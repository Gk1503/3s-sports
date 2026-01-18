# 🧪 Quick Test Guide - Student Registration Flow

## Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- MongoDB connected

---

## 📋 Test Scenario: Complete Student Registration to Dashboard Access

### Step 1: Register a New Student
1. **Navigate to:** `http://localhost:3000/sr`
2. **Fill out the form:**
   - Username: `teststudent123`
   - Password: `Test@1234`
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Phone: `9876543210`
   - Gender: `Male`
   - Date of Birth: `2005-01-15`
   - Address: `123 Main Street, City`
   - Preferred Batch: `Morning Batch`
   - Parent Name: `Jane Doe`
   - Parent Phone: `9876543211`
   - Role: `All-rounder`
   - Batting Hand: `Right Hand`
   - Bowling Hand: `Right Hand`
   - Bowling Type: `Medium Fast`
   - Upload Profile Photo: (optional)

3. **Click "Register"**
4. **Expected Result:** ✅ "Registration successful! You can now log in with your username and password."

---

### Step 2: Verify Student in Coach Dashboard
1. **Login as Coach** (you need existing coach credentials)
   - Navigate to: `http://localhost:3000`
   - Click "Login"
   - Select "Coach" role
   - Enter coach credentials

2. **Navigate to Coach Dashboard**
3. **Check Dashboard Tab:**
   - ✅ Total Students count should increase by 1

4. **Check Students Tab:**
   - ✅ Find "John Doe" in the student list
   - ✅ Verify email: `john.doe@example.com`
   - ✅ Verify phone: `9876543210`
   - ✅ Verify batch: `Morning Batch`
   - ✅ Click "View Details" to see full profile

5. **Check Fees Tab:**
   - ✅ Find "John Doe" in the list
   - ✅ Monthly Fee should be ₹0 (default for self-registered)
   - ✅ Click "Collect Fee" to test fee collection modal

6. **Check Attendance Tab:**
   - ✅ Find "John Doe" in the list
   - ✅ Try marking attendance (Present/Absent/Leave)
   - ✅ Click "View History" to see attendance records

---

### Step 3: Student Login & Dashboard Access
1. **Logout** from Coach Dashboard
2. **Navigate to:** `http://localhost:3000`
3. **Click "Login"**
4. **Select "Student" role**
5. **Enter credentials:**
   - Username: `teststudent123`
   - Password: `Test@1234`
6. **Click "Login as Student"**
7. **Expected Result:** ✅ Should redirect to Student Dashboard
8. **Verify:** Student can see their own profile and information

---

## 🎯 Key Features to Test

### A. Coach Can View Student
- [x] Student appears in Students list
- [x] Profile photo displays correctly
- [x] All personal details are visible
- [x] Skills information is saved

### B. Coach Can Manage Student
- [x] Collect fees from the student
- [x] Mark attendance for the student
- [x] View attendance history
- [x] Update student profile (View Details → Update)

### C. Student Can Login
- [x] Login with registered credentials
- [x] Access Student Dashboard
- [x] View own profile
- [x] Protected route works correctly

---

## 🔍 What to Look For

### ✅ Success Indicators
1. **Registration Form:**
   - Success message appears
   - Form clears after successful submission
   - No error messages

2. **Coach Dashboard:**
   - Student appears in all relevant tabs
   - Profile photo loads (or placeholder if none)
   - All data matches what was entered
   - Actions (collect fee, mark attendance) work

3. **Student Login:**
   - Login succeeds with correct credentials
   - Redirects to Student Dashboard
   - Cannot access Coach/Sr. Coach dashboards

### ❌ Potential Issues
1. **Registration fails:**
   - Check backend logs
   - Verify MongoDB is running
   - Check if username already exists

2. **Student not in Coach Dashboard:**
   - Refresh the page
   - Re-login as coach
   - Check backend API response in Network tab

3. **Student cannot login:**
   - Verify username and password are correct
   - Check if User document was created
   - Check backend authentication logs

---

## 🛠️ Backend Verification Commands

### Check if User was created:
```javascript
// In MongoDB shell or Compass
db.users.findOne({ username: "teststudent123" })
```

**Expected Output:**
```json
{
  "_id": ObjectId("..."),
  "username": "teststudent123",
  "passwordHash": "$2a$10$...",
  "role": "student",
  "createdBy": null
}
```

### Check if Student was created:
```javascript
db.students.findOne({ firstName: "John" })
```

**Expected Output:**
```json
{
  "_id": ObjectId("..."),
  "user": ObjectId("..."),
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "batch": "Morning Batch",
  "skills": {
    "role": "all-rounder",
    "battingHand": "right",
    "bowlingHand": "right",
    "bowlingType": "medium-fast"
  },
  "monthlyFee": 0,
  "feeDuration": "1m",
  "registrationSource": "self"
}
```

---

## 📱 API Testing with Postman/Thunder Client

### 1. Test Registration
```
POST http://localhost:5000/api/auth/register-student
Content-Type: multipart/form-data

Body (form-data):
- username: teststudent123
- password: Test@1234
- firstName: John
- lastName: Doe
- email: john.doe@example.com
- phone: 9876543210
- gender: Male
- dob: 2005-01-15
- address: 123 Main Street
- batch: Morning Batch
- parentName: Jane Doe
- parentPhone: 9876543211
- skills: {"role":"all-rounder","battingHand":"right","bowlingHand":"right","bowlingType":"medium-fast"}
- profilePhoto: [file upload]
```

**Expected Response (201):**
```json
{
  "message": "Student registered successfully",
  "userId": "...",
  "studentId": "...",
  "username": "teststudent123"
}
```

### 2. Test Student Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "teststudent123",
  "password": "Test@1234"
}
```

**Expected Response (200):**
```json
{
  "_id": "...",
  "username": "teststudent123",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Test Coach Get All Students
```
GET http://localhost:5000/api/coaches/students
Authorization: Bearer <coach-token>
```

**Expected Response (200):**
```json
{
  "count": 15,
  "students": [
    {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "batch": "Morning Batch",
      "monthlyFee": 0,
      "skills": { ... },
      "user": {
        "_id": "...",
        "username": "teststudent123"
      }
    },
    // ... other students
  ]
}
```

---

## 🔄 Quick Reset (For Re-testing)

If you want to test registration again with the same username:

### Option 1: Delete the test user
```javascript
// MongoDB shell
db.users.deleteOne({ username: "teststudent123" })
db.students.deleteOne({ firstName: "John", lastName: "Doe" })
```

### Option 2: Use a different username
Register with: `teststudent124`, `teststudent125`, etc.

---

## 📊 Expected Results Summary

| Test Step | Expected Outcome | Status |
|-----------|------------------|--------|
| Student Registration | Success message, form clears | ✅ |
| Coach Views Students Tab | New student appears | ✅ |
| Coach Collects Fee | Fee modal opens, can record payment | ✅ |
| Coach Marks Attendance | Attendance is recorded | ✅ |
| Student Login | Login succeeds, gets token | ✅ |
| Student Dashboard Access | Redirects to dashboard | ✅ |
| Student Profile Display | All data displays correctly | ✅ |

---

## 💡 Tips

1. **Keep Browser Console Open:** Check for any JavaScript errors
2. **Monitor Network Tab:** Verify API calls are successful
3. **Check Backend Logs:** Look for server-side errors
4. **Test with Different Browsers:** Ensure cross-browser compatibility
5. **Test Profile Photo Upload:** Try with and without photos
6. **Test Different Roles:** Try batsman, bowler, all-rounder
7. **Test Validation:** Try submitting with missing required fields

---

## 🎓 All Systems Working!

After following this guide, you should confirm:
- ✅ Students can self-register via `/sr` route
- ✅ Registered students appear in Coach Dashboard immediately
- ✅ Coaches can manage all students (fees, attendance, details)
- ✅ Students can login with their credentials
- ✅ Students can access Student Dashboard
- ✅ All data flows correctly from registration → database → dashboards

