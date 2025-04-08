
const soundEffects = {
    click: new Audio('sound/click.mp3'),

    play(soundName) {
        try {
            const sound = this[soundName];
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(error => {
                    console.error('Error reproduciendo sonido:', error);
                });
            }
        } catch (e) {
            console.error('Error playing sound:', e);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const botonesConSonido = document.querySelectorAll('button');
    botonesConSonido.forEach(boton => {
        boton.addEventListener('click', () => {
            soundEffects.play('click');
        });
    });
});
