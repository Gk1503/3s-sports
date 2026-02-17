# Student Registration Flow - Complete Documentation

## Overview
This document explains how students register through the `/sr` route and how their data flows through the system to appear in the Coach Dashboard and enable Student Dashboard access.

---

## 🎯 Complete Flow

### 1️⃣ Student Registration (`/sr` Route)

**Frontend Component:** `src/components/RegisterStudent/RegisterStudent.js`

**Process:**
1. Student fills out the registration form at `http://localhost:3000/sr`
2. Form includes:
   - **Account Info:** username, password
   - **Personal Info:** firstName, lastName, email, phone, gender, dob, address, batch
   - **Profile Photo:** Optional image upload
   - **Parent Info:** parentName, parentPhone
   - **Skills:** role (batsman/bowler/all-rounder), batting/bowling details, wicket-keeper status
   - **Extra Info:** Additional notes

3. On submit, form data is sent as `FormData` to:
   ```
   POST http://localhost:5000/api/auth/register-student
   ```

**Backend Endpoint:** `src/backend/routes/auth.js` → `authController.registerStudentPublic()`

---

### 2️⃣ Backend Processing

**Controller:** `src/backend/controllers/authController.js`

**Process:**
1. **Validate** required fields (username, password, firstName)
2. **Check** if username already exists
3. **Create User Account:**
   ```javascript
   User.create({
     username,
     passwordHash: bcrypt.hash(password),
     role: 'student',
     createdBy: null  // Self-registration
   })
   ```

4. **Handle Profile Photo Upload** (if provided):
   - Stored in `/uploads/profile-photos/`
   - URL saved as `profilePhotoUrl`

5. **Create Student Profile:**
   ```javascript
   Student.create({
     user: user._id,              // Link to User account
     firstName,
     lastName,
     email,
     phone,
     gender,
     dob,
     address,
     batch,
     parentName,
     parentPhone,
     profilePhotoUrl,
     skills: {
       role: 'batsman|bowler|all-rounder',
       battingHand: 'right|left',
       bowlingHand: 'right|left',
       bowlingType: 'fast|medium-fast|spinner',
       wicketKeeper: true/false
     },
     extraInfo,
     monthlyFee: 0,              // Default, set by Sr. Coach later
     feeDuration: '1m',          // Default
     registrationSource: 'self'  // Self-registered
   })
   ```

6. **Return Success Response:**
   ```json
   {
     "message": "Student registered successfully",
     "userId": "...",
     "studentId": "...",
     "username": "..."
   }
   ```

---

### 3️⃣ Data Appears in Coach Dashboard

**Component:** `src/components/CoachDashboard/CoachDashboard.js`

**API Endpoint:**
```
GET http://localhost:5000/api/coaches/students
Authorization: Bearer <coach-token>
```

**Backend Route:** `src/backend/routes/coaches.js` → `coachController.getAllStudents()`

**Process:**
1. Coach logs in and navigates to Coach Dashboard
2. Dashboard automatically fetches ALL students (including self-registered ones)
3. Data is displayed in:
   - **Dashboard Tab:** Overview statistics
   - **Students Tab:** Complete student list with details
   - **Fees Tab:** List of students for fee collection
   - **Attendance Tab:** Mark attendance for all students

**Backend Controller:** `src/backend/controllers/coachController.js`
```javascript
exports.getAllStudents = async (req, res) => {
  const students = await Student.find()
    .populate("user", "username")
    .select("-attendanceRecords")
    .sort({ firstName: 1 });

  res.json({
    count: students.length,
    students
  });
};
```

**Features Available to Coach:**
- ✅ View all student details (including profile photo)
- ✅ Collect fees from students
- ✅ Mark attendance (present/absent/leave)
- ✅ View attendance history
- ✅ Update student profiles
- ✅ Bulk mark attendance

---

### 4️⃣ Student Login & Dashboard Access

**Login Process:**

1. **Student goes to Home Page** and clicks "Login" button
2. **Login Modal** appears (`src/components/Login/Login.js`)
3. Student selects **"Student"** role
4. Enters credentials:
   - Username: (the username they registered with)
   - Password: (the password they registered with)

5. **Backend Authenticates:**
   ```
   POST http://localhost:5000/api/auth/login
   Body: { username, password, role: "student" }
   ```

6. **Backend Process** (`authController.login()`):
   - Finds user by username
   - Compares password hash
   - Generates JWT token
   - Returns user data with token

7. **Frontend Receives Response:**
   ```json
   {
     "_id": "user-id",
     "username": "student123",
     "role": "student",
     "token": "jwt-token..."
   }
   ```

8. **Frontend Stores User Data:**
   ```javascript
   localStorage.setItem("user", JSON.stringify(userData));
   ```

9. **Navigate to Student Dashboard:**
   ```
   navigate("/student-dashboard")
   ```

**Protected Route:** `src/App.js`
```javascript
<Route
  path="/student-dashboard"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🔐 Security & Authorization

### Protected Routes
All dashboard routes are protected:
- **Student Dashboard:** Only accessible by users with `role: "student"`
- **Coach Dashboard:** Only accessible by users with `role: "coach"`
- **Sr. Coach Dashboard:** Only accessible by users with `role: "seniorCoach"`

### Token-Based Authentication
- All API requests after login include: `Authorization: Bearer <token>`
- Token is validated by backend middleware (`src/backend/middleware/auth.js`)
- Token contains user ID and role information

---

## 📊 Data Models

### User Model
```javascript
{
  username: String (unique),
  passwordHash: String (bcrypt),
  role: 'student' | 'coach' | 'seniorCoach',
  createdBy: ObjectId | null,
  temporaryPassword: String (optional)
}
```

### Student Model
```javascript
{
  user: ObjectId (ref: 'User'),
  firstName: String (required),
  lastName: String,
  email: String,
  phone: String,
  gender: String,
  dob: Date,
  address: String,
  batch: String,
  parentName: String,
  parentPhone: String,
  profilePhotoUrl: String,
  skills: {
    role: 'batsman' | 'bowler' | 'all-rounder',
    battingHand: 'right' | 'left',
    bowlingHand: 'right' | 'left',
    bowlingType: 'fast' | 'medium-fast' | 'spinner',
    wicketKeeper: Boolean,
    handedness: String (legacy),
    tags: [String]
  },
  monthlyFee: Number (default: 0),
  feeDuration: '1m' | '3m' | '6m' | '12m',
  attendanceRecords: [ObjectId],
  registrationSource: 'srcoach' | 'self',
  createdAt: Date
}
```

---

## 🧪 Testing Instructions

### Test 1: Student Registration
1. Navigate to `http://localhost:3000/sr`
2. Fill out all required fields (marked with *)
3. Upload a profile photo (optional)
4. Select role: batsman/bowler/all-rounder
5. Fill out role-specific fields
6. Click "Register"
7. ✅ Success message: "Registration successful! You can now log in..."

### Test 2: Verify Data in Coach Dashboard
1. Login as Coach
2. Navigate to Coach Dashboard
3. Click "Students" tab
4. ✅ Verify newly registered student appears in the list
5. ✅ Verify profile photo is displayed
6. ✅ Click "View Details" to see full student information

### Test 3: Student Login & Dashboard Access
1. Logout (if logged in)
2. Click "Login" on home page
3. Select "Student" role
4. Enter credentials from Test 1
5. Click "Login as Student"
6. ✅ Should navigate to Student Dashboard
7. ✅ Verify student can see their profile and information

### Test 4: Coach Features with New Student
1. Login as Coach
2. **Fees Tab:**
   - ✅ Find newly registered student
   - ✅ Click "Collect Fee"
   - ✅ Successfully record a fee payment

3. **Attendance Tab:**
   - ✅ Find newly registered student
   - ✅ Mark attendance (Present/Absent/Leave)
   - ✅ Verify attendance is recorded
   - ✅ Click "View History" to see attendance records

---

## 🚀 API Endpoints Summary

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login for all users |
| POST | `/api/auth/register-student` | Public student self-registration |

### Coach Endpoints (require `coach` role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coaches/students` | Get all students |
| GET | `/api/coaches/profile` | Get coach profile |
| POST | `/api/coaches/attendance` | Mark attendance |
| POST | `/api/coaches/attendance/bulk` | Bulk mark attendance |
| GET | `/api/coaches/attendance?date=YYYY-MM-DD` | Get attendance for date |
| GET | `/api/coaches/attendance/:studentId` | Get student attendance history |
| POST | `/api/coaches/fees/collect` | Collect fee from student |
| GET | `/api/coaches/fees?status=pending\|collected` | Get fees list |

### Senior Coach Endpoints (require `seniorCoach` role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/srcoach/students` | Get all students |
| POST | `/api/srcoach/students` | Add new student (with fees) |
| PUT | `/api/srcoach/students/:id` | Update student |
| DELETE | `/api/srcoach/students/:id` | Delete student |
| PUT | `/api/srcoach/students/:id/fees` | Set/update student fees |
| GET | `/api/srcoach/students/:id/credentials` | Get student login credentials |

---

## 📝 Important Notes

### 1. Registration Source
Students can be added two ways:
- **Self-registration** (`/sr` route) → `registrationSource: 'self'`, `monthlyFee: 0`
- **Sr. Coach registration** → `registrationSource: 'srcoach'`, `monthlyFee: set by Sr. Coach`

### 2. Fee Management
- Self-registered students have `monthlyFee: 0` by default
- Senior Coach can update fees via: `PUT /api/srcoach/students/:id/fees`
- Coaches can collect fees regardless of registration source

### 3. Profile Photos
- Stored in: `uploads/profile-photos/`
- Accessed via: `http://localhost:5000/uploads/profile-photos/<filename>`
- Frontend displays with fallback: `https://via.placeholder.com/50`

### 4. Authentication Flow
- Username must be unique across all users
- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens expire after 7 days (configurable in `.env`)

### 5. Coach Access
- Coaches can see ALL students (both self-registered and Sr. Coach registered)
- No assignment/filtering is applied in the current implementation
- All coaches have full access to manage all students

---

## ⚠️ Troubleshooting

### Problem: Student not appearing in Coach Dashboard
**Solution:**
1. Check backend logs for registration errors
2. Verify student was successfully created in database
3. Refresh Coach Dashboard or re-login as coach
4. Check network tab for API call to `/api/coaches/students`

### Problem: Student cannot login
**Solution:**
1. Verify username and password are correct
2. Check if user was created in database (User collection)
3. Ensure role is set to "student"
4. Check backend logs for authentication errors

### Problem: Profile photo not displaying
**Solution:**
1. Check if file was uploaded successfully during registration
2. Verify `uploads/profile-photos/` directory exists
3. Check `profilePhotoUrl` field in Student document
4. Ensure backend is serving static files from `/uploads`

---

## ✅ Fixed Issues

### Issue 1: Premature Navigation (FIXED)
**Problem:** `RegisterStudent.js` had `navigate('/student-dashboard')` at line 65, which caused navigation before registration completed.

**Solution:** Removed the premature navigation. Now students see success message and can login afterward.

**Code Change:**
```javascript
// BEFORE (❌ Wrong)
const submit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  navigate('/student-dashboard');  // ❌ Navigates too early!
  setMessage("");
  // ... rest of code

// AFTER (✅ Correct)
const submit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setMessage("");
  // ... registration logic
  // Success message is shown, student can then login
```

---

## 🎓 Summary

The complete flow is:

1. **Student registers** at `/sr` → Backend creates User + Student records
2. **Coach logs in** → Coach Dashboard fetches ALL students via `/api/coaches/students`
3. **Newly registered student appears** in Coach Dashboard (all tabs)
4. **Coach can manage student:** collect fees, mark attendance, view details
5. **Student logs in** with credentials → JWT token generated
6. **Student accesses** Student Dashboard with protected route

✅ **Everything is working correctly!** The system is fully functional for the complete student registration and management flow.


