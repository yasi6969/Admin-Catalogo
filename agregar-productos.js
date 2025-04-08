document.addEventListener('DOMContentLoaded', () => {
    const formularioAgregarProducto = document.getElementById('formularioAgregarProducto');
    const btnAgregarProducto = document.getElementById('agregarProductoBtn');
    const mensajeEstado = document.getElementById('mensajeEstado');
    const precioInput = document.getElementById('precio');
    const categoriaSelect = document.getElementById('categoria');
    const descripcionCortaInput = document.getElementById('descripcionCorta');
    const imagenInput = document.getElementById('imagen');
    const idInput = document.getElementById('id');
    const enlaceInput = document.getElementById('enlace');
    const db = window.firebaseDb;
    const auth = window.firebaseAuth;

    const IMAGEN_POR_DEFECTO = "/imagenes/catalogo/producto_sin_definir.png";

    function generarEnlaceWhatsApp(mensaje) {
        const telefono = '573053662867';
        const mensajeCodificado = encodeURIComponent(mensaje);
        return `https://wa.me/${telefono}?text=${mensajeCodificado}`;
    }

    enlaceInput.addEventListener('blur', () => {
        const mensajeWhatsApp = enlaceInput.value.trim();
        
        if (mensajeWhatsApp) {
            const enlaceWhatsApp = generarEnlaceWhatsApp(mensajeWhatsApp);
            enlaceInput.value = enlaceWhatsApp;
        }
    });

    function limpiarPrecio(precioFormateado) {
        return precioFormateado.trim();
    }

    function formatearPrecio() {
        let valor = precioInput.value.replace(/\$/g, '').trim();
        
        if (valor === '') {
            precioInput.value = '$';
            return;
        }
        
        valor = valor.replace(/[^\d]/g, '');
        
        const numero = parseInt(valor, 10);
        const precioFormateado = numero.toLocaleString('es-CL');
        
        precioInput.value = '$' + precioFormateado;
    }

    imagenInput.addEventListener('focus', () => {
        if (imagenInput.value.trim() === IMAGEN_POR_DEFECTO) {
            imagenInput.value = '';
        }
    });

    imagenInput.addEventListener('blur', () => {
        if (imagenInput.value.trim() === '') {
            imagenInput.value = IMAGEN_POR_DEFECTO;
        }
    });

    if (imagenInput.value.trim() === '') {
        imagenInput.value = IMAGEN_POR_DEFECTO;
    }

    function normalizarId(texto) {
        return texto.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function validarYGenerarId() {
        const categoriaSeleccionada = categoriaSelect.value;
        
        if (categoriaSeleccionada === '') {
            return 'Seleccione una categoría primero';
        }
        
        const categoriaNumero = categoriaSeleccionada.replace('categoria', '');
        let id = idInput.value.trim();
        
        const prefijoEsperado = `C${categoriaNumero}-`;
        
        if (!id.startsWith(prefijoEsperado)) {
            id = prefijoEsperado;
        }
        
        id = id.replace(/^.*?C\d+-/, prefijoEsperado);
        
        return id;
    }

    precioInput.addEventListener('input', formatearPrecio);
    precioInput.addEventListener('focus', formatearPrecio);

    idInput.addEventListener('input', () => {
        idInput.value = validarYGenerarId();
    });

    function generarIdPorCategoria(categoria) {
        const mapeoCategoria = {
            'categoria1': 'C1-',
            'categoria2': 'C2-',
            'categoria3': 'C3-',
            'categoria4': 'C4-',
            'categoria5': 'C5-',
            'categoria6': 'C6-',
            'categoria7': 'C7-',
            'categoria8': 'C8-'
        };
        return mapeoCategoria[categoria] || 'C1-';
    }

    idInput.addEventListener('keydown', (e) => {
        const categoriaSeleccionada = categoriaSelect.value;
        const prefijoCategoria = generarIdPorCategoria(categoriaSeleccionada);
        
        if (e.key === 'Backspace' || e.key === 'Delete') {
            const cursorPosition = e.target.selectionStart;
            if (cursorPosition <= prefijoCategoria.length) {
                e.preventDefault();
                return false;
            }
        }
        
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            return false;
        }
    });

    categoriaSelect.addEventListener('change', () => {
        const categoriaSeleccionada = categoriaSelect.value;
        
        if (!categoriaSeleccionada) {
            idInput.value = '';
            idInput.setAttribute('disabled', true);
            return;
        }
        
        const prefijoCategoria = generarIdPorCategoria(categoriaSeleccionada);
        idInput.removeAttribute('disabled');
        
        const valorActual = idInput.value;
        const valorSinPrefijo = valorActual.replace(/^C[1-8]-/, '');
        
        idInput.value = prefijoCategoria + valorSinPrefijo;
    });

    function sanitizarEntrada(texto) {
        return texto ? texto.trim() : '';
    }

    btnAgregarProducto.addEventListener('click', async () => {
        const usuarioActual = auth.currentUser;
        if (!usuarioActual) {
            mensajeEstado.textContent = 'Por favor, inicia sesión primero para agregar productos.';
            mensajeEstado.style.color = 'red';
            
            const botonLogin = document.getElementById('login-btn');
            if (botonLogin) {
                botonLogin.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    botonLogin.style.animation = '';
                }, 500);
            }
            return;
        }

        const categoria = sanitizarEntrada(categoriaSelect.value);
        const descripcion_corta = sanitizarEntrada(descripcionCortaInput.value);
        const descripcion_larga = sanitizarEntrada(document.getElementById('descripcionLarga').value);
        const enlace = sanitizarEntrada(enlaceInput.value);
        const imagen = sanitizarEntrada(imagenInput.value) || IMAGEN_POR_DEFECTO;
        const id = sanitizarEntrada(idInput.value);
        const precio = limpiarPrecio(precioInput.value);

        if (!categoria || !descripcion_corta || !descripcion_larga || !id || !precio) {
            mensajeEstado.textContent = 'Por favor, complete todos los campos obligatorios.';
            mensajeEstado.style.color = 'red';
            return;
        }

        try {
            const idExistenteSnapshot = await db.collection('productos')
                .where('id', '==', id)
                .get();

            if (!idExistenteSnapshot.empty) {
                mensajeEstado.textContent = `El ID "${id}" ya está en uso. Por favor, elija un ID diferente.`;
                mensajeEstado.style.color = 'red';
                return;
            }

            const nuevoProductoRef = await db.collection('productos').add({
                categoria,
                descripcion_corta,
                descripcion_larga,
                enlace,
                id,
                imagen,
                precio
            });

            const productCountElement = document.getElementById('productCount');
            if (productCountElement) {
                const currentCount = parseInt(productCountElement.textContent, 10);
                productCountElement.textContent = currentCount + 1;
            }

            if (window.cargarProductosEditar) {
                window.cargarProductosEditar();
            }
            if (window.cargarProductosEliminar) {
                window.cargarProductosEliminar();
            }

            formularioAgregarProducto.reset();
            imagenInput.value = IMAGEN_POR_DEFECTO;
            mensajeEstado.textContent = `Producto "${descripcion_corta}" agregado correctamente.`;
            mensajeEstado.style.color = 'green';

            console.log('Producto agregado con ID:', nuevoProductoRef.id);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            mensajeEstado.textContent = `Error al agregar producto: ${error.message}`;
            mensajeEstado.style.color = 'red';
        }
    });
});
