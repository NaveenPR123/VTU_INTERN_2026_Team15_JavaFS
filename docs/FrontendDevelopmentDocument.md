# EduTrack — Frontend Development Document

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Technology:** React 19  
**Date:** April 2026

---

## 1. React Application Overview

EduTrack's frontend is built using **React 19**, a JavaScript library for building user interfaces. The application is a Single Page Application (SPA) that dynamically renders content based on the logged-in user's role without full page reloads.

The app was bootstrapped using **Create React App** which provides a pre-configured build setup with Webpack, Babel, and ESLint out of the box.

**Key characteristics:**
- Single Page Application (SPA)
- Hash-based routing using `window.history.pushState`
- Role-based rendering — different portals for Admin, Teacher, and Student
- Dark/Light theme support using React Context
- Fully responsive layout

---

## 2. Folder Structure

```
EduTrack-Frontend/
├── public/
│   ├── index.html
│   ├── favicon.png
│   └── edutrack-logo.png
├── src/
│   ├── assets/              # CSS files and static images
│   │   ├── App.css
│   │   ├── LandingPage.css
│   │   ├── index.css
│   │   └── edutrack-logo.png
│   ├── components/          # Reusable UI components
│   │   └── ThemeToggle.jsx
│   ├── context/             # React Context providers
│   │   └── ThemeContext.jsx
│   ├── pages/               # Full page components
│   │   ├── Dashboard.jsx    # Main dashboard (all portals)
│   │   ├── Login.jsx        # Login page
│   │   ├── Signup.jsx       # Student registration
│   │   ├── ForgotPassword.jsx
│   │   └── LandingPage.jsx
│   ├── App.js               # Root component and routing
│   ├── theme.js             # Font and theme constants
│   └── index.js             # Entry point
├── tests/
│   └── e2e/                 # Playwright E2E tests
├── .env                     # Environment variables
├── .env.example             # Template for env variables
├── package.json
└── playwright.config.js
```

---

## 3. Components and Hooks

### 3.1 Pages (Major Components)

| Component | Description |
|---|---|
| `LandingPage.jsx` | Home page with features overview and navigation |
| `Login.jsx` | Role-based login with Student, Teacher, Admin selector |
| `Signup.jsx` | Student self-registration form |
| `ForgotPassword.jsx` | 3-step OTP-based password reset |
| `Dashboard.jsx` | Main application — contains all portals |

### 3.2 Dashboard Sub-Components (inside Dashboard.jsx)

| Component | Role | Description |
|---|---|---|
| `AdminDashboard` | Admin | Overview stats |
| `AdminStudents` | Admin | Student CRUD management |
| `AdminTeachers` | Admin | Teacher CRUD management |
| `AdminCourses` | Admin | Course management |
| `StudentDashboard` | Student | Student overview |
| `StudentCourses` | Student | View available courses |
| `StudentAttendance` | Student | View attendance per course |
| `StudentAssignments` | Student | View and submit assignments |
| `StudentMarks` | Student | View marks and CGPA |
| `StudentMaterials` | Student | View and download materials |
| `TeacherDashboard` | Teacher | Teacher overview |
| `TeacherCourses` | Teacher | Manage courses |
| `TeacherAttendance` | Teacher | Mark and view attendance |
| `TeacherAssignments` | Teacher | Create and manage assignments |
| `TeacherMarks` | Teacher | Enter and update marks |
| `TeacherMaterials` | Teacher | Upload course materials |
| `Settings` | All | Profile, password, system settings |
| `ChangePasswordModal` | All | Change password modal |

### 3.3 Reusable Components

| Component | Description |
|---|---|
| `ThemeToggle.jsx` | Dark/Light mode toggle button |
| `PasswordField` | Password input with show/hide toggle |
| `NavGlyph` | SVG icon renderer for navigation |

### 3.4 React Hooks Used

| Hook | Usage |
|---|---|
| `useState` | Managing local component state (forms, loading, errors) |
| `useEffect` | Fetching data on component mount and dependency changes |
| `useContext` | Accessing theme (dark/light) from ThemeContext |

---

## 4. Role-Based Access Logic

EduTrack implements role-based access on the frontend by rendering completely different portals based on the logged-in user's role.

### 4.1 How it works

When a user logs in, the backend returns a `role` field (`admin`, `teacher`, or `student`). This role is stored in the `App.js` state and passed down to the `Dashboard` component.

```javascript
// App.js
const [role, setRole] = useState("student");
const [user, setUser] = useState(null);

const handleLogin = (r, data) => {
  setRole(r);      // "admin", "teacher", or "student"
  setUser(data);   // user profile data
  setPage("dashboard");
};
```

### 4.2 Portal Rendering

The `Dashboard` component checks the role and renders the appropriate portal:

```javascript
// Dashboard.jsx
const isStudent = role === "student";
const isAdmin   = role === "admin";
const isTeacher = role === "teacher";

// Navigation items change per role
const navItems = isStudent ? STUDENT_NAV : isAdmin ? ADMIN_NAV : TEACHER_NAV;

// Pages rendered per role
case "Settings":
  return <Settings role={role} user={user} />;
```

### 4.3 Navigation per Role

| Role | Navigation Items |
|---|---|
| Admin | Dashboard, Students, Teachers, Courses, Settings |
| Teacher | Dashboard, Manage Courses, Mark Attendance, Assignments, Enter Marks, Course Materials, Settings |
| Student | Dashboard, My Courses, Attendance, Assignments, My Marks, Materials, Settings |

### 4.4 Maintenance Mode

When maintenance mode is enabled by admin, students and teachers see an error on login:
```
"Platform is under maintenance. Please try again later."
```
Admin login is not affected by maintenance mode.

---

## 5. Modules Installed

| Module | Version | Purpose |
|---|---|---|
| `react` | 19.2.4 | Core React library |
| `react-dom` | 19.2.4 | DOM rendering |
| `react-scripts` | 5.0.1 | Build toolchain (CRA) |
| `@testing-library/react` | 16.3.2 | Component testing utilities |
| `@testing-library/jest-dom` | 6.9.1 | Jest DOM matchers |
| `@testing-library/user-event` | 13.5.0 | User interaction simulation |
| `@playwright/test` | Latest | End-to-end browser testing |
| `web-vitals` | 2.1.4 | Performance metrics |
| `@fortawesome/fontawesome-free` | 7.2.0 | Icon library |

> Note: EduTrack uses the native **Fetch API** for HTTP requests instead of Axios, and **window.history** for routing instead of react-router-dom, keeping the dependency footprint minimal.

---

## 6. APIs Used

### 6.1 Internal REST API (EduTrack Backend)

All data operations use the EduTrack Spring Boot backend REST API.

| Base URL (Local) | `http://localhost:8080` |
|---|---|
| Base URL (Production) | `https://edutrack-backend-o1ym.onrender.com` |

The API URL is configured via environment variable:
```
REACT_APP_API_URL=http://localhost:8080
```

Used in frontend as:
```javascript
const API = process.env.REACT_APP_API_URL || "http://localhost:8080";
fetch(`${API}/api/auth/login/admin`, { ... });
```

### 6.2 Gmail SMTP (via Backend)

OTP emails for password reset are sent through the backend using Gmail SMTP. The frontend triggers this by calling:
```
POST /api/otp/forgot-password
```
The backend handles the actual email sending — the frontend only makes the API call.

### 6.3 No Third-Party APIs

EduTrack does not use any third-party APIs such as:
- No payment gateway
- No map API
- No chatbot/AI API
- No social login (Google/Facebook)

All functionality is self-contained within the EduTrack backend.

---

## 7. REST API Integration

The frontend communicates with the backend exclusively through **REST APIs** using the native **Fetch API**.

### 7.1 Standard API Call Pattern

```javascript
const res = await fetch(`${API}/api/auth/login/admin`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});
const data = await res.json();
if (data.success) {
  // handle success
} else {
  setError(data.message);
}
```

### 7.2 File Upload Pattern (multipart/form-data)

```javascript
const formData = new FormData();
formData.append("file", file);
formData.append("courseId", courseId);

const res = await fetch(`${API}/api/materials/upload`, {
  method: "POST",
  body: formData   // No Content-Type header — browser sets it automatically
});
```

### 7.3 Error Handling

All API calls are wrapped in try-catch blocks:
```javascript
try {
  const res = await fetch(...);
  if (!res.ok) {
    setError(`Server error (${res.status})`);
    return;
  }
  const data = await res.json();
  if (!data.success) setError(data.message);
} catch {
  setError("Cannot connect to server. Make sure the backend is running.");
}
```

### 7.4 API Modules Covered

| Module | Endpoints Used |
|---|---|
| Authentication | Login, Register, Change Password |
| OTP | Send OTP, Verify OTP, Reset Password |
| Students | CRUD, Status update, Bulk import |
| Teachers | CRUD, Status update, Bulk import |
| Courses | CRUD |
| Attendance | Mark, View, Bulk import |
| Marks | Enter, View, Bulk import |
| Assignments | CRUD |
| Submissions | Upload, View, Download |
| Course Materials | Upload, Link, Download, Delete |
| System Settings | Get, Update |

---

## 8. Theme System

EduTrack supports **Dark and Light mode** using React Context.

```javascript
// ThemeContext.jsx
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

All components access the theme via:
```javascript
const { theme: C } = useTheme();
// Use C.text, C.surface, C.teal, etc.
```

---

## 9. Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend API base URL |
| `DISABLE_ESLINT_PLUGIN` | Disables ESLint during production build |

---

*EduTrack — VTU Internship 2026, Team 15*
