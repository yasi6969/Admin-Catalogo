// login.js
document.addEventListener('DOMContentLoaded', () => {
    if (!window.firebaseDb || !window.firebaseAuth) {
        console.error('Firebase no está correctamente inicializado');
        return;
    }

    const db = window.firebaseDb;
    const auth = window.firebaseAuth;

    const loginBtn = document.getElementById('login-btn');
    const productCountSpan = document.getElementById('productCount');
    const loginSection = document.getElementById('login-container');

    const modalCierreSesion = document.createElement('div');
    modalCierreSesion.id = 'modal-cierre-sesion';
    modalCierreSesion.classList.add('modal');
    modalCierreSesion.style.display = 'none';
    modalCierreSesion.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Sesión Iniciada</h2>
            <div class="user-info">
                <img id="user-photo-modal" src="" alt="Foto de perfil" class="user-photo">
                <p id="user-name-modal"></p>
                <p id="user-email-modal"></p>
            </div>
            <button id="cerrar-sesion-btn" class="btn-cerrar-sesion">Cerrar Sesión</button>
        </div>
    `;
    document.body.appendChild(modalCierreSesion);

    const userPhotoModal = document.getElementById('user-photo-modal');
    const userNameModal = document.getElementById('user-name-modal');
    const userEmailModal = document.getElementById('user-email-modal');
    const cerrarSesionBtn = document.getElementById('cerrar-sesion-btn');
    const closeModalBtn = modalCierreSesion.querySelector('.close-modal');

    function abrirModal() {
        const scrollY = window.scrollY;
        document.body.classList.add('modal-open');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        modalCierreSesion.style.display = 'flex';
    }

    function cerrarModal() {
        const scrollY = parseInt(document.body.style.top) * -1;
        modalCierreSesion.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.body.style.position = '';
        window.scrollTo(0, scrollY);
    }

    closeModalBtn.addEventListener('click', cerrarModal);

    modalCierreSesion.addEventListener('click', function(event) {
        if (event.target === modalCierreSesion) {
            cerrarModal();
        }
    });

    cerrarSesionBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            cerrarModal();
            console.log('Sesión cerrada exitosamente');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión: ' + error.message);
        }
    });

    async function contarProductos() {
        try {
            const productosRef = db.collection("productos");
            const querySnapshot = await productosRef.get();
            const count = querySnapshot.docs.length;
            
            console.log('Número de productos:', count);
            
            if (productCountSpan) {
                productCountSpan.textContent = count;
            }
            
            return count;
        } catch (error) {
            console.error("Error contando productos: ", error);
            if (productCountSpan) {
                productCountSpan.textContent = '0';
            }
            return 0;
        }
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        'prompt': 'select_account'
    });

    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            if (auth.currentUser) {
                const user = auth.currentUser;
                
                userPhotoModal.src = user.photoURL || 'path/to/default/avatar.png';
                userNameModal.textContent = user.displayName || 'Usuario';
                userEmailModal.textContent = user.email;
                
                abrirModal();
                return;
            }

            try {
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                
                console.log('Inicio de sesión exitoso:', user);
                
                loginBtn.innerHTML = `
                    <img src="${user.photoURL || 'path/to/default/avatar.png'}" 
                         alt="Foto de perfil" 
                         class="user-photo">
                    ${user.displayName || user.email}
                `;
                loginBtn.classList.add('logged-in');
                
                // Contar productos
                await contarProductos();
            } catch (error) {
                console.error('Error en inicio de sesión:', error);
                alert('Error en inicio de sesión: ' + error.message);
            }
        });
    }


    if (auth && auth.onAuthStateChanged) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('Usuario autenticado:', user);
                

                if (loginBtn) {
                    loginBtn.innerHTML = `
                        <img src="${user.photoURL || 'path/to/default/avatar.png'}" 
                            alt="Foto de perfil" 
                            class="user-photo">
                        ${user.displayName || user.email}
                    `;
                    loginBtn.classList.add('logged-in');
                }
                

                contarProductos();
            } else {
                console.log('No hay usuario autenticado');
                

                if (loginBtn) {
                    loginBtn.innerHTML = `
                        <i class="fas fa-user"></i> Iniciar sesión
                    `;
                    loginBtn.classList.remove('logged-in');
                }
                

                if (productCountSpan) {
                    productCountSpan.textContent = '0';
                }
            }
        });
    } else {
        console.error('onAuthStateChanged no está disponible');
    }


    contarProductos();
});
