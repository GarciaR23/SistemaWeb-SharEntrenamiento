const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts')) processFile(p);
  }
}

function processFile(p) {
  let s = fs.readFileSync(p, 'utf8');
  let n = s.replace(/styleUrls:\s*(['\"])([^'\"]+)\1/g, "styleUrls: ['$2']");
  n = n.replace(/\\\\\./g, '.');
  n = n.replace(/\\\./g, '.');
  if (n !== s) {
    fs.writeFileSync(p, n, 'utf8');
    console.log('fixed', p);
  }
}

walk(path.join(__dirname, '..', 'src', 'app'));
console.log('done');
