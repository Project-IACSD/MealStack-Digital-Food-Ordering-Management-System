# Campus Canteen Management System (Backend)

> **A role-based web application backend designed to digitize and automate canteen operations in a college campus.**

The Campus Canteen Management System is a comprehensive backend solution that supports secure authentication, authorization, student account management, and administrative control, using modern backend technologies and best practices.

---

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Technology Stack](#-technology-stack)
- [User Roles & Responsibilities](#-user-roles--responsibilities)
- [Authentication & Authorization Flow](#-authentication--authorization-flow)
- [Database Design](#-database-design)
- [Key Modules](#-key-modules-implemented)
- [API Documentation](#-api-documentation)
- [Setup & Installation](#-setup--installation)
- [Configuration](#-configuration)

---

## 🏗️ Architecture Overview

The application follows a **layered architecture** pattern:

```
Controller → Service → Repository → Database
```

### Core Components

- **Backend Framework**: Spring Boot 3.2.1 (RESTful architecture)
- **Security**: Spring Security 6 + JWT (Stateless authentication)
- **Database**: MySQL 8.0+
- **ORM**: Spring Data JPA (Hibernate 6)
- **API Documentation**: Swagger/OpenAPI 3 (springdoc-openapi)
- **Password Security**: BCrypt hashing
- **Authorization Model**: Role-Based Access Control (RBAC)

---

## 🛠️ Technology Stack

### Backend Framework
- **Spring Boot**: 3.2.1
- **Java**: 21
- **Maven**: Dependency Management

### Security & Authentication
- **Spring Security**: 6.x
- **JWT (JJWT)**: 0.11.5
- **BCrypt**: Password encryption

### Database & ORM
- **MySQL Connector**: 8.0+
- **Spring Data JPA**: Hibernate 6
- **Hibernate**: Auto DDL (update mode)

### API Documentation
- **springdoc-openapi**: 2.3.0
- **Swagger UI**: Integrated

### Utilities
- **Lombok**: Code generation
- **ModelMapper**: DTO mapping
- **Apache Commons**: Utility functions

---

## 👥 User Roles & Responsibilities

### 🎓 Student

- Register and log in securely
- Maintain a wallet balance
- View personal profile details
- Place orders
- View order history
- Recharge wallet
- Change password
- Access only student-specific APIs

### 🛠️ Admin

- Log in securely with admin credentials
- View all registered students
- Monitor total student count
- Manage menu items
- Process orders
- Access only admin-specific APIs

**Role enforcement** is handled using JWT claims + Spring Security filters.

---

## 🔐 Authentication & Authorization Flow

### 1️⃣ Registration

1. Student registers using `/student/register`
2. Password is encrypted using BCrypt
3. A linked `User` entity is created with role `STUDENT`
4. `Student` and `User` are saved using cascading

### 2️⃣ Login (Student / Admin)

1. Credentials are verified
2. On success, a JWT token is generated containing:
   - **Email** (subject)
   - **Role** (STUDENT / ADMIN)
   - **Issue time** & **expiration**
3. Token is returned to the client

### 3️⃣ JWT Validation

Every protected request must include:
```
Authorization: Bearer <JWT_TOKEN>
```

A custom JWT filter:
- Extracts token from header
- Validates signature & expiry
- Extracts role from claims
- Sets authentication in Spring Security context

### 4️⃣ Role-Based Access Control

- `/student/**` → accessible only by `STUDENT`
- `/admin/**` → accessible only by `ADMIN`
- Unauthorized access results in `401 Unauthorized` / `403 Forbidden`

---

## 🗄️ Database Design (Core Tables)

### `users` Table

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGINT | Primary key |
| `email` | VARCHAR | Unique login ID |
| `password` | VARCHAR | BCrypt encrypted |
| `role` | ENUM | STUDENT / ADMIN |

### `students` Table

| Field | Type | Description |
|-------|------|-------------|
| `student_id` | BIGINT | Primary key |
| `name` | VARCHAR | Student name |
| `email` | VARCHAR | Unique email |
| `mobile_no` | VARCHAR | Contact number |
| `balance` | DECIMAL | Wallet balance |
| `course_name` | ENUM | DAC, DBDA, etc. |
| `user_id` | BIGINT | FK → users.id |

### Entity Relationships

- **Student ↔ User**: One-to-One
- **Student ↔ Orders**: One-to-Many
- **Student ↔ RechargeHistory**: One-to-Many

---

## 🧾 Key Modules Implemented

### ✔ Student Module

- **Registration**: Secure student registration with password encryption
- **Login**: JWT-based authentication
- **Password Management**: Change password functionality
- **Balance Management**: Wallet operations
- **Profile CRUD**: View and update student profile
- **Order Management**: Place orders, view order history

### ✔ Admin Module

- **Admin Login**: Secure admin authentication
- **Dashboard Access**: Admin dashboard with statistics
- **Student Management**: View all students, student count
- **Menu Management**: CRUD operations for menu items
- **Order Processing**: Manage pending and completed orders

### ✔ Security Module

- **JWT Utility Class**: Token generation and validation
- **Custom JWT Authentication Filter**: Request interception and validation
- **Stateless Session Management**: No server-side sessions
- **Role-based Endpoint Restriction**: Spring Security configuration

### ✔ Additional Modules

- **Item Master**: Menu item management
- **Item Daily**: Daily menu availability
- **Order Management**: Order processing and tracking
- **Recharge History**: Wallet transaction history
- **Cart Management**: Shopping cart functionality

---

## 📑 API Documentation

### Swagger UI Integration

The application includes **Swagger UI** for interactive API documentation:

- **Access URL**: `http://localhost:8080/swagger-ui.html`
- **JWT Authorization**: Supported directly from Swagger UI
- **Clear API Visibility**: All endpoints documented with request/response schemas

### API Endpoints Overview

#### Public Endpoints
- `POST /student/register` - Student registration
- `POST /admin/login` - Admin login
- `POST /student/login` - Student login

#### Student Endpoints (Protected - STUDENT role)
- `GET /student/profile` - Get student profile
- `PUT /student/update` - Update student profile
- `POST /student/change-password` - Change password
- `GET /student/balance` - Get wallet balance
- `POST /student/recharge` - Recharge wallet
- `GET /student/orders` - Get order history
- `POST /student/place-order` - Place new order

#### Admin Endpoints (Protected - ADMIN role)
- `GET /admin/students` - Get all students
- `GET /admin/students/count` - Get total student count
- `GET /admin/dashboard` - Admin dashboard data
- `GET /admin/orders/pending` - Get pending orders
- `GET /admin/orders/completed` - Get completed orders

---

## 🚀 Setup & Installation

### Prerequisites

- **Java**: JDK 21 or higher
- **Maven**: 3.6+ (or use included Maven Wrapper)
- **MySQL**: 8.0 or higher
- **IDE**: IntelliJ IDEA / Eclipse / VS Code (optional)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Campus-Canteen-Management-System-main/Backend/backend
   ```

2. **Configure Database**
   - Create MySQL database (or let Spring Boot create it automatically)
   - Update `application.properties` with your database credentials:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/cms?createDatabaseIfNotExist=true
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Configure JWT Secret**
   - Update JWT secret in `application.properties`:
     ```properties
     jwt.secret=YOUR_32_CHAR_MINIMUM_SECRET_KEY_HERE
     jwt.expiration.time=86400000  # 24 hours in milliseconds
     ```

4. **Build the project**
   ```bash
   # Using Maven Wrapper (Windows)
   mvnw.cmd clean install
   
   # Using Maven Wrapper (Linux/Mac)
   ./mvnw clean install
   
   # Or using installed Maven
   mvn clean install
   ```

5. **Run the application**
   ```bash
   # Using Maven Wrapper
   mvnw.cmd spring-boot:run
   
   # Or using installed Maven
   mvn spring-boot:run
   ```

6. **Access the application**
   - **API Base URL**: `http://localhost:8080`
   - **Swagger UI**: `http://localhost:8080/swagger-ui.html`
   - **API Docs (JSON)**: `http://localhost:8080/v3/api-docs`

---

## ⚙️ Configuration

### Application Properties

Key configuration in `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/cms?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root123

# JPA Configuration
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false

# JWT Configuration
jwt.secret=THIS_IS_A_32_CHAR_MINIMUM_SECRET_KEY_123
jwt.expiration.time=86400000
```

### Security Configuration

- **CORS**: Configured for cross-origin requests
- **JWT Filter**: Applied to all requests except public endpoints
- **Password Encoding**: BCrypt with strength 10

### Database Auto-Configuration

- **DDL Mode**: `update` (automatically creates/updates tables)
- **Show SQL**: Enabled for development (disable in production)

---

## 📝 Notes

- **Development Mode**: SQL queries are logged to console
- **Production Ready**: Update `application.properties` for production environment
- **Security**: Change default JWT secret before deployment
- **Database**: Ensure MySQL is running before starting the application

---

## 📄 License

This project is part of a CDAC (Centre for Development of Advanced Computing) project.

---

## 👨‍💻 Development

### Project Structure

```
src/main/java/com/app/
├── Application.java              # Main application class
├── config/                       # Configuration classes
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── SwaggerConfig.java
├── controller/                   # REST Controllers
├── dto/                          # Data Transfer Objects
├── entities/                     # JPA Entities
├── repository/                   # Data Access Layer
├── service/                      # Business Logic Layer
├── security/                     # JWT & Security
└── exc_handler/                  # Exception Handling
```

---

**Built with ❤️ using Spring Boot 3.x**
