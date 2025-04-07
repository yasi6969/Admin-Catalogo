document.addEventListener('DOMContentLoaded', () => {

    const btnAgregar = document.getElementById('btn-agregar');
    const btnEditar = document.getElementById('btn-editar');
    const btnEliminar = document.getElementById('btn-eliminar');

    const seccionAgregar = document.getElementById('productos-añadir-form');
    const seccionEditar = document.getElementById('productos-editar-grid');
    const seccionEliminar = document.getElementById('productos-eliminar-grid');
    const filtroProductosContainer = document.getElementById('filtro-productos-container');
    const mainContainer = document.querySelector('.main-container');

    function ocultarTodasSecciones() {
        seccionAgregar.style.display = 'none';
        seccionEditar.style.display = 'none';
        seccionEliminar.style.display = 'none';
        filtroProductosContainer.style.display = 'none';

        btnAgregar.classList.remove('active');
        btnEditar.classList.remove('active');
        btnEliminar.classList.remove('active');
    }

    btnAgregar.addEventListener('click', () => {
        ocultarTodasSecciones();
        seccionAgregar.style.display = 'block';
        btnAgregar.classList.add('active');
    });

    btnEditar.addEventListener('click', () => {
        ocultarTodasSecciones();
        seccionEditar.style.display = 'grid';
        btnEditar.classList.add('active');
        filtroProductosContainer.style.display = 'flex';

        if (window.cargarProductosEditar) {
            window.cargarProductosEditar();
        }
    });

    btnEliminar.addEventListener('click', () => {
        ocultarTodasSecciones();
        seccionEliminar.style.display = 'grid';
        filtroProductosContainer.style.display = 'flex';
        btnEliminar.classList.add('active');
    });

    function buscarProductos() {
        const filtroBusqueda = document.getElementById('filtro-descripcion').value.toLowerCase().trim();
        const tarjetasProducto = document.querySelectorAll('.tarjeta-producto');

        tarjetasProducto.forEach(tarjeta => {
            const descripcionElem = tarjeta.querySelector('h3');
            const pTags = tarjeta.querySelectorAll('p');

            const descripcion = descripcionElem ? descripcionElem.textContent.toLowerCase() : '';
            const categoria = pTags[0] ? pTags[0].textContent.toLowerCase() : '';
            const id = pTags[3] ? pTags[3].textContent.toLowerCase() : ''; // producto.id está en el 4° <p> (índice 3)

            if (
                descripcion.includes(filtroBusqueda) ||
                categoria.includes(filtroBusqueda) ||
                id.includes(filtroBusqueda)
            ) {
                tarjeta.style.display = 'block';
            } else {
                tarjeta.style.display = 'none';
            }
        });
    }

    
    const filtroDescripcion = document.getElementById('filtro-descripcion');
    if (filtroDescripcion) {
        filtroDescripcion.addEventListener('input', buscarProductos);
    }
});
