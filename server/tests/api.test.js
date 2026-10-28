const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Task = require('../models/Task');

let mongoServer;
let user1Token;
let user1Id;
let user2Token;
let user2Id;
let user1TaskId;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_jwt_secret_super_secure_key_123456';
  process.env.NODE_ENV = 'test';

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  // Clear database before each test suite setup
});

describe('=== TaskFlow API Test Suite ===', () => {
  describe('1. Health Check Endpoint', () => {
    it('GET /api/health should return 200 OK with status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('TaskFlow API Server');
    });
  });

  describe('2. Authentication Endpoints', () => {
    it('POST /api/auth/register should register User 1 successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice Johnson',
          email: 'alice@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.name).toBe('Alice Johnson');
      expect(res.body.user.email).toBe('alice@example.com');
      expect(res.body.user.password).toBeUndefined(); // Security: never return password

      user1Token = res.body.token;
      user1Id = res.body.user._id;
    });

    it('POST /api/auth/register should fail on duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice Clone',
          email: 'alice@example.com',
          password: 'DifferentPassword!',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('POST /api/auth/register should fail with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Pass',
          email: 'short@example.com',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/login should authenticate user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('POST /api/auth/login should fail with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('POST /api/auth/register should register User 2 for multi-user tests', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Bob Smith',
          email: 'bob@example.com',
          password: 'BobPassword123!',
        });

      expect(res.status).toBe(201);
      user2Token = res.body.token;
      user2Id = res.body.user._id;
    });
  });

  describe('3. User Profile Endpoints', () => {
    it('GET /api/auth/me should return 401 when token is missing', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('GET /api/auth/me should return current user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.name).toBe('Alice Johnson');
      expect(res.body.user.email).toBe('alice@example.com');
    });

    it('PUT /api/users/profile should update user profile', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'Alice J. Engineer',
          bio: 'Full-stack developer and task management enthusiast',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.name).toBe('Alice J. Engineer');
      expect(res.body.user.bio).toBe('Full-stack developer and task management enthusiast');
    });
  });

  describe('4. Task CRUD Endpoints (User 1)', () => {
    it('POST /api/tasks should fail when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          description: 'Task without a title',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/tasks should create a new task successfully', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Complete MERN Project Milestone',
          description: 'Finish all frontend and backend requirements for TaskFlow',
          status: 'pending',
          priority: 'high',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          tags: ['college', 'mern', 'react'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.task.title).toBe('Complete MERN Project Milestone');
      expect(res.body.task.priority).toBe('high');
      expect(res.body.task.tags).toContain('mern');
      expect(res.body.task.user.toString()).toBe(user1Id.toString());

      user1TaskId = res.body.task._id;
    });

    it('POST /api/tasks should create a second task (completed) for stats testing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Design Database Schema',
          description: 'Document ER diagram and Mongoose schemas',
          status: 'completed',
          priority: 'medium',
          dueDate: new Date(Date.now() - 86400000).toISOString(),
          tags: ['database', 'design'],
        });

      expect(res.status).toBe(201);
    });

    it('GET /api/tasks should retrieve all tasks for User 1', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.total).toBe(2);
      expect(res.body.tasks.length).toBe(2);
    });

    it('GET /api/tasks with search query should filter tasks', async () => {
      const res = await request(app)
        .get('/api/tasks?search=Milestone')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks.length).toBe(1);
      expect(res.body.tasks[0].title).toContain('Milestone');
    });

    it('GET /api/tasks with status filter should filter tasks', async () => {
      const res = await request(app)
        .get('/api/tasks?status=completed')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks.length).toBe(1);
      expect(res.body.tasks[0].status).toBe('completed');
    });

    it('GET /api/tasks/:id should retrieve single task details', async () => {
      const res = await request(app)
        .get(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.task._id.toString()).toBe(user1TaskId.toString());
    });

    it('PUT /api/tasks/:id should update task details', async () => {
      const res = await request(app)
        .put(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          status: 'in-progress',
          priority: 'medium',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.task.status).toBe('in-progress');
      expect(res.body.task.priority).toBe('medium');
    });

    it('GET /api/tasks/stats should calculate dashboard statistics via aggregation', async () => {
      const res = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats.totalTasks).toBe(2);
      expect(res.body.stats.completedTasks).toBe(1);
      expect(res.body.stats.inProgressTasks).toBe(1);
      expect(res.body.stats.completionRate).toBe(50);
      expect(res.body.stats.priorityBreakdown).toBeDefined();
    });
  });

  describe('5. Cross-User Authorization & Security Isolation', () => {
    it('User 2 should NOT see User 1 tasks in GET /api/tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(0);
      expect(res.body.tasks.length).toBe(0);
    });

    it('User 2 should NOT be able to view User 1 task (GET /api/tasks/:id)', async () => {
      const res = await request(app)
        .get(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found or access denied');
    });

    it('User 2 should NOT be able to edit User 1 task (PUT /api/tasks/:id)', async () => {
      const res = await request(app)
        .put(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          title: 'Hacked by User 2',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('User 2 should NOT be able to delete User 1 task (DELETE /api/tasks/:id)', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('User 1 can delete their own task successfully (DELETE /api/tasks/:id)', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const checkRes = await request(app)
        .get(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
