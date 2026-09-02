// Drives the real skills-canvas IIFE from assets/js/script.js against stubbed
// browser globals. Card positions are read back out of the ctx.translate calls
// the code actually makes, so this tests the shipped drawing path, not a copy.
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';

const src = fs.readFileSync(new URL('../assets/js/script.js', import.meta.url), 'utf8');
const j = src.indexOf('#INTERACTIVE SKILLS CANVAS');
assert.ok(j > 0, 'skills canvas section not found in script.js');
const code = src.slice(src.lastIndexOf('/*', j));

const CSS_W = 700, CSS_H = 320, DPR = 2;

// Builds a fresh sandbox. `hidden: true` starts the wrapper at 0x0, the way a
// display:none tab reports, until reveal() is called.
function makeEnv({ hidden = false } = {}) {
  const ops = [];
  const nodeSrcs = [];
  const listeners = {};
  let size = hidden ? { width: 0, height: 0 } : { width: CSS_W, height: CSS_H };
  let roCb = null, ioCb = null, now = 0;
  const frames = [];

  const ctx = new Proxy({}, {
    get: (_, k) => {
      if (k === 'measureText') return (t) => ({ width: String(t).length * 6 });
      return (...a) => { ops.push([k, ...a]); };
    },
    set: () => true,
  });

  const rect = () => ({ left: 0, top: 0, width: size.width, height: size.height });
  const canvas = {
    width: 300, height: 150, style: {},   // HTML canvas defaults
    getContext: () => ctx,
    addEventListener: (t, fn) => { (listeners[t] ||= []).push(fn); },
    getBoundingClientRect: rect,
  };
  const wrap = { addEventListener() {}, getBoundingClientRect: rect };
  canvas.parentElement = wrap;

  const sandbox = {
    document: {
      getElementById: (id) => (id === 'skills-canvas' ? canvas : null),
      documentElement: { hasAttribute: () => false },
    },
    window: {
      devicePixelRatio: DPR,
      matchMedia: () => ({ matches: false }),
      addEventListener() {},
    },
    performance: { now: () => now },
    requestAnimationFrame: (fn) => { frames.push(fn); return frames.length; },
    cancelAnimationFrame: () => {},
    IntersectionObserver: class { constructor(cb) { ioCb = cb; } observe() {} disconnect() {} },
    ResizeObserver: class { constructor(cb) { roCb = cb; } observe() {} disconnect() {} },
    setTimeout: () => 0,
    clearTimeout: () => {},
    // Icons load instantly and report a real intrinsic size, so drawImage runs.
    Image: class {
      constructor() { this.complete = true; this.naturalWidth = 128; }
      set src(v) { this._src = v; nodeSrcs.push(v); }
      get src() { return this._src; }
      addEventListener() {}
    },
    Math, Date, console,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  // Pull card {x, y, scale} out of the recorded draw ops for one frame.
  function readCards() {
    const cards = [];
    let pending = null;
    for (const [op, a, b] of ops) {
      if (op === 'save') pending = {};
      else if (op === 'translate' && pending && pending.x === undefined) { pending.x = a; pending.y = b; }
      else if (op === 'scale' && pending && pending.x !== undefined) { pending.scale = a; }
      else if (op === 'restore' && pending) { if (pending.scale !== undefined) cards.push(pending); pending = null; }
    }
    return cards;
  }

  function tick(ms = 16) {
    now += ms;
    const due = frames.splice(0, frames.length);
    ops.length = 0;
    for (const fn of due) fn(now);
    return readCards();
  }

  return {
    canvas, listeners, tick,
    // ops still holds the most recent frame after tick() returns
    iconsDrawn: () => ops.filter((o) => o[0] === 'drawImage').length,
    iconSrcs: () => nodeSrcs,
    textDrawn: () => ops.filter((o) => o[0] === 'fillText').length,
    show: () => ioCb([{ isIntersecting: true }]),
    hide: () => ioCb([{ isIntersecting: false }]),
    reveal: () => { size = { width: CSS_W, height: CSS_H }; if (roCb) roCb([{}]); },
    settle: (n = 140) => { let c = []; for (let i = 0; i < n; i++) c = tick(16); return c; },
  };
}

// === scenario A: section already laid out (active tab) =======================
{
  const env = makeEnv();
  env.show();

  // DPR: backing store must be css size x dpr, or the canvas renders blurry
  assert.strictEqual(env.canvas.width, CSS_W * DPR, 'canvas backing width must scale by DPR');
  assert.strictEqual(env.canvas.height, CSS_H * DPR, 'canvas backing height must scale by DPR');
  assert.strictEqual(env.canvas.style.width, CSS_W + 'px', 'css width must stay in css px');

  // entrance: staggered, overshoots past full size, settles at exactly 1
  let maxScale = 0, first = 0;
  for (let i = 0; i < 25; i++) {            // first card peaks at 250ms (t=0.5)
    const c = env.tick(16);
    if (i === 0) first = c.length;
    for (const k of c) maxScale = Math.max(maxScale, k.scale);
  }
  assert.ok(first < 15, `entrance must stagger, drew all ${first} at once`);
  assert.ok(maxScale > 1.2, `entrance must overshoot, peaked at ${maxScale.toFixed(2)}`);

  const cards = env.settle();
  assert.strictEqual(cards.length, 15, 'all 15 skills should be drawn once settled');
  for (const k of cards) {
    assert.ok(Math.abs(k.scale - 1) < 1e-9, `scale settles at 1, got ${k.scale}`);
    assert.ok(Math.abs(k.x) <= CSS_W / 2, `card x ${k.x.toFixed(0)} outside canvas`);
    assert.ok(Math.abs(k.y) <= CSS_H / 2, `card y ${k.y.toFixed(0)} outside canvas`);
  }

  // cards must actually be spread out, not stacked on one point
  const spreadX = Math.max(...cards.map((k) => k.x)) - Math.min(...cards.map((k) => k.x));
  assert.ok(spreadX > CSS_W * 0.5, `cards must spread across the canvas, span was ${spreadX.toFixed(0)}px`);

  // every tile draws its technology icon, and nothing draws text any more
  assert.strictEqual(env.iconsDrawn(), 15, 'each tile must draw its icon');
  assert.strictEqual(env.textDrawn(), 0, 'tiles must not render text or percentages');

  // the icon files the code asks for have to exist on disk
  const srcs = env.iconSrcs();
  assert.strictEqual(srcs.length, 15, 'one image per skill');
  assert.strictEqual(new Set(srcs).size, 15, 'each skill needs its own icon');
  for (const s of srcs) {
    const file = new URL('../' + s.replace(/^\.\//, ''), import.meta.url);
    assert.ok(fs.existsSync(file), `missing icon file: ${s}`);
    assert.ok(fs.statSync(file).size > 100, `icon looks empty: ${s}`);
  }

  // comet tail: nearest card chases the cursor
  const move = env.listeners.mousemove[0];
  const near = (list) => list.map((k) => Math.hypot(k.x - 250, k.y - 80)).sort((a, b) => a - b)[0];
  const before = near(env.tick(16));
  for (let i = 0; i < 60; i++) { move({ clientX: 600, clientY: 240 }); env.tick(16); }
  const after = near(env.tick(16));
  assert.ok(after < before, 'lead card must move toward the cursor');
  assert.ok(after < 5, `lead card should reach the cursor, still ${after.toFixed(1)}px away`);

  // release: springs home, stays bounded, no card left parked on the cursor
  env.listeners.mouseleave[0]();
  const settled = env.settle(400);
  for (const k of settled) {
    assert.ok(Number.isFinite(k.x) && Number.isFinite(k.y), 'spring diverged to NaN/Infinity');
    assert.ok(Math.abs(k.x) <= CSS_W, `spring overshot off canvas: x=${k.x.toFixed(0)}`);
    assert.ok(Math.abs(k.y) <= CSS_H, `spring overshot off canvas: y=${k.y.toFixed(0)}`);
  }
  assert.strictEqual(
    settled.filter((k) => Math.hypot(k.x - 250, k.y - 80) < 3).length, 0,
    'cards must return home after the cursor leaves');

  // --- either mouse button resets the field, movement picks it back up ------
  const home = settled.map((k) => ({ x: k.x, y: k.y }));

  for (const button of ['click', 'contextmenu']) {
    // grab the cards with the cursor first
    for (let i = 0; i < 60; i++) { move({ clientX: 600, clientY: 240 }); env.tick(16); }
    assert.ok(near(env.tick(16)) < 5, `precondition (${button}): cards should be following`);

    let defaultPrevented = false;
    env.listeners[button][0]({
      clientX: 600, clientY: 240,
      preventDefault: () => { defaultPrevented = true; },
    });
    if (button === 'contextmenu') {
      assert.ok(defaultPrevented, 'right-click must suppress the browser context menu');
    }

    // a nudge smaller than the re-engage threshold must not re-grab the cards
    move({ clientX: 602, clientY: 241 });
    const afterReset = env.settle(400);

    // Every tile is back on its own rest spot. Checking against home rather
    // than "far from the cursor" because one tile's home really does sit next
    // to the cursor point used above.
    const drifted = afterReset.map((k, i) => Math.hypot(k.x - home[i].x, k.y - home[i].y));
    assert.ok(Math.max(...drifted) < 40,
      `${button}: tiles should return to rest, worst was ${Math.max(...drifted).toFixed(0)}px`);

    // ...and the field is spread out again, not still strung along the trail
    const span = Math.max(...afterReset.map((k) => k.x)) - Math.min(...afterReset.map((k) => k.x));
    assert.ok(span > CSS_W * 0.5,
      `${button}: tiles stayed bunched on the cursor, x span only ${span.toFixed(0)}px`);

    // a real move past the threshold resumes following
    for (let i = 0; i < 60; i++) { move({ clientX: 500, clientY: 200 }); env.tick(16); }
    const resumed = env.tick(16).map((k) => Math.hypot(k.x - 150, k.y - 40)).sort((a, b) => a - b)[0];
    assert.ok(resumed < 5, `${button}: must follow again after reset, lead ${resumed.toFixed(1)}px away`);

    // back to rest before the next button's run
    env.listeners.mouseleave[0]();
    env.settle(400);
  }
}

// === scenario B: section starts in a hidden tab (the real page) ==============
// #skills-section lives in <article class="resume">, which is display:none on
// load, so the first layout pass sees a 0x0 rect. The canvas must recover when
// the tab is opened rather than keeping its default 300x150 backing store.
{
  const env = makeEnv({ hidden: true });
  env.show();
  env.tick(16);

  env.reveal();                 // user clicks the Resume tab
  const cards = env.settle(200);

  assert.strictEqual(env.canvas.width, CSS_W * DPR,
    `canvas never re-sized after the tab opened (backing width ${env.canvas.width})`);
  assert.strictEqual(env.canvas.height, CSS_H * DPR,
    `canvas never re-sized after the tab opened (backing height ${env.canvas.height})`);
  assert.strictEqual(cards.length, 15, 'all 15 skills should be drawn after reveal');

  const spreadX = Math.max(...cards.map((k) => k.x)) - Math.min(...cards.map((k) => k.x));
  const spreadY = Math.max(...cards.map((k) => k.y)) - Math.min(...cards.map((k) => k.y));
  assert.ok(spreadX > CSS_W * 0.5, `cards stacked instead of spreading, x span ${spreadX.toFixed(0)}px`);
  assert.ok(spreadY > CSS_H * 0.3, `cards stacked instead of spreading, y span ${spreadY.toFixed(0)}px`);
  for (const k of cards) {
    assert.ok(Math.abs(k.x) <= CSS_W / 2, `card x ${k.x.toFixed(0)} outside canvas`);
    assert.ok(Math.abs(k.y) <= CSS_H / 2, `card y ${k.y.toFixed(0)} outside canvas`);
  }
}

console.log('skills canvas: all checks passed');
