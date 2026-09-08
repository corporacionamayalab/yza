// ==================== CARRITO — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  const carritoItems = document.getElementById('carritoItems');
  const carritoVacio = document.getElementById('carritoVacio');
  const carritoResumen = document.getElementById('carritoResumen');
  const btnVaciar = document.getElementById('btnVaciar');
  const avisoMinimo = document.getElementById('avisoMinimo');
  const btnPagar = document.getElementById('btnPagar');

  if (!carritoItems) return;

  // ----- Cargar carrito -----
  function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito_myt') || '[]');

    if (carrito.length === 0) {
      carritoItems.innerHTML = '';
      carritoVacio.style.display = 'block';
      carritoResumen.style.display = 'none';
      btnVaciar.style.display = 'none';
      avisoMinimo.style.display = 'none';
      return;
    }

    carritoVacio.style.display = 'none';
    carritoResumen.style.display = 'block';
    btnVaciar.style.display = 'block';

    renderItems(carrito);
    renderResumen(carrito);
  }

  // ----- Renderizar items -----
  function renderItems(carrito) {
    carritoItems.innerHTML = carrito.map(item => `
      <div class="item-carrito">
        <img src="${item.imagen_url || 'https://via.placeholder.com/100?text=MYT'}" 
             alt="${item.nombre}" 
             class="item-carrito__imagen">
        <div class="item-carrito__info">
          <h3 class="item-carrito__nombre">${item.nombre}</h3>
          <span class="item-carrito__precio">S/ ${parseFloat(item.precio).toFixed(2)}</span>
        </div>
        <div class="item-carrito__cantidad">
          <button class="item-carrito__btn" onclick="cambiarCantidad('${item.id}', -1)">−</button>
          <span class="item-carrito__numero">${item.cantidad}</span>
          <button class="item-carrito__btn" onclick="cambiarCantidad('${item.id}', 1)">+</button>
        </div>
        <button class="item-carrito__eliminar" onclick="eliminarItem('${item.id}')">🗑️</button>
      </div>
    `).join('');
  }

  // ----- Renderizar resumen -----
  function renderResumen(carrito) {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    document.getElementById('subtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `S/ ${subtotal.toFixed(2)}`;

    // Verificar mínimo de compra
    if (subtotal < 25) {
      avisoMinimo.style.display = 'block';
      btnPagar.classList.add('carrito__btn-pagar--deshabilitado');
    } else {
      avisoMinimo.style.display = 'none';
      btnPagar.classList.remove('carrito__btn-pagar--deshabilitado');
    }
  }

  // ----- Vaciar carrito -----
  btnVaciar.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
      localStorage.removeItem('carrito_myt');
      window.dispatchEvent(new Event('storage'));
      cargarCarrito();
    }
  });

  cargarCarrito();

});

// ----- Cambiar cantidad -----
function cambiarCantidad(id, cambio) {
  const carrito = JSON.parse(localStorage.getItem('carrito_myt') || '[]');
  const item = carrito.find(i => i.id === id);

  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    eliminarItem(id);
    return;
  }

  localStorage.setItem('carrito_myt', JSON.stringify(carrito));
  window.dispatchEvent(new Event('storage'));
  location.reload();
}

// ----- Eliminar item -----
function eliminarItem(id) {
  if (!confirm('¿Eliminar este producto?')) return;

  const carrito = JSON.parse(localStorage.getItem('carrito_myt') || '[]');
  const filtrado = carrito.filter(i => i.id !== id);
  localStorage.setItem('carrito_myt', JSON.stringify(filtrado));
  window.dispatchEvent(new Event('storage'));
  location.reload();
}