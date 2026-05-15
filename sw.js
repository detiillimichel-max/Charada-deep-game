const CACHE_NAME = 'oque-e-oque-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/game.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;700&display=swap'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia: Cache First, depois rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }
        
        // Clone da requisição
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Verifica se resposta é válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone da resposta para cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // Fallback offline - página customizada
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Conteúdo offline - jogue mais tarde!', {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

// Sincronização em segundo plano (opcional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-game-data') {
    console.log('[SW] Sincronizando dados do jogo...');
    // Aqui poderia enviar pontuações para um servidor
  }
});
