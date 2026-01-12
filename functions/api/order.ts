
export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    const { orderInfo, cart, total, paymentDetails } = data;

    // Generate a unique numeric order ID (5 digits)
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderItems = cart.map((item: any) => `- ${item.name} (${item.quantity} units) = ${item.price * item.quantity}৳`).join('\n');

    const adminEmailContent = `
      🔥 NEW ORDER RECEIVED: ${orderId}
      ----------------------------------
      CUSTOMER PROFILE:
      Full Name: ${orderInfo.name}
      Mobile: ${orderInfo.mobile}
      WhatsApp: ${orderInfo.whatsapp || 'N/A'}
      Email: ${orderInfo.email}
      Personal FB Link: ${orderInfo.personalFbLink || 'N/A'}
      Promotion Target: ${orderInfo.targetLink}
      
      ORDER CONTENTS:
      ${orderItems}
      
      PAYMENT INFORMATION:
      Grand Total: ${total}৳
      Gateway: ${paymentDetails.method}
      Sender Account: ${paymentDetails.senderNumber}
      ----------------------------------
      Sent via Sociafy Automation
    `;

    const customerEmailContent = `
      Assalamu Alaikum ${orderInfo.name},
      
      Thank you for choosing Sociafy Digital! Your order has been placed successfully.
      
      📦 Order ID: ${orderId}
      💰 Total Amount: ${total}৳
      💳 Payment Method: ${paymentDetails.method}
      
      Our verification team will review your payment of ${total}৳ from account ${paymentDetails.senderNumber}. 
      Once verified, your growth services will be initiated within 1-24 hours.
      
      If you need immediate assistance, reach us on WhatsApp: 01846-119500.
      
      Best Regards,
      Nayeem Uddin
      Sociafy Digital Growth Architecture
    `;

    // Send emails using MailChannels
    // 1. Notify Admin
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'sociafybd@gmail.com', name: 'Sociafy Admin' }] }],
        from: { email: 'orders@sociafy.com', name: 'Sociafy System' },
        subject: `[New Order] ${orderId} from ${orderInfo.name}`,
        content: [{ type: 'text/plain', value: adminEmailContent }],
      }),
    });

    // 2. Confirm to Customer
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: orderInfo.email, name: orderInfo.name }] }],
        from: { email: 'sociafybd@gmail.com', name: 'Sociafy Digital' },
        subject: `Your Order Confirmation - ${orderId}`,
        content: [{ type: 'text/plain', value: customerEmailContent }],
      }),
    });

    return new Response(JSON.stringify({ success: true, orderId }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
