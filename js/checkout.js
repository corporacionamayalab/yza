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

    // Guardar en Supabase
    const { data, error } = await window.supabaseClient
      .from('pedidos')
      .insert([{
        cliente_nombre: nombre,
        cliente_telefono: telefono,
        direccion: direccion,
        metodo_pago: metodoPago,
        total: total,
        items: JSON.stringify(carrito),
        estado: 'pendiente'
      }])
      .select('id');

    if (error) {
      alert('❌ Error al guardar el pedido. Intenta de nuevo.');
      console.error(error);
      return;
    }

    // ----- Notificación WhatsApp -----
    enviarWhatsApp(nombre, telefono, direccion, metodoPago, total, carrito, data[0].id);

    // Limpiar carrito
    localStorage.removeItem('carrito_myt');

    // Redirigir a confirmación
    window.location.href = `confirmacion.html?pedido=${data[0].id}`;

  });

});

// ==================== NOTIFICACIÓN WHATSAPP ====================

function enviarWhatsApp(nombre, telefono, direccion, metodoPago, total, carrito, pedidoId) {

  // Número de WhatsApp del negocio
  const numeroNegocio = '51990571182';

  // Construir mensaje
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

  // Codificar mensaje para URL
  const mensajeCodificado = encodeURIComponent(mensaje);

  // Abrir WhatsApp en nueva pestaña
  window.open(`https://wa.me/${numeroNegocio}?text=${mensajeCodificado}`, '_blank');

}