const fs = require('fs');

let html = fs.readFileSync('source_clean.html', 'utf8');

// Replace names
html = html.replace(/Incarnage/ig, "Bucha's");

// Remove <!doctype html>
html = html.replace(/<!doctype html>/i, '');

// Remove <html> and </html>
html = html.replace(/<html[^>]*>/i, '');
html = html.replace(/<\/html>/i, '');

const finalCode = `
import '../app/globals.css'; // keeping this in case they want it

export default function Page() {
  return (
    <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: \`${html.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
  );
}
`;

fs.writeFileSync('app/page.tsx', finalCode);
