# Cricket Academy Backend API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All routes except `/api/auth/login` require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Routes (`/api/auth`)

### POST `/api/auth/login`
Login for all user types (student, coach, seniorCoach)
```json
{
  "username": "string",
  "password": "string"
}
```

### POST `/api/auth/register` (SeniorCoach only)
Create new user (only seniorCoach can create users)
```json
{
  "username": "string",
  "password": "string",
  "role": "student|coach|seniorCoach"
}
```

### POST `/api/auth/register-student` (Public)
Self-registration for students (fees not set here)
```json
{
  "username": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "gender": "string",
  "dob": "YYYY-MM-DD",
  "address": "string",
  "batch": "string",
  "parentName": "string",
  "parentPhone": "string",
  "profilePhotoUrl": "string",
  "skills": {
    "role": "batsman|bowler|all-rounder",
    "handedness": "right|left",
    "wicketKeeper": true,
    "tags": ["string"]
  },
  "extraInfo": "string"
}
```

---

## 2. Senior Coach Routes (`/api/srcoach`)

All routes require `seniorCoach` role.

### Student Management

#### POST `/api/srcoach/students`
Add new student with username and password
```json
{
  "username": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "gender": "string",
  "dob": "date",
  "batch": "string",
  "address": "string",
  "parentName": "string",
  "parentPhone": "string",
  "profilePhotoUrl": "string",
  "monthlyFee": 0,
  "feeDuration": "1m|3m|6m|12m",
  "extraInfo": "string"
}
```

#### GET `/api/srcoach/students`
Get all students with their credentials (username)

#### GET `/api/srcoach/students/:id/credentials`
Get student credentials (username)

#### PUT `/api/srcoach/students/:id`
Update student details

#### DELETE `/api/srcoach/students/:id`
Delete student and associated records

#### PUT `/api/srcoach/students/:id/fees`
Set/Update student fees
```json
{
  "monthlyFee": 0,
  "feeDuration": "1m|3m|6m|12m"
}
```

### Coach Management

#### POST `/api/srcoach/coaches`
Add new coach
```json
{
  "username": "string",
  "password": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "profilePhotoUrl": "string"
}
```

#### GET `/api/srcoach/coaches`
Get all coaches with their credentials

#### PUT `/api/srcoach/coaches/:id`
Update coach details

#### DELETE `/api/srcoach/coaches/:id`
Delete coach and associated records

### Dashboard & Reports

#### GET `/api/srcoach/dashboard/stats`
Get dashboard statistics (total students, coaches, fees, attendance)

#### GET `/api/srcoach/report`
Overall report (backward compatibility)

### Fees Reports

#### GET `/api/srcoach/fees/report`
Get fees report with filters
Query params: `?status=pending|collected&month=YYYY-MM&studentId=<id>`

#### GET `/api/srcoach/fees/pending`
Get all pending fees

#### GET `/api/srcoach/fees/collected`
Get all collected fees

#### PUT `/api/srcoach/fees/:feeId/collect`
Mark fee as collected
```json
{
  "month": "YYYY-MM",
  "mode": "cash|online|cheque|other"
}
```

### Attendance Reports

#### GET `/api/srcoach/attendance/report`
Get attendance report with filters
Query params: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&studentId=<id>&status=present|absent|leave`

---

## 3. Coach Routes (`/api/coaches`)

All routes require `coach` role.

### Students

#### GET `/api/coaches/students`
View all students

#### GET `/api/coaches/students/assigned`
Get assigned students (if any)

### Attendance

#### POST `/api/coaches/attendance`
Mark attendance with date
```json
{
  "studentId": "string",
  "date": "YYYY-MM-DD",
  "status": "present|absent|leave",
  "note": "string"
}
```

#### POST `/api/coaches/attendance/bulk`
Mark attendance for multiple students
```json
{
  "students": ["studentId1", "studentId2"],
  "date": "YYYY-MM-DD",
  "status": "present|absent|leave"
}
```

#### GET `/api/coaches/attendance`
Get all attendance records
Query params: `?date=YYYY-MM-DD&status=present|absent|leave&studentId=<id>`

#### GET `/api/coaches/attendance/:studentId`
Get attendance for specific student

### Fees Collection

#### POST `/api/coaches/fees/collect`
Mark fee collection (cash received)
```json
{
  "studentId": "string",
  "amount": 0,
  "feeForMonths": "1m|3m|6m|12m",
  "month": "YYYY-MM",
  "mode": "cash|online|cheque|other",
  "note": "string"
}
```

#### GET `/api/coaches/fees`
Get fee records
Query params: `?studentId=<id>&status=pending|collected&month=YYYY-MM`

---

## 4. Student Routes (`/api/students`)

All routes require `student` role.

### Profile

#### GET `/api/students/profile`
Get student profile (including profile photo)

#### PUT `/api/students/profile`
Update own profile
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "profilePhotoUrl": "string",
  "dob": "date",
  "gender": "string",
  "extraInfo": "string"
}
```

### Dashboard

#### GET `/api/students/dashboard`
Get student dashboard with summary (recent attendance, fees status)

### Fees

#### GET `/api/students/fees`
Get fees report with summary

### Attendance

#### GET `/api/students/attendance`
Get attendance report with summary
Query params: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&status=present|absent|leave`

---

## Models Structure

### User Model
- `username` (unique)
- `passwordHash`
- `role` (student|coach|seniorCoach)
- `createdBy` (who created this user)
- `createdAt`

### Student Model
- `user` (reference to User)
- `firstName`, `lastName`
- `email`, `phone`
- `dob`, `gender`
- `address`
- `profilePhotoUrl`
- `batch`
- `parentName`, `parentPhone`
- `monthlyFee` (set by srcoach)
- `feeDuration` (1m|3m|6m|12m)
- `attendanceRecords` (array of Attendance references)
- `extraInfo`
- `createdAt`

### Coach Model
- `user` (reference to User)
- `name`, `email`, `phone`
- `profilePhotoUrl`
- `assignedStudents` (array of Student references)
- `createdAt`

### Attendance Model
- `student` (reference to Student)
- `coach` (reference to User who marked)
- `date`
- `status` (present|absent|leave)
- `note`
- `createdAt`
- Unique index on (student, date)

### Fee Model
- `student` (reference to Student)
- `amount`
- `feeForMonths` (1m|3m|6m|12m)
- `date`
- `month` (YYYY-MM format)
- `status` (pending|collected)
- `mode` (cash|online|cheque|other)
- `note`
- `collectedBy` (reference to User)
- `collectedAt`
- `createdAt`

---

## Error Responses

All errors follow this format:
```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Environment Variables

Make sure to set these in your `.env` file:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `PORT` - Server port (default: 5000)








