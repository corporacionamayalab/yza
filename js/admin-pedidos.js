// ==================== PEDIDOS ADMIN — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', async () => {

  const listaPedidos = document.getElementById('listaPedidos');
  const filtros = document.querySelectorAll('.pedidos-filtro');

  if (!listaPedidos) return;

  let filtroActivo = 'todos';

  // ----- Verificar sesión -----
  async function verificarSesion() {
    const { data } = await window.supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  const ok = await verificarSesion();
  if (!ok) return;

  // ----- Logout desktop -----
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await window.supabaseClient.auth.signOut();
      window.location.href = 'index.html';
    });
  }

  // ----- Menú móvil -----
  const btnAdminHamburguesa = document.getElementById('btnAdminHamburguesa');
  const adminMenuMovil = document.getElementById('adminMenuMovil');
  const btnAdminCerrarMenu = document.getElementById('btnAdminCerrarMenu');
  const adminOverlay = document.getElementById('adminOverlay');

  function abrirAdminMenu() {
    if (adminMenuMovil) adminMenuMovil.classList.add('admin-menu-movil--abierto');
    if (adminOverlay) adminOverlay.classList.add('admin-header__overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function cerrarAdminMenu() {
    if (adminMenuMovil) adminMenuMovil.classList.remove('admin-menu-movil--abierto');
    if (adminOverlay) adminOverlay.classList.remove('admin-header__overlay--visible');
    document.body.style.overflow = '';
  }

  if (btnAdminHamburguesa) btnAdminHamburguesa.addEventListener('click', abrirAdminMenu);
  if (btnAdminCerrarMenu) btnAdminCerrarMenu.addEventListener('click', cerrarAdminMenu);
  if (adminOverlay) adminOverlay.addEventListener('click', cerrarAdminMenu);

  document.querySelectorAll('.admin-menu-movil__link').forEach(link => {
    link.addEventListener('click', cerrarAdminMenu);
  });

  // ----- Logout móvil -----
  const btnLogoutMovil = document.getElementById('btnLogoutMovil');
  if (btnLogoutMovil) {
    btnLogoutMovil.addEventListener('click', async () => {
      await window.supabaseClient.auth.signOut();
      window.location.href = 'index.html';
    });
  }

  // ----- Fecha -----
  const fechaActual = document.getElementById('fechaActual');
  if (fechaActual) {
    const hoy = new Date();
    fechaActual.textContent = hoy.toLocaleDateString('es-PE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  // ----- Stats -----
  const { data: pedidosData } = await window.supabaseClient.from('pedidos').select('*');

  if (pedidosData) {
    const statTotalPedidos = document.getElementById('statTotalPedidos');
    const statPedidosPendientes = document.getElementById('statPedidosPendientes');
    const statTotalVentas = document.getElementById('statTotalVentas');

    if (statTotalPedidos) statTotalPedidos.textContent = pedidosData.length;
    if (statPedidosPendientes) statPedidosPendientes.textContent = pedidosData.filter(p => p.estado === 'pendiente').length;
    if (statTotalVentas) statTotalVentas.textContent = `S/ ${pedidosData.reduce((s, p) => s + parseFloat(p.total), 0).toFixed(2)}`;
  }

  // ----- Filtros -----
  filtros.forEach(filtro => {
    filtro.addEventListener('click', () => {
      filtros.forEach(f => f.classList.remove('pedidos-filtro--activo'));
      filtro.classList.add('pedidos-filtro--activo');
      filtroActivo = filtro.dataset.filtro;
      cargarPedidos();
    });
  });

  // ----- Buscador -----
  const adminBuscadorPedidos = document.getElementById('adminBuscadorPedidos');
  if (adminBuscadorPedidos) {
    adminBuscadorPedidos.addEventListener('input', () => {
      const term = adminBuscadorPedidos.value.toLowerCase();
      document.querySelectorAll('.pedido-card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
      });
    });
  }

  // ----- Cargar pedidos -----
  await cargarPedidos();

  async function cargarPedidos() {
    const { data, error } = await window.supabaseClient.from('pedidos').select('*').order('creado', { ascending: false });

    if (error) return;

    if (!data || data.length === 0) {
      listaPedidos.innerHTML = '<div class="pedidos-vacio">No hay pedidos.</div>';
      return;
    }

    let pedidos = data;
    if (filtroActivo !== 'todos') pedidos = data.filter(p => p.estado === filtroActivo);

    if (pedidos.length === 0) {
      listaPedidos.innerHTML = '<div class="pedidos-vacio">No hay pedidos con este estado.</div>';
      return;
    }

    listaPedidos.innerHTML = pedidos.map(pedido => {
      let itemsPedido = [];
      try { itemsPedido = JSON.parse(pedido.items || '[]'); } catch(e) {}

      const itemsHTML = itemsPedido.map(item => `
        <div class="pedido-card__item">
          <span>${item.cantidad}x ${item.nombre}</span>
          <span>S/ ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}</span>
        </div>
      `).join('');

      return `
        <div class="pedido-card">
          <div class="pedido-card__header">
            <span class="pedido-card__id">Pedido #${pedido.id}</span>
            <span class="pedido-card__estado pedido-card__estado--${pedido.estado}">${pedido.estado}</span>
          </div>
          <div class="pedido-card__info">
            <span><strong>Cliente:</strong> ${pedido.cliente_nombre}</span>
            <span><strong>Teléfono:</strong> ${pedido.cliente_telefono}</span>
            <span><strong>Dirección:</strong> ${pedido.direccion}</span>
            <span><strong>Pago:</strong> ${pedido.metodo_pago}</span>
            <span><strong>Fecha:</strong> ${new Date(pedido.creado).toLocaleString('es-PE')}</span>
          </div>
          <div class="pedido-card__items">
            <strong>🛒 Productos:</strong>
            ${itemsHTML || '<span class="pedido-card__sin-items">Sin detalles</span>'}
          </div>
          <div class="pedido-card__footer">
            <span class="pedido-card__total">Total: S/ ${parseFloat(pedido.total).toFixed(2)}</span>
            <div class="pedido-card__acciones">
              <button class="pedido-card__btn-imprimir" onclick="imprimirTicket('${pedido.id}')">🖨️</button>
              <select class="pedido-card__select" onchange="cambiarEstado('${pedido.id}', this.value)">
                <option value="pendiente" ${pedido.estado === 'pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
                <option value="confirmado" ${pedido.estado === 'confirmado' ? 'selected' : ''}>✅ Confirmado</option>
                <option value="entregado" ${pedido.estado === 'entregado' ? 'selected' : ''}>🚀 Entregado</option>
              </select>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ----- Cambiar estado -----
  window.cambiarEstado = async function(id, estado) {
    const { error } = await window.supabaseClient.from('pedidos').update({ estado }).eq('id', id);
    if (error) { alert('❌ Error'); return; }
    alert('✅ Actualizado');
    await cargarPedidos();
  };

  // ==================== IMPRIMIR TICKET ====================

  window.imprimirTicket = async function(id) {
    const { data } = await window.supabaseClient.from('pedidos').select('*').eq('id', id).single();
    if (!data) return;

    let items = [];
    try { items = JSON.parse(data.items || '[]'); } catch(e) {}

    const ticket = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket #${data.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; max-width: 300px; margin: 0 auto; padding: 20px; font-size: 12px; }
          .centro { text-align: center; }
          h2 { font-size: 18px; }
          .linea { border-top: 1px dashed #000; margin: 8px 0; }
          .item { display: flex; justify-content: space-between; margin: 4px 0; }
          .total { font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; }
          .gracias { text-align: center; margin-top: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="centro"><h2>MYT EXPRESS</h2><p>Pedido #${data.id}</p></div>
        <div class="linea"></div>
        <p><strong>Cliente:</strong> ${data.cliente_nombre}</p>
        <p><strong>Tel:</strong> ${data.cliente_telefono}</p>
        <p><strong>Dirección:</strong> ${data.direccion}</p>
        <p><strong>Pago:</strong> ${data.metodo_pago}</p>
        <p><strong>Fecha:</strong> ${new Date(data.creado).toLocaleString('es-PE')}</p>
        <div class="linea"></div>
        ${items.map(i => `<div class="item"><span>${i.cantidad}x ${i.nombre}</span><span>S/ ${(i.precio*i.cantidad).toFixed(2)}</span></div>`).join('')}
        <div class="linea"></div>
        <div class="total"><span>Total</span><span>S/ ${parseFloat(data.total).toFixed(2)}</span></div>
        <div class="gracias">¡Gracias por tu compra!</div>
        <script>window.print(); setTimeout(() => window.close(), 500);<\/script>
      </body>
      </html>
    `;

    const ventana = window.open('', '_blank');
    ventana.document.write(ticket);
    ventana.document.close();
  };

  // ==================== NOTIFICACIÓN SONORA ====================

  let ultimoPedidoId = localStorage.getItem('ultimo_pedido_id');

  async function verificarNuevosPedidos() {
    const { data } = await window.supabaseClient.from('pedidos').select('id').order('creado', { ascending: false }).limit(1);
    if (!data || data.length === 0) return;

    const nuevoId = data[0].id;
    if (ultimoPedidoId && nuevoId != ultimoPedidoId) {
      reproducirSonido();
      mostrarNotificacion('🛒 ¡Nuevo pedido recibido!');
      cargarPedidos();
    }
    ultimoPedidoId = nuevoId;
    localStorage.setItem('ultimo_pedido_id', nuevoId);
  }

  function reproducirSonido() {
    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    audio.play().catch(() => {});
  }

  function mostrarNotificacion(mensaje) {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:90px;right:20px;background:#009D95;color:#fff;padding:16px 24px;border-radius:14px;font-weight:700;z-index:5000;box-shadow:0 12px 40px rgba(0,0,0,0.3);animation:slideIn 0.4s ease;';
    div.textContent = mensaje;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
  }

  verificarNuevosPedidos();
  setInterval(verificarNuevosPedidos, 30000);

});