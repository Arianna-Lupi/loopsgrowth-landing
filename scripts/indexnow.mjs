// Avisa a IndexNow (Bing, Yandex, Naver) de las URLs del sitemap con `lastmod` de hoy.
// Se ejecuta en el workflow de despliegue después de publicar. No bloquea el despliegue si falla.
// Uso: node scripts/indexnow.mjs [dist]
import { readFileSync, existsSync } from 'node:fs';

const KEY = '1d6c39c0420cc093b5a423b075c49979';
const HOST = 'loopsgrowth.com';
const dist = process.argv[2] ?? 'dist';
const file = `${dist}/sitemap-0.xml`;
if (!existsSync(file)) {
  console.log(`IndexNow: sin ${file}, nada que enviar.`);
  process.exit(0);
}
const today = new Date().toISOString().slice(0, 10);
const urls = [...readFileSync(file, 'utf8').matchAll(/<url>([\s\S]*?)<\/url>/g)]
  .map((m) => ({ loc: m[1].match(/<loc>([^<]+)/)?.[1], mod: m[1].match(/<lastmod>([^<]+)/)?.[1]?.slice(0, 10) }))
  .filter((u) => u.loc && u.mod === today)
  .map((u) => u.loc);
if (urls.length === 0) {
  console.log('IndexNow: ninguna URL con lastmod de hoy.');
  process.exit(0);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} URL enviadas, respuesta ${res.status}.`);
