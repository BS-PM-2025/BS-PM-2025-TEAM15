﻿# BS-PM-2025-TEAM15

#  Askii – Smart Academic Request Management System

## 🧭 Executive Summary / Product Vision

**Askii** is a smart, web-based application designed to streamline the management of student requests in academic institutions. Built with transparency and efficiency in mind, Askii replaces fragmented communication systems like emails and paper forms with a centralized platform. The result is reduced response times, improved satisfaction, and streamlined administrative workflows.

---

## 💡 Why Askii?

###  The Problem

Academic institutions often rely on outdated systems—email chains, handwritten notes, or separate portals—resulting in:
- Lost or overlooked requests
- Long processing delays
- Lack of transparency for students

### The Solution

Askii introduces:
- A **student-first** platform with real-time tracking and status updates
- A **centralized dashboard** for staff to manage requests
- **Categorized requests** (academic, financial, medical, etc.)
- **Automated alerts**, **document uploads**, **PDF generation**, and **group request handling**

---

## 👥 Target Users

- **Primary:** making the system more efficient and fast for all users.
- **Secondary:** Students submitting academic and personal requests.
- **Third:** Lecturers and administrative staff managing and responding to those requests.

---

## 🛠️ Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | [React](https://reactjs.org/) |
| Backend     | [Django](https://www.djangoproject.com/) |
| Database    | [MongoDB](https://www.mongodb.com/) |
| CI/CD       | [Jenkins](https://www.jenkins.io/) |
| Version Control | [GitHub](https://github.com/) |
| Agile Management | [Jira Software](https://www.atlassian.com/software/jira) |

---

## 🚀 Features

- 📋 Submit and categorize requests
- 📦 Group requests (e.g., entire class)
- 🧾 PDF approval generation
- 🔔 Automated email/notification alerts
- 📂 File/document upload
- 📊 Admin dashboard with filters and reporting
- 🔄 Real-time request tracking and status updates

---

##  Installation

### Backend (Django)

```bash
cd server
pip install -r requirements.txt (Please Note the Python and React requirements are in requirements.txt )
python manage.py migrate
python manage.py runserver
```

### Frontend (React)

```bash
cd React/my-app
npm install --legacy-peer-deps
npm start
```

Ensure MongoDB is running locally or configured via Atlas.

---

## 🔄 CI/CD Pipeline

- **Jenkins** automates:
  - Code build
  - Backend testing
  - Deployment on staging/production
- **GitHub** triggers Jenkins jobs via webhooks

---

## 📅 Agile Process

- Scrum methodology
- Sprint planning via **Jira**
- Tasks and stories mapped to GitHub issues
- Continuous delivery using Jenkins

---

## 📁 Project Structure

```
Askii/
├── client/               # React frontend
│   └── src/
├── server/               # Django backend
│   └── api/
├── jenkins/              # CI/CD jobs
├── .github/              # GitHub workflows
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `feature/my-feature`
3. Commit changes and push: `git push origin feature/my-feature`
4. Open a Pull Request

---

## 👨‍💻 Authors

- Felix Khmelnitsky – Full-stack Developer.
- Yana Zlatin - Full-stack Developer.
- Rotem Bahalker - Full-stack Developer.
- Shir Cohen - Full-stack Developer.
---


