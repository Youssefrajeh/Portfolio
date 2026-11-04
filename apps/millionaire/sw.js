// Service Worker — يخلّي اللعبة تشتغل بدون إنترنت
// غيّر رقم النسخة كل ما تعدّل الملفات، لحتى ينزل التحديث
const CACHE = "millionaire-v4";
const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./game.js",
  "./questions.json.gz",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// ملف الأسئلة: من الشبكة أولاً (لتوصل الأسئلة الجديدة)، وإذا ما في نت من الكاش
// باقي الملفات: من الكاش أولاً (سرعة)
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  if (url.pathname.includes("questions.json")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
