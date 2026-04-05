import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ProductsPage from './pages/Products/ProductsPage'
import OrdersPage from './pages/Orders/OrdersPage'
import UsersPage from './pages/Users/UsersPage'
import ApprovalsPage from './pages/Approvals/ApprovalsPage'
import SubAdminsPage from './pages/SubAdmins/SubAdminsPage'
import AuditLogsPage from './pages/AuditLogs/AuditLogsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
      <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
      <Route path="/users" element={<Layout><UsersPage /></Layout>} />
      <Route path="/approvals" element={<Layout><ApprovalsPage /></Layout>} />
      <Route path="/sub-admins" element={<Layout><SubAdminsPage /></Layout>} />
      <Route path="/audit" element={<Layout><AuditLogsPage /></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
