// ==================== PRODUCTOS — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', async () => {

  const gridProductos = document.getElementById('gridProductos');
  const contadorProductos = document.getElementById('contadorProductos');
  const tiendaVacio = document.getElementById('tiendaVacio');

  if (!gridProductos) return;

  let productos = [];
  let categoriaActiva = 'todos';
  let busqueda = '';

  // ----- Cargar productos -----
  async function cargarProductos() {
    const { data, error } = await window.supabaseClient
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('creado', { ascending: false });

    if (error) {
      console.error('Error al cargar productos:', error);
      return;
    }

    productos = data || [];
    renderProductos();
  }

  // ----- Renderizar productos -----
  function renderProductos() {
    let filtrados = [...productos];

    if (categoriaActiva !== 'todos') {
      filtrados = filtrados.filter(p => p.categoria === categoriaActiva);
    }

    if (busqueda) {
      const term = busqueda.toLowerCase();
      filtrados = filtrados.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    }

    if (contadorProductos) {
      contadorProductos.textContent = `${filtrados.length} producto(s)`;
    }

    if (filtrados.length === 0) {
      gridProductos.innerHTML = '';
      tiendaVacio.style.display = 'block';
      return;
    }

    tiendaVacio.style.display = 'none';

    // Renderizar con modal
    gridProductos.innerHTML = filtrados.map(producto => `
      <div class="producto-card" onclick="abrirModalProducto(${JSON.stringify(producto).replace(/"/g, '&quot;')})" style="cursor: pointer;">
        <img src="${producto.imagen_url || 'https://via.placeholder.com/400x300?text=MYT+Express'}" 
             alt="${producto.nombre}" 
             class="producto-card__imagen">
        <div class="producto-card__info">
          <span class="producto-card__categoria">${producto.categoria || 'General'}</span>
          <h3 class="producto-card__nombre">${producto.nombre}</h3>
          <span class="producto-card__precio">S/ ${parseFloat(producto.precio).toFixed(2)}</span>
          <span class="producto-card__stock">${producto.stock > 0 ? `✅ ${producto.stock} disponibles` : '❌ Agotado'}</span>
          <button class="producto-card__btn ${producto.stock <= 0 ? 'producto-card__btn--agotado' : ''}" 
                  onclick="event.stopPropagation(); agregarAlCarrito(${JSON.stringify(producto).replace(/"/g, '&quot;')})"
                  ${producto.stock <= 0 ? 'disabled' : ''}>
            ${producto.stock > 0 ? '🛒 Agregar' : 'Agotado'}
          </button>
        </div>
      </div>
    `).join('');
  }

  // ----- Agregar al carrito -----
  window.agregarAlCarrito = function(producto) {
    const carrito = JSON.parse(localStorage.getItem('carrito_myt') || '[]');
    const existente = carrito.find(item => item.id === producto.id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen_url: producto.imagen_url,
        cantidad: 1
      });
    }

    localStorage.setItem('carrito_myt', JSON.stringify(carrito));
    window.dispatchEvent(new Event('storage'));
    mostrarToast('Producto agregado al carrito');
  };

  // ----- Escuchar filtros -----
  window.addEventListener('filtrarProductos', (e) => {
    categoriaActiva = e.detail.categoria;
    renderProductos();
  });

  // ----- Escuchar buscador -----
  window.addEventListener('buscarProductos', (e) => {
    busqueda = e.detail.busqueda;
    renderProductos();
  });

  // ----- Cargar todo -----
  await cargarProductos();

});