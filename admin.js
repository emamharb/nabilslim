import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-functions.js";
import { getStorage, ref, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const ADMIN_EMAIL = "nabilslim@admin.com";
const MAX_IMAGE_BYTES = 250 * 1000;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const reserveImageUpload = httpsCallable(functions, "reserveImageUpload");
const finishImageUpload = httpsCallable(functions, "finishImageUpload");
const cancelImageUpload = httpsCallable(functions, "cancelImageUpload");
const deleteGalleryImage = httpsCallable(functions, "deleteGalleryImage");

const loginPanel = document.querySelector("[data-login-panel]");
const dashboard = document.querySelector("[data-dashboard]");
const statusMessage = document.querySelector("[data-status]");
const loginForm = document.querySelector("[data-login-form]");
const uploadForm = document.querySelector("[data-upload-form]");
const imageInput = uploadForm.elements.images;
const fileNames = document.querySelector("[data-file-names]");
const gallery = document.querySelector("[data-admin-gallery]");
const progressTrack = document.querySelector("[data-progress-track]");
const progressBar = document.querySelector("[data-progress-bar]");
const progressRole = document.querySelector("[data-progress-role]");
const uploadStage = document.querySelector("[data-upload-stage]");
const uploadCounter = document.querySelector("[data-upload-counter]");
const uploadQueue = document.querySelector("[data-upload-queue]");

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.dataset.error = String(isError);
}

function friendlyError(error) {
  const code = error?.code || error?.name || "unknown";
  console.error("[admin] Firebase operation failed", { code, message: error?.message, customData: error?.customData }, error);
  if (error?.code === "functions/resource-exhausted") return "تعذر حفظ الصور الآن.";
  if (error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password" || error?.code === "auth/user-not-found") return "بيانات الدخول غير صحيحة.";
  if (error?.code === "firestore/permission-denied" || error?.code === "permission-denied") return "تعذر قراءة صور المعرض. راجع صلاحيات Firestore.";
  if (error?.code === "functions/not-found") return "دالة Firebase المطلوبة غير منشورة.";
  if (error?.code === "storage/unauthorized" || error?.code === "functions/permission-denied") return "الحساب غير مصرح له بهذه العملية.";
  return `حصلت مشكلة أثناء تنفيذ الطلب (${code}). حاول مرة أخرى.`;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    loginPanel.hidden = false;
    dashboard.hidden = true;
    return;
  }
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
    await signOut(auth);
    setStatus("هذا الحساب غير مصرح له بالدخول.", true);
    return;
  }
  loginPanel.hidden = true;
  dashboard.hidden = false;
  await refreshGallery();
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = loginForm.elements.email.value.trim().toLowerCase();
  const password = loginForm.elements.password.value;
  if (email !== ADMIN_EMAIL) {
    setStatus("هذا الحساب غير مصرح له بالدخول.", true);
    return;
  }
  setStatus("جارٍ تسجيل الدخول...");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
    setStatus("");
  } catch (error) {
    setStatus(friendlyError(error), true);
  }
});

document.querySelector("[data-reset-password]").addEventListener("click", async () => {
  const email = loginForm.elements.email.value.trim().toLowerCase();
  if (email !== ADMIN_EMAIL) {
    setStatus("اكتب بريد حساب الإدارة أولًا.", true);
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    setStatus("أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك.");
  } catch (error) {
    setStatus(friendlyError(error), true);
  }
});

document.querySelector("[data-sign-out]").addEventListener("click", () => signOut(auth));
document.querySelector("[data-refresh]").addEventListener("click", refreshGallery);

imageInput.addEventListener("change", () => {
  const files = [...imageInput.files];
  fileNames.textContent = files.length ? `تم اختيار ${files.length} صورة` : "لم يتم اختيار صور";
  if (!files.length) return;
  uploadQueue.replaceChildren(...files.map((file) => {
    const item = document.createElement("li");
    item.dataset.state = "pending";
    const name = document.createElement("span");
    name.textContent = file.name;
    const state = document.createElement("span");
    state.textContent = "في الانتظار";
    item.append(name, state);
    return item;
  }));
  uploadCounter.textContent = `${files.length} صورة`;
  uploadStage.textContent = "جاهز للرفع";
  progressTrack.hidden = false;
  progressBar.style.width = "0%";
  progressRole.setAttribute("aria-valuenow", "0");
});

function canvasBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("image-conversion-failed")), "image/webp", quality);
  });
}

async function compressImage(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("image-decode-failed");
  }

  let width = bitmap.width;
  let height = bitmap.height;
  const initialScale = Math.min(1, 2560 / Math.max(width, height));
  width = Math.max(1, Math.round(width * initialScale));
  height = Math.max(1, Math.round(height * initialScale));
  const canvas = document.createElement("canvas");

  try {
    for (let sizeAttempt = 0; sizeAttempt < 16; sizeAttempt += 1) {
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("canvas-unavailable");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
      context.drawImage(bitmap, 0, 0, width, height);

      for (const quality of [0.84, 0.74, 0.64, 0.54, 0.44, 0.34]) {
        const blob = await canvasBlob(canvas, quality);
        if (blob.type !== "image/webp") throw new Error("webp-unsupported");
        if (blob.size <= MAX_IMAGE_BYTES) return blob;
      }
      width = Math.max(1, Math.floor(width * 0.82));
      height = Math.max(1, Math.floor(height * 0.82));
    }
  } finally {
    bitmap.close?.();
    canvas.width = 1;
    canvas.height = 1;
  }
  throw new Error("image-too-detailed");
}

function uploadBlob(blob, storagePath, onProgress) {
  const task = uploadBytesResumable(ref(storage, storagePath), blob, { contentType: "image/webp" });
  return new Promise((resolve, reject) => {
    task.on("state_changed", (snapshot) => {
      onProgress(snapshot.bytesTransferred / snapshot.totalBytes);
    }, reject, resolve);
  });
}

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const files = [...imageInput.files];
  if (!files.length) return;
  uploadForm.querySelector("button[type='submit']").disabled = true;
  progressTrack.hidden = false;
  progressBar.style.width = "0%";
  progressRole.setAttribute("aria-valuenow", "0");
  let completedUploads = 0;
  const failures = [];
  const queueItems = [...uploadQueue.children];
  const updateProgress = (percent) => {
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    progressBar.style.width = `${value}%`;
    progressRole.setAttribute("aria-valuenow", String(value));
  };
  const updateQueue = (index, state, text) => {
    const item = queueItems[index];
    item.dataset.state = state;
    item.lastElementChild.textContent = text;
  };

  try {
    for (const [index, file] of files.entries()) {
      uploadCounter.textContent = `${index + 1} / ${files.length}`;
      uploadStage.textContent = `تجهيز الصورة ${index + 1} من ${files.length}`;
      setStatus(`جارٍ تجهيز ${file.name}...`);
      updateQueue(index, "active", "جارٍ التجهيز");
      let fileName;
      try {
        const compressed = await compressImage(file);
        fileName = `${crypto.randomUUID()}.webp`;
        const reservation = await reserveImageUpload({ fileName, expectedBytes: compressed.size });
        const storagePath = reservation.data.storagePath;
        uploadStage.textContent = `رفع الصورة ${index + 1} من ${files.length}`;
        updateQueue(index, "active", "جارٍ الرفع · 0٪");
        setStatus(`جارٍ رفع ${file.name}...`);
        await uploadBlob(compressed, storagePath, (fraction) => {
          updateProgress(((index + fraction) / files.length) * 100);
          updateQueue(index, "active", `جارٍ الرفع · ${Math.round(fraction * 100)}٪`);
        });
        await finishImageUpload({ fileName });
        completedUploads += 1;
        updateQueue(index, "done", "تم الرفع");
        updateProgress(((index + 1) / files.length) * 100);
      } catch (error) {
        if (fileName) await cancelImageUpload({ fileName }).catch(() => {});
        const message = error.message === "image-decode-failed" || error.message === "image-too-detailed"
          ? "تعذر تجهيز الصورة"
          : error.message === "webp-unsupported"
            ? "المتصفح لا يدعم تجهيز الصور"
            : friendlyError(error);
        failures.push({ name: file.name, message });
        updateQueue(index, "error", "تعذر الرفع");
      }
    }
    updateProgress(100);
    uploadForm.reset();
    fileNames.textContent = "لم يتم اختيار صور";
    uploadStage.textContent = "اكتملت الدفعة";
    uploadCounter.textContent = `${completedUploads} من ${files.length} نجحت`;
    setStatus(failures.length
      ? `اكتمل رفع ${completedUploads} صورة، وتعذر رفع ${failures.length}. راجع الصور المحددة بالأحمر.`
      : `تم رفع ${completedUploads} صورة بنجاح.` , failures.length > 0);
    if (completedUploads) await refreshGallery();
  } finally {
    uploadForm.querySelector("button[type='submit']").disabled = false;
  }
});

async function refreshGallery() {
  if (!auth.currentUser || auth.currentUser.email?.toLowerCase() !== ADMIN_EMAIL) return;
  gallery.replaceChildren();
  setStatus("جارٍ تحميل الصور...");
  try {
    const imagesQuery = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(imagesQuery);
    if (snapshot.empty) {
      setStatus("لا توجد صور مضافة بعد.");
      return;
    }
    snapshot.docs.forEach((docSnapshot) => {
      const image = docSnapshot.data();
      const card = document.createElement("article");
      card.className = "admin-image";
      const thumbnail = document.createElement("img");
      thumbnail.src = image.url;
      thumbnail.alt = "صورة من المعرض";
      thumbnail.loading = "lazy";

      const content = document.createElement("div");
      content.className = "admin-image-content";
      const actions = document.createElement("div");
      actions.className = "image-actions";
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "حذف الصورة";
      deleteButton.addEventListener("click", async () => {
        if (!window.confirm("هل تريد حذف هذه الصورة؟")) return;
        deleteButton.disabled = true;
        try {
          await deleteGalleryImage({ fileName: image.fileName });
          card.remove();
          setStatus("تم حذف الصورة.");
        } catch (error) {
          setStatus(friendlyError(error), true);
          deleteButton.disabled = false;
        }
      });

      actions.append(deleteButton);
      content.append(actions);
      card.append(thumbnail, content);
      gallery.append(card);
    });
    setStatus(`عدد الصور المضافة: ${snapshot.size}`);
  } catch (error) {
    setStatus(friendlyError(error), true);
  }
}
