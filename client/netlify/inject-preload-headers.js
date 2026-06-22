const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const netlifyTomlPath = path.join(__dirname, '..', '..', 'netlify.toml');

function findIndexHtml(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      const found = findIndexHtml(fullPath);
      if (found) return found;
    } else if (file === 'index.html') {
      return fullPath;
    }
  }
  return null;
}

try {
  const indexPath = findIndexHtml(distPath);
  if (!indexPath) {
    console.error('❌ Ошибка: index.html не найден в папке dist.');
    process.exit(1);
  }

  const html = fs.readFileSync(indexPath, 'utf8');

  const regex = /rel="modulepreload"\s+href="([^"]+\.js)"/g;
  let match;
  const chunks = [];

  while ((match = regex.exec(html)) !== null) {
    const chunkName = match[1];
    chunks.push(`</${chunkName}>; rel=modulepreload`);
  }

  if (chunks.length === 0) {
    console.log('⚠️ Чанки для modulepreload не найдены в index.html. Заголовки не изменены.');
    process.exit(0);
  }

  let tomlContent = '';
  if (fs.existsSync(netlifyTomlPath)) {
    tomlContent = fs.readFileSync(netlifyTomlPath, 'utf8');

    tomlContent = tomlContent.split('\n## ANGULAR_CHUNKS_START')[0].trim();
  } else {
    console.log('⚠️ Файл netlify.toml не найден в корне, создаем новый.');
  }

  const linkHeader = chunks.join(', ');

  const newToml = `${tomlContent}\n\n## ANGULAR_CHUNKS_START\n[[headers]]\n  for = "/*"\n  [headers.values]\n    Link = "${linkHeader}"\n## ANGULAR_CHUNKS_END\n`;

  fs.writeFileSync(netlifyTomlPath, newToml);
  console.log(`\n✅ Успех! netlify.toml в корне обновлен.`);
  console.log(`🚀 Добавлено чанков для параллельной загрузки: ${chunks.length}\n`);
} catch (err) {
  console.error('❌ Произошла ошибка во время инжекции заголовков:', err);
  process.exit(1);
}
