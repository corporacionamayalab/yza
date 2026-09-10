// ==================== DESTACADOS — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', async () => {

  const destacadosGrid = document.getElementById('destacadosGrid');
  if (!destacadosGrid) return;

  // ----- Cargar productos destacados -----
  async function cargarDestacados() {
    const { data: productos, error } = await window.supabaseClient
      .from('productos')
      .select('*')
      .eq('activo', true)
      .limit(8)
      .order('creado', { ascending: false });

    if (error) {
      console.error('Error al cargar destacados:', error);
      return;
    }

    if (!productos || productos.length === 0) {
      destacadosGrid.innerHTML = `
        <div class="destacados__vacio">
          <p>😕 No hay productos destacados aún.</p>
        </div>
      `;
      return;
    }

    // Renderizar con modal
    destacadosGrid.innerHTML = productos.map((prod, index) => `
      <div class="producto-destacado" onclick="abrirModalProducto(${JSON.stringify(prod).replace(/"/g, '&quot;')})" style="cursor: pointer;">
        ${index < 3 ? '<span class="producto-destacado__top">🔥 Top</span>' : ''}
        <img src="${prod.imagen_url || 'https://pub-1a9e1895df724843a63ab4872f69867b.r2.dev/logo.png'}" 
             alt="${prod.nombre}" 
             class="producto-destacado__imagen">
        <div class="producto-destacado__info">
          <span class="producto-destacado__categoria">${prod.categoria || 'General'}</span>
          <h3 class="producto-destacado__nombre">${prod.nombre}</h3>
          <span class="producto-destacado__precio">S/ ${parseFloat(prod.precio).toFixed(2)}</span>
          <button class="producto-destacado__btn ${prod.stock <= 0 ? 'producto-destacado__btn--agotado' : ''}" 
                  onclick="event.stopPropagation(); agregarDestacado(${JSON.stringify(prod).replace(/"/g, '&quot;')})"
                  ${prod.stock <= 0 ? 'disabled' : ''}>
            ${prod.stock > 0 ? '🛒 Agregar' : 'Agotado'}
          </button>
        </div>
      </div>
    `).join('');

    // Animación
    const cards = destacadosGrid.querySelectorAll('.producto-destacado');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(25px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 + (index * 100));
    });
  }

  // ----- Agregar al carrito -----
  window.agregarDestacado = function(prod) {
    const carrito = JSON.parse(localStorage.getItem('carrito_myt') || '[]');
    const existente = carrito.find(item => item.id === prod.id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({
        id: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        imagen_url: prod.imagen_url,
        cantidad: 1
      });
    }

    localStorage.setItem('carrito_myt', JSON.stringify(carrito));
    window.dispatchEvent(new Event('storage'));
    mostrarToast('Producto agregado al carrito');
  };

  // ----- Cargar todo -----
  await cargarDestacados();

});