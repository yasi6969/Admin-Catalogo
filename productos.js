document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btn-agregar');
    const btnEditar = document.getElementById('btn-editar');
    const btnEliminar = document.getElementById('btn-eliminar');

    const seccionAgregar = document.getElementById('productos-añadir-form');
    const seccionEditar = document.getElementById('productos-editar-grid');
    const seccionEliminar = document.getElementById('productos-eliminar-grid');
    const filtroProductosContainer = document.getElementById('filtro-productos-container');
    const textoInicial = document.getElementById('texto-inicial');

    function animarSeccion(seccion, filtro = null, textoInicial = null, animacion = 'left') {
        const resetearEstilos = (elemento) => {
            elemento.style.transition = 'none';
            elemento.style.opacity = '0';
            elemento.style.transform = 'translate(0)';
        };

        [seccionAgregar, seccionEditar, seccionEliminar].forEach(s => {
            if (s !== seccion) {
                resetearEstilos(s);
                s.style.display = 'none';
            }
        });

        if (textoInicial) {
            textoInicial.style.transition = 'opacity 0.1s ease-out';
            textoInicial.style.opacity = '0';
            
            setTimeout(() => {
                textoInicial.style.display = 'none';
            }, 100);
        }

        if (filtroProductosContainer) {
            filtroProductosContainer.style.display = 'none';
        }

        seccion.style.display = seccion === seccionAgregar ? 'block' : 'grid';
        
        if (seccion === seccionEditar) {

            seccion.style.transition = 'all 0.2s ease-out';
            seccion.style.opacity = '0';
            seccion.style.transform = 'scale(0.95) translateY(10px)';
            
            requestAnimationFrame(() => {
                seccion.style.opacity = '1';
                seccion.style.transform = 'scale(1) translateY(0)';
            });

            if (filtroProductosContainer) {
                filtroProductosContainer.style.display = 'flex';
            }
        } else {

            switch(animacion) {
                case 'right':
                    seccion.style.transform = 'translateX(20%)';
                    break;
                case 'bottom':
                    seccion.style.transform = 'translateY(30%)';
                    break;
                default:
                    seccion.style.transform = 'translateX(-20%)';
            }

            if (filtro) {
                filtro.style.display = 'flex';
                resetearEstilos(filtro);
            }

            requestAnimationFrame(() => {
                seccion.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                seccion.style.opacity = '1';
                seccion.style.transform = 'translate(0)';

                if (filtro) {
                    filtro.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    filtro.style.opacity = '1';
                }
            });
        }
    }

    function manejarBotonesActivos(botonActivo) {
        [btnAgregar, btnEditar, btnEliminar].forEach(btn => {
            btn.classList.toggle('active', btn === botonActivo);
        });
    }

    btnAgregar.addEventListener('click', () => {
        animarSeccion(seccionAgregar, null, textoInicial);
        manejarBotonesActivos(btnAgregar);
    });

    btnEditar.addEventListener('click', () => {
        animarSeccion(seccionEditar, filtroProductosContainer, textoInicial, 'bottom');
        manejarBotonesActivos(btnEditar);

        if (window.cargarProductosEditar) {
            window.cargarProductosEditar();
        }
    });

    btnEliminar.addEventListener('click', () => {
        animarSeccion(seccionEliminar, filtroProductosContainer, textoInicial, 'right');
        manejarBotonesActivos(btnEliminar);
    });

    function buscarProductos() {
        const filtroBusqueda = document.getElementById('filtro-descripcion').value.toLowerCase().trim();
        const tarjetasProducto = document.querySelectorAll('.tarjeta-producto');

        tarjetasProducto.forEach(tarjeta => {
            const descripcionElem = tarjeta.querySelector('h3');
            const pTags = tarjeta.querySelectorAll('p');

            const descripcion = descripcionElem ? descripcionElem.textContent.toLowerCase() : '';
            const categoria = pTags[0] ? pTags[0].textContent.toLowerCase() : '';
            const id = pTags[3] ? pTags[3].textContent.toLowerCase() : '';

            if (
                descripcion.includes(filtroBusqueda) ||
                categoria.includes(filtroBusqueda) ||
                id.includes(filtroBusqueda)
            ) {
                tarjeta.style.display = 'block';
                tarjeta.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                tarjeta.style.display = 'none';
            }
        });
    }
    
    const filtroDescripcion = document.getElementById('filtro-descripcion');
    if (filtroDescripcion) {
        filtroDescripcion.addEventListener('input', buscarProductos);
    }

    const animationStyles = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);
});
