self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let d = {}; try { d = e.data.json(); } catch {}
  e.waitUntil(self.registration.showNotification(d.titulo || "Novedades del catálogo", {
    body: d.texto || "", icon: "app-icono-192.png", badge: "app-icono-192.png", tag: d.tipo || "aviso", renotify: true,
    vibrate: [120, 60, 120], data: { k: d.k || "" } }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL("./" + (e.notification.data?.k ? "?k=" + encodeURIComponent(e.notification.data.k) : ""), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) if (c.url.startsWith(self.registration.scope)) { c.focus(); return c.navigate ? c.navigate(url) : null; }
    return self.clients.openWindow(url);
  }));
});
self.addEventListener("fetch", () => {});
