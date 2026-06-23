import type { CartLine } from './types';

export function buildWhatsAppUrl(lines: CartLine[], phoneNumber: string): string {
  let message = `Hello BUCHA'S, I would like to place an order:\n\n`;

  lines.forEach((line, index) => {
    const subtotal = line.price * line.quantity;
    message += `${index + 1}. *${line.name}*\n`;
    message += `   Color: ${line.color}\n`;
    message += `   Size: ${line.size}\n`;
    message += `   Qty: ${line.quantity}\n`;
    message += `   Subtotal: LKR ${subtotal.toLocaleString()}\n\n`;
  });

  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  message += `Total: LKR ${total.toLocaleString()}\n`;
  message += `\nPlease confirm availability and delivery details. Thank you!`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}
