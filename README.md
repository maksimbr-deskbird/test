# Patients Management System

A comprehensive full-stack application for managing patient data with secure authentication and role-based access control.

## 🌟 Features

### Backend (NestJS)
- **JWT Authentication** with role-based access control
- **CRUD Operations** for patient management
- **User Roles**: Admin (full access) and User (read-only)
- **SQLite Database** with TypeORM
- **Input Validation** using class-validator
- **RESTful API** design
- **Error Handling** with proper HTTP status codes
- **CORS Configuration** for frontend communication

### Frontend (Next.js + React)
- **Modern UI** with Tailwind CSS and Shadcn/ui
- **Responsive Design** for mobile, tablet, and desktop
- **State Management** with Recoil
- **API Communication** with React Query
- **Form Validation** using React Hook Form + Zod
- **Real-time Notifications** with React Hot Toast
- **Authentication Flow** with protected routes
- **Role-based UI** rendering

### Key Features
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ Patient CRUD operations
- ✅ Responsive data tables
- ✅ Form validation
- ✅ Real-time notifications
- ✅ Docker containerization
- ✅ Professional UI/UX

## 🛠️ Tech Stack

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - ORM for database operations
- **SQLite** - Database
- **JWT** - Authentication
- **Passport** - Authentication middleware
- **Class Validator** - Input validation
- **bcryptjs** - Password hashing

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Recoil** - State management
- **React Query** - API state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd patients-management-system
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Start both services**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile

### Patient Endpoints
- `GET /api/patients` - Get all patients (Admin & User)
- `POST /api/patients` - Create patient (Admin only)
- `GET /api/patients/:id` - Get patient by ID
- `PATCH /api/patients/:id` - Update patient (Admin only)
- `DELETE /api/patients/:id` - Delete patient (Admin only)

## 🔐 Default Accounts

For testing purposes, you can create these accounts:

**Admin Account:**
- Email: admin@example.com
- Password: password123
- Role: admin

**User Account:**
- Email: user@example.com
- Password: password123
- Role: user

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Mobile** (320px+)
- **Tablet** (768px+)
- **Desktop** (1024px+)

## 🏗️ Architecture

### Backend Structure
```
backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── patients/       # Patients module
│   ├── users/          # Users module
│   └── main.ts         # Application entry point
├── database.sqlite     # SQLite database
└── Dockerfile          # Docker configuration
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   ├── store/          # Recoil state
│   └── types/          # TypeScript types
└── Dockerfile          # Docker configuration
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database
The application uses SQLite for simplicity. The database file is created automatically when the backend starts.

## 🎯 Focus Areas

This project demonstrates:

1. **Clean Architecture** - Separation of concerns, modular design
2. **Security** - JWT authentication, password hashing, input validation
3. **User Experience** - Intuitive UI, responsive design, real-time feedback
4. **Performance** - Optimized queries, caching, lazy loading
5. **Developer Experience** - Type safety, error handling, documentation
6. **Scalability** - Modular structure, containerization, environment configuration

## 🐳 Docker Commands

```bash
# Build and start services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

## 📋 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

### Frontend Tests
```bash
cd frontend

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- **Backend**: Unit tests for services, controllers, and E2E tests for API endpoints
- **Frontend**: Component tests, hook tests, and integration tests
- **Coverage Target**: 70% minimum across all metrics (lines, functions, branches, statements)

### Test Structure
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and user flows
- **E2E Tests**: Complete user scenarios
- **Mocks**: External dependencies and services

## 🚀 Production Deployment

### Heroku Deployment
Complete deployment guide available in [DEPLOYMENT.md](./DEPLOYMENT.md)

```bash
# Quick Heroku deployment
# Backend
cd backend
heroku create your-app-backend
heroku addons:create heroku-postgresql:mini
heroku config:set JWT_SECRET="your-secret-key"
git push heroku main

# Frontend
cd frontend
heroku create your-app-frontend
heroku config:set NEXT_PUBLIC_API_URL="https://your-app-backend.herokuapp.com/api"
git push heroku main
```

### Using Docker
```bash
# Build for production
docker-compose -f docker-compose.yml up --build

# Or deploy to cloud platforms like AWS, Azure, or Google Cloud
```

### Manual Deployment
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database provisioned (PostgreSQL for production)
- [ ] JWT secret set
- [ ] API URL configured in frontend
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Error monitoring setup
- [ ] Performance monitoring setup

## 🔍 Key Implementation Details

### Authentication Flow
1. User registers/logs in
2. Server returns JWT token
3. Token stored in localStorage
4. Token sent with API requests
5. Server validates token for protected routes

### Role-Based Access Control
- **Admin**: Full CRUD operations on patients
- **User**: Read-only access to patient data
- UI adapts based on user role

### State Management
- **Recoil** for global state (auth, modals)
- **React Query** for server state (patients, API calls)
- **React Hook Form** for form state

### Error Handling
- Global error boundary
- API error interceptors
- User-friendly error messages
- Loading states

## 📞 Support

For questions or issues, please check the documentation or create an issue in the repository.

## 📄 License

This project is licensed under the MIT License. # test
