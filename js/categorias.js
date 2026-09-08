// ==================== CATEGORÍAS — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', async () => {

  const categoriasGrid = document.getElementById('categoriasGrid');
  if (!categoriasGrid) return;

  // ----- Iconos para categorías -----
  const iconosCategorias = {
    'cervezas': '🍺',
    'vinos': '🍷',
    'destilados': '🥃',
    'gaseosas': '🥤',
    'energizantes': '⚡',
    'snacks': '🍟',
    'todos': '🛒'
  };

  // ----- Cargar categorías desde Supabase -----
  async function cargarCategorias() {
    // Obtener productos para contar por categoría
    const { data: productos, error } = await window.supabaseClient
      .from('productos')
      .select('categoria');

    if (error) {
      console.error('Error al cargar categorías:', error);
      return;
    }

    // Contar productos por categoría
    const conteo = {};
    productos.forEach(p => {
      const cat = p.categoria || 'otros';
      conteo[cat] = (conteo[cat] || 0) + 1;
    });

    // Crear lista de categorías
    const categorias = Object.keys(conteo);

    if (categorias.length === 0) {
      categoriasGrid.innerHTML = `
        <div class="categorias__vacio">
          <p>😕 No hay categorías aún.</p>
        </div>
      `;
      return;
    }

    // Renderizar
    categoriasGrid.innerHTML = categorias.map(cat => `
      <div class="categoria-card" onclick="irACategoria('${cat}')">
        <div class="categoria-card__icono">${iconosCategorias[cat.toLowerCase()] || '📦'}</div>
        <span class="categoria-card__nombre">${capitalizar(cat)}</span>
        <span class="categoria-card__cantidad">${conteo[cat]} productos</span>
      </div>
    `).join('');

    // Animación de entrada
    const cards = categoriasGrid.querySelectorAll('.categoria-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 + (index * 80));
    });
  }

  // ----- Función capitalizar -----
  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // ----- Ir a la tienda con filtro -----
  window.irACategoria = function(categoria) {
    localStorage.setItem('categoria_filtro', categoria);
    window.location.href = 'tienda.html';
  };

  // ----- Cargar todo -----
  await cargarCategorias();

});