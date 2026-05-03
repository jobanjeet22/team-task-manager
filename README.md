# 🚀 TaskFlow — Team Task Manager

A full-stack team task management web app built with React, Node.js, Express, and MongoDB.

## ✨ Features

- **Authentication** — Signup, Login with JWT tokens
- **Role-Based Access** — Admin vs Member roles (project & global)
- **Project Management** — Create, update, delete projects with team members
- **Task Tracking** — Create tasks, assign to members, set priority & due dates
- **Dashboard** — Stats overview, overdue alerts, recent activity
- **My Tasks** — Personal task view with status filters

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| HTTP | Axios |

## 📁 Project Structure

```
team-task-manager/
├── backend/          # Express REST API
│   ├── config/       # DB connection
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth + role checks
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js     # Entry point
│
└── frontend/         # React SPA
    └── src/
        ├── api/      # Axios instance
        ├── components/
        ├── context/  # Auth context
        ├── pages/    # Route pages
        └── utils/    # Helpers
```

## 🚦 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/teamtaskmanager
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: **http://localhost:5173**

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| POST | /api/projects/:id/members | Add member |
| DELETE | /api/projects/:id/members/:userId | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks | Create task |
| GET | /api/tasks/project/:projectId | Get project tasks |
| GET | /api/tasks/my | Get my tasks |
| GET | /api/tasks/dashboard | Dashboard stats |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all (Admin only) |
| GET | /api/users/search?email= | Search users |
| PUT | /api/users/profile | Update profile |

## 🔐 Role-Based Access

- **Global Admin** → Can access all users list
- **Project Owner** → Can add/remove members, delete project
- **Project Admin** → Admin-level access within project
- **Project Member** → Can create/update tasks within project

## 🌐 Deploy

### Backend → Railway / Render
1. Push to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy!

### Frontend → Vercel / Netlify
1. Push to GitHub
2. Connect to Vercel
3. Set `VITE_API_URL` if needed
4. Deploy!
