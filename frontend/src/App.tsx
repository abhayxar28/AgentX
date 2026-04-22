import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminRegisterPage from './pages/auth/AdminRegisterPage';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import ForwardCalculator from './pages/calculators/ForwardCalculator';
import ReverseCalculator from './pages/calculators/ReverseCalculator';
import MDRTTracker from './pages/calculators/MDRTTracker';
import ActivityPredictor from './pages/calculators/ActivityPredictor';
import MyPoliciesPage from './pages/policies/MyPoliciesPage';
import CreatePolicyPage from './pages/policies/CreatePolicyPage';
import PolicyDetailPage from './pages/policies/PolicyDetailPage';
import MyCustomersPage from './pages/customers/MyCustomersPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';
import CreateCustomerPage from './pages/customers/CreateCustomerPage';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import AgentOverviewPage from './pages/admin/agents/AgentOverviewPage';
import AgentDetailPage from './pages/admin/agents/AgentDetailPage';
import RegistrationsPage from './pages/admin/registrations/RegistrationsPage';
import UserManagementPage from './pages/admin/users/UserManagementPage';
import ProductManagementPage from './pages/admin/products/ProductManagementPage';
import CommissionConfigPage from './pages/admin/config/CommissionConfigPage';
import AuditLogsPage from './pages/admin/logs/AuditLogsPage';
import { useAuthStore } from './store/authStore';

function HomeRedirect() {
  const role = useAuthStore((state) => state.role);
  return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-admin" element={<AdminRegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route element={<ProtectedRoute allowedRoles={['agent']} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<AgentDashboard />} />
            <Route path="/calculator/forward" element={<ForwardCalculator />} />
            <Route path="/calculator/reverse" element={<ReverseCalculator />} />
            <Route path="/calculator/mdrt" element={<MDRTTracker />} />
            <Route path="/calculator/activity" element={<ActivityPredictor />} />
            <Route path="/policies" element={<MyPoliciesPage />} />
            <Route path="/policies/create" element={<CreatePolicyPage />} />
            <Route path="/policies/:id" element={<PolicyDetailPage />} />
            <Route path="/customers" element={<MyCustomersPage />} />
            <Route path="/customers/create" element={<CreateCustomerPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/agents" element={<AgentOverviewPage />} />
            <Route path="/admin/agents/:id" element={<AgentDetailPage />} />
            <Route path="/admin/registrations" element={<RegistrationsPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/products" element={<ProductManagementPage />} />
            <Route path="/admin/config" element={<CommissionConfigPage />} />
            <Route path="/admin/logs" element={<AuditLogsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
