// ==================== BUSCADOR — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  const inputBuscador = document.getElementById('inputBuscador');
  const btnLimpiar = document.getElementById('btnLimpiar');

  if (!inputBuscador) return;

  // Buscar mientras se escribe
  inputBuscador.addEventListener('input', () => {
    const valor = inputBuscador.value;

    // Mostrar u ocultar botón limpiar
    if (valor.length > 0) {
      btnLimpiar.style.display = 'block';
    } else {
      btnLimpiar.style.display = 'none';
    }

    // Guardar búsqueda
    localStorage.setItem('busqueda_myt', valor);

    // Disparar evento para filtrar productos
    window.dispatchEvent(new CustomEvent('buscarProductos', { 
      detail: { busqueda: valor } 
    }));
  });

  // Limpiar búsqueda
  btnLimpiar.addEventListener('click', () => {
    inputBuscador.value = '';
    btnLimpiar.style.display = 'none';
    localStorage.removeItem('busqueda_myt');
    window.dispatchEvent(new CustomEvent('buscarProductos', { 
      detail: { busqueda: '' } 
    }));
    inputBuscador.focus();
  });

});