document.addEventListener('DOMContentLoaded', () => {
    const sonidoDeClic = new Audio('sound/click.mp3');

    function reproducirSonidoDeClic() {
        try {
            sonidoDeClic.currentTime = 0;
            sonidoDeClic.play().catch(error => {
                console.error('Error reproduciendo sonido de clic:', error);
            });
        } catch (error) {
            console.error('Error al intentar reproducir sonido:', error);
        }
    }

    document.querySelectorAll('button').forEach(boton => {
        boton.addEventListener('click', () => {
            reproducirSonidoDeClic();
        });
    });

    const botonInstalacion = document.getElementById('install-app-btn');
    let solicitudInstalacion = null;

    function actualizarEstadoBotonInstalacion() {
        const esModoStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                                 window.navigator.standalone === true;

        if (esModoStandalone) {
            botonInstalacion.style.display = 'none';
            return;
        }

        let appInstalada = localStorage.getItem('appInstalada') === 'true';

        if (appInstalada && !solicitudInstalacion) {
            botonInstalacion.innerHTML = '<span>Abrir app</span>';
            botonInstalacion.style.display = 'flex';
            botonInstalacion.onclick = () => {
                window.open(window.location.origin, '_blank', 'noopener');
            };
        } else if (solicitudInstalacion) {
            botonInstalacion.innerHTML = '<i class="fas fa-download"></i> Instalar';
            botonInstalacion.style.display = 'flex';
            botonInstalacion.onclick = async () => {
                try {
                    solicitudInstalacion.prompt();
                    const { outcome } = await solicitudInstalacion.userChoice;
                    if (outcome === 'accepted') {
                        console.log('Aplicación instalada exitosamente');
                    }
                } catch (error) {
                    console.error('Error al intentar instalar:', error);
                } finally {
                    solicitudInstalacion = null;
                    localStorage.setItem('appInstalada', 'true');
                    actualizarEstadoBotonInstalacion();
                }
            };
        } else {
            botonInstalacion.style.display = 'none';
        }
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        solicitudInstalacion = e;
        actualizarEstadoBotonInstalacion();
    });

    window.addEventListener('appinstalled', () => {
        console.log('La aplicación fue instalada');
        localStorage.setItem('appInstalada', 'true');
        actualizarEstadoBotonInstalacion();
    });

    setTimeout(() => {
        const esModoStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                                 window.navigator.standalone === true;
        if (!esModoStandalone && !solicitudInstalacion) {
            localStorage.removeItem('appInstalada');
        }
        actualizarEstadoBotonInstalacion();
    }, 1000);
});
