const fs = require('fs');
let s = fs.readFileSync('source.html', 'utf8');
s = s.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
fs.writeFileSync('source_clean.html', s);
