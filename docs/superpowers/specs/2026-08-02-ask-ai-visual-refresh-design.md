# Ask AI Widget — Visual Refresh + Mobile Fixes

## Context

The "Ask about Ashish" chat widget ([index.html](../../../index.html), [assets/css/style.css](../../../assets/css/style.css), [assets/js/script.js](../../../assets/js/script.js)) works — streaming, thinking dots, markdown formatting are all functional. But it looks flat next to the rest of the portfolio, which is far more visually deliberate (isometric icons, gradient borders, glow accents). The user flagged four specific gaps: the panel feels generic, messages are hard to tell apart at a glance, the launcher doesn't draw the eye, and the whole thing feels bolted onto the site rather than native to it.

Separately, a mobile audit of the whole site turned up two real bugs scoped to this widget (not pre-existing site issues):
1. `.ask-launcher` (`bottom: 20px`) overlaps the site's fixed-bottom nav bar on every screen under 1024px.
2. `.ask-input`'s 14-15px font size plus auto-focus-on-open triggers iOS Safari's zoom-on-focus behavior.

Both are bundled into this same pass since they're in the exact CSS/markup being touched. Three touch targets (close button, send button, suggestion chips) also came in under Apple's ~44px guideline and are bumped here too.

This is styling + minor markup restructuring only — no change to the streaming/sanitization/markdown logic already shipped.

## Visual direction: "Warm Glow"

Chosen over two alternatives (glassmorphism "Glass Card", and a more heavily-bordered "Native Card" using the site's isometric-icon language) via mockup comparison. Warm Glow reuses tokens the site already defines (`--orange-yellow-crayola`, `--vegas-gold`, `--bg-gradient-yellow-1`) rather than introducing new colors — an ambient amber halo instead of a flat rule, everywhere the widget currently has a hard edge.

### 1. Panel border + glow
Replace the plain `1px solid var(--jet)` panel border with an amber-tinted hairline plus a soft diffuse glow:
```css
.ask-panel {
  border: 1px solid hsla(45, 100%, 72%, 0.35);
  box-shadow: 0 0 0 1px hsla(45, 100%, 72%, 0.12), 0 20px 60px hsla(45, 90%, 55%, 0.18), var(--shadow-5);
}
```
Applies at the `min-width: 580px` breakpoint where the panel is a floating card (full-screen mobile view keeps `inset: 0`, no border needed there).

### 2. Message kicker label
Every assistant reply gets a small uppercase "✦ Ashish AI" label above it, in `--vegas-gold`, `font-size: 9-10px`, `letter-spacing: 0.06em`. This is the mockup the user picked over an avatar-dot and a no-label/divider-only option.

Markup restructure needed in `script.js`: the assistant message node currently gets `innerHTML` replaced wholesale on every streamed chunk. It needs an inner wrapper so the kicker survives re-renders:
```html
<div class="ask-msg ask-msg--assistant">
  <div class="ask-kicker">Ashish AI</div>
  <div class="ask-msg-content"><!-- formatted markdown goes here, re-rendered per chunk --></div>
</div>
```
The kicker renders immediately when the message node is created (alongside the thinking dots, inside `.ask-msg-content`), not held back until the first token arrives. `askFormatMarkdown()` output now targets the `.ask-msg-content` child, not the message root — the `streaming`/`thinking` classes and the `::after` caret stay on the message root as before.

### 3. Launcher: pill, glowed
Keeps today's icon + "Ask about me" text pill (chosen over an icon-only orb and an icon-only orb with a pulsing ring — clarity of intent won out). The flat gradient fill becomes a radial warm gradient with a matching glow:
```css
.ask-launcher {
  background: radial-gradient(circle at 30% 20%, hsl(45, 100%, 78%), hsl(45, 90%, 58%) 75%);
  box-shadow: 0 8px 24px hsla(45, 90%, 55%, 0.45);
}
```

## Mobile fixes (bundled)

### Nav/launcher overlap
The site's `.navbar` is fixed to the viewport bottom below `1024px`; `.ask-launcher` is independently fixed at `bottom: 20px` with no awareness of it. Fix by giving the launcher nav clearance at the base/mobile styles, then reverting to `20px` once the nav moves to the top:
```css
.ask-launcher { bottom: 80px; }               /* base — clears the fixed bottom nav */

@media (min-width: 1024px) {
  .ask-launcher { bottom: 20px; }              /* nav has moved to top here, no clearance needed */
}
```
The floating panel (only present `≥580px`) anchors relative to the launcher, so its `bottom` offset needs the same two-tier treatment: `150px` at `580-1023px` (clearing the launcher at its 80px position), `90px` (today's value) at `≥1024px`.

### iOS zoom-on-focus
`.ask-input` inherits `font-size: var(--fs-6)`, which is 14-15px depending on breakpoint — under the 16px threshold that triggers iOS Safari's auto-zoom on focus, and the panel auto-focuses this field the instant it opens. Fix: hardcode `font-size: 16px` on `.ask-input` directly, unconditionally (no breakpoint logic needed — 16px reads fine at every panel size already used).

## Touch target bumps
| Element | Current | New |
|---|---|---|
| `.ask-close-btn` | ~22px hit box (icon only, no box) | 36×36px, `border-radius: 50%`, icon centered |
| `.ask-send-btn` | 38×38px | 44×44px |
| `.ask-chip` | `padding: 8px 14px` (~29px tall) | `padding: 12px 16px` (~40px tall) |

## Files touched
- `assets/css/style.css` — the `#ASK AI` block: panel border/glow, launcher gradient/glow, kicker label styles, the two mobile-fix breakpoint rules, three touch-target size bumps.
- `assets/js/script.js` — restructure the assistant message node to separate the kicker from the re-rendered content div (the `askAppendMsg`/submit-handler logic around `assistantMsg`).
- `index.html` — no markup change; the widget's static markup (launcher, panel shell, composer) is unaffected. Only the dynamically-created assistant message nodes change shape, and that's JS-side.

No changes to `netlify/functions/chat.mjs` or `bio.js` — this is presentation only.

## Verification
1. Visual: open the site locally, trigger a few assistant replies, confirm the kicker label appears immediately per turn and survives streaming updates without flicker/duplication.
2. Mobile: resize to <1024px width, confirm the launcher pill no longer overlaps the bottom nav bar at any width down to 320px; confirm the floating panel (580-1023px range) still clears the launcher with no gap or overlap.
3. iOS zoom: cannot be tested outside Safari/iOS directly — confirm via computed style that `.ask-input` resolves to `16px` regardless of viewport width (DevTools computed panel), which is the documented threshold that prevents the zoom.
4. Touch targets: DevTools box-model inspector on `.ask-close-btn`, `.ask-send-btn`, `.ask-chip` — confirm each meets or exceeds ~40px in its smallest dimension.
5. Re-run the existing streaming/thinking-dots/markdown-formatting behavior (already covered by prior verification) to confirm the kicker restructure didn't regress it — a chunk should still append into `.ask-msg-content` only, not duplicate the kicker.
