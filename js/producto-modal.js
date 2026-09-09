// ==================== MODAL PRODUCTO — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('productoModal');
  const overlay = document.getElementById('modalOverlay');
  const btnCerrar = document.getElementById('btnCerrarModal');

  if (!modal) return;

  let productoActual = null;
  let cantidadActual = 1;

  // ----- Abrir modal -----
  window.abrirModalProducto = function(producto) {
    productoActual = producto;
    cantidadActual = 1;

    document.getElementById('modalImagen').src = producto.imagen_url || 'https://via.placeholder.com/400';
    document.getElementById('modalCategoria').textContent = producto.categoria || 'General';
    document.getElementById('modalNombre').textContent = producto.nombre;
    document.getElementById('modalPrecio').textContent = `S/ ${parseFloat(producto.precio).toFixed(2)}`;
    document.getElementById('modalStock').textContent = producto.stock > 0 ? `✅ ${producto.stock} disponibles` : '❌ Agotado';
    document.getElementById('modalDescripcion').textContent = producto.descripcion || 'Sin descripción disponible.';
    document.getElementById('modalCantidad').textContent = '1';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  // ----- Cerrar modal -----
  function cerrarModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    productoActual = null;
    cantidadActual = 1;
  }

  btnCerrar.addEventListener('click', cerrarModal);
  overlay.addEventListener('click', cerrarModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });

  // ----- Cantidad -----
  const btnMenos = document.getElementById('btnMenos');
  const btnMas = document.getElementById('btnMas');

  btnMenos.addEventListener('click', () => {
    if (cantidadActual > 1) {
      cantidadActual--;
      document.getElementById('modalCantidad').textContent = cantidadActual;
    }
  });

  btnMas.addEventListener('click', () => {
    cantidadActual++;
    document.getElementById('modalCantidad').textContent = cantidadActual;
  });

  // ----- Agregar al carrito desde el modal -----
  const btnModalAgregar = document.getElementById('btnModalAgregar');

  btnModalAgregar.addEventListener('click', () => {
    if (!productoActual) return;

    const carrito = JSON.parse(localStorage.getItem('carrito_myt') || '[]');
    const existente = carrito.find(item => item.id === productoActual.id);

    if (existente) {
      existente.cantidad += cantidadActual;
    } else {
      carrito.push({
        id: productoActual.id,
        nombre: productoActual.nombre,
        precio: productoActual.precio,
        imagen_url: productoActual.imagen_url,
        cantidad: cantidadActual
      });
    }

    localStorage.setItem('carrito_myt', JSON.stringify(carrito));
    window.dispatchEvent(new Event('storage'));
    mostrarToast(`${cantidadActual}x ${productoActual.nombre} agregado`);
    cerrarModal();
  });

});