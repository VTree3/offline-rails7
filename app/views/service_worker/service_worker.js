function onInstall(event) {
  console.log("[Serviceworker]", "Installing!", event);
}

function onActivate(event) {
  console.log("[Serviceworker]", "Activating!", event);
}

function onFetch(event) {
  console.log("[Serviceworker]", "Fetching!", event);
}
self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetch);

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

const { CacheFirst, NetworkFirst } = workbox.strategies;
const { registerRoute } = workbox.routing;

registerRoute(
  ({ url }) => url.pathname.startsWith("/home"),
  new CacheFirst({ cacheName: "documents" })
); // For every other page we use network first to ensure the most up-to-date resources
registerRoute(
  ({ request, url }) =>
    request.destination === "document" || request.destination === "",
  new NetworkFirst({
    cacheName: "documents",
  })
); // For assets (scripts and >>ges), we use cache first
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new CacheFirst({ cacheName: "assets-styles-and-scripts" })
);
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({ cacheName: "assets-images" })
);

const { warmStrategyCache } = workbox.recipes;
const { setCatchHandler } = workbox.routing;
const strategy = new CacheFirst();
const urls = ["/offline.html"]; // Warm the runtime cache with a list of asset URLs
warmStrategyCache({ urls, strategy }); // Trigger a 'catch' handler when any of the other routes fail to generate a response
setCatchHandler(async ({ event }) => {
  switch (event.request.destination) {
    case "document":
      return strategy.handle({ event, request: urls[0] });
    default:
      return Response.error();
  }
});
