# Sarvesh P. D. 
## MERN Portfolio and Blogging Platform

A **full-stack, production-ready portfolio and content management system** built using the **MERN stack**.
This platform is designed to showcase projects, certifications, and blogs — with a **secure admin dashboard** for complete control.

> This is not a static portfolio.
> It is a **custom CMS-backed web platform** built from scratch.


## ✨ Features

### 🌐 Public Website

* Projects showcase (ordered by importance)
* Certifications with credential verification links
* Blogs system

  * Search & tag filtering
  * Markdown-based content
  * Clean card-based layout
* Smooth animations & responsive UI

### 🔐 Admin Dashboard

* Secure **JWT-based authentication**
* Fully protected routes (frontend & backend)
* Central dashboard with live statistics
* Full **CRUD** management for:

  * Blogs (draft & published)
  * Projects
  * Certifications

### 📝 Blog Editor (CMS)

* Markdown editor
* Auto-generated **Blog ID**
* Draft / Publish workflow
* Importance-based ordering
* Editable publish date
* Tag system
* Optional cover images

### 🧠 Smart Data Handling

* Blogs ordered by **importance → date**
* Public APIs return **published content only**
* Admin APIs return **drafts + published**
* Server-side authorization middleware
* Clean separation between public & admin APIs


## 🛠 Tech Stack

### Frontend

* React
* Vite
* React Router
* Custom CSS (no UI frameworks)

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

### Tooling

* Git & GitHub
* REST APIs
* Environment-based configuration


## 📂 Project Structure

```
mern-portfolio/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── styles/
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── index.js
│   └── package.json
│
├── .gitignore
├── SECURITY.md
└── README.md
```


## 🔐 Security Overview

* JWT-based authentication
* Protected frontend routes
* Protected backend routes using middleware
* Tokens stored securely in `localStorage`
* Admin-only APIs isolated under `/api/admin/*`
* Environment variables for sensitive credentials


## ⚙️ Environment Setup

Create a `.env` file inside the `server` directory.

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=4000
```


## ▶️ Running the Project Locally

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

* Client: `http://localhost:5173`
* Server: `http://localhost:4000`



## 📌 Why This Project Stands Out

* ✅ Not a template
* ✅ Not a static portfolio
* ✅ Real authentication & authorization
* ✅ Real CMS logic
* ✅ Clean API design
* ✅ Recruiter-friendly codebase

This project demonstrates:

* Full-stack engineering
* Secure system design
* UI/UX thinking
* Real-world architecture decisions



## 🚧 Planned Improvements

* Autosave drafts
* Rich markdown toolbar
* SEO-friendly blog slugs (`/blogs/my-awesome-post`)
* Image uploads via cloud storage
* Role-based admin access
* Production deployment (Vercel + Render)



## 👨‍💻 Author

**Sarvesh Dabholkar**
Computer Engineering Student | Developer