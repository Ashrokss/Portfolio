// Everything the "Ask about me" assistant is allowed to know about Ashish.
// Plain prose on purpose — it goes straight into the model's system prompt
// whole, every request. No RAG, no chunking: this is ~2-3k tokens.
//
// Sourced from index.html. Keep this in sync if the site content changes.

module.exports = `
IDENTITY
Ashish Pal. Cloud & DevOps Engineer. Based in Jaipur, Rajasthan, India. Born
January 21, 2002. Email: ashish200221@gmail.com. GitHub: github.com/Ashrokss.
LinkedIn: linkedin.com/in/ashish-pal-b959b1254.

ABOUT
Cloud and DevOps engineer with strong roots in data science and automation.
Passionate about building scalable infrastructure and leveraging data to
drive impactful insights. Has worked on projects spanning Cloud Computing,
DevOps, Data Science, and Machine Learning.

WHAT HE DOES
- CI/CD Pipelines: setting up robust CI/CD workflows and self-hosted runners
  for application and infrastructure deployment.
- Terraform / Infrastructure as Code: provisioning and managing scalable,
  multi-subscription cloud environments.
- Mobile video editing with CapCut (transitions, effects, audio sync) and
  smartphone photography — personal creative interests, not professional work.

EXPERIENCE
- Xebia — Junior Consultant, 2025 to Present.
- Xebia — Apprentice, 2024 to 2025.
- Accenture North America Data Analytics and Visualization Job Simulation,
  June 2024 — cleaned, modeled and analyzed 7 datasets to uncover insights
  into content trends to inform strategic decisions.

EDUCATION
- Birla Institute of Technology, Mesra (Jaipur Campus) — MCA (Masters in
  Computer Applications), 2023-2025, CGPA 9.00.
- Manipal University Jaipur — BCA (Bachelors in Computer Applications),
  2020-2023, CGPA 9.43.
- Tilak Public School, Jaipur — 12th grade, completed 2020, 76%.
- Aditya Birla Vani Bharti, West Bengal — 10th grade, completed 2018, 78%.

SKILLS
Cloud & DevOps: Azure, Terraform, Git, Linux.
Data Science: SQL, Python, Machine Learning.

PROJECTS
Whenever you mention a project below, write it as a markdown link using
the exact URL given — e.g. [AI Agents](https://github.com/Ashrokss/AI-Agents)
— so it renders as a clickable link in the chat. Never invent a URL for a
project that has none listed (the two Google Doc write-ups below).

GenAI / AI Agents:
- [AI Agents](https://github.com/Ashrokss/AI-Agents) — collection of real-world
  agentic application demos.
- [Google Calendar Assistant](https://github.com/Ashrokss/Google-Calendar-Assistant)
  — AI assistant for viewing and booking events on Google Calendar.
- [Vision Voice Agent](https://github.com/Ashrokss/Vision-Voice-Agent) — sees,
  hears and responds in real time using Stream's edge network and Gemini.
- [CrewAI Research Blogger](https://github.com/Ashrokss/Crewai-Research-Blogger)
  — multi-agent crew (CrewAI + Gemini) that automates research and blog writing.
- [Deep Research Agent](https://github.com/Ashrokss/Deep-Research-Agent) —
  "ResearchGPT," a multi-agent deep-research assistant using Azure OpenAI,
  DuckDuckGo search, and the Agno framework, producing reports with citations.
- [SQL Agent](https://github.com/Ashrokss/SQL-Agent) — natural-language-to-SQL
  agent over a MySQL database, built with Agno, Azure OpenAI and Streamlit.
- [Recruitment Agent Team](https://github.com/Ashrokss/Recruitment-Agent-Team)
  — multi-agent resume screener that scores candidates against a job
  description and can email candidates, built on the Agno framework.
- [QA Automation (Browser-Use)](https://github.com/Ashrokss/QA-Automation-Browser-Use)
  — multi-agent app that generates functional requirement docs from a GitHub
  repo, writes test plans/cases, and executes them in a real browser via an
  LLM-driven browser agent.
- [Gemini Tutor](https://github.com/Ashrokss/Gemini-Tutor) — multimodal
  educational assistant powered by Gemini, adjustable by education level,
  with real-time search grounding and citations.
- [Finance Agent](https://github.com/Ashrokss/Finance-Agent) — AI market-research
  team (web-search agent + Yahoo Finance agent + editor agent) built on Agno
  and Azure OpenAI (GPT-4o-mini).
- [Custom MCP with Agno](https://github.com/Ashrokss/Custom-Mcp-with-Agno) —
  demonstrates building a custom MCP server with an Agno agent as the client.
- [Invoice Parser](https://github.com/Ashrokss/Invoice-Parser) — extracts
  structured data from invoice PDFs/images via the Gemini API into
  JSON/CSV/Excel, with a Streamlit UI.
- [Agentic Doc Extractor](https://github.com/Ashrokss/Agentic-Doc-Extractor) —
  explored an agentic document-extraction API for pulling structured data out
  of unstructured PDFs and images.

Cloud & DevOps:
- [AKS Terraform GitOps](https://github.com/Ashrokss/AKS-Terraform-GitOps) —
  multi-environment (dev/test/prod) Azure Kubernetes Service infrastructure
  provisioned with modular Terraform, deployed via ArgoCD GitOps, secrets
  from Azure Key Vault via the CSI driver, running a 3-tier app
  (React + Node.js + PostgreSQL).
- [AzOps](https://github.com/Ashrokss/AzOps) — a terminal-native TUI for
  managing Azure infrastructure without leaving the terminal.
- [Terraform Ansible Lab](https://github.com/Ashrokss/Terraform-Ansible-Lab)
  — end-to-end Azure infrastructure automation: Terraform for provisioning,
  Ansible for Docker and NGINX configuration.
- [Terraform Learning](https://github.com/Ashrokss/Terraform-Learning) —
  Terraform labs and practical Azure examples, including an
  [Azure VNet Peering PoC](https://github.com/Ashrokss/Terraform-Learning/tree/main/vnet-peering)
  and [ADF with SHIR](https://github.com/Ashrokss/Terraform-Learning/tree/main/ADF-with-SHIR)
  (Azure Data Factory with a Self-Hosted Integration Runtime).
- "GitLab CI/CD Setup using Git Runner" and "Atlantis Setup in GitLab" —
  these are write-ups shared as Google Docs, not GitHub repos, so there is
  no link to give for them.

Machine Learning:
- [Fake Review Detection System](https://github.com/Ashrokss/Fake-Review-Detection-System)
  — classifies genuine vs. computer-generated reviews.
- [Bank Churn Analysis](https://github.com/Ashrokss/Bank-Churn-Analysis) —
  predicts customer churn and surfaces retention insights.
- [Loan Eligibility Prediction](https://github.com/Ashrokss/Loan_Eligibilty_Prediction-Web-App)
  — web app predicting loan eligibility.
- [Salary Prediction](https://github.com/Ashrokss/Salary-Prediction-Web-App) —
  predicts salary from education, experience and gender via linear regression.
- [YouTube Sentiment Analysis](https://github.com/Ashrokss/Youtube_Sentiment_Analysis)
  — sentiment analysis over YouTube data.
- [Sentiment App](https://github.com/Ashrokss/Sentiment-App) — sentiment
  analysis web app using TextBlob and Gradio (the subject of the Medium post
  below).
- [Python Meme Reactor](https://github.com/Ashrokss/Python-Meme-Reactor) —
  MediaPipe + OpenCV project that detects when your tongue is out and reacts
  with memes/emoji — a fun personal build, not professional work.

Analytics / BI:
- [HR Analytics Dashboard](https://github.com/Ashrokss/HR-Analytics-Dashboard-Using-Power-BI)
- [Amazon Prime Video Analysis](https://github.com/Ashrokss/Amazon-Prime-Video-Dashboard-Using-Power-Bi)
- [Healthcare Dashboard](https://github.com/Ashrokss/Healthcare-Dashboard) —
  Apollo Hospital dashboard built in Power BI.
- [Finance Store Analysis](https://github.com/Ashrokss/Excel--Project) —
  interactive Excel dashboard on retail store data.
- [Pizza Sales Analysis](https://github.com/Ashrokss/Pizza_Sales--SQL) — MySQL
  queries ranging from basic to advanced.

Note: a couple of in-progress private "CloudOps" repos exist but aren't
ready to discuss publicly yet — if asked about them, say they're a current
work-in-progress you can't share details on yet.

WRITING
- "Build a Sentiment Analysis Web App Using Python and Gradio" — Medium,
  Aug 19, 2024.
- "Predict Salaries with Machine Learning" — used linear regression to
  predict salaries. Medium.

--- TODO(ashish): fill these in. Anything left blank here means the
assistant will say "I don't have that detail, email me" rather than guess.
- Day-to-day at Xebia: what do you actually build? which clients/domains?
- Deepest project story: the problem, what you chose, what broke, what
  you'd redo.
- Certifications (AZ-104? AZ-400? Terraform Associate?) and dates.
- What you're looking for next — role, stack, location, remote?
- Availability and preferred contact route.
`;
