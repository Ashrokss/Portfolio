'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



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



// ask AI variables
const askOpenBtn = document.querySelector("[data-ask-open]");
const askPanel = document.querySelector("[data-ask-panel]");
const askCloseBtn = document.querySelector("[data-ask-close]");
const askThread = document.querySelector("[data-ask-thread]");
const askForm = document.querySelector("[data-ask-form]");
const askInput = document.querySelector("[data-ask-input]");
const askSendBtn = document.querySelector("[data-ask-send]");
const askChips = document.querySelectorAll("[data-ask-chip]");

let askHistory = [];

// open / close panel
askOpenBtn.addEventListener("click", function () {
  elementToggleFunc(askPanel);
  if (askPanel.classList.contains("active")) askInput.focus();
});
askCloseBtn.addEventListener("click", function () { elementToggleFunc(askPanel); });

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
  msg.textContent = text;
  askThread.appendChild(msg);
  askThread.scrollTop = askThread.scrollHeight;
  return msg;
};

// minimal, safe markdown -> HTML: escape first, then only add back the
// handful of tags the system prompt is told to use (bold, paragraphs, lists)
const askEscapeHtml = function (str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const askFormatMarkdown = function (raw) {
  const withBold = askEscapeHtml(raw).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  return withBold
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

      return "<p>" + block.trim().replace(/\n/g, "<br>") + "</p>";
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
  assistantMsg.innerHTML = '<span class="ask-thinking"><span></span><span></span><span></span></span>';
  askThread.appendChild(assistantMsg);
  askThread.scrollTop = askThread.scrollHeight;

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
            assistantMsg.innerHTML = askFormatMarkdown(fullText);
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
    assistantMsg.textContent = err.message || "Something went wrong. Try again shortly.";
    askHistory.pop(); // drop the failed turn so a retry isn't poisoned
  } finally {
    askSendBtn.removeAttribute("disabled");
  }
});