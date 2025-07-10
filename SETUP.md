# Quick Setup Guide

## 🚀 Getting Started (5 minutes)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Development Servers
```bash
npm run dev
```

### 3. Seed Database (Optional)
```bash
cd backend && npm run seed
```

## 🔑 Default Login Credentials

After seeding, you can use these accounts:

**Admin Account (Full Access)**
- Email: `admin@example.com`
- Password: `password123`

**User Account (Read-Only)**
- Email: `user@example.com`
- Password: `password123`

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

## 🐳 Docker Quick Start

```bash
docker-compose up --build
```

## ✅ Testing the Application

1. Visit http://localhost:3000
2. Login with admin credentials
3. Create, view, edit, and delete patients
4. Logout and login as regular user
5. Verify read-only access

## 🎯 Key Features Demonstrated

- ✅ JWT Authentication
- ✅ Role-based Access Control
- ✅ CRUD Operations
- ✅ Responsive Design
- ✅ Form Validation
- ✅ Real-time Notifications
- ✅ Professional UI/UX

## 🛠️ Tech Stack Used

**Backend**: NestJS, TypeORM, SQLite, JWT, Passport
**Frontend**: Next.js, React, TypeScript, Tailwind CSS, Shadcn/ui, Recoil, React Query

## 📋 API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient (Admin only)
- `PATCH /api/patients/:id` - Update patient (Admin only)
- `DELETE /api/patients/:id` - Delete patient (Admin only) 