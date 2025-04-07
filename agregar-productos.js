document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar elementos del DOM
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

    // Constante para imagen por defecto
    const IMAGEN_POR_DEFECTO = "/imagenes/catalogo/producto_sin_definir.png";

    // Función para generar enlace de WhatsApp
    function generarEnlaceWhatsApp(mensaje) {
        const telefono = '573053662867';
        const mensajeCodificado = encodeURIComponent(mensaje);
        return `https://wa.me/${telefono}?text=${mensajeCodificado}`;
    }

    // Eventos de enlace de WhatsApp
    enlaceInput.addEventListener('blur', () => {
        const mensajeWhatsApp = enlaceInput.value.trim();
        
        if (mensajeWhatsApp) {
            // Generar enlace de WhatsApp
            const enlaceWhatsApp = generarEnlaceWhatsApp(mensajeWhatsApp);
            
            // Establecer el enlace generado en el input
            enlaceInput.value = enlaceWhatsApp;
        }
    });

    // Función para limpiar precio antes de guardar
    function limpiarPrecio(precioFormateado) {
        // Devolver el precio tal como está en el input
        return precioFormateado.trim();
    }

    // Función para formatear precio con $ y puntos de mil
    function formatearPrecio() {
        console.log('Formateando precio:', precioInput.value);
        
        // Eliminar todos los $ existentes
        let valor = precioInput.value.replace(/\$/g, '').trim();
        
        // Si está vacío, establecer $
        if (valor === '') {
            precioInput.value = '$';
            return;
        }
        
        // Eliminar caracteres no numéricos
        valor = valor.replace(/[^\d]/g, '');
        
        // Convertir a número para formatear con puntos de mil
        const numero = parseInt(valor, 10);
        
        // Formatear con puntos de mil
        const precioFormateado = numero.toLocaleString('es-CL');
        
        // Añadir $ al principio
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

    // Función para normalizar ID
    function normalizarId(texto) {
        // Convertir a minúsculas, eliminar caracteres especiales, reemplazar espacios con guiones
        return texto.toLowerCase()
            .normalize('NFD')  // Descomponer caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '')  // Eliminar acentos
            .replace(/[^a-z0-9]/g, '-')  // Reemplazar caracteres no alfanuméricos con guiones
            .replace(/-+/g, '-')  // Reemplazar múltiples guiones consecutivos con uno solo
            .replace(/^-|-$/g, '');  // Eliminar guiones al inicio y final
    }

    // Función para validar y generar ID
    function validarYGenerarId() {
        // Extraer número de categoría
        const categoriaSeleccionada = categoriaSelect.value;
        
        // Si no se ha seleccionado una categoría
        if (categoriaSeleccionada === '') {
            return 'Seleccione una categoría primero';
        }
        
        const categoriaNumero = categoriaSeleccionada.replace('categoria', '');
        
        // Obtener valor actual del ID
        let id = idInput.value.trim();
        
        // Validar que comience con el prefijo de categoría
        const prefijoEsperado = `C${categoriaNumero}-`;
        
        if (!id.startsWith(prefijoEsperado)) {
            // Si no comienza con el prefijo correcto, reiniciar
            id = prefijoEsperado;
        }
        
        // Eliminar cualquier cosa antes del prefijo
        id = id.replace(/^.*?C\d+-/, prefijoEsperado);
        
        console.log('ID validado:', id);
        return id;
    }

    // Eventos de precio
    precioInput.addEventListener('input', formatearPrecio);
    precioInput.addEventListener('focus', formatearPrecio);

    // Eventos de ID
    idInput.addEventListener('input', () => {
        // Validar formato de ID
        idInput.value = validarYGenerarId();
    });

    // Función para generar ID basado en categoría
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
        
        // Prevenir borrado del prefijo de categoría
        if (e.key === 'Backspace' || e.key === 'Delete') {
            const cursorPosition = e.target.selectionStart;
            if (cursorPosition <= prefijoCategoria.length) {
                e.preventDefault();
                return false;
            }
        }
        
        // Prevenir pegar texto que modifique el prefijo
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
        
        // Mantener solo el número después del prefijo si ya existe
        const valorActual = idInput.value;
        const valorSinPrefijo = valorActual.replace(/^C[1-8]-/, '');
        
        idInput.value = prefijoCategoria + valorSinPrefijo;
    });

    // Eventos de categoría
    categoriaSelect.addEventListener('change', () => {
        console.log('Categoría cambiada');
        // Restablecer ID con nuevo prefijo o mensaje
        const categoriaSeleccionada = categoriaSelect.value;
        
        if (categoriaSeleccionada === '') {
            idInput.value = 'Seleccione una categoría primero';
        } else {
            idInput.value = `C${categoriaSeleccionada.replace('categoria', '')}-`;
        }
    });

    // Función para sanitizar entradas
    function sanitizarEntrada(texto) {
        return texto.replace(/[<>"']/g, '').trim();
    }

    btnAgregarProducto.addEventListener('click', async () => {
        const categoria = sanitizarEntrada(categoriaSelect.value);
        const descripcion_corta = sanitizarEntrada(descripcionCortaInput.value);
        const descripcion_larga = sanitizarEntrada(document.getElementById('descripcionLarga').value);
        const enlace = sanitizarEntrada(enlaceInput.value);
        const imagen = sanitizarEntrada(imagenInput.value);
        const id = sanitizarEntrada(idInput.value);
        const precio = sanitizarEntrada(precioInput.value);

        // Validaciones básicas
        if (categoria === '') {
            mensajeEstado.textContent = 'Por favor, seleccione una categoría.';
            mensajeEstado.classList.add('error');
            return;
        }

        if (!descripcion_corta || !descripcion_larga) {
            mensajeEstado.textContent = 'Por favor, complete los campos obligatorios.';
            mensajeEstado.classList.add('error');
            return;
        }

        // Validar ID
        const idRegex = /^C[1-8]-\d+[a-zA-Z]?$/;
        if (!idRegex.test(id)) {
            mensajeEstado.textContent = 'Por favor, complete el ID con un número y opcionalmente una letra.';
            mensajeEstado.classList.add('error');
            return;
        }

        // Normalizar ID agregando prefijo si no existe
        const idNormalizado = id.includes('C') ? id : `C1-${id}`;

        try {
            // Verificar si el ID ya existe
            const idExistenteSnapshot = await db.collection('productos')
                .where('id', '==', idNormalizado)
                .get();

            if (!idExistenteSnapshot.empty) {
                mensajeEstado.textContent = `El ID "${idNormalizado}" ya está en uso. Por favor, elija un ID diferente.`;
                mensajeEstado.classList.add('error');
                return;
            }

            // Generar ID de documento basado en descripción corta
            const documentId = normalizarId(descripcion_corta);
            const docRef = db.collection('productos').doc(documentId);
            const doc = await docRef.get();

            if (doc.exists) {
                mensajeEstado.textContent = `Ya existe un producto con una descripción similar. Por favor, elija una descripción diferente.`;
                mensajeEstado.classList.add('error');
                return;
            }

            // Preparar datos del producto para guardar
            const productoData = {
                categoria,
                descripcion_corta,
                descripcion_larga,
                enlace,
                imagen: imagen || IMAGEN_POR_DEFECTO,
                id: idNormalizado,
                precio: limpiarPrecio(precio)
            };

            // Guardar producto en Firestore sin nombre ni fecha de creación
            await docRef.set(productoData);
            
            console.log(`📦 Producto agregado: ${descripcion_corta} (ID: ${id})`);
            
            // Limpiar formulario
            formularioAgregarProducto.reset();
            
            mensajeEstado.textContent = `Producto agregado exitosamente. Nombre: ${descripcion_corta}`;
            mensajeEstado.classList.remove('error');
            mensajeEstado.classList.add('exito');

        } catch (error) {
            console.error('Error al agregar producto:', error);
            mensajeEstado.textContent = 'Error al agregar producto: ' + error.message;
            mensajeEstado.classList.add('error');
        }
    });

    // Inicializar formulario
    formatearPrecio();
    idInput.value = 'Seleccione una categoría primero';

    // Añadir logs de depuración
    console.log('Script de agregar productos inicializado');
    console.log('Elementos:', { 
        precioInput, 
        categoriaSelect, 
        descripcionCortaInput,
        imagenInput,
        idInput
    });
});
