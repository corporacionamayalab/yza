// ==================== FILTROS — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', async () => {

  const filtrosCategorias = document.getElementById('filtrosCategorias');
  if (!filtrosCategorias) return;

  let categoriaActiva = 'todos';

  // ----- Cargar categorías desde Supabase -----
  async function cargarFiltros() {
    const { data: productos, error } = await window.supabaseClient
      .from('productos')
      .select('categoria')
      .eq('activo', true);

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

    const categorias = Object.keys(conteo);

    renderFiltros(categorias, conteo);
  }

  // ----- Renderizar botones -----
  function renderFiltros(categorias, conteo) {
    const todas = [
      { nombre: 'Todos', valor: 'todos', cantidad: Object.values(conteo).reduce((a, b) => a + b, 0) },
      ...categorias.map(cat => ({ nombre: capitalizar(cat), valor: cat, cantidad: conteo[cat] }))
    ];

    filtrosCategorias.innerHTML = todas.map(cat => `
      <button class="filtro-categoria ${cat.valor === categoriaActiva ? 'filtro-categoria--activo' : ''}" 
              data-categoria="${cat.valor}">
        ${cat.nombre}
        <span class="filtro-categoria__contador">${cat.cantidad}</span>
      </button>
    `).join('');

    // Eventos
    filtrosCategorias.querySelectorAll('.filtro-categoria').forEach(btn => {
      btn.addEventListener('click', () => {
        categoriaActiva = btn.dataset.categoria;
        renderFiltros(categorias, conteo);
        
        // Disparar evento para filtrar productos
        window.dispatchEvent(new CustomEvent('filtrarProductos', { 
          detail: { categoria: categoriaActiva } 
        }));
      });
    });
  }

  // ----- Capitalizar -----
  function capitalizar(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // ----- Cargar todo -----
  await cargarFiltros();

});