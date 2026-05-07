# EduTrack — High Level Design (HLD) & Low Level Design (LLD)

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Version:** 1.0  
**Date:** April 2026

---

# PART 1 — HIGH LEVEL DESIGN (HLD)

---

## 1. System Architecture

EduTrack follows a 3-tier architecture:

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                      │
│              React 19 (Vercel CDN)                       │
│   Admin Portal | Teacher Portal | Student Portal         │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS REST API (JSON)
┌─────────────────────▼───────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                    │
│           Spring Boot 3 (Render - Docker)                │
│   Controllers → Services → Repositories                  │
└─────────────────────┬───────────────────────────────────┘
                      │ JDBC (HikariCP Connection Pool)
┌─────────────────────▼───────────────────────────────────┐
│                    DATA LAYER                            │
│              MySQL 9.4 (Railway Cloud)                   │
│              11 Tables, Foreign Keys                     │
└─────────────────────────────────────────────────────────┘
```

---

## 2. System Context Diagram

Paste at https://www.plantuml.com/plantuml/uml to generate:

```plantuml
@startuml
skinparam actorStyle awesome
left to right direction

actor Admin
actor Teacher
actor Student
actor "Gmail SMTP" as Gmail

rectangle "EduTrack System" {
  component "React Frontend\n(Vercel)" as FE
  component "Spring Boot API\n(Render)" as BE
  database "MySQL\n(Railway)" as DB
}

Admin --> FE : manages platform
Teacher --> FE : manages courses
Student --> FE : views academic data
FE --> BE : REST API calls
BE --> DB : JDBC queries
BE --> Gmail : sends OTP emails
@enduml
```

---

## 3. Component Diagram

```plantuml
@startuml
package "Frontend (React)" {
  [Login Page]
  [Signup Page]
  [ForgotPassword Page]
  [Admin Portal]
  [Teacher Portal]
  [Student Portal]
  [ThemeContext]
}

package "Backend (Spring Boot)" {
  [AuthController]
  [OtpController]
  [AppControllers]
  [BulkImportController]
  [CourseMaterialController]
  [SubmissionController]
  [SystemSettingsController]
  [AuthService]
  [OtpService]
  [EmailService]
}

package "Database (MySQL)" {
  [admins]
  [teachers]
  [students]
  [courses]
  [attendance]
  [marks]
  [assignments]
  [submissions]
  [course_materials]
  [otp_verification]
  [system_settings]
}

[Login Page] --> [AuthController]
[Admin Portal] --> [AppControllers]
[Teacher Portal] --> [AppControllers]
[Student Portal] --> [AppControllers]
[ForgotPassword Page] --> [OtpController]
[AuthController] --> [AuthService]
[OtpController] --> [OtpService]
[OtpService] --> [EmailService]
[AuthService] --> [students]
[AuthService] --> [teachers]
[AuthService] --> [admins]
@enduml
```

---

## 4. Deployment Diagram

```plantuml
@startuml
node "Developer Machine" {
  [Source Code]
}

node "GitHub" {
  [Repository]
}

node "Vercel (CDN)" {
  [React Build\n(Static Files)]
}

node "Render (Docker)" {
  [Spring Boot JAR\n(Port 8080)]
}

node "Railway (Cloud)" {
  database "MySQL 9.4\n(Port 12491)"
}

node "Gmail" {
  [SMTP Server\n(Port 587)]
}

[Source Code] --> [Repository] : git push
[Repository] --> [React Build\n(Static Files)] : auto-deploy
[Repository] --> [Spring Boot JAR\n(Port 8080)] : auto-deploy (Docker)
[Spring Boot JAR\n(Port 8080)] --> [MySQL 9.4\n(Port 12491)] : JDBC
[Spring Boot JAR\n(Port 8080)] --> [SMTP Server\n(Port 587)] : OTP emails
[React Build\n(Static Files)] --> [Spring Boot JAR\n(Port 8080)] : REST API
@enduml
```

---

## 5. Authentication Flow Diagram

```plantuml
@startuml
actor User
participant "Login Page" as LP
participant "AuthController" as AC
participant "AuthService" as AS
database "MySQL" as DB

User -> LP : Enter email, password, select role
LP -> AC : POST /api/auth/login/{role}
AC -> AS : loginAdmin/Student/Teacher(email, password)
AS -> DB : findByEmail(email)
DB --> AS : user record
AS -> AS : BCrypt.matches(password, hash)
alt valid credentials
  AS --> AC : {success: true, role, userId, name, ...}
  AC --> LP : 200 OK
  LP --> User : Redirect to portal
else invalid credentials
  AS --> AC : {success: false, message: "Invalid email or password"}
  AC --> LP : 200 OK
  LP --> User : Show error message
end
@enduml
```

---

## 6. OTP Password Reset Flow Diagram

```plantuml
@startuml
actor User
participant "ForgotPassword\nPage" as FP
participant "OtpController" as OC
participant "OtpService" as OS
participant "EmailService" as ES
database "otp_verification" as DB

User -> FP : Enter email + select role
FP -> OC : POST /api/otp/forgot-password {email, role}
OC -> OC : Check email exists for role
alt email not found
  OC --> FP : {success: false, "No account found"}
  FP --> User : Show error
else email found
  OC -> OS : sendPasswordResetOtp(email)
  OS -> DB : deleteByEmail(email)
  OS -> OS : Generate 6-digit OTP (SecureRandom)
  OS -> DB : Save OTP (expiry = now + 10 min, used = false)
  OS -> ES : sendPasswordResetEmail(email, otp)
  ES --> User : OTP email sent
  FP --> User : Show OTP input
  User -> FP : Enter OTP
  FP -> OC : POST /api/otp/verify {email, otp}
  OC -> OS : validateOtp(email, otp)
  OS -> DB : findTopByEmailOrderByIdDesc(email)
  alt OTP valid
    OS -> DB : Set used = true
    OS --> OC : true
    FP --> User : Show new password form
    User -> FP : Enter new password
    FP -> OC : POST /api/auth/reset-password/{role}
    OC -> DB : BCrypt encode + save
    FP --> User : Password reset successful
  else OTP invalid/expired/used
    OS --> OC : false
    FP --> User : Show error
  end
end
@enduml
```

---

## 7. Mark Attendance Flow

```plantuml
@startuml
actor Teacher
participant "TeacherAttendance\nComponent" as TA
participant "AttendanceController" as AC
database "attendance" as DB

Teacher -> TA : Select course, date, mark students
TA -> AC : POST /api/attendance {studentId, courseId, date, status}
AC -> DB : findByStudent+Course+Date (check existing)
alt record exists
  AC -> DB : Update status (upsert)
else new record
  AC -> DB : Insert new attendance record
end
DB --> AC : saved record
AC --> TA : 200 OK
TA --> Teacher : Attendance saved
@enduml
```

---

---

# PART 2 — LOW LEVEL DESIGN (LLD)

---

## 8. Entity Class Diagram

```plantuml
@startuml
class Student {
  +Integer studentId
  +String name
  +String email
  -String password
  +String phone
  +String usn
  +String department
  +String year
  +String semester
  +String status
  +Course course
}

class Teacher {
  +Integer teacherId
  +String name
  +String email
  -String password
  +String department
  +String phone
  +String employeeId
  +String status
}

class Admin {
  +Integer adminId
  +String name
  +String email
  -String password
}

class Course {
  +Integer courseId
  +String courseName
  +Integer credits
  +Teacher teacher
}

class Attendance {
  +Integer attendanceId
  +Student student
  +Course course
  +LocalDate attendanceDate
  +String status
}

class Marks {
  +Integer markId
  +Student student
  +Course course
  +Integer marks
  +String grade
}

class OtpVerification {
  +Long id
  +String email
  +String otp
  +LocalDateTime expiryTime
  +boolean used
}

class SystemSettings {
  +Integer id
  +String activeYear
  +String activeSemester
  +boolean maintenanceMode
  +boolean registrationOpen
}

Teacher "1" --> "many" Course : teaches
Course "1" --> "many" Attendance : has
Student "1" --> "many" Attendance : recorded in
Course "1" --> "many" Marks : assessed in
Student "1" --> "many" Marks : receives
@enduml
```

---

## 9. Correct Entity Code

### 9.1 Student Entity (Actual)

```java
@Entity
@Table(name = "students")
@Data @NoArgsConstructor @AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studentId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(unique = true)
    private String usn;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String year;

    private String semester;

    @Column(nullable = false)
    private String status = "Active"; // Active, Suspended, Graduated

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}
```

### 9.2 Teacher Entity (Actual)

```java
@Entity
@Table(name = "teachers")
@Data @NoArgsConstructor @AllArgsConstructor
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer teacherId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String department;

    private String phone;

    @Column(unique = true)
    private String employeeId;

    @Column(nullable = false)
    private String status = "Active"; // Active, Suspended
}
```

### 9.3 Attendance Entity (Actual)

```java
@Entity
@Table(name = "attendance",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"student_id","course_id","attendance_date"}))
@Data @NoArgsConstructor @AllArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer attendanceId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private LocalDate attendanceDate;

    @Column(nullable = false)
    private String status; // Present or Absent
}
```

---

## 10. Service Method Design

### 10.1 AuthService.loginAdmin()

```
Input:  email: String, password: String
Output: Map<String, Object>

Steps:
  1. adminRepo.findByEmail(email)
  2. If empty OR !BCrypt.matches(password, hash) → {success:false}
  3. Build response: {success:true, adminId, name, email, role:"admin"}
  4. Return response
```

### 10.2 OtpService.validateOtp()

```
Input:  email: String, otp: String
Output: boolean

Steps:
  1. otpRepo.findTopByEmailOrderByIdDesc(email)
  2. If empty → return false
  3. If otpEntity.isUsed() → return false
  4. If otpEntity.expiryTime.isBefore(now) → return false
  5. If !otpEntity.otp.equals(otp) → return false
  6. otpEntity.setUsed(true) → otpRepo.save()
  7. Return true
```

### 10.3 MarksController.enterMarks()

```
Input:  Marks {student, course, marks}
Output: Marks with grade

Grade calculation:
  marks >= 90 → "O"
  marks >= 80 → "A+"
  marks >= 70 → "A"
  marks >= 60 → "B+"
  else        → "B"
```

---

## 11. Repository Methods

### 11.1 StudentRepository

```java
Optional<Student> findByEmail(String email);
boolean existsByEmail(String email);
Optional<Student> findByUsn(String usn);
List<Student> findByDepartmentIgnoreCase(String department);
```

### 11.2 AttendanceRepository

```java
List<Attendance> findByStudent_StudentId(Integer studentId);
List<Attendance> findByCourse_CourseId(Integer courseId);
List<Attendance> findByCourse_CourseIdAndAttendanceDate(Integer courseId, LocalDate date);
Optional<Attendance> findByStudent_StudentIdAndCourse_CourseIdAndAttendanceDate(
    Integer studentId, Integer courseId, LocalDate date);
void deleteByStudent_StudentId(Integer studentId);
void deleteByCourse_CourseId(Integer courseId);
```

### 11.3 OtpRepository

```java
Optional<OtpVerification> findTopByEmailOrderByIdDesc(String email);
void deleteByEmail(String email);
```

---

## 12. Security Configuration

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll()
        );
    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(List.of("*"));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    // ...
}
```

---

*EduTrack — VTU Internship 2026, Team 15*
