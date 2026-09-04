'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}



// resume toggle functionality
const resumeToggleBtns = document.querySelectorAll("[data-resume-toggle]");
const resumeSections = document.querySelectorAll("[data-resume-section]");

for (let i = 0; i < resumeToggleBtns.length; i++) {
  resumeToggleBtns[i].addEventListener("click", function () {

    const toggleTarget = this.dataset.resumeToggle;

    for (let j = 0; j < resumeSections.length; j++) {
      if (toggleTarget === resumeSections[j].dataset.resumeSection) {
        resumeSections[j].classList.add("active");
        resumeToggleBtns[j].classList.add("active");
      } else {
        resumeSections[j].classList.remove("active");
        resumeToggleBtns[j].classList.remove("active");
      }
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



const askOpenBtns = document.querySelectorAll("[data-ask-open]");
const askPanel = document.querySelector("[data-ask-panel]");
const askCloseBtn = document.querySelector("[data-ask-close]");
const askMaximizeBtn = document.querySelector("[data-ask-maximize]");
const askThread = document.querySelector("[data-ask-thread]");
const askForm = document.querySelector("[data-ask-form]");
const askInput = document.querySelector("[data-ask-input]");
const askSendBtn = document.querySelector("[data-ask-send]");
const askChips = document.querySelectorAll("[data-ask-chip]");

let askHistory = [];

// open / close panel
const askLauncherWrapper = document.querySelector(".ask-launcher-wrapper");

for (let i = 0; i < askOpenBtns.length; i++) {
  askOpenBtns[i].addEventListener("click", function () {
    elementToggleFunc(askPanel);
    if (askLauncherWrapper) {
      askLauncherWrapper.style.display = askPanel.classList.contains("active") ? "none" : "flex";
    }
    if (askPanel.classList.contains("active")) askInput.focus();
  });
}
askCloseBtn.addEventListener("click", function () {
  elementToggleFunc(askPanel);
  if (askLauncherWrapper) {
    askLauncherWrapper.style.display = "flex";
  }
});

// maximize / restore panel toggle
if (askMaximizeBtn) {
  askMaximizeBtn.addEventListener("click", function () {
    askPanel.classList.toggle("maximized");
    const icon = this.querySelector("ion-icon");
    if (icon) {
      if (askPanel.classList.contains("maximized")) {
        icon.setAttribute("name", "contract-outline");
      } else {
        icon.setAttribute("name", "expand-outline");
      }
    }
  });
}

// suggested prompt chips
for (let i = 0; i < askChips.length; i++) {
  askChips[i].addEventListener("click", function () {
    askInput.value = this.textContent;
    askForm.requestSubmit();
  });
}

// textarea auto-grow, enter to send
askInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});
askInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askForm.requestSubmit();
  }
});

const askAppendMsg = function (role, text) {
  const msg = document.createElement("div");
  msg.className = "ask-msg ask-msg--" + role;
  if (role === "user") {
    msg.innerHTML =
      '<div class="ask-kicker ask-kicker--user">YOU</div>' +
      '<div class="ask-msg-bubble">' + askEscapeHtml(text) + '</div>';
  } else {
    msg.textContent = text;
  }
  askThread.appendChild(msg);
  askThread.scrollTop = askThread.scrollHeight;
  return msg;
};

// minimal, safe markdown -> HTML: escape first, then only add back the
// handful of tags the system prompt is told to use (bold, paragraphs, lists, links)
// Quotes are escaped too (not just &/</>) because link URLs/text get spliced
// into a href="..." attribute below — an unescaped " would break out of it.
const askEscapeHtml = function (str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const askFormatMarkdown = function (raw) {
  if (!raw) return "";

  // 1. Safe HTML escape first
  let text = askEscapeHtml(raw);

  // 2. Inline formatting
  // Code: `code`
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Bold: **text** or __text__
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  // Italics: *text* or _text_ (excluding list bullets at start of line)
  text = text.replace(/(^|[^\*])\*([^\*\s][^\*]*[^\*\s]|[^\*\s])\*/g, "$1<em>$2</em>");
  // Links: [text](url) - only http(s)
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // 3. Line-by-line block parser
  const lines = text.split("\n");
  const htmlBlocks = [];
  let currentParagraph = [];
  let currentList = null; // { type: 'ul'|'ol', items: [] }

  const cleanString = function (arr) {
    return arr
      .map(function (l) { return l.trim(); })
      .filter(Boolean)
      .join(" ")
      .replace(/\s+([.,!?;:])/g, "$1")
      .trim();
  };

  const flushParagraph = function () {
    if (currentParagraph.length > 0) {
      const pText = cleanString(currentParagraph);
      if (pText) {
        htmlBlocks.push("<p>" + pText + "</p>");
      }
      currentParagraph = [];
    }
  };

  const flushList = function () {
    if (currentList && currentList.items.length > 0) {
      const tag = currentList.type;
      const itemsHtml = currentList.items
        .map(function (itemLines) {
          const itemText = cleanString(itemLines);
          return itemText ? "<li>" + itemText + "</li>" : "";
        })
        .filter(Boolean)
        .join("");
      if (itemsHtml) {
        htmlBlocks.push("<" + tag + ">" + itemsHtml + "</" + tag + ">");
      }
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      // Blank line flushes open blocks
      flushParagraph();
      flushList();
      continue;
    }

    const ulMatch = trimmed.match(/^[-*+]\s+(.+)/);
    const olMatch = trimmed.match(/^\d+\.\s+(.+)/);

    if (ulMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push([ulMatch[1]]);
    } else if (olMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push([olMatch[1]]);
    } else {
      // If inside a list, subsequent non-empty lines without a bullet marker
      // continue the current list item. Otherwise, accumulate in currentParagraph.
      if (currentList && currentList.items.length > 0) {
        currentList.items[currentList.items.length - 1].push(trimmed);
      } else {
        currentParagraph.push(trimmed);
      }
    }
  }

  flushParagraph();
  flushList();

  return htmlBlocks.join("");
};

askForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const text = askInput.value.trim();
  if (!text) return;

  askHistory.push({ role: "user", content: text });
  askAppendMsg("user", text);
  askInput.value = "";
  askInput.style.height = "auto";
  askSendBtn.setAttribute("disabled", "");

  const assistantMsg = document.createElement("div");
  assistantMsg.className = "ask-msg ask-msg--assistant thinking";
  assistantMsg.innerHTML =
    '<div class="ask-kicker">✦ ASHISH AI</div>' +
    '<div class="ask-msg-content"><span class="ask-thinking"><span></span><span></span><span></span></span></div>';
  askThread.appendChild(assistantMsg);
  askThread.scrollTop = askThread.scrollHeight;

  const assistantContent = assistantMsg.querySelector(".ask-msg-content");
  let started = false;

  try {
    let res;
    let isLocalFallback = false;
    let fullText = "";

    try {
      res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: askHistory }),
      });
      if (!res.ok && (res.status === 404 || res.status === 501)) {
        isLocalFallback = true;
      }
    } catch (netErr) {
      // Only treat this as "no backend available" when the page itself isn't
      // served over http(s) (e.g. opened straight from disk). On a real
      // deployment a thrown fetch is a genuine network failure and must
      // surface as one, not get masked by a fake canned answer.
      if (location.protocol === "file:") {
        isLocalFallback = true;
      } else {
        throw netErr;
      }
    }

    if (isLocalFallback) {
      // Local dev mode without netlify dev proxying serverless functions.
      // Provide simulated streaming response so local preview never breaks.
      assistantMsg.classList.remove("thinking");
      assistantMsg.classList.add("streaming");

      const mockText = (function (prompt) {
        const p = prompt.toLowerCase();
        if (p.includes("cloud") || p.includes("project") || p.includes("walkthrough") || p.includes("aks") || p.includes("terraform")) {
          return "Ashish has built several enterprise-grade Cloud & DevOps projects:\n\n" +
            "- **[Enterprise AKS Platform](https://github.com/Ashrokss/Enterprise-Aks-Platform)**: Azure Kubernetes Service infrastructure built with modular `Terraform`, ArgoCD GitOps, and Azure Key Vault.\n" +
            "- **[Terraform Ansible Lab](https://github.com/Ashrokss/Terraform-Ansible-Lab)**: End-to-end automation combining Terraform provisioning with Ansible configuration management.\n" +
            "- **[AzOps](https://github.com/Ashrokss/AzOps)**: Terminal-native Azure management utility for fast CLI resource inspection.\n\n" +
            "*Note: Local static preview mode active. To test live Groq/Gemini LLM responses, run `netlify dev`.*";
        }
        if (p.includes("do") || p.includes("about") || p.includes("who") || p.includes("skill") || p.includes("experience") || p.includes("background")) {
          return "Ashish Pal is a **Cloud & DevOps Engineer** specializing in automated infrastructure, container orchestration, and CI/CD pipelines.\n\n" +
            "Key Technical Skills:\n" +
            "- **Cloud Platforms**: Azure, AWS\n" +
            "- **Infrastructure as Code**: Terraform, Ansible, GitOps (ArgoCD)\n" +
            "- **Containers & Orchestration**: Docker, Kubernetes (AKS)\n" +
            "- **Data & AI**: Python, SQL, Generative AI models\n\n" +
            "*Note: Local static preview mode active. To test live Groq/Gemini LLM responses, run `netlify dev`.*";
        }
        if (p.includes("opportunity") || p.includes("contact") || p.includes("hire") || p.includes("email") || p.includes("phone")) {
          return "Ashish is open to Cloud & DevOps engineering roles and collaborative opportunities!\n\n" +
            "- **Email**: [ashish200221@gmail.com](mailto:ashish200221@gmail.com)\n" +
            "- **Phone**: +91 7878816331\n" +
            "- **LinkedIn**: [Ashish Pal](https://www.linkedin.com/in/ashish-pal-544485226)\n" +
            "- **GitHub**: [Ashrokss](https://github.com/Ashrokss)\n\n" +
            "*Note: Local static preview mode active. To test live Groq/Gemini LLM responses, run `netlify dev`.*";
        }
        return "Hello! I am Ashish's AI assistant. Ashish is a Cloud & DevOps Engineer specializing in Azure, Terraform, and CI/CD automation.\n\n" +
          "Feel free to ask about his **cloud projects**, **skills**, or **contact details**!\n\n" +
          "*Note: Local static preview mode active. To test live Groq/Gemini LLM responses, run `netlify dev`.*";
      })(text);

      let currentLength = 0;
      fullText = "";
      while (currentLength < mockText.length) {
        currentLength += Math.min( mockText.length - currentLength, Math.floor(Math.random() * 4) + 2 );
        fullText = mockText.slice(0, currentLength);
        assistantContent.innerHTML = askFormatMarkdown(fullText);
        askThread.scrollTop = askThread.scrollHeight;
        await new Promise((r) => setTimeout(r, 20));
      }

      assistantMsg.classList.remove("streaming");
      askHistory.push({ role: "assistant", content: fullText });
      askHistory = askHistory.slice(-20);
      return;
    }

    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Something went wrong.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;

        try {
          const json = JSON.parse(payload);
          const delta = json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content;
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
        } catch (parseErr) {
          // ignore malformed SSE chunk
        }
      }
    }

    assistantMsg.classList.remove("streaming");
    askHistory.push({ role: "assistant", content: fullText });
    askHistory = askHistory.slice(-20);

  } catch (err) {
    assistantMsg.classList.remove("thinking", "streaming");
    assistantMsg.classList.add("ask-msg--error");
    assistantContent.innerHTML = '<div class="ask-error-text"><ion-icon name="alert-circle-outline"></ion-icon> ' + askEscapeHtml(err.message || "Something went wrong. Try again shortly.") + '</div>';
    askHistory.pop(); // drop the failed turn so a retry isn't poisoned
  } finally {
    askSendBtn.removeAttribute("disabled");
  }
});


/*-----------------------------------*\
  #INTERACTIVE SKILLS CANVAS
\*-----------------------------------*/
(function initSkillsCanvas() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;
  const wrap = canvas.parentElement;
  const ctx = canvas.getContext('2d');

  // Motion constants. Entrance is easeOutBack with a scale overshoot; the
  // cursor drags icons along as a comet tail; letting go springs them home
  // to rest points that drift slightly so the field never looks frozen.
  const TRAIL_MAX = 160;   // cursor points kept
  const TRAIL_GAP = 7;     // trail points between consecutive icons
  const FOLLOW = 0.14;     // lerp toward assigned trail point
  const SPRING = 0.08;
  const DAMP = 0.82;
  const DRIFT_MS = 2000;
  const DRIFT_PX = 10;
  const ENTER_STAGGER = 75;
  const ENTER_MS = 500;
  const REENGAGE_PX = 6;   // movement needed to resume following after a reset

  const easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);

  const ICON_DIR = './assets/images/skills/';
  const SKILLS = [
    { name: 'Azure', icon: 'azure' },
    { name: 'Terraform', icon: 'terraform' },
    { name: 'Git', icon: 'git' },
    { name: 'Linux', icon: 'linux' },
    { name: 'Docker', icon: 'docker' },
    { name: 'AWS', icon: 'aws' },
    { name: 'Kubernetes', icon: 'kubernetes' },
    { name: 'CI/CD', icon: 'cicd' },
    { name: 'SQL', icon: 'sql' },
    { name: 'Python', icon: 'python' },
    { name: 'Machine Learning', icon: 'ml' },
    { name: 'Power BI', icon: 'powerbi' },
    { name: 'Excel', icon: 'excel' },
    { name: 'GenAI', icon: 'genai' },
    { name: 'Data Science', icon: 'datascience' }
  ];

  // Rest positions as fractions of the usable half-extent, so the scatter
  // keeps its shape at any container size.
  const WIDE = [
    [-0.77, 0.00], [1.00, 0.33], [0.92, -0.17], [-0.92, -0.50], [-0.92, 0.83],
    [0.15, -0.83], [-0.62, -1.00], [0.77, 0.67], [-0.46, 0.00], [0.46, 0.00],
    [0.38, 1.00], [0.85, -1.00], [-0.38, 0.83], [-0.05, 0.45], [0.05, -0.42]
  ];
  const NARROW = [
    [-0.67, 0.32], [1.00, 0.29], [0.80, -0.39], [-0.80, -0.72], [0.00, 0.86],
    [0.07, -0.74], [-0.67, -0.39], [0.03, 0.39], [-1.00, 0.79], [1.00, 1.00],
    [0.83, -0.95], [-1.00, -0.97], [0.67, 0.66], [-0.50, 0.00], [0.45, 0.06]
  ];

  const nodes = SKILLS.map((s) => {
    const image = new Image();
    image.src = ICON_DIR + s.icon + '.svg';
    // Icons stream in after first paint; repaint if the loop is not running.
    image.addEventListener('load', () => { if (!raf) draw(); });
    return {
      name: s.name, image: image,
      x: 0, y: 0, vx: 0, vy: 0, scale: 0,
      baseRestX: 0, baseRestY: 0, restX: 0, restY: 0
    };
  });

  const pointer = { x: 0, y: 0, active: false };
  let W = 0, H = 0, dpr = 1, tile = 56;
  let trail = [];
  let order = [];
  let phase = 'wait';       // wait -> entering -> idle
  let enterStart = 0;
  let driftAcc = 0;
  let last = 0;
  let raf = 0;
  let sized = false;
  let visible = false;
  let resetAt = null;      // where a right-click reset happened, until re-engaged

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function layout() {
    const r = wrap.getBoundingClientRect();
    // The skills section sits in a tab that is display:none on load, which
    // reports 0x0. Stay unsized until the ResizeObserver says it has opened.
    if (!r.width || !r.height) { sized = false; return; }
    dpr = window.devicePixelRatio || 1;
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    tile = Math.round(Math.max(44, Math.min(68, W * 0.085)));

    const pts = W < 600 ? NARROW : WIDE;
    const halfX = Math.max(20, W / 2 - tile / 2 - 6);
    const halfY = Math.max(16, H / 2 - tile / 2 - 6);
    nodes.forEach((n, i) => {
      const p = pts[i % pts.length];
      n.baseRestX = p[0] * halfX;
      n.baseRestY = p[1] * halfY;
      n.restX = n.baseRestX;
      n.restY = n.baseRestY;
      if (phase !== 'entering') { n.x = n.restX; n.y = n.restY; }
    });
    sized = true;
  }

  function releasePointer() {
    pointer.active = false;
    trail = [];
    order = [];
    resetAt = null;
  }

  function toLocal(clientX, clientY) {
    const r = wrap.getBoundingClientRect();
    return { x: clientX - r.left - r.width / 2, y: clientY - r.top - r.height / 2 };
  }

  function setPointer(clientX, clientY) {
    const p = toLocal(clientX, clientY);
    // After a right-click reset, wait for real movement before grabbing the
    // cards again, so the jitter of the click itself doesn't undo the reset.
    if (resetAt) {
      if (Math.hypot(p.x - resetAt.x, p.y - resetAt.y) < REENGAGE_PX) return;
      resetAt = null;
    }
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.active = true;
  }

  canvas.addEventListener('mousemove', (e) => setPointer(e.clientX, e.clientY));
  canvas.addEventListener('mouseleave', releasePointer);
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length) setPointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  canvas.addEventListener('touchend', releasePointer);

  // Either mouse button sends every card home; moving the cursor picks them
  // up again. Right-click also swallows the browser context menu.
  function resetField(clientX, clientY) {
    releasePointer();
    resetAt = toLocal(clientX, clientY);
  }

  canvas.addEventListener('click', (e) => resetField(e.clientX, e.clientY));
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    resetField(e.clientX, e.clientY);
  });

  function step(now) {
    const dt = last ? now - last : 16;
    last = now;

    if (phase === 'entering') {
      let done = true;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const el = now - enterStart - i * ENTER_STAGGER;
        if (el < 0) { n.scale = 0; done = false; continue; }
        const t = Math.min(el / ENTER_MS, 1);
        if (t < 1) done = false;
        const e = easeOutBack(t);
        n.x = n.baseRestX * e;
        n.y = n.baseRestY * e;
        // pop past full size, then settle back to it
        n.scale = t < 0.5 ? lerp(0, 1.5, t * 2) : lerp(1.5, 1, (t - 0.5) * 2);
      }
      if (done) {
        phase = 'idle';
        nodes.forEach((n) => { n.x = n.baseRestX; n.y = n.baseRestY; n.scale = 1; n.vx = 0; n.vy = 0; });
      }
    } else if (phase === 'idle') {
      if (pointer.active) {
        trail.push({ x: pointer.x, y: pointer.y });
        if (trail.length > TRAIL_MAX) trail.shift();
        // Nearest card leads the tail, the rest queue up behind it.
        if (!order.length) {
          order = nodes
            .map((n, i) => ({ i: i, d: Math.hypot(n.x - pointer.x, n.y - pointer.y) }))
            .sort((a, b) => a.d - b.d)
            .map((o) => o.i);
        }
        for (let k = 0; k < order.length; k++) {
          const ti = trail.length - 1 - k * TRAIL_GAP;
          if (ti < 0) break;            // tail too short yet; the rest hold still
          const p = trail[ti];
          const n = nodes[order[k]];
          n.x = lerp(n.x, p.x, FOLLOW);
          n.y = lerp(n.y, p.y, FOLLOW);
          n.vx = 0; n.vy = 0;
        }
      } else {
        for (const n of nodes) {
          n.vx += (n.restX - n.x) * SPRING;
          n.vy += (n.restY - n.y) * SPRING;
          n.vx *= DAMP; n.vy *= DAMP;
          n.x += n.vx; n.y += n.vy;
        }
        driftAcc += dt;
        if (driftAcc > DRIFT_MS) {
          driftAcc = 0;
          for (const n of nodes) {
            n.restX = n.baseRestX + rand(-DRIFT_PX, DRIFT_PX);
            n.restY = n.baseRestY + rand(-DRIFT_PX, DRIFT_PX);
          }
        }
      }
    }

    draw();
    raf = requestAnimationFrame(step);
  }

  function draw() {
    if (!sized) return;          // never paint into a canvas of unknown size
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    ctx.translate(W / 2, H / 2);

    const brutal = document.documentElement.hasAttribute('data-brutal');
    const half = tile / 2;
    const icon = Math.round(tile * 0.62);

    for (const n of nodes) {
      if (n.scale <= 0) continue;
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.scale(n.scale, n.scale);

      if (brutal) {
        ctx.fillStyle = '#111215';
        ctx.beginPath();
        ctx.rect(-half + 4, -half + 4, tile, tile);
        ctx.fill();
      }

      ctx.fillStyle = brutal ? '#FFFFFF' : 'rgba(30, 32, 42, 0.92)';
      ctx.strokeStyle = brutal ? '#111215' : 'rgba(255, 219, 112, 0.35)';
      ctx.lineWidth = brutal ? 2.5 : 1.2;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-half, -half, tile, tile, brutal ? 0 : 12);
      else ctx.rect(-half, -half, tile, tile);
      ctx.fill();
      ctx.stroke();

      if (n.image && n.image.complete && n.image.naturalWidth) {
        ctx.drawImage(n.image, -icon / 2, -icon / 2, icon, icon);
      }

      ctx.restore();
    }
  }

  function start() {
    if (raf) return;
    last = 0;
    raf = requestAnimationFrame(step);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  function restAll() {
    nodes.forEach((n) => { n.x = n.restX; n.y = n.restY; n.scale = 1; });
  }

  layout();

  if (reduced) {
    // Honour reduced-motion: show the field at rest, no loop, no cursor follow.
    restAll();
    draw();
    new ResizeObserver(() => { layout(); restAll(); draw(); }).observe(wrap);
    return;
  }

  // Run the entrance once the section is both on screen and actually laid out.
  function maybeStart() {
    if (!visible || !sized) return;
    if (phase === 'wait') { phase = 'entering'; enterStart = performance.now(); }
    start();
  }

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) maybeStart();
    else { stop(); releasePointer(); }
  }, { threshold: 0.1 });
  io.observe(wrap);

  // Fires when the tab opens (0x0 -> real size) and on every later resize, so
  // this covers both the hidden-on-load case and window resizing.
  new ResizeObserver(() => {
    const wasSized = sized;
    layout();
    if (!sized) { stop(); return; }
    if (!wasSized) maybeStart();
    else if (!raf) draw();
  }).observe(wrap);
})();
