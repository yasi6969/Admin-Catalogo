document.addEventListener('DOMContentLoaded', () => {
    const gridEditar = document.getElementById('productos-editar-grid');
    const filtroDescripcion = document.getElementById('filtro-descripcion');
    

    const modalEdicion = document.createElement('div');
    modalEdicion.id = 'modal-edicion-producto';
    modalEdicion.classList.add('modal');
    modalEdicion.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Editar Producto</h2>
            <form id="formularioEditarProducto" class="formulario-producto">
                <div class="input-group">
                    <label for="categoria-editar">Categoría</label>
                    <select id="categoria-editar" name="categoria" required>
                        <option value="">Seleccione una categoría</option>
                        <option value="categoria1">Categoría 1</option>
                        <option value="categoria2">Categoría 2</option>
                        <option value="categoria3">Categoría 3</option>
                        <option value="categoria4">Categoría 4</option>
                        <option value="categoria5">Categoría 5</option>
                        <option value="categoria6">Categoría 6</option>
                        <option value="categoria7">Categoría 7</option>
                        <option value="categoria8">Categoría 8</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="descripcionCorta-editar">Descripción Corta / Nombre</label>
                    <input type="text" id="descripcionCorta-editar" name="descripcionCorta" required>
                    <small id="mensaje-edicion" class="mensaje-edicion"></small>
                </div>
                <div class="input-group">
                    <label for="descripcionLarga-editar">Descripción Larga</label>
                    <textarea id="descripcionLarga-editar" name="descripcionLarga" rows="4" required></textarea>
                </div>
                <div class="input-group">
                    <label for="enlace-editar">Texto para enlace de WhatsApp</label>
                    <input type="text" id="enlace-editar" name="enlace" placeholder="Escribe el texto para el enlace">
                    <small id="enlace-generado-editar" class="enlace-generado"></small>
                </div>
                <div class="input-group">
                    <label for="id-editar">ID</label>
                    <input type="text" id="id-editar" name="id" placeholder="C1-1a o C1-2 o C2-1" required>
                </div>
                <div class="input-group">
                    <label for="imagen-editar">Link de Imagen</label>
                    <input type="text" id="imagen-editar" name="imagen" placeholder="/imagenes/catalogo/nombre">
                </div>
                <div class="input-group">
                    <label for="precio-editar">Precio</label>
                    <input type="text" id="precio-editar" name="precio" placeholder="$1.000" required>
                </div>
                <div class="mensaje-estado" id="mensajeEstadoEditar"></div>
                <button type="button" id="editarProductoBtn" class="btn-editar-producto">Guardar Cambios</button>
            </form>
            

        </div>
    `;
    document.body.appendChild(modalEdicion);

    const closeModalBtn = modalEdicion.querySelector('.close-modal');
    
    function openModal() {
        const scrollY = window.scrollY;
        document.body.classList.add('no-scroll');
        modalEdicion.style.display = 'flex';
    }

    function closeModal() {
        const scrollY = parseInt(document.body.style.top) * -1;
        modalEdicion.style.display = 'none';
        document.body.classList.remove('no-scroll');
        window.scrollTo(0, scrollY);
    }

    closeModalBtn.addEventListener('click', closeModal);

    modalEdicion.addEventListener('click', function(event) {
        if (event.target === modalEdicion) {
            closeModal();
        }
    });


    function generarEnlaceWhatsApp(telefono, mensaje) {
        const enlaceBase = 'https://wa.me/';
        const telefonoLimpio = telefono.replace(/[^\d]/g, '');
        const enlaceCompleto = `${enlaceBase}${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
        return enlaceCompleto;
    }


    function mostrarEnlaceGenerado(enlace) {
        const enlaceGeneradoDiv = document.getElementById('enlace-generado-editar');
        if (enlaceGeneradoDiv) {
            enlaceGeneradoDiv.textContent = enlace;
            enlaceGeneradoDiv.classList.add('enlace-generado');
        }
    }


    let enlaceWhatsApp = '';
    let descripcionOriginal = '';


    const enlaceInput = document.getElementById('enlace-editar');
    const enlaceGenerado = document.getElementById('enlace-generado-editar');
    const categoriaSelect = document.getElementById('categoria-editar');
    const idInput = document.getElementById('id-editar');
    const descripcionCortaInput = document.getElementById('descripcionCorta-editar');
    const mensajeEdicion = document.getElementById('mensaje-edicion');
    
    descripcionCortaInput.addEventListener('input', () => {
        const descripcionActual = descripcionCortaInput.value.trim();
        
        if (descripcionOriginal && descripcionActual !== descripcionOriginal) {
            mensajeEdicion.textContent = `Vas a editar el producto con la descripción "${descripcionOriginal}"`;
            mensajeEdicion.style.color = '#007bff';
        } else {
            mensajeEdicion.textContent = '';
        }
    });

    enlaceInput.addEventListener('input', () => {
        const texto = enlaceInput.value.trim();
        enlaceWhatsApp = generarEnlaceWhatsApp('573053662867', texto);
        
        if (enlaceWhatsApp) {
            mostrarEnlaceGenerado(enlaceWhatsApp);
        } else {
            enlaceGenerado.textContent = '';
        }
    });


    categoriaSelect.addEventListener('change', () => {
        const categoria = categoriaSelect.value;
        const categoriaNumero = categoria.replace('categoria', '');
        const idInput = document.getElementById('id-editar');
        const idLabel = document.querySelector('label[for="id-editar"]');
        

        const idActual = idInput.value;
        const partes = idActual.split('-');
        
        if (categoria === '') {

            idInput.value = '';
            idInput.classList.remove('valido');
            idInput.classList.add('invalido');
            idInput.disabled = true;
            

            if (idLabel) {
                idLabel.classList.remove('valido');
                idLabel.classList.add('invalido');
            }
        } else {

            idInput.disabled = false;
            
            if (partes.length > 1) {
                idInput.value = `C${categoriaNumero}-${partes[1]}`;
            } else {
                idInput.value = `C${categoriaNumero}-1`;
            }
            

            validarEntrada(idInput);
            

            if (idLabel) {
                idLabel.classList.remove('invalido');
                idLabel.classList.add('valido');
            }
        }
    });


    const precioInput = document.getElementById('precio-editar');
    
    precioInput.addEventListener('input', () => {
        let valor = precioInput.value.replace(/[^\d]/g, '');
        
        if (valor) {

            valor = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(valor);
            

            valor = valor.replace('COP', '$');
            
            precioInput.value = valor;
        }
    });


    function validarEntrada(entrada) {
        const valor = entrada.value.trim();
        const etiqueta = entrada.closest('.input-group').querySelector('label');
        

        if (entrada.id === 'enlace-editar') {
            if (valor) {
                entrada.classList.remove('invalido');
                entrada.classList.add('valido');
                if (etiqueta) {
                    etiqueta.classList.remove('invalido');
                    etiqueta.classList.add('valido');
                }
            } else {
                entrada.classList.remove('valido');
                entrada.classList.add('invalido');
                if (etiqueta) {
                    etiqueta.classList.remove('valido');
                    etiqueta.classList.add('invalido');
                }
            }
            return;
        }
        

        if (entrada.id === 'imagen-editar') {
            if (valor) {
                entrada.classList.remove('invalido');
                entrada.classList.add('valido');
                if (etiqueta) {
                    etiqueta.classList.remove('invalido');
                    etiqueta.classList.add('valido');
                }
            } else {

                entrada.value = '/imagenes/catalogo/producto_sin_definir.png';
                entrada.classList.remove('invalido');
                entrada.classList.add('valido');
                if (etiqueta) {
                    etiqueta.classList.remove('invalido');
                    etiqueta.classList.add('valido');
                }
            }
            return;
        }
        
        if (entrada.hasAttribute('required')) {
            if (valor) {
                entrada.classList.remove('invalido');
                entrada.classList.add('valido');
                if (etiqueta) {
                    etiqueta.classList.remove('invalido');
                    etiqueta.classList.add('valido');
                }
            } else {
                entrada.classList.remove('valido');
                entrada.classList.add('invalido');
                if (etiqueta) {
                    etiqueta.classList.remove('valido');
                    etiqueta.classList.add('invalido');
                }
            }
        }
    }


    const entradasRequeridas = [
        categoriaSelect, 
        descripcionCortaInput, 
        document.getElementById('descripcionLarga-editar'), 
        idInput, 
        precioInput,
        document.getElementById('enlace-editar'),
        document.getElementById('imagen-editar')
    ];

    entradasRequeridas.forEach(entrada => {
        entrada.addEventListener('input', () => validarEntrada(entrada));
        entrada.addEventListener('blur', () => validarEntrada(entrada));
    });


    function extraerTextoEnlaceWhatsApp(enlace) {
        if (!enlace) return '';
        try {
            const url = new URL(enlace);
            const parametros = new URLSearchParams(url.search);
            return parametros.get('text') || '';
        } catch (error) {
            return '';
        }
    }


    function cargarDatosProductoEnModal(producto) {

        const mensajeEstadoEditar = document.getElementById('mensajeEstadoEditar');
        if (mensajeEstadoEditar) {
            mensajeEstadoEditar.textContent = '';
            mensajeEstadoEditar.classList.remove('exito', 'error');
        }

        document.getElementById('categoria-editar').value = producto.categoria;
        document.getElementById('descripcionCorta-editar').value = producto.descripcion_corta;
        document.getElementById('descripcionLarga-editar').value = producto.descripcion_larga;

        const textoEnlace = extraerTextoEnlaceWhatsApp(producto.enlace);
        document.getElementById('enlace-editar').value = textoEnlace;

        document.getElementById('imagen-editar').value = producto.imagen || '';
        
        document.getElementById('id-editar').value = producto.id;
        document.getElementById('precio-editar').value = producto.precio;
        
        modalEdicion.dataset.firestoreId = producto.firestore_id;
        modalEdicion.dataset.descripcionOriginal = producto.descripcion_corta;
        
        const entradasRequeridas = [
            document.getElementById('categoria-editar'),
            document.getElementById('descripcionCorta-editar'), 
            document.getElementById('descripcionLarga-editar'), 
            document.getElementById('id-editar'), 
            document.getElementById('precio-editar'),
            document.getElementById('enlace-editar'),
            document.getElementById('imagen-editar')
        ];
        
        entradasRequeridas.forEach(entrada => {
            validarEntrada(entrada);
        });
    }

    document.getElementById('editarProductoBtn').addEventListener('click', () => {
        const firestoreId = modalEdicion.dataset.firestoreId;
        const nuevoId = document.getElementById('id-editar').value;

        const textoEnlace = document.getElementById('enlace-editar').value.trim();
        const enlaceWhatsApp = generarEnlaceWhatsApp('573053662867', textoEnlace);

        window.firebaseDb.collection('productos')
            .where('id', '==', nuevoId)
            .get()
            .then((querySnapshot) => {
                const productosConMismoId = querySnapshot.docs.filter(
                    doc => doc.id !== firestoreId
                );

                if (productosConMismoId.length > 0) {
                    document.getElementById('mensajeEstadoEditar').textContent = `El ID "${nuevoId}" ya está en uso. Por favor, elija un ID diferente.`;
                    document.getElementById('mensajeEstadoEditar').classList.add('error');
                    return;
                }

                const producto = {
                    categoria: document.getElementById('categoria-editar').value,
                    descripcion_corta: document.getElementById('descripcionCorta-editar').value,
                    descripcion_larga: document.getElementById('descripcionLarga-editar').value,
                    enlace: enlaceWhatsApp || document.getElementById('enlace-editar').value,
                    id: nuevoId,
                    imagen: document.getElementById('imagen-editar').value,
                    precio: document.getElementById('precio-editar').value
                };

                window.firebaseDb.collection('productos').doc(firestoreId).update(producto)
                    .then(() => {
                        console.log(`✏️ Producto editado: ${producto.descripcion_corta} (ID: ${producto.id})`);
                        document.getElementById('mensajeEstadoEditar').textContent = 'Producto actualizado exitosamente';
                        document.getElementById('mensajeEstadoEditar').classList.add('exito');
                        
                        setTimeout(() => {
                            closeModal();
                            cargarProductos();
                        }, 1500);
                    })
                    .catch((error) => {
                        document.getElementById('mensajeEstadoEditar').textContent = 'Error al actualizar producto: ' + error.message;
                        document.getElementById('mensajeEstadoEditar').classList.add('error');
                    });
            })
            .catch((error) => {
                console.error('Error al verificar ID:', error);
                document.getElementById('mensajeEstadoEditar').textContent = 'Error al verificar ID: ' + error.message;
                document.getElementById('mensajeEstadoEditar').classList.add('error');
            });
    });

    function cargarProductos() {
        if (!window.firebaseDb) {
            console.error('Firestore no está inicializado');
            return;
        }

        const productosRef = window.firebaseDb.collection('productos');
        
        productosRef.get().then((querySnapshot) => {
            gridEditar.innerHTML = ''; 

            querySnapshot.forEach((doc) => {
                const producto = doc.data();
                producto.firestore_id = doc.id;

                const tarjetaProducto = document.createElement('div');
                tarjetaProducto.classList.add('tarjeta-producto');
                tarjetaProducto.innerHTML = `
                    
                    <div class="info-producto editar">
                    <img src="${producto.imagen || '/imagenes/catalogo/producto_sin_definir.png'}" alt="${producto.descripcion_corta}">
                        <h3>${producto.descripcion_corta}</h3>
                        <p>${producto.categoria}</p>
                        <p>${producto.descripcion_larga}</p>
                        <p>${producto.enlace}</p>
                        <p>${producto.id}</p>
                        <p>${producto.precio}</p>
                        <div class="acciones-producto">
                            <button class="btn-editar-producto btn-editar-full" data-id="${producto.firestore_id}">Editar</button>
                        </div>
                    </div>
                `;
                gridEditar.appendChild(tarjetaProducto);

                tarjetaProducto.querySelector('.btn-editar-producto').addEventListener('click', () => {
                    const productoEditar = {
                        categoria: producto.categoria,
                        descripcion_corta: producto.descripcion_corta,
                        descripcion_larga: producto.descripcion_larga,
                        enlace: producto.enlace,
                        id: producto.id,
                        imagen: producto.imagen,
                        precio: producto.precio,
                        firestore_id: producto.firestore_id
                    };
                    cargarDatosProductoEnModal(productoEditar);
                    openModal();
                });
            });
        }).catch((error) => {
            console.error('Error al cargar productos:', error);
            gridEditar.innerHTML = `<p>Error al cargar productos: ${error.message}</p>`;
        });
    }

    filtroDescripcion.addEventListener('input', () => {
        const filtro = filtroDescripcion.value.toLowerCase();
        const tarjetas = document.querySelectorAll('.tarjeta-producto');
        
        tarjetas.forEach(tarjeta => {
            const texto = tarjeta.textContent.toLowerCase();
            tarjeta.style.display = texto.includes(filtro) ? 'block' : 'none';
        });
    });

    cargarProductos();

    window.cargarProductosEditar = cargarProductos;

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

    document.getElementById('id-editar').addEventListener('keydown', (e) => {
        const categoriaSeleccionada = document.getElementById('categoria-editar').value;
        
        if (!categoriaSeleccionada) {
            e.preventDefault();
            document.getElementById('id-editar').value = 'Seleccione una categoría primero';
            return false;
        }

        const prefijoCategoria = generarIdPorCategoria(categoriaSeleccionada);
        const cursorPosition = e.target.selectionStart;
        
        if ((e.key === 'Backspace' || e.key === 'Delete') && 
            cursorPosition <= prefijoCategoria.length) {
            e.preventDefault();
            return false;
        }
    });

    document.getElementById('categoria-editar').addEventListener('change', () => {
        const categoriaSeleccionada = document.getElementById('categoria-editar').value;
        const idInput = document.getElementById('id-editar');
        
        if (!categoriaSeleccionada) {
            idInput.value = 'Seleccione una categoría primero';
            idInput.setAttribute('disabled', true);
            return;
        }
        
        const prefijoCategoria = generarIdPorCategoria(categoriaSeleccionada);
        idInput.removeAttribute('disabled');

        if (idInput.value === 'Seleccione una categoría primero') {
            idInput.value = prefijoCategoria;
        } else {

            const valorActual = idInput.value;
            const valorSinPrefijo = valorActual.replace(/^C[1-8]-/, '');
            
            idInput.value = prefijoCategoria + valorSinPrefijo;
        }
    });
});