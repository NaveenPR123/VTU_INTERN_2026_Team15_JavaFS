# EduTrack — API Documentation

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Base URL (Local):** `http://localhost:8080`  
**Base URL (Production):** `https://edutrack-backend-o1ym.onrender.com`  
**Date:** April 2026

---

## Overview

All APIs return JSON responses. Every response includes a `success` boolean field.

**Success Response:**
```json
{ "success": true, "message": "..." }
```

**Failure Response:**
```json
{ "success": false, "message": "Error description" }
```

---

## 1. Authentication APIs

### 1.1 Admin Login
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/login/admin` |
| Description | Authenticate admin user |

**Request Body:**
```json
{
  "email": "admin@edutrack.com",
  "password": "Admin@123"
}
```

**Success Response:**
```json
{
  "success": true,
  "adminId": 1,
  "name": "Admin",
  "email": "admin@edutrack.com",
  "role": "admin",
  "message": "Login successful"
}
```

---

### 1.2 Student Login
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/login/student` |
| Description | Authenticate student user |

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "Test@123"
}
```

**Success Response:**
```json
{
  "success": true,
  "studentId": 1,
  "name": "Arjun Kumar",
  "email": "student@college.edu",
  "department": "Computer Science and Engineering",
  "year": "3rd Year",
  "semester": "Sem 5",
  "usn": "1VT22CS001",
  "phone": "9876543210",
  "role": "student",
  "message": "Login successful"
}
```

---

### 1.3 Teacher Login
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/login/teacher` |
| Description | Authenticate teacher user |

**Request Body:**
```json
{
  "email": "teacher@college.edu",
  "password": "Test@123"
}
```

---

### 1.4 Student Registration
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/register/student` |
| Description | Self-registration for students (blocked if registrationOpen=false) |

**Request Body:**
```json
{
  "name": "Arjun Kumar",
  "email": "arjun@college.edu",
  "password": "Test@123",
  "department": "Computer Science and Engineering",
  "year": "1st Year",
  "semester": "Sem 1",
  "phone": "9876543210",
  "usn": "1VT25CS001"
}
```

---

### 1.5 Admin Add Student
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/admin/add-student` |
| Description | Admin adds student (bypasses registration gate) |

**Request Body:** Same as student registration

---

### 1.6 Admin Add Teacher
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/admin/add-teacher` |
| Description | Admin adds teacher |

**Request Body:**
```json
{
  "name": "Prof. Sharma",
  "email": "sharma@college.edu",
  "password": "Test@123",
  "department": "Computer Science and Engineering",
  "phone": "9876543210",
  "employeeId": "EMP001"
}
```

---

### 1.7 Change Admin Password
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/change-password/admin` |
| Description | Change admin password (requires current password) |

**Request Body:**
```json
{
  "id": 1,
  "currentPassword": "Admin@123",
  "newPassword": "NewPass@123"
}
```

---

### 1.8 Change Student Password
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/change-password/student` |
| Description | Change student password |

**Request Body:**
```json
{
  "id": 1,
  "currentPassword": "Test@123",
  "newPassword": "NewPass@123"
}
```

---

### 1.9 Change Teacher Password
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/change-password/teacher` |
| Description | Change teacher password |

**Request Body:** Same as change student password

---

## 2. OTP / Password Reset APIs

### 2.1 Send OTP (Forgot Password)
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/otp/forgot-password` |
| Description | Send OTP to email for password reset. Validates email exists for given role. |

**Request Body:**
```json
{
  "email": "student@college.edu",
  "role": "student"
}
```

> role can be: `student`, `teacher`, `admin`

**Success Response:**
```json
{
  "success": true,
  "message": "Password reset OTP sent to student@college.edu"
}
```

**Failure Response (email not found):**
```json
{
  "success": false,
  "message": "No account found with this email."
}
```

---

### 2.2 Verify OTP
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/otp/verify` |
| Description | Verify OTP code. OTP expires in 10 minutes and is single-use. |

**Request Body:**
```json
{
  "email": "student@college.edu",
  "otp": "123456"
}
```

---

### 2.3 Reset Student Password
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/reset-password/student` |
| Description | Reset student password after OTP verification |

**Request Body:**
```json
{
  "email": "student@college.edu",
  "otp": "123456",
  "newPassword": "NewPass@123"
}
```

---

### 2.4 Reset Teacher Password
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/reset-password/teacher` |

**Request Body:** Same as reset student password

---

### 2.5 Reset Admin Password
| Field | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/auth/reset-password/admin` |

**Request Body:** Same as reset student password

---

## 3. Student APIs

### 3.1 Get All Students
| Method | GET | Endpoint | `/api/students` |
|---|---|---|---|

**Response:** Array of student objects

---

### 3.2 Get Student by ID
| Method | GET | Endpoint | `/api/students/{id}` |
|---|---|---|---|

---

### 3.3 Update Student Profile
| Method | PUT | Endpoint | `/api/students/{id}` |
|---|---|---|---|

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "9999999999"
}
```

---

### 3.4 Delete Student
| Method | DELETE | Endpoint | `/api/students/{id}` |
|---|---|---|---|

> Cascades: deletes all attendance, marks, and submissions for the student

---

### 3.5 Update Student Status
| Method | PATCH | Endpoint | `/api/students/{id}/status` |
|---|---|---|---|

**Request Body:**
```json
{ "status": "Suspended" }
```

> status can be: `Active`, `Suspended`, `Graduated`

---

### 3.6 Admin Force Reset Student Password
| Method | POST | Endpoint | `/api/students/{id}/reset-password` |
|---|---|---|---|

**Request Body:**
```json
{ "newPassword": "NewPass@123" }
```

---

## 4. Teacher APIs

### 4.1 Get All Teachers
| Method | GET | Endpoint | `/api/teachers` |
|---|---|---|---|

### 4.2 Get Teacher by ID
| Method | GET | Endpoint | `/api/teachers/{id}` |
|---|---|---|---|

### 4.3 Update Teacher Profile
| Method | PUT | Endpoint | `/api/teachers/{id}` |
|---|---|---|---|

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "9999999999",
  "employeeId": "EMP002"
}
```

### 4.4 Delete Teacher
| Method | DELETE | Endpoint | `/api/teachers/{id}` |
|---|---|---|---|

> Cascades: deletes all courses, attendance, marks, assignments, materials

### 4.5 Update Teacher Status
| Method | PATCH | Endpoint | `/api/teachers/{id}/status` |
|---|---|---|---|

**Request Body:**
```json
{ "status": "Suspended" }
```

> status can be: `Active`, `Suspended`

---

## 5. Course APIs

### 5.1 Get All Courses
| Method | GET | Endpoint | `/api/courses` |
|---|---|---|---|

### 5.2 Get Course by ID
| Method | GET | Endpoint | `/api/courses/{id}` |
|---|---|---|---|

### 5.3 Get Courses by Teacher
| Method | GET | Endpoint | `/api/courses/teacher/{teacherId}` |
|---|---|---|---|

### 5.4 Get Courses by Department
| Method | GET | Endpoint | `/api/courses/department/{department}` |
|---|---|---|---|

### 5.5 Create Course
| Method | POST | Endpoint | `/api/courses` |
|---|---|---|---|

**Request Body:**
```json
{
  "courseName": "Data Structures",
  "credits": 4,
  "teacher": { "teacherId": 1 }
}
```

### 5.6 Update Course
| Method | PUT | Endpoint | `/api/courses/{id}` |
|---|---|---|---|

### 5.7 Delete Course
| Method | DELETE | Endpoint | `/api/courses/{id}` |
|---|---|---|---|

> Cascades: deletes all attendance, marks, assignments, materials for the course

---

## 6. Attendance APIs

### 6.1 Get Attendance by Student
| Method | GET | Endpoint | `/api/attendance/student/{studentId}` |
|---|---|---|---|

### 6.2 Get Attendance by Course
| Method | GET | Endpoint | `/api/attendance/course/{courseId}` |
|---|---|---|---|

### 6.3 Get Attendance by Course and Date
| Method | GET | Endpoint | `/api/attendance/course/{courseId}/date/{date}` |
|---|---|---|---|

> date format: `YYYY-MM-DD`

### 6.4 Get Attendance Stats by Course
| Method | GET | Endpoint | `/api/attendance/course/{courseId}/stats` |
|---|---|---|---|

**Response:** Attendance percentage per student

### 6.5 Mark Attendance
| Method | POST | Endpoint | `/api/attendance` |
|---|---|---|---|

**Request Body:**
```json
{
  "student": { "studentId": 1 },
  "course": { "courseId": 1 },
  "attendanceDate": "2026-04-21",
  "status": "Present"
}
```

> Upsert: updates existing record if same student+course+date exists

### 6.6 Update Attendance
| Method | PUT | Endpoint | `/api/attendance/{id}` |
|---|---|---|---|

**Request Body:**
```json
{ "status": "Absent" }
```

---

## 7. Marks APIs

### 7.1 Get Marks by Student
| Method | GET | Endpoint | `/api/marks/student/{studentId}` |
|---|---|---|---|

### 7.2 Get Marks by Course
| Method | GET | Endpoint | `/api/marks/course/{courseId}` |
|---|---|---|---|

### 7.3 Enter Marks
| Method | POST | Endpoint | `/api/marks` |
|---|---|---|---|

**Request Body:**
```json
{
  "student": { "studentId": 1 },
  "course": { "courseId": 1 },
  "marks": 85
}
```

> Grade is auto-calculated: O(90+), A+(80+), A(70+), B+(60+), B(below 60)

### 7.4 Update Marks
| Method | PUT | Endpoint | `/api/marks/{id}` |
|---|---|---|---|

### 7.5 Delete Marks
| Method | DELETE | Endpoint | `/api/marks/{id}` |
|---|---|---|---|

---

## 8. Assignment APIs

### 8.1 Get All Assignments
| Method | GET | Endpoint | `/api/assignments` |
|---|---|---|---|

### 8.2 Get Assignments by Course
| Method | GET | Endpoint | `/api/assignments/course/{courseId}` |
|---|---|---|---|

### 8.3 Create Assignment
| Method | POST | Endpoint | `/api/assignments` |
|---|---|---|---|

**Request Body:**
```json
{
  "course": { "courseId": 1 },
  "title": "Linked List Implementation",
  "description": "Implement singly and doubly linked lists",
  "dueDate": "2026-05-01"
}
```

### 8.4 Update Assignment
| Method | PUT | Endpoint | `/api/assignments/{id}` |
|---|---|---|---|

### 8.5 Delete Assignment
| Method | DELETE | Endpoint | `/api/assignments/{id}` |
|---|---|---|---|

---

## 9. Course Materials APIs

### 9.1 Get Materials by Course
| Method | GET | Endpoint | `/api/materials/course/{courseId}` |
|---|---|---|---|

### 9.2 Upload Material (File)
| Method | POST | Endpoint | `/api/materials/upload` |
|---|---|---|---|

**Request:** `multipart/form-data`

| Parameter | Type | Description |
|---|---|---|
| courseId | Integer | Course ID |
| teacherId | Integer | Teacher ID |
| title | String | Material title |
| description | String | Optional description |
| file | File | File to upload |

### 9.3 Add Material (Link)
| Method | POST | Endpoint | `/api/materials/link` |
|---|---|---|---|

**Request Body:**
```json
{
  "courseId": "1",
  "teacherId": "1",
  "title": "Reference Notes",
  "description": "Optional",
  "url": "https://example.com/notes"
}
```

### 9.4 Download Material
| Method | GET | Endpoint | `/api/materials/download/{id}` |
|---|---|---|---|

### 9.5 Delete Material
| Method | DELETE | Endpoint | `/api/materials/{id}` |
|---|---|---|---|

---

## 10. Submission APIs

### 10.1 Submit Assignment (File Upload)
| Method | POST | Endpoint | `/api/submissions/upload` |
|---|---|---|---|

**Request:** `multipart/form-data`

| Parameter | Type | Description |
|---|---|---|
| assignmentId | Integer | Assignment ID |
| studentId | Integer | Student ID |
| file | File | Submission file |

### 10.2 Get Submissions by Assignment
| Method | GET | Endpoint | `/api/submissions/assignment/{assignmentId}` |
|---|---|---|---|

### 10.3 Get Submissions by Student
| Method | GET | Endpoint | `/api/submissions/student/{studentId}` |
|---|---|---|---|

### 10.4 Check Submission Status
| Method | GET | Endpoint | `/api/submissions/check?assignmentId={id}&studentId={id}` |
|---|---|---|---|

**Response:**
```json
{
  "submitted": true,
  "submissionId": 1,
  "fileName": "assignment.pdf",
  "submittedAt": "2026-04-21T10:30:00",
  "grade": "A+",
  "comment": "Good work"
}
```

### 10.5 Grade Submission
| Method | PUT | Endpoint | `/api/submissions/{id}/grade` |
|---|---|---|---|

**Request Body:**
```json
{
  "grade": "A+",
  "comment": "Excellent work"
}
```

### 10.6 Download Submission
| Method | GET | Endpoint | `/api/submissions/download/{submissionId}` |
|---|---|---|---|

---

## 11. Health API

### 11.1 Database Health Check
| Method | GET | Endpoint | `/api/health/db` |
|---|---|---|---|

**Response:**
```json
{ "status": "Connected" }
```

---

## 12. System Settings APIs

### 12.1 Get System Settings
| Method | GET | Endpoint | `/api/system/settings` |
|---|---|---|---|

**Response:**
```json
{
  "id": 1,
  "activeYear": "2025-26",
  "activeSemester": "Even",
  "maintenanceMode": false,
  "registrationOpen": true
}
```

### 12.2 Update System Settings
| Method | PUT | Endpoint | `/api/system/settings` |
|---|---|---|---|

**Request Body:**
```json
{
  "maintenanceMode": true,
  "registrationOpen": false,
  "activeYear": "2025-26",
  "activeSemester": "Even"
}
```

---

## 13. Bulk Import APIs



### 11.1 Bulk Import Students
| Method | POST | Endpoint | `/api/bulk/students` |
|---|---|---|---|

**Request:** `multipart/form-data` with CSV file

**CSV Format:**
```
name,email,password,department,year,semester,phone,usn
Arjun Kumar,arjun@college.edu,Test@123,Computer Science and Engineering,3rd Year,Sem 5,9876543210,1VT22CS001
```

---

### 11.2 Bulk Import Teachers
| Method | POST | Endpoint | `/api/bulk/teachers` |
|---|---|---|---|

**CSV Format:**
```
name,email,password,department,phone,employeeId
Prof. Sharma,sharma@college.edu,Test@123,Computer Science and Engineering,9876543210,TCH001
```

---

### 11.3 Bulk Import Attendance
| Method | POST | Endpoint | `/api/bulk/attendance?courseId={id}&date={date}` |
|---|---|---|---|

**Request:** `multipart/form-data` with CSV file

**Query Parameters:**
- `courseId` — ID of the course
- `date` — Date in `YYYY-MM-DD` format

**CSV Format:**
```
usn,status
1VT22CS001,Present
1VT22CS002,Absent
1VT22CS003,Present
```

**Response:**
```json
{
  "success": true,
  "imported": 3,
  "errors": []
}
```

> Upsert: updates existing record if same student+course+date already exists

---

### 11.4 Bulk Import Marks
| Method | POST | Endpoint | `/api/bulk/marks?courseId={id}` |
|---|---|---|---|

**Request:** `multipart/form-data` with CSV file

**Query Parameters:**
- `courseId` — ID of the course

**CSV Format:**
```
usn,marks
1VT22CS001,85
1VT22CS002,72
1VT22CS003,91
```

**Response:**
```json
{
  "success": true,
  "imported": 3,
  "errors": []
}
```

> Grade is auto-calculated from marks. Updates existing record if already present.

---

## API Summary

| Module | Total Endpoints |
|---|---|
| Authentication | 9 |
| OTP / Password Reset | 5 |
| Students | 6 |
| Teachers | 5 |
| Courses | 7 |
| Attendance | 6 |
| Marks | 5 |
| Assignments | 5 |
| Course Materials | 5 |
| Submissions | 6 |
| Health | 1 |
| System Settings | 2 |
| Bulk Import | 4 |
| **Total** | **65** |

---

*EduTrack — VTU Internship 2026, Team 15*
