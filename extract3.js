const fs = require('fs');

const content = fs.readFileSync('C:/Users/LTP-112/.gemini/antigravity/brain/d445cea4-3d76-4136-b5af-8e17e3cd657d/.system_generated/logs/overview.txt', 'utf8');

const match = content.match(/<!doctype html>[\s\S]{1000,500000}?(?:<\/html>|<truncated)/i);

if (match) {
    let html = match[0];
    
    // Check if it's escaped inside JSON
    // e.g. "content":"...<!doctype html>\n<html..."
    // We can just unescape JSON string values manually
    html = html.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    
    fs.writeFileSync('source.html', html);
    console.log("Extracted HTML of length:", html.length);
} else {
    console.log("NOT FOUND. Length of overview:", content.length);
    // Let's print occurrences of 'html' to see if there's any hint
    const idx = content.toLowerCase().indexOf('<!doctype');
    console.log("Index of <!doctype (case insensitive):", idx);
}
