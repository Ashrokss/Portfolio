// Runs the real handler in-process. Each case re-imports with a cache-buster
// because the module reads env into consts at import time.
import assert from 'node:assert';
import fs from 'node:fs';

const MOD = new URL('../netlify/functions/chat.mjs', import.meta.url).href;
const real = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter(l => l.includes('=')).map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

let n = 0;
async function run(name, env, expect) {
  for (const k of ['GROQ_API_KEY', 'GEMINI_API_KEY', 'LLM_API_KEY', 'GEMINI_MODEL', 'GEMINI_BASE_URL', 'LLM_BASE_URL'])
    delete process.env[k];
  Object.assign(process.env, env);
  const { default: handler } = await import(`${MOD}?v=${++n}`);
  const res = await handler(new Request('http://x/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Who is Ashish?' }] }),
  }));
  let first = '';
  if (res.status === 200) {
    for await (const c of res.body) { first = new TextDecoder().decode(c).slice(0, 80); break; }
  } else {
    first = await res.text();
  }
  console.log(`${name}\n  -> ${res.status} | ${first.replace(/\n/g, ' ')}`);
  assert.strictEqual(res.status, expect, `${name}: expected ${expect}, got ${res.status}`);
}

// Groq broken, Gemini good -> fallback must serve a 200 stream
await run('groq dead + gemini ok  (FALLBACK)', { GROQ_API_KEY: 'gsk_invalid_key', GEMINI_API_KEY: real.GEMINI_API_KEY }, 200);
// Groq unreachable host (throw path, not !ok path)
await run('groq unreachable + gemini ok', { GROQ_API_KEY: 'x', LLM_BASE_URL: 'https://127.0.0.1:9/v1', GEMINI_API_KEY: real.GEMINI_API_KEY }, 200);
// No Groq key at all -> straight to Gemini
await run('no groq key + gemini ok', { GEMINI_API_KEY: real.GEMINI_API_KEY }, 200);
// Happy path, Groq only
await run('groq ok (PRIMARY)', { GROQ_API_KEY: real.GROQ_API_KEY }, 200);
// Both broken -> 502
await run('both dead', { GROQ_API_KEY: 'bad', GEMINI_API_KEY: 'bad' }, 502);
// Nothing configured -> 500
await run('no keys', {}, 500);

console.log('\nall cases passed');
