// ==================== CHECKOUT — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  const formCheckout = document.getElementById('formCheckout');
  const checkoutResumen = document.getElementById('checkoutResumen');

  if (!formCheckout) return;

  // ----- Mostrar resumen -----
  function mostrarResumen() {
    const carrito = JSON.parse(localStorage.getItem('carrito_myt') || '[]');

    if (carrito.length === 0) {
      window.location.href = 'tienda.html';
      return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    checkoutResumen.innerHTML = `
      ${carrito.map(item => `
        <div class="checkout-item">
          <span class="checkout-item__nombre">${item.cantidad}x ${item.nombre}</span>
          <span>S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
        </div>
      `).join('')}
      <div class="checkout-total">
        <span>Total</span>
        <span>S/ ${total.toFixed(2)}</span>
      </div>
    `;
  }

  mostrarResumen();

  // ----- Enviar pedido -----
  formCheckout.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const metodoPago = document.querySelector('input[name="metodo_pago"]:checked').value;

    const carrito = JSON.parse(localStorage.getItem('carrito_myt') || '[]');
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // Guardar con función RPC (devuelve el ID real)
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/crear_pedido`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          p_cliente_nombre: nombre,
          p_cliente_telefono: telefono,
          p_direccion: direccion,
          p_metodo_pago: metodoPago,
          p_total: total,
          p_items: carrito
        })
      });

      const data = await response.json();

      console.log('STATUS:', response.status);
      console.log('RESPUESTA:', data);

      if (!response.ok) {
        alert('❌ Error al guardar el pedido. Intenta de nuevo.');
        console.error(data);
        return;
      }

      // ID real del pedido
      const pedidoId = data[0].id;

      // WhatsApp
      enviarWhatsApp(nombre, telefono, direccion, metodoPago, total, carrito, pedidoId);

      // Limpiar carrito
      localStorage.removeItem('carrito_myt');

      // Redirigir
      window.location.href = `confirmacion.html?pedido=${pedidoId}`;

    } catch (error) {
      alert('❌ Error de conexión. Intenta de nuevo.');
      console.error(error);
    }

  });

});

// ==================== NOTIFICACIÓN WHATSAPP ====================

function enviarWhatsApp(nombre, telefono, direccion, metodoPago, total, carrito, pedidoId) {
  const numeroNegocio = '51990571182';

  const itemsMensaje = carrito.map(item =>
    `• ${item.cantidad}x ${item.nombre} — S/ ${(item.precio * item.cantidad).toFixed(2)}`
  ).join('\n');

  const mensaje = `
🛒 *NUEVO PEDIDO #${pedidoId}*

👤 *Cliente:* ${nombre}
📱 *Teléfono:* ${telefono}
📍 *Dirección:* ${direccion}
💳 *Pago:* ${metodoPago}

📦 *Productos:*
${itemsMensaje}

💰 *Total: S/ ${total.toFixed(2)}*
  `.trim();

  const mensajeCodificado = encodeURIComponent(mensaje);
  window.open(`https://wa.me/${numeroNegocio}?text=${mensajeCodificado}`, '_blank');
}