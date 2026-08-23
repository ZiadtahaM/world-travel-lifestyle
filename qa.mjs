import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('./style.css', import.meta.url), 'utf8');

const checks = [
  ['independent page title', html.includes('<title>World - Travel, Lifestyle & Technology</title>')],
  ['hero heading exists', /class="hero-title"/.test(html)],
  ['article discovery cards', html.includes('trending-card') && html.includes('data-category')],
  ['filter behavior is wired', app.includes('setupFilters') && app.includes('filterTrendingCards')],
  ['newsletter form exists', html.includes('newsletter-form')],
  ['newsletter truthfulness', app.includes('Newsletter service is not connected in this preview.') && !app.includes('Successfully subscribed to newsletter!')],
  ['notification output is escaped', app.includes('messageEl.textContent') && !app.includes('notification.innerHTML')],
  ['skip link exists', html.includes('skip-link')],
  ['reduced motion exists', css.includes('prefers-reduced-motion')],
];

for (const [name, passed] of checks) assert.equal(passed, true, name);
console.log(`Worldweb QA: ${checks.length}/${checks.length} checks passed`);
