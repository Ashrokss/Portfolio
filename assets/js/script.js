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
  const escaped = askEscapeHtml(raw);
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Only http(s) links — the escape above already neutralized quotes, so
  // these captured groups can't break out of the href attribute they land in.
  const withLinks = withBold.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return withLinks
    .split(/\n{2,}/)
    .map(function (block) {
      const lines = block.split("\n").filter(function (l) { return l.trim() !== ""; });
      const isList = lines.length > 0 && lines.every(function (l) { return /^[-*]\s+/.test(l.trim()); });

      if (isList) {
        const items = lines.map(function (l) {
          return "<li>" + l.trim().replace(/^[-*]\s+/, "") + "</li>";
        }).join("");
        return "<ul>" + items + "</ul>";
      }

      const cleanText = lines
        .map(function (l) { return l.trim(); })
        .join(" ")
        .replace(/\s+([.,!?;:])/g, "$1")
        .trim();

      return "<p>" + cleanText + "</p>";
    })
    .join("");
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
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: askHistory }),
    });

    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Something went wrong.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

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
  #INTERACTIVE SKILLS CANVAS PHYSICS
\*-----------------------------------*/
(function initSkillsCanvas() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const container = canvas.parentElement;
  let width, height;

  function resizeCanvas() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    width = canvas.width = rect.width || 700;
    height = canvas.height = rect.height || 280;
  }
  resizeCanvas();

  const skillsData = [
    { name: 'Azure', percent: '80%', color: '#0089D6' },
    { name: 'Terraform', percent: '75%', color: '#7B42BC' },
    { name: 'Git', percent: '85%', color: '#F05032' },
    { name: 'Linux', percent: '80%', color: '#FCC624' },
    { name: 'SQL', percent: '80%', color: '#4479A1' },
    { name: 'Python', percent: '70%', color: '#3776AB' },
    { name: 'Machine Learning', percent: '90%', color: '#FF6F61' },
    { name: 'Docker', percent: '85%', color: '#2496ED' },
    { name: 'AWS', percent: '80%', color: '#FF9900' },
    { name: 'CI/CD', percent: '90%', color: '#00C853' },
    { name: 'Power BI', percent: '85%', color: '#F2C811' },
    { name: 'GenAI', percent: '85%', color: '#A855F7' }
  ];

  const nodes = skillsData.map((skill, index) => {
    const angle = (index / skillsData.length) * Math.PI * 2;
    const radiusX = (width * 0.35);
    const radiusY = (height * 0.3);
    const restX = width / 2 + Math.cos(angle) * radiusX;
    const restY = height / 2 + Math.sin(angle) * radiusY;

    return {
      name: skill.name,
      percent: skill.percent,
      color: skill.color,
      x: restX,
      y: restY,
      baseX: restX,
      baseY: restY,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      phase: Math.random() * Math.PI * 2
    };
  });

  let mouse = { x: -1000, y: -1000, active: false };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.active = true;
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.active = false;
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    nodes.forEach((node, index) => {
      const angle = (index / skillsData.length) * Math.PI * 2;
      node.baseX = width / 2 + Math.cos(angle) * (width * 0.35);
      node.baseY = height / 2 + Math.sin(angle) * (height * 0.3);
    });
  });

  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    time += 0.015;

    const isBrutal = document.documentElement.hasAttribute('data-brutal');

    nodes.forEach((node) => {
      // Ambient floating motion
      const floatX = Math.sin(time + node.phase) * 0.5;
      const floatY = Math.cos(time * 0.9 + node.phase) * 0.5;
      node.baseX += floatX * 0.1;
      node.baseY += floatY * 0.1;

      // Mouse interactive physics (repulsion force)
      if (mouse.active) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;

        if (dist < maxDist && dist > 0) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          node.vx += Math.cos(angle) * force * 1.6;
          node.vy += Math.sin(angle) * force * 1.6;
        }
      }

      // Spring return to base position
      const dxBase = node.baseX - node.x;
      const dyBase = node.baseY - node.y;
      node.vx += dxBase * 0.025;
      node.vy += dyBase * 0.025;

      // Velocity damping
      node.vx *= 0.86;
      node.vy *= 0.86;

      node.x += node.vx;
      node.y += node.vy;

      // Draw floating skill badge
      ctx.save();
      ctx.translate(node.x, node.y);

      const cardW = 125;
      const cardH = 38;
      const rx = -cardW / 2;
      const ry = -cardH / 2;

      // Draw Hard shadow if in brutal mode
      if (isBrutal) {
        ctx.fillStyle = '#111215';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(rx + 4, ry + 4, cardW, cardH, 0);
        else ctx.rect(rx + 4, ry + 4, cardW, cardH);
        ctx.fill();
      }

      // Card Body
      ctx.fillStyle = isBrutal ? '#FFFFFF' : 'rgba(30, 32, 42, 0.92)';
      ctx.strokeStyle = isBrutal ? '#111215' : 'rgba(255, 219, 112, 0.35)';
      ctx.lineWidth = isBrutal ? 2.5 : 1.2;

      ctx.beginPath();
      const cornerRadius = isBrutal ? 0 : 10;
      if (ctx.roundRect) ctx.roundRect(rx, ry, cardW, cardH, cornerRadius);
      else ctx.rect(rx, ry, cardW, cardH);
      ctx.fill();
      ctx.stroke();

      // Category color dot / accent
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(rx + 16, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      // Skill Title
      ctx.fillStyle = isBrutal ? '#111215' : '#FFFFFF';
      ctx.font = isBrutal ? '800 12px "Space Grotesk", sans-serif' : '600 12px "Poppins", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, rx + 26, 0);

      // Percentage Tag
      const badgeW = 28;
      const badgeH = 18;
      const badgeX = rx + cardW - badgeW - 6;
      const badgeY = -badgeH / 2;

      ctx.fillStyle = isBrutal ? '#FACC15' : '#FFDB70';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(badgeX, badgeY, badgeW, badgeH, isBrutal ? 0 : 4);
      else ctx.rect(badgeX, badgeY, badgeW, badgeH);
      ctx.fill();

      if (isBrutal) {
        ctx.strokeStyle = '#111215';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.fillStyle = '#111215';
      ctx.font = '800 9px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.percent, badgeX + badgeW / 2, 0);

      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
})();