import { db } from './firebase.js'; 

console.warn('🚨 product-counter.js cargado');

async function contarProductos() {
  try {
    console.warn('🟠 Contando productos en Firestore...');
    const productosRef = db.collection("productos");
    const querySnapshot = await productosRef.get();
    const count = querySnapshot.size;

    const productCountSpan = document.getElementById('productCount');
    if (productCountSpan) {
      productCountSpan.textContent = count;
      productCountSpan.style.color = 'black';
      productCountSpan.style.fontWeight = 'normal';
    }

    console.warn(`✅ Conteo actualizado: ${count}`);
    return count;
  } catch (error) {
    console.error("❌ Error al contar productos:", error);
    const productCountSpan = document.getElementById('productCount');
    if (productCountSpan) {
      productCountSpan.textContent = "Error";
      productCountSpan.style.color = 'red';
    }
    return 0;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.warn('🌐 DOM completamente cargado');

  contarProductos();

  setTimeout(() => {
    const productCountBtn = document.getElementById('product-count-btn');
    const productCountSpan = document.getElementById('productCount');

    if (productCountBtn) {
      console.warn('✅ Botón encontrado, asignando evento click');

      productCountBtn.addEventListener('click', async () => {
        console.warn('🔄 Actualizando productos...');

        if (productCountSpan) {
          productCountSpan.textContent = '...';
          productCountSpan.style.color = 'orange';
          productCountSpan.style.fontWeight = 'bold';
        }

        const count = await contarProductos();

        if (window.cargarProductosEditar) {
          console.warn('📦 Productos cargados para edición');
          window.cargarProductosEditar();
        } else {
          console.warn('ℹ️ No se encontró la función cargarProductosEditar');
        }
      });
    } else {
      console.error('❌ No se encontró el botón con id="product-count-btn"');
    }
  }, 300);
});


export { contarProductos };
