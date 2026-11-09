const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const output = path.join(__dirname, 'dist');
const publishFiles = ['index.html', 'requirements.md', 'RFC.md'];
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let scripts = 0;
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  new vm.Script(match[1]);
  scripts++;
}
if (!scripts || !html.includes('Моё пространство')) throw new Error('Application is missing');
if (/(?:file:\/\/\/|https?:\/\/(?:localhost|127\.0\.0\.1))/.test(html)) {
  throw new Error('Published HTML must not reference local URLs');
}
fs.mkdirSync(output, { recursive: true });
for (const file of publishFiles) fs.copyFileSync(path.join(__dirname, file), path.join(output, file));
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log(`Prepared GitHub Pages: ${publishFiles.length} public files; ${scripts} scripts checked.`);
