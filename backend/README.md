# Skillify E-Learning Platform - Backend API

## 🚀 Overview
Complete backend implementation for Skillify E-Learning Platform with three user roles: Admin, Instructor, and Student.

## ✅ Completed Features

### Phase 1: Backend Infrastructure ✓

#### Database Models
- ✅ **User Model** - Multi-role support (student, instructor, admin)
- ✅ **Course Model** - Complete course structure with sections, lessons, and approval workflow
- ✅ **Assignment Model** - Assignment creation and submission tracking
- ✅ **Quiz Model** - MCQ-based quizzes with automatic grading
- ✅ **Badge Model** - Instructor-awarded student achievements
- ✅ **Certificate Model** - Admin-approved certificates
- ✅ **Notification Model** - Comprehensive notification system
- ✅ **Enrollment Model** - Student course enrollment and progress tracking
- ✅ **Revenue Model** - Platform and instructor revenue tracking (10% platform fee)

#### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control middleware
- ✅ Password hashing with bcrypt
- ✅ Refresh token support
- ✅ Protected routes

#### API Endpoints

##### Authentication Routes (`/api/auth`)
- `POST /register` - User registration (student/instructor)
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `GET /me` - Get current user
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `PUT /complete-first-login` - Mark first login complete

##### Instructor Routes (`/api/instructor`)
- `GET /dashboard` - Dashboard statistics
- `GET /courses` - Get instructor's courses
- `POST /courses` - Create new course (requires admin approval)
- `PUT /courses/:id` - Update course
- `POST /courses/:id/sections` - Add section to course
- `POST /courses/:id/sections/:sectionId/lessons` - Add lesson to section
- `GET /courses/:id/enrollments` - Get course enrollments
- `POST /badges` - Award badge to student

##### Admin Routes (`/api/admin`)
- `GET /dashboard` - Admin dashboard statistics
- `GET /instructors/pending` - Get pending instructor applications
- `PUT /instructors/:id/approve` - Approve instructor application
- `PUT /instructors/:id/reject` - Reject instructor application
- `GET /instructors/popular` - Get most popular instructors
- `GET /courses/pending` - Get pending courses
- `PUT /courses/:id/approve` - Approve course
- `PUT /courses/:id/reject` - Reject course
- `GET /revenue` - Get revenue statistics
- `GET /users` - Get all users (with filters)
- `PUT /users/:id/toggle-status` - Activate/deactivate user
- `PUT /certificates/:id/approve` - Approve certificate

#### Services
- ✅ **Notification Service** - Automated notifications for all user interactions

#### Middleware
- ✅ **Auth Middleware** - JWT verification and token generation
- ✅ **Role Middleware** - Role-based access control
- ✅ **Error Handler** - Global error handling

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── jwt.js               # JWT configuration
│   └── filekit.js           # FileKit configuration
├── models/
│   ├── User.js              # User model (all roles)
│   ├── Course.js            # Course model
│   ├── Assignment.js        # Assignment model
│   ├── Quiz.js              # Quiz model
│   ├── Badge.js             # Badge model
│   ├── Certificate.js       # Certificate model
│   ├── Notification.js      # Notification model
│   ├── Enrollment.js        # Enrollment model
│   └── Revenue.js           # Revenue model
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── instructorController.js  # Instructor logic
│   └── adminController.js   # Admin logic
├── routes/
│   ├── authRoutes.js        # Auth routes
│   ├── instructorRoutes.js  # Instructor routes
│   └── adminRoutes.js       # Admin routes
├── services/
│   └── notificationService.js  # Notification service
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   ├── roleMiddleware.js    # Role-based access
│   └── errorHandler.js      # Error handling
├── .env                     # Environment variables
├── app.js                   # Main application
└── package.json             # Dependencies
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=1000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/skillify

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
JWT_REFRESH_EXPIRE=30d

# FileKit Configuration (Video Storage)
FILEKIT_API_KEY=your-filekit-api-key
FILEKIT_API_SECRET=your-filekit-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@skillify.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Platform Revenue Percentage
PLATFORM_FEE_PERCENTAGE=10
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the values with your configuration

4. Start the server:

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:1000`

## 📝 API Usage Examples

### Register a Student
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "city": "New York",
  "country": "USA"
}
```

### Register an Instructor (Application)
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "instructor",
  "expertise": ["Web Development", "JavaScript"],
  "experience": "5 years of teaching experience",
  "education": "Master's in Computer Science"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create a Course (Instructor)
```bash
POST /api/instructor/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Web Development Bootcamp",
  "description": "Learn web development from scratch",
  "shortDescription": "Comprehensive web dev course",
  "category": "Web Development",
  "level": "beginner",
  "price": 49.99,
  "whatYouWillLearn": [
    "HTML & CSS",
    "JavaScript",
    "React.js"
  ]
}
```

## 🔐 Authentication Flow

1. **User Registration**: User registers as student or instructor
2. **Instructor Approval**: If instructor, admin must approve application
3. **Login**: User logs in with email/password
4. **Token Generation**: Server returns JWT access token and refresh token
5. **Protected Routes**: Include token in Authorization header: `Bearer <token>`
6. **Token Refresh**: Use refresh token to get new access token when expired

## 🎯 User Flows

### Instructor Flow
1. Register as instructor → Status: Pending
2. Admin approves application → Status: Approved
3. Receive welcome notification
4. Create course → Status: Pending
5. Admin approves course → Course goes live
6. Add sections and lessons (no approval needed after first approval)
7. View enrollments and student performance
8. Award badges to students

### Student Flow
1. Register as student
2. Browse and enroll in courses
3. Track progress
4. Complete quizzes and assignments
5. Receive badges from instructors
6. Request certificates
7. Admin approves certificates

### Admin Flow
1. View dashboard statistics
2. Approve/reject instructor applications
3. Approve/reject courses
4. View revenue analytics
5. Manage users
6. Approve certificates

## 📊 Revenue Model

- Platform fee: 10% of course price
- Instructor receives: 90% of course price
- Revenue tracked per transaction
- Analytics available for admin

## 🔔 Notification System

Automated notifications for:
- Instructor application approved/rejected
- Course approved/rejected
- New student enrollment
- Assignment submission/grading
- Badge awarded
- Certificate approved
- And more...

## 🛠️ Next Steps

### Remaining Backend Tasks
- [ ] Student controller and routes
- [ ] Assignment controller (create, submit, grade)
- [ ] Quiz controller (create, take, grade)
- [ ] File upload service (FileKit integration)
- [ ] Email service integration
- [ ] Chat/messaging system
- [ ] Search and filter functionality
- [ ] Payment integration

### Frontend Tasks
- [ ] Redux store setup
- [ ] API integration layer
- [ ] Authentication pages
- [ ] Instructor dashboard and pages
- [ ] Student dashboard and pages
- [ ] Admin dashboard and pages
- [ ] Course player
- [ ] Quiz interface
- [ ] Assignment submission

## 📚 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **express-validator** - Input validation

## 🤝 Contributing

This is a complete e-learning platform implementation. Follow the implementation plan in `.agent/workflows/implementation-plan.md` for adding new features.

## 📄 License

MIT License

---

**Built with ❤️ for Skillify E-Learning Platform**
