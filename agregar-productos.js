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

    const IMAGEN_POR_DEFECTO = "/imagenes/catalogo/producto_sin_definir.png";

    // Generar enlace de WhatsApp
    function generarEnlaceWhatsApp(mensaje) {
        const telefono = '573053662867';
        const mensajeCodificado = encodeURIComponent(mensaje);
        return `https://wa.me/${telefono}?text=${mensajeCodificado}`;
    }

    // Evento para generar enlace de WhatsApp
    enlaceInput.addEventListener('blur', () => {
        const mensajeWhatsApp = enlaceInput.value.trim();
        
        if (mensajeWhatsApp) {
            const enlaceWhatsApp = generarEnlaceWhatsApp(mensajeWhatsApp);
            enlaceInput.value = enlaceWhatsApp;
        }
    });

    // Limpiar precio antes de guardar
    function limpiarPrecio(precioFormateado) {
        return precioFormateado.trim();
    }

    // Formatear precio con $ y puntos de mil
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

    // Manejar imagen por defecto
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

    // Establecer imagen por defecto al cargar
    if (imagenInput.value.trim() === '') {
        imagenInput.value = IMAGEN_POR_DEFECTO;
    }

    // Normalizar ID para URL y base de datos
    function normalizarId(texto) {
        return texto.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Validar y generar ID
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

    // Eventos de precio
    precioInput.addEventListener('input', formatearPrecio);
    precioInput.addEventListener('focus', formatearPrecio);

    // Eventos de ID
    idInput.addEventListener('input', () => {
        idInput.value = validarYGenerarId();
    });

    // Generar ID por categoría
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

    // Bloquear edición del prefijo de categoría en ID
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

    // Establecer prefijo de categoría automáticamente
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

    // Sanitizar entradas
    function sanitizarEntrada(texto) {
        return texto ? texto.trim() : '';
    }

    // Evento de agregar producto
    btnAgregarProducto.addEventListener('click', async () => {
        const categoria = sanitizarEntrada(categoriaSelect.value);
        const descripcion_corta = sanitizarEntrada(descripcionCortaInput.value);
        const descripcion_larga = sanitizarEntrada(document.getElementById('descripcionLarga').value);
        const enlace = sanitizarEntrada(enlaceInput.value);
        const imagen = sanitizarEntrada(imagenInput.value) || IMAGEN_POR_DEFECTO;
        const id = sanitizarEntrada(idInput.value);
        const precio = limpiarPrecio(precioInput.value);

        // Validaciones
        if (!categoria || !descripcion_corta || !descripcion_larga || !id || !precio) {
            mensajeEstado.textContent = 'Por favor, complete todos los campos obligatorios.';
            mensajeEstado.style.color = 'red';
            return;
        }

        try {
            // Verificar si el ID ya existe
            const idExistenteSnapshot = await db.collection('productos')
                .where('id', '==', id)
                .get();

            if (!idExistenteSnapshot.empty) {
                mensajeEstado.textContent = `El ID "${id}" ya está en uso. Por favor, elija un ID diferente.`;
                mensajeEstado.style.color = 'red';
                return;
            }

            // Agregar producto a Firestore
            const nuevoProductoRef = await db.collection('productos').add({
                categoria,
                descripcion_corta,
                descripcion_larga,
                enlace,
                id,
                imagen,
                precio
            });

            // Actualizar contador de productos
            const productCountElement = document.getElementById('productCount');
            if (productCountElement) {
                const currentCount = parseInt(productCountElement.textContent, 10);
                productCountElement.textContent = currentCount + 1;
            }

            // Actualizar grids de editar y eliminar
            if (window.cargarProductosEditar) {
                window.cargarProductosEditar();
            }
            if (window.cargarProductosEliminar) {
                window.cargarProductosEliminar();
            }

            // Limpiar formulario
            formularioAgregarProducto.reset();
            imagenInput.value = IMAGEN_POR_DEFECTO;

            // Mensaje de éxito
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
