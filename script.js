const installContainer = document.getElementById('install-container');
const installBtn = document.getElementById('install-app-btn');
let deferredPrompt = null;

function isRunningAsApp() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigator.standalone === true ||
    document.referrer.startsWith('android-app://')
  );
}

if (!isRunningAsApp()) {
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
    } else {
      alert('La app ya está instalada. Ábrela desde tu inicio o escritorio.');
      window.location.href = '/';
    }
  });
}
