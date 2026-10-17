const shots = [
  ["all/صور/webp/1 (1)_1_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (2)_2_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (3)_3_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (4)_4_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (5)_5_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (6)_6_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (7)_7_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (8)_8_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (9)_9_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (10)_10_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (11)_11_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (12)_12_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/1 (13)_13_11zon.webp", "مجموعة جديدة"],
  ["all/صور/webp/778901460_1504509575025136_3095601360285637262_n_52_11zon.webp", "مجموعة 01"],
  ["all/صور/webp/779729650_1504509978358429_7387290257429037111_n_53_11zon.webp", "مجموعة 01"],
  ["all/صور/webp/779896733_1504509748358452_9186054924475496098_n (1)_54_11zon.webp", "مجموعة 01"],
  ["all/صور/webp/779946146_1504509655025128_6803762058198114479_n_55_11zon.webp", "مجموعة 01"],
  ["all/صور/webp/781713397_1504509835025110_4725398320425728233_n_56_11zon.webp", "مجموعة 01"],
  ["all/صور/webp/775321986_1501890858620341_3107660415715181859_n_47_11zon.webp", "مجموعة 02"],
  ["all/صور/webp/775321991_1501891275286966_3442246061809498822_n_48_11zon.webp", "مجموعة 02"],
  ["all/صور/webp/776133080_1501891545286939_9022274001779463074_n_49_11zon.webp", "مجموعة 02"],
  ["all/صور/webp/776225099_1501890265287067_4898485723149649183_n_50_11zon.webp", "مجموعة 02"],
  ["all/صور/webp/776589086_1501890478620379_8029626195954078296_n_51_11zon.webp", "مجموعة 02"],
  ["all/صور/webp/773252278_1498821545593939_2000961791660695653_n_43_11zon.webp", "مجموعة 03"],
  ["all/صور/webp/773316243_1498821445593949_8903362470174447310_n_44_11zon.webp", "مجموعة 03"],
  ["all/صور/webp/773985662_1498822422260518_7651390642926752512_n_45_11zon.webp", "مجموعة 03"],
  ["all/صور/webp/774318887_1498821718927255_7760617655002073763_n_46_11zon.webp", "مجموعة 03"],
  ["all/صور/webp/764116327_1492219102920850_189284757570050517_n_38_11zon.webp", "مجموعة 04"],
  ["all/صور/webp/764850001_1492219436254150_6589853288980294397_n_39_11zon.webp", "مجموعة 04"],
  ["all/صور/webp/764963501_1492219219587505_5380843657212889116_n_40_11zon.webp", "مجموعة 04"],
  ["all/صور/webp/767603064_1492219346254159_1396219779571299797_n_41_11zon.webp", "مجموعة 04"],
  ["all/صور/webp/768435529_1492218969587530_7610253471930752180_n_42_11zon.webp", "مجموعة 04"],
  ["all/صور/webp/759188638_1485057730303654_5360742870715574731_n_26_11zon.webp", "مجموعة 05"],
  ["all/صور/webp/759434041_1485057800303647_1044208538843097695_n_27_11zon.webp", "مجموعة 05"],
  ["all/صور/webp/759676959_1485057613636999_1007804569141209834_n_30_11zon.webp", "مجموعة 05"],
  ["all/صور/webp/761414281_1485057680303659_4427945445107312761_n_31_11zon.webp", "مجموعة 05"],
  ["all/صور/webp/761504076_1485057563637004_2828992595675593763_n_32_11zon.webp", "مجموعة 05"],
  ["all/صور/webp/761559526_1486422290167198_3520326147291341911_n_33_11zon.webp", "مجموعة 06"],
  ["all/صور/webp/762796865_1486422166833877_897705402169175861_n_34_11zon.webp", "مجموعة 06"],
  ["all/صور/webp/762831361_1486422353500525_8349273360296917506_n_35_11zon.webp", "مجموعة 06"],
  ["all/صور/webp/763119787_1486422226833871_2868147524846202696_n_36_11zon.webp", "مجموعة 06"],
  ["all/صور/webp/763119787_1486422423500518_3559121203028552054_n_37_11zon.webp", "مجموعة 06"],
  ["all/صور/webp/758677130_1484138377062256_1437927029855443666_n_23_11zon.webp", "مجموعة 07"],
  ["all/صور/webp/758677449_1484138433728917_7130823338271717480_n_24_11zon.webp", "مجموعة 07"],
  ["all/صور/webp/758830777_1484138223728938_8646903376518764618_n_25_11zon.webp", "مجموعة 07"],
  ["all/صور/webp/759477813_1484138160395611_5180040854488676041_n_28_11zon.webp", "مجموعة 07"],
  ["all/صور/webp/759655519_1484138293728931_3402058816949593913_n_29_11zon.webp", "مجموعة 07"],
  ["all/صور/webp/687007137_1413646154111479_7523993491165674418_n_18_11zon.webp", "مجموعة 08"],
  ["all/صور/webp/687542296_1413645920778169_8820911244325017061_n_19_11zon.webp", "مجموعة 08"],
  ["all/صور/webp/687553799_1413646370778124_8384190107187258688_n_20_11zon.webp", "مجموعة 08"],
  ["all/صور/webp/687554917_1413646090778152_323371959639095268_n_21_11zon.webp", "مجموعة 08"],
  ["all/صور/webp/687702355_1413646297444798_4349277223892324317_n_22_11zon.webp", "مجموعة 08"],
  ["all/صور/webp/676034992_1402388358570592_4740018175586881063_n_14_11zon.webp", "مجموعة 09"],
  ["all/صور/webp/677922971_1402388285237266_4311095504240874925_n_15_11zon.webp", "مجموعة 09"],
  ["all/صور/webp/678739861_1402388418570586_3690212499703054282_n_16_11zon.webp", "مجموعة 09"],
  ["all/صور/webp/678995355_1402388191903942_8559401270831916364_n_17_11zon.webp", "مجموعة 09"]
];

const folderOrder = ["p4", "p1", "p7", "p3", "p9", "p2", "p6", "p5", "p8"];
const newShots = shots.filter(([, label]) => label === "مجموعة جديدة");
const orderedShots = [];
for (let imageIndex = 0; imageIndex < 6; imageIndex += 1) {
  folderOrder.forEach((folder) => {
    const folderLabels = { p1: "مجموعة 01", p2: "مجموعة 02", p3: "مجموعة 03", p4: "مجموعة 04", p5: "مجموعة 05", p6: "مجموعة 06", p7: "مجموعة 07", p8: "مجموعة 08", p9: "مجموعة 09" };
    const folderShots = shots.filter(([, label]) => label === folderLabels[folder]);
    if (folderShots[imageIndex]) orderedShots.push(folderShots[imageIndex]);
  });
}

// Interleave the new collection across the portfolio instead of showing it as one block.
const distributedShots = [];
let existingIndex = 0;
newShots.forEach((newShot, newIndex) => {
  const targetExistingIndex = Math.round((newIndex * orderedShots.length) / newShots.length);
  while (existingIndex < targetExistingIndex) {
    distributedShots.push(orderedShots[existingIndex]);
    existingIndex += 1;
  }
  distributedShots.push(newShot);
});
while (existingIndex < orderedShots.length) {
  distributedShots.push(orderedShots[existingIndex]);
  existingIndex += 1;
}

shots.splice(0, shots.length, ...distributedShots.map(([src, label]) => [src.replace(/\.(jpe?g|png|gif)$/i, ".webp"), label]));
const localShots = [...shots];

const gallery = document.querySelector("[data-gallery]");
const loadMoreButton = document.querySelector("[data-load-more]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = lightbox.querySelector("img");
const lightboxText = lightbox.querySelector("p");
const closeLightbox = lightbox.querySelector(".lightbox-close");
const previousImageButton = lightbox.querySelector(".lightbox-prev");
const nextImageButton = lightbox.querySelector(".lightbox-next");
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector(".nav-links");
let visibleCount = 44;
let closeTimer;
let lastFocusedElement;
let galleryObserver;
let previousBodyOverflow = "";
let renderedShotCount = 0;
let currentLightboxIndex = 0;

function openLightbox(src, label, index) {
  window.clearTimeout(closeTimer);
  lightbox.classList.remove("is-closing");
  lightboxImage.src = src;
  lightboxImage.alt = label;
  lightboxText.textContent = "Lens of Nabil Slim Azazy";
  currentLightboxIndex = index;
  lastFocusedElement = document.activeElement;
  previousBodyOverflow = document.body.style.overflow;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  closeLightbox.focus();
}

function showLightboxImage(offset) {
  currentLightboxIndex = (currentLightboxIndex + offset + shots.length) % shots.length;
  const [src, label] = shots[currentLightboxIndex];
  lightboxImage.src = src;
  lightboxImage.alt = label;
}

function closeLightboxView() {
  if (lightbox.hidden || lightbox.classList.contains("is-closing")) return;
  lightbox.classList.add("is-closing");
  closeTimer = window.setTimeout(() => {
    lightbox.hidden = true;
    lightbox.classList.remove("is-closing");
    lightboxImage.src = "";
    document.body.style.overflow = previousBodyOverflow;
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
    lastFocusedElement = null;
  }, 330);
}

const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
const backstageVideos = [
  { id: "tala", src: "all/فيديو/tala.mp4", poster: "all/صور/jpg/tala-poster_47_11zon.jpg", label: "رأي عميلة" },
  { id: "v2", src: "all/فيديو/v2.mp4", poster: "all/صور/jpg/v2-poster_46_11zon.jpg", label: "الكواليس" },
  { id: "v1", src: "all/فيديو/v1.mp4", poster: "all/صور/jpg/v1-poster_45_11zon.jpg", label: "الكواليس" }
];
function createVideoCard({ id, src, poster, label }) {
  const card = document.createElement("article");
  card.className = "video-card";
  card.dataset.videoCard = id;
  card.innerHTML = `<video playsinline preload="none" poster="${poster}" aria-label="${label}"><source data-src="${src}" type="video/mp4"></video><button class="video-play" type="button" aria-label="تشغيل ${label}"><span>▶</span></button><div class="video-card-caption"><span>${label}</span></div>`;

  const video = card.querySelector("video");
  const playButton = card.querySelector(".video-play");
  playButton.addEventListener("click", () => {
    loadDeferredVideo(video);
    video.controls = true;
    playButton.hidden = true;
    const playback = video.play();
    if (playback) playback.catch(() => { playButton.hidden = false; });
  });
  video.addEventListener("ended", () => { playButton.hidden = false; });
  return card;
}

function createGalleryItem([src, label], index) {
  const item = document.createElement("button");
  item.className = "gallery-item";
  item.type = "button";
  item.setAttribute("aria-label", `تكبير صورة ${label}`);
  const eager = index < 8;
  item.innerHTML = `<img src="${eager ? src : transparentPixel}" ${eager ? "" : `data-src="${src}"`} alt="${label}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
  item.addEventListener("click", () => openLightbox(src, label, index));
  return item;
}

window.appendCloudGalleryImages = (cloudShots) => {
  const fragment = document.createDocumentFragment();
  cloudShots.forEach((shot) => {
    const index = shots.push(shot) - 1;
    fragment.appendChild(createGalleryItem(shot, index));
  });
  const firstImage = gallery.querySelector(".gallery-item");
  if (firstImage) gallery.insertBefore(fragment, firstImage);
  else gallery.appendChild(fragment);
  lazyLoadImages();
};

function renderGallery(reset = false) {
  if (reset) {
    gallery.innerHTML = "";
    renderedShotCount = 0;
    gallery.appendChild(createVideoCard(backstageVideos[0]));
  }

  const midpoint = Math.ceil(localShots.length / 2);
  localShots.slice(renderedShotCount, visibleCount).forEach((shot, index) => {
    const absoluteIndex = renderedShotCount + index;
    if (absoluteIndex === midpoint) gallery.appendChild(createVideoCard(backstageVideos[1]));
    gallery.appendChild(createGalleryItem(shot, absoluteIndex));
  });
  renderedShotCount = Math.min(visibleCount, localShots.length);
  if (renderedShotCount === localShots.length && !gallery.querySelector(`[data-video-card="${backstageVideos[2].id}"]`)) {
    gallery.appendChild(createVideoCard(backstageVideos[2]));
  }
  loadMoreButton.hidden = visibleCount >= localShots.length;
  lazyLoadImages();
}

function lazyLoadImages() {
  if (galleryObserver) galleryObserver.disconnect();
  const images = document.querySelectorAll("img[data-src]");
  if (!("IntersectionObserver" in window)) {
    images.forEach((image) => {
      image.src = image.dataset.src;
      image.removeAttribute("data-src");
    });
    return;
  }
  galleryObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const image = entry.target;
      image.src = image.dataset.src;
      image.removeAttribute("data-src");
      image.addEventListener("load", () => image.classList.add("is-loaded"), { once: true });
      observer.unobserve(image);
    });
  }, { rootMargin: "550px 0px" });

  images.forEach((image) => galleryObserver.observe(image));
}

function loadDeferredVideo(video) {
  const source = video.querySelector("source[data-src]");
  if (!source) return;
  source.src = source.dataset.src;
  source.removeAttribute("data-src");
  video.load();
}

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMobileMenu() {
  nav.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  nav.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

function observeActiveSection() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55%", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

loadMoreButton.addEventListener("click", () => {
  visibleCount = Math.min(visibleCount + 16, localShots.length);
  renderGallery();
});

document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
  button.addEventListener("click", () => openLightbox(button.dataset.lightboxSrc, button.dataset.lightboxLabel));
});

closeLightbox.addEventListener("click", closeLightboxView);
previousImageButton.addEventListener("click", () => showLightboxImage(-1));
nextImageButton.addEventListener("click", () => showLightboxImage(1));
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightboxView(); });
document.addEventListener("keydown", (event) => {
  if (lightbox.hidden || lightbox.classList.contains("is-closing")) return;
  if (event.key === "Escape") {
    closeLightboxView();
    return;
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    showLightboxImage(event.key === "ArrowLeft" ? 1 : -1);
    return;
  }
  if (event.key === "Tab") {
    event.preventDefault();
    const focusable = [closeLightbox, previousImageButton, nextImageButton];
    const currentIndex = focusable.indexOf(document.activeElement);
    const direction = event.shiftKey ? -1 : 1;
    focusable[(currentIndex + direction + focusable.length) % focusable.length].focus();
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
  nav.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) nav.querySelector("a")?.focus();
});
document.querySelectorAll(".nav-links a").forEach((link) => link.addEventListener("click", closeMobileMenu));
document.addEventListener("click", (event) => {
  if (!nav.classList.contains("is-open")) return;
  if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
  closeMobileMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    closeMobileMenu();
    menuToggle.focus();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
renderGallery(true);
observeActiveSection();
