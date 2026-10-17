const { randomUUID } = require("node:crypto");
const { initializeApp } = require("firebase-admin/app");
const { FieldValue, Timestamp, getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const { HttpsError, onCall } = require("firebase-functions/v2/https");

initializeApp();

const db = getFirestore();
const bucket = getStorage().bucket();
const ADMIN_EMAIL = "nabilslim@admin.com";
const MAX_STORAGE_BYTES = 3_000_000_000;
const MAX_IMAGE_BYTES = 250 * 1000;
const RESERVATION_LIFETIME_MS = 15 * 60 * 1000;

function requireAdmin(request) {
  const email = request.auth?.token?.email?.toLowerCase();
  if (!request.auth || email !== ADMIN_EMAIL) {
    throw new HttpsError("permission-denied", "غير مسموح.");
  }
  return request.auth.uid;
}

function validateFileName(value) {
  if (typeof value !== "string" || !/^[a-f0-9-]{36}\.webp$/.test(value)) {
    throw new HttpsError("invalid-argument", "بيانات الصورة غير صالحة.");
  }
  return value;
}

function cleanLabel(value, fallback = "صورة جديدة") {
  if (typeof value !== "string") return fallback;
  const label = value.trim().slice(0, 80);
  return label || fallback;
}

function storageUsage(snapshot) {
  if (!snapshot.exists) return { usedBytes: 0, reservedBytes: 0 };
  const usage = snapshot.data();
  if (!Number.isSafeInteger(usage.usedBytes) || usage.usedBytes < 0
    || !Number.isSafeInteger(usage.reservedBytes) || usage.reservedBytes < 0
    || usage.usedBytes + usage.reservedBytes > MAX_STORAGE_BYTES) {
    throw new HttpsError("failed-precondition", "تعذر حفظ الصورة.");
  }
  return { usedBytes: usage.usedBytes, reservedBytes: usage.reservedBytes };
}

async function cleanupExpiredReservations(uid) {
  const expired = await db.collection(`uploadReservations/${uid}/files`)
    .where("expiresAt", "<=", Timestamp.now()).limit(100).get();

  for (const item of expired.docs) {
    let markedForCleanup = false;
    await db.runTransaction(async (transaction) => {
      markedForCleanup = false;
      const current = await transaction.get(item.ref);
      if (!current.exists || current.data().expiresAt.toMillis() > Date.now()) return;
      if (current.data().state !== "cleaning") transaction.update(item.ref, { state: "cleaning" });
      markedForCleanup = true;
    });
    if (!markedForCleanup) continue;

    const fileName = item.data().fileName;
    await bucket.file(`gallery/${uid}/${fileName}`).delete({ ignoreNotFound: true });
    const usageRef = db.doc("system/storageUsage");
    await db.runTransaction(async (transaction) => {
      const [reservation, usage] = await Promise.all([transaction.get(item.ref), transaction.get(usageRef)]);
      if (!reservation.exists || reservation.data().state !== "cleaning") return;
      const currentUsage = storageUsage(usage);
      transaction.set(usageRef, {
        usedBytes: currentUsage.usedBytes,
        reservedBytes: Math.max(0, currentUsage.reservedBytes - reservation.data().expectedBytes),
        updatedAt: FieldValue.serverTimestamp()
      });
      transaction.delete(item.ref);
    });
  }
}

exports.reserveImageUpload = onCall(async (request) => {
  const uid = requireAdmin(request);
  const fileName = validateFileName(request.data?.fileName);
  const expectedBytes = Number(request.data?.expectedBytes);
  if (!Number.isInteger(expectedBytes) || expectedBytes < 1 || expectedBytes > MAX_IMAGE_BYTES) {
    throw new HttpsError("invalid-argument", "الصورة غير صالحة للرفع.");
  }

  const usageRef = db.doc("system/storageUsage");
  const reservationRef = db.doc(`uploadReservations/${uid}/files/${fileName}`);
  await cleanupExpiredReservations(uid);

  await db.runTransaction(async (transaction) => {
    const [usageSnapshot, reservationSnapshot] = await Promise.all([
      transaction.get(usageRef), transaction.get(reservationRef)
    ]);
    if (reservationSnapshot.exists) throw new HttpsError("already-exists", "الطلب موجود بالفعل.");

    const usage = storageUsage(usageSnapshot);

    if (usage.usedBytes + usage.reservedBytes > MAX_STORAGE_BYTES - expectedBytes) {
      throw new HttpsError("resource-exhausted", "تعذر حفظ الصورة.");
    }

    transaction.set(usageRef, {
      usedBytes: usage.usedBytes,
      reservedBytes: usage.reservedBytes + expectedBytes,
      updatedAt: FieldValue.serverTimestamp()
    });
    transaction.create(reservationRef, {
      uid,
      fileName,
      expectedBytes,
      state: "reserved",
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: Timestamp.fromMillis(Date.now() + RESERVATION_LIFETIME_MS)
    });
  });

  return { fileName, storagePath: `gallery/${uid}/${fileName}` };
});

exports.finishImageUpload = onCall(async (request) => {
  const uid = requireAdmin(request);
  const fileName = validateFileName(request.data?.fileName);
  const storagePath = `gallery/${uid}/${fileName}`;
  const file = bucket.file(storagePath);
  const [metadata] = await file.getMetadata().catch(() => {
    throw new HttpsError("failed-precondition", "تعذر العثور على الصورة المرفوعة.");
  });
  const actualBytes = Number(metadata.size);
  const reservationRef = db.doc(`uploadReservations/${uid}/files/${fileName}`);
  const galleryRef = db.doc(`gallery/${fileName}`);

  const existing = await galleryRef.get();
  if (existing.exists && existing.data().ownerUid === uid) return { fileName, saved: true };

  const reservationSnapshot = await reservationRef.get();
  if (!reservationSnapshot.exists || reservationSnapshot.data().state !== "reserved"
    || actualBytes > reservationSnapshot.data().expectedBytes || actualBytes > MAX_IMAGE_BYTES) {
    throw new HttpsError("failed-precondition", "تعذر إتمام رفع الصورة.");
  }

  const downloadToken = randomUUID();
  await file.setMetadata({
    contentType: "image/webp",
    cacheControl: "public, max-age=31536000, immutable",
    metadata: { firebaseStorageDownloadTokens: downloadToken }
  });
  const url = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket.name)}/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;
  const usageRef = db.doc("system/storageUsage");

  await db.runTransaction(async (transaction) => {
    const [reservation, usage, gallery] = await Promise.all([
      transaction.get(reservationRef), transaction.get(usageRef), transaction.get(galleryRef)
    ]);
    if (gallery.exists && gallery.data().ownerUid === uid) return;
    if (!reservation.exists || reservation.data().state !== "reserved") {
      throw new HttpsError("failed-precondition", "تعذر إتمام رفع الصورة.");
    }
    const current = storageUsage(usage);
    const reservedBytes = reservation.data().expectedBytes;
    transaction.set(usageRef, {
      usedBytes: current.usedBytes + actualBytes,
      reservedBytes: Math.max(0, current.reservedBytes - reservedBytes),
      updatedAt: FieldValue.serverTimestamp()
    });
    transaction.create(galleryRef, {
      ownerUid: uid,
      storagePath,
      url,
      fileName,
      sizeBytes: actualBytes,
      createdAt: FieldValue.serverTimestamp()
    });
    transaction.delete(reservationRef);
  });

  return { fileName, saved: true };
});

exports.cancelImageUpload = onCall(async (request) => {
  const uid = requireAdmin(request);
  const fileName = validateFileName(request.data?.fileName);
  const reservationRef = db.doc(`uploadReservations/${uid}/files/${fileName}`);
  const galleryRef = db.doc(`gallery/${fileName}`);
  const usageRef = db.doc("system/storageUsage");
  let shouldDeleteObject = false;
  await db.runTransaction(async (transaction) => {
    shouldDeleteObject = false;
    const [currentReservation, usage, gallery] = await Promise.all([
      transaction.get(reservationRef), transaction.get(usageRef), transaction.get(galleryRef)
    ]);
    if (!currentReservation.exists || gallery.exists) return;
    const current = storageUsage(usage);
    transaction.set(usageRef, {
      usedBytes: current.usedBytes,
      reservedBytes: Math.max(0, current.reservedBytes - currentReservation.data().expectedBytes),
      updatedAt: FieldValue.serverTimestamp()
    });
    transaction.delete(reservationRef);
    shouldDeleteObject = true;
  });
  if (shouldDeleteObject) await bucket.file(`gallery/${uid}/${fileName}`).delete({ ignoreNotFound: true });
  return { cancelled: true };
});

exports.updateImageLabel = onCall(async (request) => {
  const uid = requireAdmin(request);
  const fileName = validateFileName(request.data?.fileName);
  const galleryRef = db.doc(`gallery/${fileName}`);
  const snapshot = await galleryRef.get();
  if (!snapshot.exists || snapshot.data().ownerUid !== uid) throw new HttpsError("not-found", "الصورة غير موجودة.");
  await galleryRef.update({ label: cleanLabel(request.data?.label), updatedAt: FieldValue.serverTimestamp() });
  return { updated: true };
});

exports.deleteGalleryImage = onCall(async (request) => {
  const uid = requireAdmin(request);
  const fileName = validateFileName(request.data?.fileName);
  const galleryRef = db.doc(`gallery/${fileName}`);
  const snapshot = await galleryRef.get();
  if (!snapshot.exists || snapshot.data().ownerUid !== uid) throw new HttpsError("not-found", "الصورة غير موجودة.");

  const image = snapshot.data();
  await bucket.file(image.storagePath).delete({ ignoreNotFound: true });
  const usageRef = db.doc("system/storageUsage");
  await db.runTransaction(async (transaction) => {
    const [currentImage, usage] = await Promise.all([transaction.get(galleryRef), transaction.get(usageRef)]);
    if (!currentImage.exists) return;
    const current = storageUsage(usage);
    transaction.set(usageRef, {
      usedBytes: Math.max(0, current.usedBytes - currentImage.data().sizeBytes),
      reservedBytes: current.reservedBytes,
      updatedAt: FieldValue.serverTimestamp()
    });
    transaction.delete(galleryRef);
  });
  return { deleted: true };
});
