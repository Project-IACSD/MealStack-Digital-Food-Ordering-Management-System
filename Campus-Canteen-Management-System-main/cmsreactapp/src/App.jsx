import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { DataProvider } from './DataContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from './components/LandingPage/LandingPage';

// Common layout
import SideBar from './components/admin/common/SideBar';
import StudentSideBar from './components/admin/common/StudentSidebar';
import NavBar from './NavBar';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import StudentTable from './pages/admin/studentPages/StudentTable';
import AddStudent from './pages/admin/studentPages/AddStudent';
import EditStudent from './pages/admin/studentPages/EditStudent';
import DisplayStudent from './pages/admin/studentPages/DisplayStudent';
import DeleteStudent from './pages/admin/studentPages/DeleteStudent';
import MenuSelector from './pages/admin/MenuPages/MenuSelector';
import PendingOrderTable from './pages/admin/orderPages/PendingOrderTable';
import CompletedOrderTable from './pages/admin/orderPages/CompletedOrderTable';
import DisplayOrder from './pages/admin/orderPages/DisplayOrder';
import DeleteOrder from './pages/admin/orderPages/DeleteOrder';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MenuList from './pages/student/MenuList';
import DailyMenu from './pages/student/MenuList/DailyMenu';
import OrderHistoryTable from './components/StudentComponents/OrderHistoryTable';
import RechargeHistoryTable from './components/StudentComponents/RechargeHistoryTable';
import ChangePassword from './components/StudentComponents/ChangePassword';
import WalletTopup from './components/StudentComponents/WalletTopup';
import PlaceOrder from './components/StudentComponents/PlaceOrder';
import PreviousOrdersList from './pages/student/PreviousOrdersList';

function App() {
  const [theme, colorMode] = useMode();
  const { isAuthenticated, hasRole } = useAuth();

  // Determine if current route is admin or student
  const location = window.location.pathname;
  const isAdminRoute = location.startsWith('/admin');
  const isStudentRoute = location.startsWith('/student');

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <DataProvider>
          <div className="app">
            {/* Show sidebars only when authenticated and on respective routes */}
            {isAuthenticated() && hasRole('ADMIN') && isAdminRoute && <SideBar />}
            {isAuthenticated() && hasRole('STUDENT') && isStudentRoute && <StudentSideBar />}

            <div className="content">
              {/* Show navbar only when authenticated */}
              {isAuthenticated() && (isAdminRoute || isStudentRoute) && <NavBar />}

              <Routes>
                {/* Landing */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth - Redirect if already logged in */}
                <Route 
                  path="/login" 
                  element={
                    isAuthenticated() 
                      ? (hasRole('ADMIN') ? <Navigate to="/admin/dashboard" /> : <Navigate to="/student/dashboard" />)
                      : <Login />
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    isAuthenticated() 
                      ? <Navigate to="/student/dashboard" />
                      : <Register />
                  } 
                />

                {/* Student Protected Routes */}
                <Route 
                  path="/student/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="STUDENT">
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/dailymenu" 
                  element={
                    <ProtectedRoute requiredRole="STUDENT">
                      <DailyMenu />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/todaysmenu" 
                  element={
                    <ProtectedRoute requiredRole="STUDENT">
                      <MenuList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/orderhistory" 
                  element={
                    <ProtectedRoute requiredRole="STUDENT">
                      <OrderHistoryTable />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/rechargehistory" 
                  element={
                    <ProtectedRoute requiredRole="STUDENT">
                      <RechargeHistoryTable />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/changePassword" 
                  element={
                    <ProtectedRoute requiredRole="STUDENT">
                      <ChangePassword />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/wallettopup" 
                  element={
                    <ProtectedRoute requiredRole="STUDENT">
                      <WalletTopup />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/placeorder" 
                  element={
                    <ProtectedRoute requiredRole="STUDENT">
                      <PlaceOrder />
                    </ProtectedRoute>
                  } 
                />

                {/* Customer routes (legacy - redirect to student) */}
                <Route
                  path="/customer/previousorderslist"
                  element={
                    <ProtectedRoute requiredRole="STUDENT">
                      <PreviousOrdersList />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/students" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <StudentTable />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/students/add" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AddStudent />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/students/edit/:id" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <EditStudent />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/students/display/:id" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <DisplayStudent />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/students/delete/:id" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <DeleteStudent />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/menu" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <MenuSelector />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders/pending" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <PendingOrderTable />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders/completed" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <CompletedOrderTable />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders/display/:id" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <DisplayOrder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders/delete/:id" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <DeleteOrder />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </DataProvider>

      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
