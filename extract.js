const fs = require('fs');
const content = fs.readFileSync('C:/Users/LTP-112/.gemini/antigravity/brain/d445cea4-3d76-4136-b5af-8e17e3cd657d/.system_generated/logs/overview.txt', 'utf8');
const match = content.match(/<!doctype html>[\s\S]*?<\/html>/i);
if (match) {
    let html = match[0];
    // if there are escaped characters like \n or \", unescape them
    try {
       // It's probably inside a JSON string. Let's try to parse the line it belongs to.
       // Actually, if we just unescape json string:
       html = html.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    } catch(e) {}
    fs.writeFileSync('source.html', html);
} else {
    fs.writeFileSync('source.html', 'NO MATCH');
}
