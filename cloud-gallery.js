import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { collection, getDocs, getFirestore, orderBy, query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

try {
  const app = initializeApp(firebaseConfig, "gallery");
  const db = getFirestore(app);
  const images = await getDocs(query(collection(db, "gallery"), orderBy("createdAt", "desc")));
  const cloudShots = images.docs
    .map((document) => document.data())
    .filter((image) => typeof image.url === "string" && typeof image.label === "string")
    .map((image) => [image.url, image.label]);
  window.appendCloudGalleryImages(cloudShots);
} catch (error) {
  console.warn("تعذر تحميل صور المعرض الإضافية.", error);
}
