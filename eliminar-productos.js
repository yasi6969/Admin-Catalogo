document.addEventListener('DOMContentLoaded', () => {
    const alertSound = new Audio('sound/alert.mp3');
    const gridEliminar = document.getElementById('productos-eliminar-grid');
    const filtroDescripcion = document.getElementById('filtro-descripcion');
    const productCountElement = document.getElementById('productCount');

    let productoAEliminar = null;

    function playAlertSound() {
        try {
            alertSound.currentTime = 0;
            alertSound.play().catch(error => {
                console.error('Error reproduciendo sonido de alerta:', error);
            });
        } catch (error) {
            console.error('Error al intentar reproducir sonido de alerta:', error);
        }
    }

    async function actualizarContadorProductos() {
        try {
            const productosSnapshot = await window.firebaseDb.collection('productos').get();
            const totalProductos = productosSnapshot.size;
            
            if (productCountElement) {
                productCountElement.textContent = totalProductos;
            }
        } catch (error) {
            console.error('Error al contar productos:', error);
        }
    }


    async function cargarProductos() {
        try {
            const productosSnapshot = await window.firebaseDb.collection('productos').get();
            

            gridEliminar.innerHTML = '';


            productosSnapshot.forEach(doc => {
                const producto = doc.data();
                producto.firestore_id = doc.id;

                const tarjetaProducto = document.createElement('div');
                tarjetaProducto.classList.add('tarjeta-producto');
                tarjetaProducto.innerHTML = `
                    <div class="info-producto eliminar">
                        <img src="${producto.imagen || '/imagenes/catalogo/producto_sin_definir.png'}" alt="${producto.descripcion_corta}">
                        <h3>${producto.descripcion_corta}</h3>
                        <p>Categoría: ${producto.categoria}</p>
                        <p>Descripción Larga: ${producto.descripcion_larga}</p>
                        <p>Enlace: ${producto.enlace}</p>
                        <p>ID: ${producto.id}</p>
                        <p>Precio: ${producto.precio}</p>
                        <div class="acciones-producto">
                            <button class="btn-eliminar-producto" 
                                    data-id="${producto.firestore_id}" 
                                    data-descripcion="${producto.descripcion_corta}">
                                Eliminar
                            </button>
                        </div>
                    </div>
                `;
                gridEliminar.appendChild(tarjetaProducto);
            });


            document.querySelectorAll('.btn-eliminar-producto').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const productoId = e.target.dataset.id;
                    const descripcion = e.target.dataset.descripcion;
                    
                    playAlertSound();

                    if (confirm(`¿Estás seguro de eliminar el producto "${descripcion}"?`)) {

                        if (confirm(`¿De verdad verdad estás segura de eliminar el producto "${descripcion}"?`)) {
                            try {

                                await window.firebaseDb.collection('productos').doc(productoId).delete();
                                
                                console.log(`🗑️ Producto eliminado: ${productoId}`);
                                

                                await cargarProductos();
                                await actualizarContadorProductos();
                            } catch (error) {
                                console.error('Error al eliminar producto:', error);
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
            gridEliminar.innerHTML = `<p>Error al cargar productos: ${error.message}</p>`;
        }
    }


    window.cargarProductosEliminar = cargarProductos;


    if (filtroDescripcion) {
        filtroDescripcion.addEventListener('input', () => {
            const filtro = filtroDescripcion.value.toLowerCase();
            const tarjetas = document.querySelectorAll('.tarjeta-producto');
            
            tarjetas.forEach(tarjeta => {
                const texto = tarjeta.textContent.toLowerCase();
                tarjeta.style.display = texto.includes(filtro) ? 'grid' : 'none';
            });
        });
    }


    cargarProductos();
    actualizarContadorProductos();
});