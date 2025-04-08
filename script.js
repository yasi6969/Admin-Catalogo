document.addEventListener('DOMContentLoaded', () => {
    const clickSound = new Audio('sound/click.mp3');
    
    function playClickSound() {
        try {
            clickSound.currentTime = 0;
            clickSound.play().catch(error => {
                console.error('Error reproduciendo sonido de clic:', error);
            });
        } catch (error) {
            console.error('Error al intentar reproducir sonido:', error);
        }
    }

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            playClickSound();
        });
    });

    const installButton = document.getElementById('install-app-btn');
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installButton.style.display = 'flex';
    });

    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('Aplicación instalada exitosamente');
            }
            deferredPrompt = null;
            installButton.style.display = 'none';
        }
    });

    window.addEventListener('appinstalled', () => {
        console.log('La aplicación fue instalada');
        installButton.style.display = 'none';
    });
});
