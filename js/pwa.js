// ==================== PWA — MYT EXPRESS ====================

// Registrar service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/yza/service-worker.js')
      .then((reg) => {
        console.log('✅ Service Worker registrado');
      })
      .catch((err) => {
        console.error('❌ Error Service Worker:', err);
      });
  });
}

// Instalación PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  mostrarBotonInstalar();
});

function mostrarBotonInstalar() {
  // Evitar duplicados
  if (document.getElementById('btnInstalarPWA')) return;

  const btnInstalar = document.createElement('button');
  btnInstalar.id = 'btnInstalarPWA';
  btnInstalar.innerHTML = '📲 Instalar App';
  btnInstalar.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 20px;
    background: linear-gradient(135deg, #009D95, #006C66);
    color: #FFFFFF;
    border: none;
    padding: 12px 20px;
    border-radius: 50px;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    z-index: 900;
    box-shadow: 0 8px 25px rgba(0, 157, 149, 0.4);
    animation: pwaPulse 2s infinite;
  `;

  btnInstalar.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        btnInstalar.remove();
      }
      deferredPrompt = null;
    }
  });

  document.body.appendChild(btnInstalar);
}

// Animación
const style = document.createElement('style');
style.textContent = `
  @keyframes pwaPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;
document.head.appendChild(style);

// Detecta cuando se instala
window.addEventListener('appinstalled', () => {
  console.log('✅ App instalada');
  const btn = document.getElementById('btnInstalarPWA');
  if (btn) btn.remove();
});