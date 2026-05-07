# EduTrack — User Manual

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Version:** 1.0  
**Date:** April 2026

---

## Getting Started

### Accessing the Application

Open your browser and go to:
```
https://vtu-intern-2026-team15-java-fs.vercel.app
```

> If the app shows "Cannot connect to server", the backend may be sleeping. Open this link first and wait 30-50 seconds, then try again:
> https://edutrack-backend-o1ym.onrender.com/api/system/settings

---

## 1. Landing Page

When you open EduTrack, you will see the landing page with:
- EduTrack logo and description
- Feature highlights (Smart Attendance, Assignment Tracking, Marks & CGPA, Course Materials)
- **Sign In** button — click to go to the login page
- **Sign Up** button — click to register as a student

---

## 2. Login

### Steps to Login

1. Click **Sign In** on the landing page
2. Select your role by clicking one of the three buttons:
   - **Student** — for students
   - **Teacher** — for teachers
   - **Admin** — for administrators
3. Enter your **Email Address**
4. Enter your **Password**
5. Click **Sign in as [Role]**

### Default Admin Credentials
- Email: `admin@edutrack.com`
- Password: `Admin@123`

### Login Errors
- **"Invalid email or password"** — check your email and password
- **"Platform is under maintenance"** — admin has enabled maintenance mode, try again later
- **"Please fill in all fields"** — enter both email and password

> Switching between Student, Teacher, and Admin roles automatically clears the email and password fields.

---

## 3. Student Registration

Students can self-register when registration is open:

1. Click **Sign Up** on the landing page
2. Fill in all required fields:
   - Full Name
   - Email Address
   - Password
   - Department
   - Year
   - Semester
   - Phone Number
   - USN / Registration Number
3. Click **Register**

> If you see "New registrations are currently disabled", contact your admin.

---

## 4. Forgot Password

If you forgot your password:

1. On the login page, click **Forgot password?**
2. **Step 1 — Enter Email:**
   - Select your role (Student / Teacher / Admin)
   - Enter your registered email address
   - Click **Send OTP**
3. **Step 2 — Verify OTP:**
   - Check your email inbox for a 6-digit OTP
   - Enter the OTP in the field
   - Click **Verify OTP**
   - OTP expires in 10 minutes
4. **Step 3 — Reset Password:**
   - Enter your new password
   - Confirm the new password
   - Click **Reset Password**

---

## 5. Admin Portal

### 5.1 Dashboard

After logging in as Admin, you see the Admin Dashboard with:
- Total number of students and teachers
- Quick navigation to all sections

### 5.2 Managing Students

**View Students:**
- Click **Students** in the left sidebar
- All registered students are listed with their USN, department, year, and semester
- Use the search box to find students by name, email, or department

**Add Student:**
1. Click **+ Add Student**
2. Fill in: Name, Email, Password, Department, Year, Semester, Phone, USN
3. Click **Add Student**

**Edit Student:**
1. Click **Edit** next to a student
2. You can change: Name, Phone Number, Password
3. Department, Year, Semester, Email, and USN cannot be changed after registration
4. Click **Save Changes**

**Delete Student:**
1. Click **Delete** next to a student
2. Confirm the deletion
3. All related attendance, marks, and submissions are also deleted

**Update Student Status:**
- Click the status badge next to a student
- Change to: Active, Suspended, or Graduated

**Bulk Import Students:**
1. Click **Import** → select **CSV**
2. Download the template or prepare a CSV with columns:
   ```
   name,email,password,department,year,semester,phone,usn
   ```
3. Upload the CSV file
4. Review the import results

### 5.3 Managing Teachers

Same as managing students, with these differences:
- Teacher fields: Name, Email, Password, Department, Phone, Employee ID
- Status options: Active or Suspended
- Department cannot be changed after registration

### 5.4 System Settings

Click **Settings** in the sidebar → click the **System** tab:

| Setting | Description |
|---|---|
| Maintenance Mode | When ON, students and teachers cannot log in |
| Registration Open | When OFF, students cannot self-register |
| Active Year | Current academic year (e.g. 2025-26) |
| Active Semester | Current semester (e.g. Even) |

Click **Save Settings** after making changes.

### 5.5 Admin Profile

Click **Settings** → **Profile** tab:
- Update your name
- Click **Save Changes**

Click **Settings** → **Security** tab:
- Click **Change Password**
- Enter current password and new password
- Click **Update Password**

---

## 6. Teacher Portal

### 6.1 Dashboard

After logging in as Teacher, you see:
- Your courses overview
- Quick stats

### 6.2 Manage Courses

Click **Manage Courses** in the sidebar:

**Create Course:**
1. Click **+ New Course**
2. Enter Course Name and Credits
3. Click **Create**

**Edit Course:**
1. Click **Edit** on a course
2. Update name or credits
3. Click **Save**

**Delete Course:**
1. Click **Delete** on a course
2. Confirm — all attendance, marks, assignments, and materials for this course are deleted

### 6.3 Mark Attendance

Click **Mark Attendance** in the sidebar:

1. Select a **Course** from the dropdown
2. Select the **Date**
3. For each student, click **Present** or **Absent**
4. Click **Save Attendance**

> If attendance for the same date already exists, it will be updated automatically.

**Bulk Import Attendance:**
1. Click **Import CSV**
2. Prepare CSV with columns: `usn,status`
3. Upload the file

### 6.4 Enter Marks

Click **Enter Marks** in the sidebar:

1. Select a **Course**
2. For each student, enter their marks (0-100)
3. Grade is auto-calculated:
   - O (90-100), A+ (80-89), A (70-79), B+ (60-69), B (below 60)
4. Click **Save Marks**

**Bulk Import Marks:**
1. Click **Import CSV**
2. Prepare CSV with columns: `usn,marks`
3. Upload the file

### 6.5 Assignments

Click **Assignments** in the sidebar:

**Create Assignment:**
1. Select a course
2. Click **+ New Assignment**
3. Enter Title, Description, and Due Date
4. Click **Create**

**View Submissions:**
1. Click on an assignment
2. See all student submissions with file names and submission time
3. Click **Grade** to add a grade and feedback

### 6.6 Course Materials

Click **Course Materials** in the sidebar:

**Upload File:**
1. Select a course
2. Click **Upload File**
3. Enter title and optional description
4. Select the file
5. Click **Upload**

**Add Link:**
1. Click **Add Link**
2. Enter title and URL
3. Click **Add**

**Delete Material:**
- Click the delete icon next to a material

### 6.7 Teacher Profile

Click **Settings** → **Profile** tab:
- Update name and phone number
- Click **Save Changes**

Click **Settings** → **Security** tab:
- Change password

---

## 7. Student Portal

### 7.1 Dashboard

After logging in as Student, you see:
- Your attendance summary
- Recent marks
- Upcoming assignment deadlines

### 7.2 My Courses

Click **My Courses** in the sidebar:
- View all courses available in your department
- See course name, credits, and teacher name

### 7.3 Attendance

Click **Attendance** in the sidebar:
- View attendance for each course
- See your attendance percentage per course
- Dates marked Present are shown in green, Absent in red

### 7.4 My Marks

Click **My Marks** in the sidebar:
- View marks and grades for each course
- See your overall CGPA at the top

### 7.5 Assignments

Click **Assignments** in the sidebar:
- View all assignments with title, description, and due date
- Click **Submit** to upload your assignment file
- View your submission status and grade after teacher grades it

### 7.6 Materials

Click **Materials** in the sidebar:
- View all course materials uploaded by your teachers
- Click **Download** to download a file
- Click a link to open external resources

### 7.7 Student Profile

Click **Settings** → **Profile** tab:
- Update your name and phone number
- View your USN, department, year, and semester (read-only)
- Click **Save Changes**

Click **Settings** → **Security** tab:
- Change your password

---

## 8. Theme Toggle

Click the **moon/sun icon** in the top right corner to switch between:
- **Dark Mode** (default)
- **Light Mode**

---

## 9. Logout

Click the **Logout** button in the top right corner to end your session and return to the landing page.

---

## 10. Tips

- Always wake up the backend before a demo by visiting the backend health URL
- OTP for password reset expires in 10 minutes — use it quickly
- Bulk import CSV files must have the correct column headers
- Department, year, and semester cannot be changed after a student registers
- Admin can force reset any student or teacher password without knowing the current password

---

*EduTrack — VTU Internship 2026, Team 15*
