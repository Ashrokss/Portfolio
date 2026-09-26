import assert from 'node:assert';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const html = read('index.html');
const brutalCss = read('assets/css/brutal.css');
const styleCss = read('assets/css/style.css');
const brutalJs = read('assets/js/brutal.js');

// 1. Markup guards
assert.ok(html.includes('class="avatar-box" data-avatar-box'), 'avatar-box must have data-avatar-box attribute');
assert.ok(html.includes('class="avatar-loader"'), 'avatar-box must contain avatar-loader');
assert.ok(html.includes('class="avatar-spinner"'), 'avatar-loader must contain avatar-spinner');
assert.ok(html.includes('src="./assets/images/my-avatar.webp"'), 'avatar-box img must use optimized webp format');
assert.ok(html.includes('fetchpriority="high"'), 'critical avatar must specify fetchpriority="high"');
assert.ok(html.includes('rel="preload" as="image" href="./assets/images/my-avatar.webp"'), 'head must preload primary avatar');
assert.ok(html.includes('rel="preload" as="image" href="./assets/images/brutal-avatar.jpg"'), 'head must preload brutal avatar');
assert.ok(html.includes('<noscript>'), 'progressive enhancement noscript fallback must exist');

// 2. CSS guards - style.css
assert.ok(/\.avatar-loader\s*\{/.test(styleCss), 'style.css must define .avatar-loader');
assert.ok(/\.avatar-spinner\s*\{/.test(styleCss), 'style.css must define .avatar-spinner');
assert.ok(/\.avatar-box\.loaded\s+\.avatar-loader\s*\{/.test(styleCss), 'style.css must hide loader when .loaded');
assert.ok(/@keyframes\s+avatar-spin\b/.test(styleCss), 'style.css must define @keyframes avatar-spin');
assert.ok(/@keyframes\s+avatar-shimmer\b/.test(styleCss), 'style.css must define @keyframes avatar-shimmer');

// 3. CSS guards - brutal.css
assert.ok(/\[data-brutal\]\s+\.avatar-loader\s*\{/.test(brutalCss), 'brutal.css must define [data-brutal] .avatar-loader');
assert.ok(/\[data-brutal\]\s+\.avatar-spinner\s*\{/.test(brutalCss), 'brutal.css must define [data-brutal] .avatar-spinner');
assert.ok(/animation:\s*brutal-spin[^;]*!important/.test(brutalCss), 'brutal spinner must use !important to beat [data-brutal] * blanket');
assert.ok(/@keyframes\s+brutal-spin\b/.test(brutalCss), 'brutal.css must define @keyframes brutal-spin');

// 4. JS guards - brutal.js
assert.ok(brutalJs.includes('preloadAvatar'), 'brutal.js must contain avatar preloader');
assert.ok(brutalJs.includes('avatarBox.classList.add(\'loaded\')') || brutalJs.includes('avatarBox.classList.add("loaded")'), 'brutal.js must handle loaded class state');
assert.ok(brutalJs.includes('avatarBox.classList.remove(\'loaded\')') || brutalJs.includes('avatarBox.classList.remove("loaded")'), 'brutal.js must remove loaded class during slow fetch');

// 5. Asset size guard
const webpStat = fs.statSync(new URL('../assets/images/my-avatar.webp', import.meta.url));
assert.ok(webpStat.size < 100 * 1024, `my-avatar.webp (${webpStat.size} bytes) must be well under 100KB for instant load`);

console.log('avatar loader: all checks passed');
