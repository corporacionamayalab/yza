// ==================== SERVICE WORKER — MYT EXPRESS ====================

const CACHE_NAME = 'myt-express-v1';

const ARCHIVOS_CACHE = [
  '/yza/',
  '/yza/index.html',
  '/yza/tienda.html',
  '/yza/carrito.html',
  '/yza/checkout.html',
  '/yza/confirmacion.html',
  '/yza/css/header.css',
  '/yza/css/portada.css',
  '/yza/css/categorias.css',
  '/yza/css/destacados.css',
  '/yza/css/comprar.css',
  '/yza/css/footer.css',
  '/yza/css/tienda-hero.css',
  '/yza/css/tienda-buscador.css',
  '/yza/css/tienda-filtros.css',
  '/yza/css/tienda-productos.css',
  '/yza/css/carrito.css',
  '/yza/css/checkout.css',
  '/yza/css/confirmacion.css',
  '/yza/css/producto-modal.css',
  '/yza/css/toast.css',
  '/yza/js/config.js',
  '/yza/js/supabase.js',
  '/yza/js/header.js',
  '/yza/js/portada.js',
  '/yza/js/categorias.js',
  '/yza/js/destacados.js',
  '/yza/js/comprar.js',
  '/yza/js/footer.js',
  '/yza/js/tienda-hero.js',
  '/yza/js/tienda-buscador.js',
  '/yza/js/tienda-filtros.js',
  '/yza/js/tienda-productos.js',
  '/yza/js/carrito.js',
  '/yza/js/checkout.js',
  '/yza/js/confirmacion.js',
  '/yza/js/producto-modal.js',
  '/yza/js/toast.js'
];

// Instalar
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ARCHIVOS_CACHE.map(url => 
          cache.add(url).catch(err => console.log('Error al cachear:', url))
        )
      );
    })
  );
  self.skipWaiting();
});

// Activar
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (e) => {
  // Ignorar peticiones externas
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('/yza/index.html');
        }
      });
    })
  );
});