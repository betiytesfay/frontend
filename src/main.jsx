import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import GeneralAdminPage from './pages/GeneralAdmin.jsx'
import SessionPage from './pages/sessionPage.jsx'
import AttendancePage from './pages/attendancePage.jsx'
import Login from './pages/login.jsx'
import SessionHistory from './pages/sessionHistory.jsx'
import AttendanceAnalysis from './pages/attendanceAnalysics.jsx'
import LastSessionAnalysisPage from './pages/lastSessionAnalysics.jsx'
import CertificateStatusPage from './pages/CertificateStatusPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<GeneralAdminPage />} />
        <Route path="/sessionAdmin" element={<SessionPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sessionHistory" element={<SessionHistory />} />
        <Route path="/attendance-analysis" element={<AttendanceAnalysis />} />
        <Route path="/last-session-analysis" element={<LastSessionAnalysisPage />} />
        <Route path="/certificate-status" element={<CertificateStatusPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)


