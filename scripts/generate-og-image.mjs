import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const apilado = readFileSync('src/assets/brand/apilado-03-morado.svg', 'utf8');
const apiladoContent = apilado.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');

const ojo = readFileSync('src/assets/loopy/ojo-18-blanco.svg', 'utf8');
const ojoContent = ojo
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>/, '')
  .replaceAll('fill="#4228d1"', 'fill="#ffc602"');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .badge { font-family: system-ui, -apple-system, sans-serif; font-weight: 700; font-size: 16px; fill: #212121; letter-spacing: 0.5px; }
      .headline { font-family: system-ui, -apple-system, sans-serif; font-weight: 800; font-size: 50px; fill: #ffffff; }
      .subhead { font-family: system-ui, -apple-system, sans-serif; font-weight: 400; font-size: 24px; fill: #f4f3e0; }
      .pill-text { font-family: system-ui, -apple-system, sans-serif; font-weight: 600; font-size: 17px; fill: #ffffff; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#4228d1" />

  <!-- Background decorative elements -->
  <circle cx="1080" cy="315" r="320" fill="#6c61db" opacity="0.25" />
  <circle cx="1120" cy="315" r="220" fill="#ffc602" opacity="0.1" />

  <!-- Logo (Apilado) -->
  <g transform="translate(80, 60) scale(0.45)">
    <svg viewBox="162.61 269.04 482.39 267.49">
      ${apiladoContent}
    </svg>
  </g>

  <!-- Tagline Pill -->
  <g transform="translate(80, 210)">
    <rect width="280" height="40" rx="20" fill="#ffc602" />
    <text x="140" y="26" class="badge" text-anchor="middle">AGENCIA DE SEO &amp; GEO (AEO)</text>
  </g>

  <!-- Headline -->
  <text x="80" y="315" class="headline">
    <tspan x="80" dy="0">Crecemos tu tienda a través</tspan>
    <tspan x="80" dy="64">de Google, ChatGPT y Gemini.</tspan>
  </text>

  <!-- Subtitle -->
  <text x="80" y="470" class="subhead">
    <tspan x="80" dy="0">Tráfico orgánico y visibilidad en asistentes de IA</tspan>
    <tspan x="80" dy="36">que generan ventas sin depender de anuncios.</tspan>
  </text>

  <!-- Feature Pills -->
  <g transform="translate(80, 550)">
    <rect width="160" height="38" rx="19" fill="#6c61db" fill-opacity="0.5" stroke="#ffffff" stroke-width="1.5" />
    <text x="80" y="25" class="pill-text" text-anchor="middle">Google Search</text>
  </g>
  <g transform="translate(260, 550)">
    <rect width="190" height="38" rx="19" fill="#6c61db" fill-opacity="0.5" stroke="#ffffff" stroke-width="1.5" />
    <text x="95" y="25" class="pill-text" text-anchor="middle">ChatGPT &amp; Gemini</text>
  </g>
  <g transform="translate(470, 550)">
    <rect width="180" height="38" rx="19" fill="#6c61db" fill-opacity="0.5" stroke="#ffffff" stroke-width="1.5" />
    <text x="90" y="25" class="pill-text" text-anchor="middle">Ventas Orgánicas</text>
  </g>

  <!-- Loopy Mascot on Right -->
  <g transform="translate(780, 120) scale(0.88)">
    <svg viewBox="176.65 188.12 437.35 449.1">
      ${ojoContent}
    </svg>
  </g>
</svg>
`;

await sharp(Buffer.from(svg))
  .png({ quality: 90, compressionLevel: 9 })
  .toFile('public/og-image.png');

console.log('public/og-image.png generated successfully.');
