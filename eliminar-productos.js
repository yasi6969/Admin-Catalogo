document.addEventListener('DOMContentLoaded', () => {
    const gridEliminar = document.getElementById('productos-eliminar-grid');
    const filtroDescripcion = document.getElementById('filtro-descripcion');
    const productCountElement = document.getElementById('productCount');

    let productoAEliminar = null;

    // Función para actualizar contador de productos
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

    // Función para cargar productos
    async function cargarProductos() {
        try {
            const productosSnapshot = await window.firebaseDb.collection('productos').get();
            
            // Limpiar grid existente
            gridEliminar.innerHTML = '';

            // Crear tarjetas de productos
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

            // Agregar eventos de eliminación
            document.querySelectorAll('.btn-eliminar-producto').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const productoId = e.target.dataset.id;
                    const descripcion = e.target.dataset.descripcion;
                    
                    // Mostrar confirmación
                    if (confirm(`¿Estás seguro de eliminar el producto "${descripcion}"?`)) {
                        try {
                            // Eliminar producto de Firestore
                            await window.firebaseDb.collection('productos').doc(productoId).delete();
                            
                            console.log(`🗑️ Producto eliminado: ${productoId}`);
                            
                            // Recargar productos y actualizar contador
                            await cargarProductos();
                            await actualizarContadorProductos();
                        } catch (error) {
                            console.error('Error al eliminar producto:', error);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
            gridEliminar.innerHTML = `<p>Error al cargar productos: ${error.message}</p>`;
        }
    }

    // Filtrar productos
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

    // Cargar productos y actualizar contador al iniciar
    cargarProductos();
    actualizarContadorProductos();
});