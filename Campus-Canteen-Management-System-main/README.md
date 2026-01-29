# Campus Canteen Management System

> **A full-stack web application for digitizing and automating canteen operations in college campuses**

A comprehensive role-based management system that enables students to order food, manage their wallet, and track orders, while administrators can manage students, menu items, and process orders efficiently.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)

---

## 🎯 Project Overview

The Campus Canteen Management System is a complete solution designed to modernize canteen operations in educational institutions. The system provides:

- **Student Portal**: Order food, manage wallet, view order history
- **Admin Portal**: Manage students, menu items, and process orders
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Real-time Updates**: Live order status and menu availability

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 21
- **Security**: Spring Security 6 + JWT
- **Database**: MySQL 8.0+
- **ORM**: Spring Data JPA (Hibernate 6)
- **API Documentation**: Swagger/OpenAPI 3
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18+
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: npm/yarn

---

## ✨ Features

### Student Features
- ✅ User registration and secure login
- ✅ Browse daily menu and available items
- ✅ Add items to cart and place orders
- ✅ View order history and status
- ✅ Wallet management and recharge
- ✅ View recharge history
- ✅ Change password
- ✅ Profile management

### Admin Features
- ✅ Secure admin login
- ✅ Dashboard with statistics
- ✅ Student management (CRUD operations)
- ✅ Menu item management
- ✅ Daily menu configuration
- ✅ Order processing (pending/completed)
- ✅ View all orders and order details

### Security Features
- ✅ JWT-based stateless authentication
- ✅ Role-based access control (RBAC)
- ✅ BCrypt password encryption
- ✅ Secure API endpoints
- ✅ CORS configuration

---

## 📁 Project Structure

```
Campus-Canteen-Management-System-main/
├── Backend/
│   └── backend/                 # Spring Boot Backend
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/app/
│       │   │   │   ├── config/      # Security, CORS, Swagger config
│       │   │   │   ├── controller/  # REST Controllers
│       │   │   │   ├── dto/         # Data Transfer Objects
│       │   │   │   ├── entities/    # JPA Entities
│       │   │   │   ├── repository/  # Data Access Layer
│       │   │   │   ├── service/     # Business Logic
│       │   │   │   └── security/    # JWT & Security
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       ├── pom.xml
│       └── README.md              # Backend Documentation
│
├── cmsreactapp/                  # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── admin/           # Admin components
│   │   │   ├── StudentComponents/ # Student components
│   │   │   └── LandingPage/     # Landing page components
│   │   ├── pages/               # Page components
│   │   │   ├── admin/          # Admin pages
│   │   │   └── customer/       # Student pages
│   │   ├── services/            # API service layer
│   │   ├── redux/              # State management
│   │   ├── config/             # Configuration
│   │   └── App.jsx             # Main App component
│   ├── package.json
│   └── README.md
│
├── ER_Diagrams/                  # Database ER Diagrams
├── Ppts/                        # Project Presentations
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Java**: JDK 21 or higher
- **Node.js**: 16.x or higher
- **MySQL**: 8.0 or higher
- **Maven**: 3.6+ (or use Maven Wrapper)
- **npm** or **yarn**

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd Backend/backend
   ```

2. Configure database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/cms?createDatabaseIfNotExist=true
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Configure JWT secret:
   ```properties
   jwt.secret=YOUR_32_CHAR_MINIMUM_SECRET_KEY
   ```

4. Build and run:
   ```bash
   # Windows
   mvnw.cmd clean install
   mvnw.cmd spring-boot:run
   
   # Linux/Mac
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

5. Backend will run on `http://localhost:8080`
6. Access Swagger UI at `http://localhost:8080/swagger-ui.html`

**For detailed backend documentation, see [Backend/backend/README.md](Backend/backend/README.md)**

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd cmsreactapp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure API endpoint in `src/config/api.jsx` (if needed):
   ```javascript
   const API_BASE_URL = 'http://localhost:8080';
   ```

4. Start development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Frontend will run on `http://localhost:3000`

---

## 📚 Documentation

### Backend Documentation
- **Location**: `Backend/backend/README.md`
- **Includes**: Architecture, API endpoints, security flow, database design

### API Documentation
- **Swagger UI**: `http://localhost:8080/swagger-ui.html` (when backend is running)
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

### Database Documentation
- **ER Diagrams**: See `ER_Diagrams/` folder
- **Schema**: Auto-generated by Hibernate (update mode)

---

## 🔐 Authentication Flow

1. **Registration**: Student registers → Password encrypted with BCrypt → User entity created
2. **Login**: Credentials verified → JWT token generated (contains email, role, expiration)
3. **Authorization**: Token validated on each request → Role extracted → Access granted/denied
4. **Role-Based Access**: 
   - `/student/**` → STUDENT role only
   - `/admin/**` → ADMIN role only

---

## 🗄️ Database Schema

### Core Tables
- **users**: Authentication (email, password, role)
- **students**: Student profiles (name, email, balance, course)
- **orders**: Order management
- **item_master**: Menu items
- **item_daily**: Daily menu availability
- **recharge_history**: Wallet transactions
- **cart**: Shopping cart

See `ER_Diagrams/` for complete database schema.

---

## 🧪 Testing

### Backend Testing
```bash
cd Backend/backend
mvnw test
```

### Frontend Testing
```bash
cd cmsreactapp
npm test
```

---

## 📦 Build for Production

### Backend
```bash
cd Backend/backend
mvnw clean package
# JAR file will be in target/ directory
java -jar target/cms_backend-0.0.1.jar
```

### Frontend
```bash
cd cmsreactapp
npm run build
# Production build will be in build/ directory
```

---

## 🤝 Contributing

This is a CDAC (Centre for Development of Advanced Computing) project.

---

## 📄 License

This project is part of an academic project.

---

## 👥 Authors

CDAC Project Team

---

## 📞 Support

For issues and questions, please refer to the documentation in respective directories:
- Backend: `Backend/backend/README.md`
- Frontend: `cmsreactapp/README.md`

---

**Built with ❤️ using Spring Boot & React**
