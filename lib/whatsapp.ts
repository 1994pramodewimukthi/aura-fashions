import type { CartLine } from './types';

export function buildWhatsAppUrl(lines: CartLine[], phoneNumber: string): string {
  let message = `Hello BUCHA'S, I would like to place an order:\n\n`;

  lines.forEach((line, index) => {
    const subtotal = line.price * line.quantity;
    message += `${index + 1}. *${line.name}*\n`;
    message += `   Color: ${line.color}\n`;
    message += `   Size: ${line.size}\n`;
    message += `   Qty: ${line.quantity}\n`;
    message += `   Subtotal: LKR ${subtotal.toLocaleString('en-US')}\n\n`;
  });

  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  message += `*Total: LKR ${total.toLocaleString('en-US')}*\n\n`;
  
  // Appending a structured template for delivery information
  message += `*Delivery Details:*\n`;
  message += `- Name: \n`;
  message += `- Shipping Address: \n`;
  message += `- Contact Number: \n\n`;
  
  message += `Please confirm availability and delivery details. Thank you!`;

  // Sanitizing phone number: remove all non-digits
  let sanitizedPhone = phoneNumber.replace(/\D/g, '');
  // Auto-prefix Sri Lankan country code (94) if entered in local 10-digit format starting with 0
  if (sanitizedPhone.startsWith('0') && sanitizedPhone.length === 10) {
    sanitizedPhone = '94' + sanitizedPhone.substring(1);
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${sanitizedPhone}?text=${encoded}`;
}
