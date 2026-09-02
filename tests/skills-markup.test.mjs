// Guards the parts of the skills section that live in HTML/CSS rather than in
// the canvas physics, where the JS tests cannot see them.
import assert from 'node:assert';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const html = read('index.html');
const brutal = read('assets/css/brutal.css');
const style = read('assets/css/style.css');

// --- the marquee must still scroll in brutal mode ---------------------------
// `[data-brutal] *` sets `animation: none !important` to keep the theme static.
// That silently froze the marquee, so an explicit, more specific rule has to
// put it back; without one the icons just sit there.
const blanket = /\[data-brutal\]\s*\*\s*\{[^}]*animation:\s*none[^}]*\}/.test(brutal);
if (blanket) {
  for (const sel of ['\\[data-brutal\\] \\.horizontal-skills-wrapper\\s*\\{',
                     '\\[data-brutal\\] \\.horizontal-skills-wrapper\\.reverse\\s*\\{']) {
    const m = brutal.match(new RegExp(sel + '([^}]*)\\}'));
    assert.ok(m, `brutal mode kills all animation but never re-enables ${sel}`);
    assert.ok(/animation:\s*marquee-scroll/.test(m[1]),
      'brutal marquee rule must set a marquee-scroll animation');
    assert.ok(/!important/.test(m[1]),
      'brutal marquee rule needs !important to beat the [data-brutal] * blanket');
  }
}

// the keyframes those rules reference have to exist
for (const kf of ['marquee-scroll', 'marquee-scroll-reverse']) {
  assert.ok(new RegExp('@keyframes\\s+' + kf + '\\b').test(style),
    `missing @keyframes ${kf}`);
}

// --- percentages and the old progress bars are gone -------------------------
for (const dead of ['skills-wrapper-brutal', 'brutal-progress-fill', 'brutal-skill-row',
                    'brutal-skills-box', 'skill-category-header']) {
  assert.ok(!html.includes(dead), `removed markup still present: ${dead}`);
  assert.ok(!style.includes(dead), `dead rule left in style.css: ${dead}`);
  assert.ok(!brutal.includes(dead), `dead rule left in brutal.css: ${dead}`);
}

const skillsSection = html.slice(html.indexOf('id="skills-section"'),
                                 html.indexOf('</section>', html.indexOf('id="skills-section"')));
assert.ok(!/\d+%/.test(skillsSection), 'skills section must not show percentages any more');
assert.ok(!skillsSection.includes('<ion-icon'),
  'marquee should use real technology logos, not placeholder ion-icons');

// --- every marquee icon resolves -------------------------------------------
const refs = [...skillsSection.matchAll(/\.\/assets\/images\/skills\/([\w-]+\.svg)/g)].map((m) => m[1]);
assert.ok(refs.length >= 30, `expected both marquee rows to be iconified, found ${refs.length}`);
for (const r of new Set(refs)) {
  const f = new URL('../assets/images/skills/' + r, import.meta.url);
  assert.ok(fs.existsSync(f), `missing icon: ${r}`);
}

// both marquee rows must hold the same set, or the loop visibly jumps
const rows = skillsSection.split('horizontal-skills-wrapper');
assert.ok(rows.length >= 3, 'expected two marquee rows');

console.log('skills markup: all checks passed');
