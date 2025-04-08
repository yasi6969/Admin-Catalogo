const installContainer = document.getElementById('install-container');
const installBtn = document.getElementById('install-app-btn');

let deferredPrompt = null;

// Detectar si la app ya está instalada
function isAppInstalled() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith('android-app://')
  );
}

// Mostrar solo si no es app
if (!isAppInstalled()) {
  installContainer.style.display = 'block';

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
  });
}
