# Campus Canteen Management System (Frontend – React)

> **A modern, responsive web application frontend designed to provide an intuitive user interface for campus canteen operations.**

The Campus Canteen Management System frontend is a role-based React application that enables students to order food, manage their wallet, and track orders, while administrators can manage students, menu items, and process orders efficiently. The application uses modern frontend technologies and follows best practices for state management, routing, and API integration.

---

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Technology Stack](#-technology-stack)
- [User Roles & Responsibilities](#-user-roles--responsibilities)
- [Authentication & Authorization Flow](#-authentication--authorization-flow)
- [Application Structure](#-application-structure)
- [Key Modules Implemented](#-key-modules-implemented)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Setup & Installation](#-setup--installation)
- [Configuration](#-configuration)

---

## 🏗️ Architecture Overview

The application follows a **component-based architecture** with clear separation of concerns:

```
Pages → Components → Services → API → Backend
```

### Core Components

- **Frontend Framework**: React 18.2.0 (Component-based UI)
- **State Management**: Redux Toolkit (Centralized state)
- **Routing**: React Router v6 (Client-side routing)
- **UI Library**: Material-UI (MUI) 5.15.10 (Modern UI components)
- **HTTP Client**: Axios (API communication)
- **Form Management**: Formik + Yup (Form handling & validation)
- **Build Tool**: Create React App (CRA)

### Architecture Pattern

- **Component-Based**: Reusable, modular components
- **Container/Presentational**: Separation of logic and presentation
- **Service Layer**: Centralized API communication
- **State Management**: Redux for global state, local state for component-specific data

---

## 🛠️ Technology Stack

### Core Framework
- **React**: 18.2.0
- **React DOM**: 18.2.0
- **React Router DOM**: 6.22.0

### State Management
- **Redux Toolkit**: 2.11.2
- **React Redux**: 9.2.0
- **Redux**: 5.0.1

### UI & Styling
- **Material-UI (MUI)**: 5.15.10
  - Core components
  - Icons
  - Data Grid
- **Bootstrap**: 5.3.8
- **React Bootstrap**: 2.10.10
- **Emotion**: 11.11.3 (CSS-in-JS)

### HTTP & API
- **Axios**: 1.13.2
- **API Interceptors**: Request/Response handling

### Forms & Validation
- **Formik**: 2.4.5
- **Yup**: 1.3.3

### Additional Libraries
- **React Pro Sidebar**: 0.7.1 (Navigation sidebar)
- **React Icons**: 5.5.0
- **React Table**: 7.8.0
- **FullCalendar**: 6.1.10 (Calendar components)
- **Razorpay**: 2.9.2 (Payment integration)

---

## 👥 User Roles & Responsibilities

### 🎓 Student Interface

- **Registration & Login**: Secure authentication interface
- **Dashboard**: Personal dashboard with wallet balance and quick actions
- **Menu Browsing**: View daily menu and available items
- **Cart Management**: Add items to cart, modify quantities
- **Order Placement**: Place orders with cart items
- **Order History**: View previous orders and order status
- **Wallet Management**: Recharge wallet, view transaction history
- **Profile Management**: View and update personal information
- **Password Management**: Change password securely

### 🛠️ Admin Interface

- **Admin Login**: Secure admin authentication
- **Dashboard**: Admin dashboard with statistics and overview
- **Student Management**: 
  - View all registered students
  - Add new students
  - Edit student details
  - Delete students
  - View student count
- **Menu Management**: 
  - Manage menu items (Item Master)
  - Configure daily menu availability
- **Order Processing**: 
  - View pending orders
  - View completed orders
  - Process and update order status
  - View order details

**Role-based routing** ensures users can only access authorized pages.

---

## 🔐 Authentication & Authorization Flow

### 1️⃣ Registration Flow

1. Student navigates to `/register`
2. Fills registration form (name, email, password, course, etc.)
3. Form validation using Formik + Yup
4. API call to `/student/register`
5. On success, redirect to login page
6. Password is encrypted on backend (BCrypt)

### 2️⃣ Login Flow (Student / Admin)

1. User navigates to `/login`
2. Enters credentials (email, password)
3. API call to `/student/login` or `/admin/login`
4. Backend validates credentials and returns JWT token
5. Frontend stores:
   - JWT token in localStorage
   - Student ID
   - Email
   - Role (STUDENT / ADMIN)
6. Redux state updated with authentication status
7. Redirect based on role:
   - Student → `/student/dailymenu`
   - Admin → `/admin/dashboard`

### 3️⃣ JWT Token Management

- **Storage**: JWT token stored in localStorage
- **Request Interceptor**: Axios interceptor automatically adds token to headers
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response Interceptor**: Handles 401 errors, redirects to login
- **Token Validation**: Backend validates token on each protected request

### 4️⃣ Route Protection

- **Protected Routes**: 
  - `/student/**` → Requires STUDENT role
  - `/admin/**` → Requires ADMIN role
- **Public Routes**: 
  - `/` (Landing page)
  - `/login`
  - `/register`
- **Route Guards**: Check authentication status before rendering

### 5️⃣ Logout Flow

1. User clicks logout
2. Clear Redux state
3. Remove tokens from localStorage
4. Redirect to landing page or login

---

## 📁 Application Structure

```
src/
├── components/              # Reusable UI components
│   ├── admin/             # Admin-specific components
│   │   ├── common/       # Header, SideBar, StudentSidebar
│   │   ├── Dashboard/    # Dashboard components
│   │   ├── menu/         # Menu management components
│   │   └── order/        # Order management components
│   ├── StudentComponents/ # Student-specific components
│   │   ├── menu/         # Menu display components
│   │   └── ...           # Order, Wallet, Profile components
│   ├── LandingPage/      # Landing page components
│   └── common/           # Shared components (Tables, Search, etc.)
│
├── pages/                 # Page-level components
│   ├── admin/            # Admin pages
│   │   ├── Dashboard/    # Admin dashboard
│   │   ├── studentPages/ # Student management pages
│   │   ├── MenuPages/    # Menu management pages
│   │   └── orderPages/   # Order management pages
│   ├── student/          # Student pages
│   │   └── MenuList/     # Menu browsing pages
│   ├── Login.jsx         # Login page
│   └── Register.jsx      # Registration page
│
├── services/             # API service layer
│   ├── StudentService.jsx
│   ├── OrderService.jsx
│   ├── ItemMasterService.jsx
│   ├── ItemDailyService.jsx
│   ├── CartService.jsx
│   ├── RechargeHistoryService.jsx
│   └── api.js            # Axios instance configuration
│
├── redux/                # State management
│   ├── store.jsx         # Redux store configuration
│   └── slices/           # Redux slices
│       ├── authSlice.jsx      # Authentication state
│       ├── studentSlice.jsx   # Student data
│       ├── orderSlice.jsx     # Order data
│       ├── cartSlice.jsx      # Shopping cart
│       └── menuSlice.jsx      # Menu data
│
├── config/               # Configuration files
│   └── api.jsx           # API base URL and interceptors
│
├── theme.js              # Material-UI theme configuration
├── DataContext.js        # Context API (if used)
├── App.jsx               # Main App component with routing
└── index.js              # Application entry point
```

---

## 🧾 Key Modules Implemented

### ✔ Authentication Module

- **Login Component**: Student and admin login
- **Registration Component**: Student registration form
- **Auth Redux Slice**: Authentication state management
- **Token Management**: JWT token storage and handling
- **Route Protection**: Protected routes based on roles
- **Auto-logout**: Automatic logout on token expiration

### ✔ Student Module

- **Student Dashboard**: Overview with wallet balance
- **Menu Browsing**: 
  - Daily menu view
  - Available items grid
  - Item details and images
- **Cart Management**: 
  - Add/remove items
  - Update quantities
  - Cart persistence
- **Order Management**: 
  - Place orders
  - View order history
  - Order status tracking
- **Wallet Management**: 
  - View balance
  - Recharge wallet
  - Transaction history
- **Profile Management**: 
  - View profile
  - Update profile
  - Change password

### ✔ Admin Module

- **Admin Dashboard**: 
  - Statistics overview
  - Quick actions
  - System metrics
- **Student Management**: 
  - Student table with pagination
  - Add/Edit/Delete students
  - Student details view
  - Search and filter
- **Menu Management**: 
  - Item Master table
  - Daily menu configuration
  - Item availability management
- **Order Processing**: 
  - Pending orders table
  - Completed orders table
  - Order details view
  - Order status updates

### ✔ Common Components

- **Data Tables**: Reusable table components with sorting, filtering
- **Search & Filter**: Search boxes and filters
- **Sidebar Navigation**: Role-based navigation menus
- **Header**: Top navigation bar
- **Forms**: Reusable form components with validation

---

## 🔄 State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: null,
    studentId: string | null,
    email: string | null,
    isAuthenticated: boolean,
    isAdmin: boolean,
    loading: boolean,
    error: string | null
  },
  student: {
    profile: object,
    balance: number,
    loading: boolean,
    error: string | null
  },
  cart: {
    items: array,
    total: number,
    itemCount: number
  },
  order: {
    orders: array,
    currentOrder: object,
    loading: boolean,
    error: string | null
  },
  menu: {
    items: array,
    dailyMenu: array,
    loading: boolean,
    error: string | null
  }
}
```

### Redux Slices

1. **authSlice**: Authentication state, login/logout actions
2. **studentSlice**: Student profile and data
3. **cartSlice**: Shopping cart state
4. **orderSlice**: Order history and current orders
5. **menuSlice**: Menu items and daily menu

### State Persistence

- **localStorage**: JWT tokens, user ID, email, role
- **Redux State**: In-memory state (resets on refresh)
- **Session Persistence**: Authentication state persists across page refreshes

---

## 🌐 API Integration

### API Configuration

- **Base URL**: Configurable via environment variable or default `http://localhost:8080`
- **Axios Instance**: Centralized API client in `config/api.jsx`
- **Request Interceptors**: 
  - Automatically adds JWT token to headers
  - Adds student ID header when available
- **Response Interceptors**: 
  - Handles 401 errors (auto-logout)
  - Global error handling
  - Network error handling

### Service Layer

Each module has a dedicated service class:

- **StudentService**: Student operations, authentication
- **OrderService**: Order placement, history
- **ItemMasterService**: Menu item management
- **ItemDailyService**: Daily menu operations
- **CartService**: Cart operations
- **RechargeHistoryService**: Wallet transactions

### API Endpoints Used

#### Authentication
- `POST /student/register` - Student registration
- `POST /student/login` - Student login
- `POST /admin/login` - Admin login

#### Student Operations
- `GET /student/{id}` - Get student profile
- `PUT /student/{id}` - Update student profile
- `GET /student/{id}/balance` - Get wallet balance
- `PUT /student/{id}/balance` - Update wallet balance
- `PUT /student/changepassword/{id}` - Change password

#### Admin Operations
- `GET /admin/students` - Get all students
- `GET /admin/totalstudents` - Get student count
- `POST /admin/register/student` - Add student
- `DELETE /student/{id}` - Delete student

#### Order Operations
- `POST /order/place` - Place order
- `GET /order/student/{id}` - Get student orders
- `GET /admin/orders/pending` - Get pending orders
- `GET /admin/orders/completed` - Get completed orders

#### Menu Operations
- `GET /itemmaster/all` - Get all menu items
- `GET /itemdaily/today` - Get today's menu
- `POST /itemmaster/add` - Add menu item
- `PUT /itemmaster/{id}` - Update menu item

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js**: 16.x or higher
- **npm**: 6.x or higher (or use yarn)
- **Backend API**: Spring Boot backend running on `http://localhost:8080`

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd cmsreactapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API endpoint** (if needed)
   
   Create `.env` file in `cmsreactapp` directory:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```
   
   Or update `src/config/api.jsx`:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080';
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - The app will automatically open in your default browser

### Build for Production

```bash
npm run build
# or
yarn build
```

Production build will be in `build/` directory, ready for deployment.

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in `cmsreactapp` directory:

```env
REACT_APP_API_URL=http://localhost:8080
```

### API Configuration

Edit `src/config/api.jsx`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
```

### Theme Configuration

Material-UI theme can be customized in `src/theme.js`:

```javascript
// Customize colors, typography, spacing, etc.
```

### Routing Configuration

Routes are defined in `src/App.jsx`:

- Public routes: `/`, `/login`, `/register`
- Student routes: `/student/**`
- Admin routes: `/admin/**`

---

## 🎨 UI/UX Features

### Material-UI Components

- **Data Grid**: Advanced tables with sorting, filtering, pagination
- **Sidebar**: Collapsible navigation sidebar
- **Forms**: Validated forms with Formik + Yup
- **Dialogs**: Modal dialogs for confirmations
- **Snackbars**: Toast notifications for user feedback
- **Theme**: Dark/Light mode support (if configured)

### Responsive Design

- Mobile-friendly layouts
- Responsive tables and grids
- Adaptive navigation
- Touch-friendly interactions

### User Experience

- Loading states for async operations
- Error handling with user-friendly messages
- Form validation with real-time feedback
- Optimistic UI updates
- Smooth page transitions

---

## 🔒 Security Features

### Frontend Security

- **JWT Token Storage**: Secure token storage in localStorage
- **XSS Protection**: React's built-in XSS protection
- **Input Validation**: Client-side validation before API calls
- **Route Protection**: Protected routes based on authentication
- **Auto-logout**: Automatic logout on token expiration

### Best Practices

- No sensitive data in client-side code
- API keys and secrets never exposed
- Secure HTTP communication (HTTPS in production)
- Token refresh mechanism (if implemented)

---

## 📝 Development Notes

### Code Structure

- **Components**: Functional components with hooks
- **Services**: Class-based service layer for API calls
- **Redux**: Redux Toolkit for state management
- **Routing**: React Router v6 for navigation

### Development Workflow

1. Start backend server (`http://localhost:8080`)
2. Start frontend dev server (`npm start`)
3. Access application at `http://localhost:3000`
4. Hot reload enabled for development

### Testing

```bash
npm test
# or
yarn test
```

---

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure backend is running on `http://localhost:8080`
   - Check CORS configuration in backend
   - Verify API base URL in `config/api.jsx`

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT token expiration
   - Verify token is being sent in request headers

3. **Build Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Check Node.js version compatibility

---

## 📄 License

This project is part of a CDAC (Centre for Development of Advanced Computing) project.

---

## 👨‍💻 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

---

**Built with ❤️ using React 18 & Material-UI**
