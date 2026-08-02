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

PROJECTS (all on GitHub at github.com/Ashrokss unless noted)
GenAI:
- AI Agents
- Google Calendar Assistant
- Vision Voice Agent
- CrewAI Research Blogger

Cloud:
- Azure VNet Peering PoC (Terraform)
- ADF with SHIR (Azure Data Factory with Self-Hosted Integration Runtime)
- GitLab CI/CD Setup using Git Runner (write-up is a shared Google Doc, not
  a repo)
- Atlantis Setup in GitLab (write-up is a shared Google Doc, not a repo)
- Infra Automation with Terraform and Ansible

Machine Learning:
- Fake Review Detection System
- Bank Churn Analysis
- Loan Eligibility Prediction (web app)
- Salary Prediction (web app)
- YouTube Sentiment Analysis

Power BI:
- HR Analytics Dashboard
- Amazon Prime Video Analysis

Excel:
- Finance Store Analysis

SQL:
- Pizza Sales Analysis using MySQL

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
