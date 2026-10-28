# TaskFlow — Task & Productivity Management System

> A full-featured, secure, and modern **MERN Stack** (MongoDB, Express.js, React, Node.js) web application designed for task tracking, workflow prioritization, and productivity analytics.

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%2B%20%7C%20v24-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Express Version](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-green.svg)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

---

## 📖 Table of Contents
1. [Project Overview & Objectives](#-project-overview--objectives)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Repository Structure](#-repository-structure)
5. [Prerequisites](#-prerequisites)
6. [Step-by-Step Installation & Setup](#-step-by-step-installation--setup)
7. [MongoDB Atlas Configuration Guide (Beginner Friendly)](#-mongodb-atlas-configuration-guide-beginner-friendly)
8. [Generating a Secure JWT Secret](#-generating-a-secure-jwt-secret)
9. [Running the Application](#-running-the-application)
10. [REST API Specifications](#-rest-api-specifications)
11. [Database Schema & Architecture](#-database-schema--architecture)
12. [Security & Authentication Model](#-security--authentication-model)
13. [Testing Instructions](#-testing-instructions)
14. [UI & Screenshots Overview](#-ui--screenshots-overview)
15. [Git & GitHub Commands Guide](#-git--github-commands-guide)
16. [Known Limitations & Future Roadmap](#-known-limitations--future-roadmap)

---

## 🎯 Project Overview & Objectives

**TaskFlow** was engineered to address modern productivity bottlenecks by providing a responsive, structured, and user-isolated workspace where individuals can manage tasks across complex projects. 

### Course Outcome Alignment
- **CO3 (Frontend Development)**: Built a responsive single-page application using React functional components, hooks (`useState`, `useEffect`, `useRef`, `useCallback`), React Router v6, Context API for global state management, and reusable modular UI components.
- **CO4 (Backend RESTful Services)**: Implemented an Express.js backend architected with separation of concerns (Routers, Controllers, Middleware, Validators, Mongoose Models), database aggregations, indexing, and centralized error handling.
- **CO5 (Full Stack Integration & Security)**: Seamlessly connected React to Express via Axios interceptors, implemented bcrypt password hashing, stateless JWT authentication, protected routes, and strict multi-tenant authorization barriers.

---

## ✨ Key Features

- **User Authentication**: Secure user registration and login with bcrypt password hashing and JWT token issuance.
- **Productivity Dashboard**: Real-time statistical metrics (Total, Completed, In-Progress, Pending, Overdue tasks) with a dynamic completion rate progress bar and priority breakdown.
- **Full Task CRUD**: Create, read, update, and delete tasks with instant UI updates and confirmation modals.
- **Dynamic Filtering & Search**: Instant client-side and server-side search across task titles, descriptions, and tags with filters for status, priority, and sorting.
- **User Profile Management**: Update full name, bio, avatar URL, and securely update password credentials.
- **Strict Data Isolation**: Multi-tenant database design where every task query and modification strictly enforces ownership verification (`user: req.user._id`).
- **Graceful UI States**: Robust handling of loading spinners, empty states with call-to-actions, field validation feedback, and dismissal alerts.

---

## 💻 Technology Stack

### Frontend (`client/`)
- **Library**: React 18
- **Tooling / Bundler**: Vite (lightning fast HMR and optimized production builds)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (configured with request and response interceptors)
- **Icons**: Lucide React
- **Styling**: Custom modern CSS design system with CSS custom properties, responsive grids, and clean typography

### Backend (`server/`)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Atlas Cloud or Local Community Server)
- **ODM**: Mongoose 8 (with schema validation, hooks, and compound indexes)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **CORS & Environment**: `cors` and `dotenv`
- **Testing**: Jest, Supertest, and `mongodb-memory-server`

---

## 📂 Repository Structure

```text
TaskFlow/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertMessage.jsx       # Alert notification banner
│   │   │   ├── EmptyState.jsx         # Clean empty state placeholder
│   │   │   ├── LoadingSpinner.jsx     # Animated loading indicator
│   │   │   ├── Modal.jsx              # Accessible modal dialog
│   │   │   ├── Navbar.jsx             # Top responsive navigation bar
│   │   │   ├── ProtectedRoute.jsx     # Route guard wrapper
│   │   │   ├── Sidebar.jsx            # Side drawer navigation
│   │   │   ├── StatCard.jsx           # Metric dashboard card
│   │   │   ├── TaskCard.jsx           # Individual task item card
│   │   │   └── TaskFilter.jsx         # Search and filter toolbar
│   │   ├── pages/
│   │   │   ├── AddTask.jsx            # Create task page
│   │   │   ├── AllTasks.jsx           # Task list with pagination
│   │   │   ├── Dashboard.jsx          # Analytics & metrics overview
│   │   │   ├── EditTask.jsx           # Edit existing task page
│   │   │   ├── Login.jsx              # User sign-in page
│   │   │   ├── NotFound.jsx           # 404 error page
│   │   │   ├── Register.jsx           # User sign-up page
│   │   │   └── UserProfile.jsx        # Account settings & password change
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global authentication context
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance with interceptors
│   │   │   ├── authService.js         # Auth API calls & token storage
│   │   │   └── taskService.js         # Task CRUD & stats API calls
│   │   ├── App.jsx                    # Root routes and layout
│   │   ├── main.jsx                   # Entry point mounting React DOM
│   │   └── index.css                  # Modern UI styles and variables
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── server/
│   ├── config/
│   │   └── db.js                      # MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js          # Register, login, getMe
│   │   ├── taskController.js          # Task CRUD, filters, aggregation stats
│   │   └── userController.js          # Profile updates & password change
│   ├── middleware/
│   │   ├── authMiddleware.js          # JWT verification & req.user attachment
│   │   └── errorMiddleware.js         # Centralized error and 404 handler
│   ├── models/
│   │   ├── Task.js                    # Task schema with compound indexes
│   │   └── User.js                    # User schema with bcrypt hooks
│   ├── routes/
│   │   ├── authRoutes.js              # Auth endpoints router
│   │   ├── taskRoutes.js              # Task endpoints router
│   │   └── userRoutes.js              # User endpoints router
│   ├── validators/
│   │   ├── authValidator.js           # Auth request sanitization
│   │   └── taskValidator.js           # Task request sanitization
│   ├── tests/
│   │   └── api.test.js                # Integration tests (Supertest + In-Memory DB)
│   ├── app.js                         # Express application setup & middleware
│   ├── server.js                      # Server startup & graceful shutdown
│   ├── package.json
│   └── .env.example
├── docs/
│   ├── API_DOCUMENTATION.md           # Full REST API request/response docs
│   └── DATABASE_SCHEMA.md             # ER diagrams and database schema
├── postman/
│   └── TaskFlow.postman_collection.json # Ready-to-import Postman collection
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

Before installing, ensure the following are installed on your machine:
- **Node.js**: `v18.0.0` or newer (Verify using `node -v`)
- **npm**: `v9.0.0` or newer (Verify using `npm -v`)
- **Git**: Installed for repository management (`git --version`)
- **MongoDB**: A free cloud database account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB service.

---

## 🚀 Step-by-Step Installation & Setup

### Step 1: Clone or Navigate to the Workspace
```bash
git clone <your-github-repo-url>
cd TaskFlow
```

### Step 2: Install Backend Dependencies
Open a terminal in the root directory and run:
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
Open a second terminal window (or navigate back to the root) and run:
```bash
cd client
npm install
```

---

## 🍃 MongoDB Atlas Configuration Guide (Beginner Friendly)

Follow these exact steps to configure a free cloud database on **MongoDB Atlas**:

### 1. Create a Free Account
1. Visit [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register).
2. Sign up with Google or enter your name, email, and password.

### 2. Create a Free Cluster (M0)
1. On the Atlas dashboard, click **"Create"** or **"Build a Database"**.
2. Select the **"M0 Free"** tier (Free forever, 512 MB storage).
3. Select any cloud provider (AWS / Google Cloud) and choose the region closest to you.
4. Name your cluster (e.g. `Cluster0`) and click **"Create Deployment"**.

### 3. Create a Database User
1. In the Quickstart prompt that appears (or under **Security > Database Access** in the left sidebar):
   - Choose **Username and Password** authentication.
   - Enter a **Username** (e.g., `taskflow_admin`).
   - Enter a **Password** (e.g., `SuperSecurePass2026!`) or click "Autogenerate Secure Password".
   - ⚠️ **Important**: Note down this password immediately. You will need it in your connection string.
   - Click **"Create Database User"**.

### 4. Configure Network Access (IP Whitelist)
1. In the left navigation menu, click **"Network Access"** (under Security).
2. Click **"Add IP Address"**.
3. Click the button **"Allow Access from Anywhere"** (this sets `0.0.0.0/0`).
4. Click **"Confirm"**. This allows your local computer to connect to Atlas without IP restriction issues.

### 5. Get Your Connection URI
1. Click on **"Database"** in the left navigation menu to view your cluster.
2. Click the **"Connect"** button next to your cluster.
3. Select **"Drivers"** under Connect to your application.
4. Driver: **Node.js**, Version: **5.5 or later**.
5. Copy the connection string displayed. It will look like this:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

### 6. Where to Enter Your Connection URI
1. Open the file `server/.env` (created from `server/.env.example`).
2. Replace `<username>` with your database user (e.g., `taskflow_admin`).
3. Replace `<password>` with your database password (e.g., `SuperSecurePass2026!`).
4. Append `/taskflow` right before the `?` to specify the database name:
   ```env
   MONGODB_URI=mongodb+srv://taskflow_admin:SuperSecurePass2026!@cluster0.xxxxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
   ```

---

## 🔑 Generating a Secure JWT Secret

Never use weak or default strings for production secrets. Generate a cryptographically secure 64-character hexadecimal key by running this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated output string and paste it into `server/.env`:
```env
JWT_SECRET=4f8b2d1c9a6e3f70821b...your_generated_hex_secret_here...
```

---

## ⚙️ Environment Variables Summary

### Server Environment (`server/.env`)
Create `server/.env` by copying `server/.env.example`:
```bash
cp server/.env.example server/.env
```
Fill in the following values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_generated_hex_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Client Environment (`client/.env`)
Create `client/.env` by copying `client/.env.example`:
```bash
cp client/.env.example client/.env
```
Ensure the API base URL points to your running backend:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### Running Backend Server
From the `server` directory:
```bash
cd server
npm run dev
```
- The backend will start on **http://localhost:5000**.
- Verify health check in your browser: `http://localhost:5000/api/health`.

### Running Frontend Client
In a separate terminal, from the `client` directory:
```bash
cd client
npm run dev
```
- Vite will launch the application on **http://localhost:5173**.
- Open your browser to `http://localhost:5173` to interact with TaskFlow.

---

## 🌐 REST API Specifications

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |
| `PUT` | `/api/users/profile` | Private | Update user details & optional password |
| `GET` | `/api/tasks` | Private | Get user tasks (search, filter, sort, paginate) |
| `POST` | `/api/tasks` | Private | Create a new task |
| `GET` | `/api/tasks/:id` | Private | Retrieve single task details |
| `PUT` | `/api/tasks/:id` | Private | Update an existing task |
| `DELETE`| `/api/tasks/:id` | Private | Delete a task |
| `GET` | `/api/tasks/stats` | Private | Aggregate dashboard statistics |
| `GET` | `/api/health` | Public | Server uptime and health verification |

*For complete request schemas, status codes, and JSON response bodies, see [docs/API_DOCUMENTATION.md](file:///c:/Users/smile/Downloads/Task%20and%20productivity%20system/docs/API_DOCUMENTATION.md).*

---

## 🗄️ Database Schema & Architecture

The database comprises two primary collections: `users` and `tasks`.

```text
+------------------------+             +------------------------+
|         users          |             |         tasks          |
+------------------------+             +------------------------+
| _id: ObjectId (PK)     | 1         * | _id: ObjectId (PK)     |
| name: String           |<------------| user: ObjectId (FK)    |
| email: String (Unique) |             | title: String          |
| password: String (Hash)|             | description: String    |
| bio: String            |             | status: Enum           |
| avatar: String         |             | priority: Enum         |
| createdAt: Date        |             | dueDate: Date          |
| updatedAt: Date        |             | tags: [String]         |
+------------------------+             | createdAt: Date        |
                                       | updatedAt: Date        |
                                       +------------------------+
```

### High-Performance Compound Indexing
- `{ user: 1, status: 1 }`
- `{ user: 1, priority: 1 }`
- `{ user: 1, dueDate: 1 }`
- `{ user: 1, createdAt: -1 }`

*For complete schema design, validations, and ER diagrams, see [docs/DATABASE_SCHEMA.md](file:///c:/Users/smile/Downloads/Task%20and%20productivity%20system/docs/DATABASE_SCHEMA.md).*

---

## 🔒 Security & Authentication Model

1. **Stateless JWT Authorization**: User credentials verify against the database during login, issuing a digitally signed JSON Web Token (HMAC SHA-256).
2. **Axios Interceptors**: The React client attaches the token (`Authorization: Bearer <token>`) automatically on all outbound requests and intercepts `401 Unauthorized` responses to clear expired sessions.
3. **Password Salting & Hashing**: Utilizes `bcryptjs` with 10 salt rounds before database persistence. Passwords are never returned in queries (`select: false`).
4. **Strict User Task Isolation**: All task queries explicitly require `user: req.user._id`. Attempts by User A to access, modify, or delete tasks belonging to User B are strictly rejected with `404 Not Found / Access Denied`.
5. **Secure Cookie Alternative**: For enterprise deployments requiring defense against XSS token interception, authentication can alternately be transmitted via `HttpOnly`, `SameSite=Strict`, `Secure` cookies with CSRF token protection.

---

## 🧪 Testing Instructions

The project includes an automated integration test suite written with **Jest**, **Supertest**, and **mongodb-memory-server**. Tests execute against an isolated in-memory database instance, requiring no live Atlas connection or manual seeding.

Run the test suite:
```bash
cd server
npm test
```

### Test Coverage Highlights
- ✅ User registration validation and duplicate email prevention
- ✅ User login with valid and invalid credentials
- ✅ Authentication token verification and profile retrieval
- ✅ Complete task CRUD lifecycle (Create, Read, Update, Delete)
- ✅ Search, filter, sorting, and pagination validation
- ✅ MongoDB aggregation pipeline calculations (`/api/tasks/stats`)
- ✅ Cross-user security access control (guaranteeing User B cannot view or mutate User A's data)

### Testing with Postman
1. Open Postman.
2. Click **Import** and select `postman/TaskFlow.postman_collection.json`.
3. Run the requests sequentially. The collection includes test scripts that automatically capture and persist the `jwt_token` and `task_id` collection variables.

---

## 🖼️ UI & Screenshots Overview

| Screen | Description |
| :--- | :--- |
| **Login / Register** | Clean, accessible authentication form with email and password validation. |
| **Dashboard** | Productivity cards (Total, In-Progress, Completed, Overdue), completion progress bar, and priority breakdown. |
| **All Tasks** | Searchable task grid with filter dropdowns for status and priority, responsive cards, and pagination. |
| **Add / Edit Task** | Form with title character counter, due date picker, priority tag selector, and comma-delimited tags. |
| **User Profile** | User avatar preview, registration timestamp, bio editor, and secure password updating. |

---

## 🐙 Git & GitHub Commands Guide

To initialize your Git repository, commit all project files, and push to GitHub, run the following exact commands in your project root:

```bash
# 1. Initialize local Git repository
git init

# 2. Add all project files (ignoring files specified in .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: complete initial implementation of TaskFlow MERN system"

# 4. Rename default branch to main
git branch -M main

# 5. Link to your GitHub remote repository (replace with your actual GitHub repository URL)
git remote add origin https://github.com/<your-username>/TaskFlow.git

# 6. Push changes to GitHub
git push -u origin main
```

---

## 📌 Known Limitations & Future Roadmap

- **Task Attachments**: Uploading file attachments directly to Amazon S3 or Cloudinary.
- **Team Collaboration**: Shared workspaces with multiple contributors assigned to a single task.
- **WebSocket Notifications**: Real-time push updates via Socket.io when tasks approach deadlines.
- **Dark Mode**: Configurable system/dark/light theme toggle.

---

## 👨‍💻 Author & Academic Submission

- **Project**: TaskFlow — Task & Productivity Management System
- **Stack**: React (CO3), Node/Express (CO4), MongoDB/Security (CO5)
- **Status**: Production-Ready / Fully Verified
