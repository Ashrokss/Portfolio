# Ask AI Widget Visual Refresh + Mobile Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the "Ask about Ashish" chat widget with the approved "Warm Glow" treatment (amber-tinted panel border + glow, glowed launcher, per-message "Ashish AI" kicker label), and fix two mobile bugs (launcher/nav overlap, iOS zoom-on-focus) plus three under-sized touch targets — all found in the design spec.

**Architecture:** Pure CSS restyling in `assets/css/style.css` for four of five tasks. The fifth (kicker label) also requires a small DOM restructure in `assets/js/script.js` so the "Ashish AI" label survives the message node's per-chunk `innerHTML` rewrites during streaming. No new files, no new dependencies, no changes to the Netlify function or `index.html`.

**Tech Stack:** Plain CSS custom properties (existing `:root` tokens), vanilla JS (existing `assets/js/script.js` patterns — no framework, no build step).

## Global Constraints

- Source of truth for every exact value (colors, px sizes, breakpoints) is `docs/superpowers/specs/2026-08-02-ask-ai-visual-refresh-design.md` — copy values verbatim, don't improvise new ones.
- Do not modify `netlify/functions/chat.mjs`, `netlify/functions/bio.js`, or `index.html` — this plan is scoped to `assets/css/style.css` and `assets/js/script.js` only.
- All new colors must come from existing `:root` custom properties (`--orange-yellow-crayola`, `--vegas-gold`, etc.) or the specific `hsla()` glow values given in the spec — no new color tokens.
- **This repo has no test framework, no `package.json`, no build step** (confirmed during the original widget build). Verification here follows the same approach already used successfully for this widget:
  - `node --check assets/js/script.js` for JS syntax.
  - A one-line Node brace-balance check for CSS syntax (`open === close`).
  - Throwaway Node scripts in the scratchpad directory for pure-logic checks (not committed — no test convention exists in this repo to extend).
  - Manual browser + DevTools QA for visual/breakpoint/DOM behavior, using explicit steps and expected results (not vague "verify it works").
- Every CSS edit in this plan lives inside the existing `/* #ASK AI */` section at the end of `assets/css/style.css` (currently starting around line 2709) — do not scatter Ask AI styles into unrelated sections of the file, and do not touch the pre-existing `@media (min-width: 1024px)` block used for core site layout (it starts around line 2193 and is unrelated to this widget).

---

### Task 1: Panel border + ambient glow

**Files:**
- Modify: `assets/css/style.css` — the `.ask-panel` rule inside the existing `@media (min-width: 580px) { ... }` block near the end of the `#ASK AI` section.

**Interfaces:**
- Consumes: existing `--shadow-5` custom property, existing `.ask-panel` selector (no name changes).
- Produces: nothing new consumed by later tasks — purely visual.

- [ ] **Step 1: Locate and edit the `.ask-panel` rule inside the 580px block**

Find this exact block (currently the only occurrence of `.ask-panel` with a `border:` declaration):

```css
@media (min-width: 580px) {

  .ask-panel {
    inset: auto;
    bottom: 90px;
    right: 20px;
    width: 380px;
    height: min(70vh, 560px);
    border-radius: 16px;
    border: 1px solid var(--jet);
    box-shadow: var(--shadow-5);
  }

}
```

Replace the `border` and `box-shadow` lines only, keep everything else identical:

```css
@media (min-width: 580px) {

  .ask-panel {
    inset: auto;
    bottom: 90px;
    right: 20px;
    width: 380px;
    height: min(70vh, 560px);
    border-radius: 16px;
    border: 1px solid hsla(45, 100%, 72%, 0.35);
    box-shadow: 0 0 0 1px hsla(45, 100%, 72%, 0.12), 0 20px 60px hsla(45, 90%, 55%, 0.18), var(--shadow-5);
  }

}
```

(The `bottom: 90px` value here will change again in Task 3 — don't worry about it in this step.)

- [ ] **Step 2: CSS syntax check**

Run:
```bash
node -e "
const css = require('fs').readFileSync('assets/css/style.css','utf8');
const open = (css.match(/{/g)||[]).length;
const close = (css.match(/}/g)||[]).length;
console.log('open:', open, 'close:', close, open===close ? 'BALANCED' : 'MISMATCH');
"
```
Expected: `BALANCED` (brace count is unchanged from before this edit — this task only replaced two property values, added no new braces).

- [ ] **Step 3: Manual visual check**

Open `index.html` directly in a browser (or via a local static server), click the "Ask about me" launcher, and confirm the panel now shows a faint warm amber edge and a soft glow around its border, instead of the previous flat gray `1px solid` line. Resize the window below 580px width and confirm the full-screen mobile view (`inset: 0`) is unaffected — it has no border/box-shadow in this rule and shouldn't gain one.

- [ ] **Step 4: Commit**

```bash
git add assets/css/style.css
git commit -m "Add amber glow to Ask AI panel border"
```

---

### Task 2: Launcher glow

**Files:**
- Modify: `assets/css/style.css` — the `.ask-launcher` base rule near the top of the `#ASK AI` section.

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed by later tasks — purely visual. (Task 3 edits the same rule's `bottom` property; that's a separate, independent property on the same selector.)

- [ ] **Step 1: Edit the `.ask-launcher` background and box-shadow**

Find:

```css
.ask-launcher {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 50px;
  background: var(--bg-gradient-yellow-1), var(--eerie-black-2);
  color: var(--smoky-black);
  font-family: var(--ff-poppins);
  font-size: var(--fs-7);
  font-weight: var(--fw-500);
  box-shadow: var(--shadow-2);
  transition: var(--transition-1);
}
```

Replace only the `background` and `box-shadow` lines:

```css
.ask-launcher {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 50px;
  background: radial-gradient(circle at 30% 20%, hsl(45, 100%, 78%), hsl(45, 90%, 58%) 75%);
  color: var(--smoky-black);
  font-family: var(--ff-poppins);
  font-size: var(--fs-7);
  font-weight: var(--fw-500);
  box-shadow: 0 8px 24px hsla(45, 90%, 55%, 0.45);
  transition: var(--transition-1);
}
```

(The `bottom: 20px` value here will change in Task 3 — don't worry about it in this step.)

- [ ] **Step 2: CSS syntax check** — same command as Task 1 Step 2. Expected: `BALANCED`.

- [ ] **Step 3: Manual visual check**

Open the site, look at the launcher pill bottom-right. Confirm it now has a warm radial-gradient fill (brighter in the upper-left of the pill, deeper gold toward the edges) and a soft amber glow shadow beneath it, replacing the previous flat linear gradient. Hover it and confirm the existing lift-on-hover (`translateY(-3px)`) still works — that rule wasn't touched.

- [ ] **Step 4: Commit**

```bash
git add assets/css/style.css
git commit -m "Add radial glow to Ask AI launcher"
```

---

### Task 3: Fix launcher/nav overlap on mobile

**Files:**
- Modify: `assets/css/style.css` — `.ask-launcher`'s `bottom` property, the `.ask-panel` rule inside the existing `@media (min-width: 580px)` block (its `bottom` property), and one **new** `@media (min-width: 1024px)` block appended at the very end of the `#ASK AI` section.

**Interfaces:**
- Consumes: the site's existing `.navbar` breakpoint behavior — fixed to viewport bottom below 1024px (`assets/css/style.css:662-673`), moved to `position: absolute; top: 0` at `@media (min-width: 1024px)` (`assets/css/style.css:2245` area). This task does not modify `.navbar` itself.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Give the launcher nav clearance at the base (mobile) breakpoint**

In the `.ask-launcher` rule (edited in Task 2), change:
```css
  bottom: 20px;
```
to:
```css
  bottom: 80px;
```

- [ ] **Step 2: Raise the floating panel's offset to match, in the existing 580px block**

In the `@media (min-width: 580px) { .ask-panel { ... } }` block (edited in Task 1), change:
```css
    bottom: 90px;
```
to:
```css
    bottom: 150px;
```

- [ ] **Step 3: Revert both to their original values once the nav moves to the top, at 1024px**

Append this new block at the very end of the `#ASK AI` CSS section (after the existing `@media (min-width: 580px) { ... }` block's closing `}`):

```css

@media (min-width: 1024px) {

  .ask-launcher {
    bottom: 20px;
  }

  .ask-panel {
    bottom: 90px;
  }

}
```

- [ ] **Step 4: CSS syntax check** — same command as Task 1 Step 2. Expected: `BALANCED` (this step adds 2 new `{` and 2 new `}`, so the count changes but must still match).

- [ ] **Step 5: Manual visual check across breakpoints**

Using browser DevTools' responsive mode, check the launcher pill at these widths and confirm it never visually overlaps the bottom nav bar (the nav bar's top edge and the launcher's bottom edge should have a visible gap in all three ranges):
- 375px (phone) — nav fixed at bottom, launcher should sit clearly above it.
- 700px (tablet, panel becomes a floating card here) — open the panel and confirm it also clears the nav with no gap or overlap between the panel's bottom edge and the launcher pill below it.
- 1200px (desktop) — nav has moved to the top-right; confirm the launcher returns to `bottom: 20px` and the panel to `bottom: 90px` (both back to their pre-refresh position, since there's no longer a bottom nav to clear).

- [ ] **Step 6: Commit**

```bash
git add assets/css/style.css
git commit -m "Fix Ask AI launcher overlapping bottom nav on mobile/tablet"
```

---

### Task 4: Composer & controls ergonomics (iOS zoom fix + touch target bumps)

**Files:**
- Modify: `assets/css/style.css` — `.ask-input`, `.ask-close-btn`, `.ask-send-btn`, `.ask-chip`.

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Fix iOS zoom-on-focus — hardcode `.ask-input` font-size to 16px**

Find:
```css
.ask-input {
  flex: 1;
  resize: none;
  max-height: 120px;
  background: var(--onyx);
  color: var(--white-2);
  font-family: var(--ff-poppins);
  font-size: var(--fs-6);
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--jet);
}
```
Change `font-size: var(--fs-6);` to `font-size: 16px;`. (16px is the documented threshold below which iOS Safari zooms the page on input focus — this widget auto-focuses the input the instant it opens, so this must hold at every breakpoint, not just some.)

- [ ] **Step 2: Give the close button a real hit box**

Find:
```css
.ask-close-btn {
  color: var(--light-gray);
  font-size: 22px;
  transition: var(--transition-1);
}
```
Replace with:
```css
.ask-close-btn {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--light-gray);
  font-size: 22px;
  transition: var(--transition-1);
}
```

- [ ] **Step 3: Bump the send button from 38px to 44px**

Find:
```css
.ask-send-btn {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--orange-yellow-crayola);
  color: var(--smoky-black);
  font-size: 18px;
  transition: var(--transition-1);
}
```
Change both `width: 38px;` and `height: 38px;` to `44px`.

- [ ] **Step 4: Bump suggestion chip padding so they read ~40px tall**

Find:
```css
.ask-chip {
  padding: 8px 14px;
  border-radius: 50px;
  border: 1px solid var(--jet);
  background: var(--onyx);
  color: var(--light-gray-70);
  font-size: var(--fs-8);
  text-align: left;
  transition: var(--transition-1);
}
```
Change `padding: 8px 14px;` to `padding: 12px 16px;`.

- [ ] **Step 5: CSS syntax check** — same command as Task 1 Step 2. Expected: `BALANCED`.

- [ ] **Step 6: Manual verification with DevTools box model**

Open the site, open the Ask AI panel, and for each of `.ask-close-btn`, `.ask-send-btn`, and one `.ask-chip`, use DevTools' element inspector (the box-model diagram in the Computed/Layout panel) to confirm the rendered box is at least ~36-44px in both dimensions as specified above. Then focus the `.ask-input` textarea and check its computed `font-size` is exactly `16px`.

- [ ] **Step 7: Commit**

```bash
git add assets/css/style.css
git commit -m "Bump Ask AI touch targets and fix iOS input zoom"
```

---

### Task 5: "Ashish AI" kicker label on assistant messages

**Files:**
- Modify: `assets/css/style.css` — add a new `.ask-kicker` rule in the `#ASK AI` section, near the existing `.ask-msg--assistant` rules.
- Modify: `assets/js/script.js` — the `askForm` submit handler (the block that creates `assistantMsg` and streams chunks into it).

**Interfaces:**
- Consumes: existing `askFormatMarkdown(raw)` function (`assets/js/script.js`, unchanged, still takes a raw string and returns formatted HTML) and existing `.ask-msg--assistant` / `.streaming` / `.thinking` classes (unchanged — the restructure only changes what's *inside* the message node, not the classes on it).
- Produces: a new `.ask-msg-content` child element inside every assistant message node — this is where formatted text now gets written on every streamed chunk, instead of directly on the message node's `innerHTML`. Nothing outside this task reads `.ask-msg-content` today, but note it here in case a future task needs to target the text content specifically (e.g. for copy-to-clipboard).

- [ ] **Step 1: Add the `.ask-kicker` CSS rule**

Insert this new rule right after the existing block of `.ask-msg--assistant` descendant rules (after the `.ask-msg--assistant strong { ... }` line, before `.ask-thinking { ... }`):

```css
.ask-kicker {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vegas-gold);
}

.ask-kicker::before { content: "✦"; }
```

- [ ] **Step 2: CSS syntax check** — same command as Task 1 Step 2. Expected: `BALANCED`.

- [ ] **Step 3: Write a throwaway Node test for the restructured message-update contract, and confirm it fails against the CURRENT (pre-restructure) code shape**

This guards against the exact bug this task fixes: the kicker getting wiped out because streamed chunks overwrite the whole message node's `innerHTML` instead of a dedicated child's. Create this file in the scratchpad directory (not part of the repo):

```js
// test-kicker-contract.mjs — verifies the assistant message node's outer
// innerHTML (set once, containing the kicker) is never reassigned after
// creation; only a dedicated content child is updated per streamed chunk.

function makeStubElement() {
  const classes = new Set();
  let html = "";
  let innerHTMLSetCount = 0;
  return {
    classList: {
      add: (...c) => c.forEach((x) => classes.add(x)),
      remove: (...c) => c.forEach((x) => classes.delete(x)),
      contains: (c) => classes.has(c),
    },
    get innerHTML() { return html; },
    set innerHTML(v) { html = v; innerHTMLSetCount++; },
    get _innerHTMLSetCount() { return innerHTMLSetCount; },
  };
}

// Mirrors the exact shape script.js's submit handler should use after this task:
//   1. assistantMsg.innerHTML is set exactly ONCE, at creation, containing the kicker.
//   2. assistantContent.innerHTML is set once per streamed chunk.
function simulateStreaming(assistantMsg, assistantContent, chunks) {
  assistantMsg.innerHTML =
    '<div class="ask-kicker">Ashish AI</div>' +
    '<div class="ask-msg-content"><span class="ask-thinking"></span></div>';

  let fullText = "";
  for (const chunk of chunks) {
    fullText += chunk;
    assistantContent.innerHTML = `<p>${fullText}</p>`; // stand-in for askFormatMarkdown()
  }
}

const assistantMsg = makeStubElement();
const assistantContent = makeStubElement();

simulateStreaming(assistantMsg, assistantContent, ["Ashish ", "is a ", "Cloud engineer."]);

console.log("assistantMsg.innerHTML set count:", assistantMsg._innerHTMLSetCount);
console.log("assistantContent.innerHTML set count:", assistantContent._innerHTMLSetCount);
console.log("assistantMsg still contains kicker:", assistantMsg.innerHTML.includes("Ashish AI"));
console.log("assistantContent has final text:", assistantContent.innerHTML.includes("Cloud engineer."));

const pass =
  assistantMsg._innerHTMLSetCount === 1 &&
  assistantContent._innerHTMLSetCount === 3 &&
  assistantMsg.innerHTML.includes("Ashish AI") &&
  assistantContent.innerHTML.includes("Cloud engineer.");

console.log(pass ? "PASS" : "FAIL");
process.exit(pass ? 0 : 1);
```

Run:
```bash
node /path/to/scratchpad/test-kicker-contract.mjs
```
Expected: `PASS` (this test only exercises the stub contract shown inline in the test itself — it doesn't yet import `script.js`, so it can't fail from real code. Its job is to pin down the exact contract Step 4 must implement: outer `innerHTML` set once, content div set per chunk.)

- [ ] **Step 4: Restructure the submit handler in `assets/js/script.js`**

Find (inside the `askForm.addEventListener("submit", ...)` handler):

```js
  const assistantMsg = document.createElement("div");
  assistantMsg.className = "ask-msg ask-msg--assistant thinking";
  assistantMsg.innerHTML = '<span class="ask-thinking"><span></span><span></span><span></span></span>';
  askThread.appendChild(assistantMsg);
  askThread.scrollTop = askThread.scrollHeight;

  let started = false;
```

Replace with:

```js
  const assistantMsg = document.createElement("div");
  assistantMsg.className = "ask-msg ask-msg--assistant thinking";
  assistantMsg.innerHTML =
    '<div class="ask-kicker">Ashish AI</div>' +
    '<div class="ask-msg-content"><span class="ask-thinking"><span></span><span></span><span></span></span></div>';
  askThread.appendChild(assistantMsg);
  askThread.scrollTop = askThread.scrollHeight;

  const assistantContent = assistantMsg.querySelector(".ask-msg-content");
  let started = false;
```

Then find, further down in the streaming loop:

```js
          if (delta) {
            if (!started) {
              started = true;
              assistantMsg.classList.remove("thinking");
              assistantMsg.classList.add("streaming");
            }
            fullText += delta;
            assistantMsg.innerHTML = askFormatMarkdown(fullText);
            askThread.scrollTop = askThread.scrollHeight;
          }
```

Replace with:

```js
          if (delta) {
            if (!started) {
              started = true;
              assistantMsg.classList.remove("thinking");
              assistantMsg.classList.add("streaming");
            }
            fullText += delta;
            assistantContent.innerHTML = askFormatMarkdown(fullText);
            askThread.scrollTop = askThread.scrollHeight;
          }
```

Finally, find the `catch` block:

```js
  } catch (err) {
    assistantMsg.classList.remove("thinking", "streaming");
    assistantMsg.classList.add("ask-msg--error");
    assistantMsg.textContent = err.message || "Something went wrong. Try again shortly.";
    askHistory.pop(); // drop the failed turn so a retry isn't poisoned
  } finally {
```

Replace the `assistantMsg.textContent = ...` line only (keep the rest identical):

```js
  } catch (err) {
    assistantMsg.classList.remove("thinking", "streaming");
    assistantMsg.classList.add("ask-msg--error");
    assistantContent.textContent = err.message || "Something went wrong. Try again shortly.";
    askHistory.pop(); // drop the failed turn so a retry isn't poisoned
  } finally {
```

(Setting `assistantContent.textContent` instead of `assistantMsg.textContent` means the kicker stays visible above the error line too, which is fine — it's still "Ashish AI" reporting that something went wrong, same as any other reply.)

- [ ] **Step 5: JS syntax check**

Run:
```bash
node --check assets/js/script.js
```
Expected: no output (syntax OK).

- [ ] **Step 6: Manual browser verification**

Open the site, open the Ask AI panel, and send a real question (or click a suggestion chip). Confirm, in order:
1. The "Ashish AI" kicker label (with the ✦ prefix) appears immediately, before any streamed text — sitting above the thinking-dots animation.
2. As the reply streams in, the kicker stays in place and only the text below it updates/grows — it must not flicker, disappear, or duplicate on any chunk.
3. Open DevTools' Elements panel while a reply is mid-stream and confirm the DOM shows `<div class="ask-msg ask-msg--assistant streaming"><div class="ask-kicker">Ashish AI</div><div class="ask-msg-content">...</div></div>` — exactly one kicker div, exactly one content div, per assistant message.
4. Send a second follow-up message and confirm the first message's kicker is still present and correct (i.e., appending a new message doesn't affect earlier ones).
5. Temporarily disconnect from the network (or block the `/.netlify/functions/chat` request in DevTools) and send a message to trigger the error path — confirm the kicker still shows above the red error text, and no `undefined`/blank kicker appears.

- [ ] **Step 7: Commit**

```bash
git add assets/css/style.css assets/js/script.js
git commit -m "Add Ashish AI kicker label to assistant messages"
```

---

## Plan Self-Review Notes

- **Spec coverage:** panel border/glow → Task 1. Launcher glow → Task 2. Kicker label → Task 5. Nav-overlap fix → Task 3. iOS zoom fix → Task 4 Step 1. Three touch-target bumps → Task 4 Steps 2-4. All five spec sections have a task.
- **No placeholders:** every step shows the exact before/after CSS or JS, not a description of what to change.
- **Type/name consistency:** `assistantContent` is introduced once (Task 5 Step 4) and used consistently in both the streaming branch and the catch branch. `.ask-msg-content` and `.ask-kicker` are the only two new class names introduced across the whole plan, and both are used identically in the CSS task (Step 1) and the JS task (Step 4).
