# TaskFlow — REST API Documentation

This document provides complete technical specifications for all backend endpoints in the **TaskFlow** Task & Productivity Management System.

---

## Base URL
- **Local Development**: `http://localhost:5000/api`
- **Authentication**: JWT Bearer Token passed via HTTP Header:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```

---

## Standard Response Envelopes

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human-readable error explanation",
  "errors": ["Specific validation error item"]
}
```

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Access**: Public
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "Password123!"
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Account registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "670f1a9b2c3d4e5f6a7b8c9d",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "bio": "",
    "avatar": "",
    "createdAt": "2026-10-29T00:00:00.000Z",
    "updatedAt": "2026-10-29T00:00:00.000Z"
  }
}
```

#### Error Responses
- `400 Bad Request`: Email already registered or invalid fields.

---

### 1.2 Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Access**: Public
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "email": "alex@example.com",
  "password": "Password123!"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "670f1a9b2c3d4e5f6a7b8c9d",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "bio": "",
    "avatar": ""
  }
}
```

#### Error Responses
- `401 Unauthorized`: Invalid email or password.

---

### 1.3 Get Current User
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Access**: Private (Requires Bearer Token)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "user": {
    "_id": "670f1a9b2c3d4e5f6a7b8c9d",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "bio": "Software engineer and student",
    "avatar": "",
    "createdAt": "2026-10-29T00:00:00.000Z"
  }
}
```

---

## 2. User Profile Endpoints

### 2.1 Update User Profile
- **Method**: `PUT`
- **Path**: `/api/users/profile`
- **Access**: Private (Requires Bearer Token)

#### Request Body (All fields optional)
```json
{
  "name": "Alex M. Johnson",
  "bio": "Full-stack developer building MERN applications",
  "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  "currentPassword": "Password123!",
  "newPassword": "NewSecurePassword456!"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "670f1a9b2c3d4e5f6a7b8c9d",
    "name": "Alex M. Johnson",
    "email": "alex@example.com",
    "bio": "Full-stack developer building MERN applications",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  }
}
```

---

## 3. Task Management Endpoints

### 3.1 Get All Tasks (Filtered, Sorted, Paginated)
- **Method**: `GET`
- **Path**: `/api/tasks`
- **Access**: Private (Strictly returns authenticated user's tasks)

#### Query Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search` | String | `""` | Matches title, description, or tags (case-insensitive) |
| `status` | String | `all` | Filter by: `all`, `pending`, `in-progress`, `completed` |
| `priority` | String | `all` | Filter by: `all`, `low`, `medium`, `high` |
| `sortBy` | String | `createdAt` | Sort by: `createdAt`, `dueDate`, `priority`, `title` |
| `order` | String | `desc` | Sort order: `asc` or `desc` |
| `page` | Number | `1` | Page number |
| `limit` | Number | `10` | Tasks per page |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 2,
  "total": 15,
  "page": 1,
  "totalPages": 2,
  "tasks": [
    {
      "_id": "670f2b1a3d4e5f6a7b8c9d01",
      "title": "Complete MERN Project Milestone",
      "description": "Finalize implementation and test cases",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-11-05T18:00:00.000Z",
      "tags": ["college", "mern"],
      "user": "670f1a9b2c3d4e5f6a7b8c9d",
      "createdAt": "2026-10-29T00:30:00.000Z",
      "updatedAt": "2026-10-29T01:15:00.000Z"
    }
  ]
}
```

---

### 3.2 Create New Task
- **Method**: `POST`
- **Path**: `/api/tasks`
- **Access**: Private

#### Request Body
```json
{
  "title": "Prepare Presentation Slides",
  "description": "Build PowerPoint presentation for system architecture",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2026-11-10T12:00:00.000Z",
  "tags": ["presentation", "slides"]
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "670f2b1a3d4e5f6a7b8c9d02",
    "title": "Prepare Presentation Slides",
    "description": "Build PowerPoint presentation for system architecture",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2026-11-10T12:00:00.000Z",
    "tags": ["presentation", "slides"],
    "user": "670f1a9b2c3d4e5f6a7b8c9d",
    "createdAt": "2026-10-29T01:20:00.000Z"
  }
}
```

---

### 3.3 Get Task by ID
- **Method**: `GET`
- **Path**: `/api/tasks/:id`
- **Access**: Private (Enforces user ownership)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "task": {
    "_id": "670f2b1a3d4e5f6a7b8c9d02",
    "title": "Prepare Presentation Slides",
    "status": "pending",
    "priority": "medium"
  }
}
```

#### Error Responses
- `404 Not Found`: Task does not exist or belongs to another user.

---

### 3.4 Update Task
- **Method**: `PUT`
- **Path**: `/api/tasks/:id`
- **Access**: Private (Enforces user ownership)

#### Request Body (Any field can be updated)
```json
{
  "status": "completed"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {
    "_id": "670f2b1a3d4e5f6a7b8c9d02",
    "status": "completed",
    "updatedAt": "2026-10-29T02:00:00.000Z"
  }
}
```

---

### 3.5 Delete Task
- **Method**: `DELETE`
- **Path**: `/api/tasks/:id`
- **Access**: Private (Enforces user ownership)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### 3.6 Get Dashboard Statistics (Aggregation)
- **Method**: `GET`
- **Path**: `/api/tasks/stats`
- **Access**: Private

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "stats": {
    "totalTasks": 12,
    "completedTasks": 8,
    "pendingTasks": 2,
    "inProgressTasks": 2,
    "overdueTasks": 1,
    "completionRate": 67,
    "priorityBreakdown": {
      "low": 3,
      "medium": 6,
      "high": 3
    },
    "recentActivity": [
      {
        "_id": "670f2b1a3d4e5f6a7b8c9d02",
        "title": "Prepare Presentation Slides",
        "status": "completed",
        "priority": "medium",
        "updatedAt": "2026-10-29T02:00:00.000Z"
      }
    ]
  }
}
```

---

## 4. System Health Check
- **Method**: `GET`
- **Path**: `/api/health`
- **Access**: Public
- **Success Response (`200 OK`)**:
  ```json
  {
    "status": "ok",
    "uptime": 124.5,
    "timestamp": "2026-10-29T01:30:00.000Z",
    "service": "TaskFlow API Server"
  }
  ```
