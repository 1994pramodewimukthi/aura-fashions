const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/LTP-112/.gemini/antigravity/brain/d445cea4-3d76-4136-b5af-8e17e3cd657d/.system_generated/logs/overview.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('"USER_INPUT"') && line.includes('<!doctype html>')) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.content) {
          // Extract the HTML part
          const match = parsed.content.match(/<!doctype html>[\s\S]*<\/html>/i);
          if (match) {
             let html = match[0];
             html = html.replace(/Incarnage/ig, "Bucha's");
             html = html.replace(/incarnage/ig, "buchas");
             fs.writeFileSync('source.html', html);
             console.log("Extracted HTML of length:", html.length);
             return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}

processLineByLine();
