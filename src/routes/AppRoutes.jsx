import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import AdminLogin from '../pages/AdminLogin'
import SessionAdmin from '../pages/SessionAdmin'
import Dashboard from '../pages/Dashboard'
import { useAuth } from '../context/AuthContext'
import GeneralAdmin from '../pages/GeneralAdmin'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/admin/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/session"
        element={
          <PrivateRoute>
            <SessionAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/general"
        element={
          <PrivateRoute>
            <GeneralAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/session/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
