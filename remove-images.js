const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend_src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<img src="\/images\/Ảnh chụp màn hình 2026-04-17 105503\.png"[^>]*>/g, '');
  content = content.replace(/<img src="\.\.\/images\/Ảnh chụp màn hình 2026-04-17 105503\.png"[^>]*>/g, '');
  fs.writeFileSync(filePath, content);
}
console.log('Removed all instances of the broken image');
