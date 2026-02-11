self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Força o SW a se tornar ativo e clama controle imediatamente para garantir que nenhuma requisição fique presa
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Ignora completamente qualquer cache e vai direto para a rede
  // Se a rede falhar, falha a requisição. Isso previne o erro 404 de cache antigo.
  e.respondWith(fetch(e.request));
});