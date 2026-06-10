const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'src', 'app');
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts')) {
      let txt = fs.readFileSync(p, 'utf8');
      const re = /styleUrls:\s*\[\s*''\s*\]/g;
      if (re.test(txt)) {
        const dirName = path.dirname(p);
        const base = path.basename(p, '.ts');
        const stylePath = path.join(dirName, base + '.scss');
        if (fs.existsSync(stylePath)) {
          const rel = './' + path.basename(stylePath);
          const newTxt = txt.replace(re, `styleUrls: ['${rel}']`);
          fs.writeFileSync(p, newTxt, 'utf8');
          console.log('fixed', p);
        } else {
          console.error('missing style', p, stylePath);
        }
      }
    }
  }
};
walk(root);
