import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login.jsx'
import GeneralAdminPage from './pages/GeneralAdmin.jsx'
import SessionPage from './pages/sessionAdminPage.jsx'
import AttendancePage from './pages/attendancePage.jsx'
import AttendanceAnalysis from './pages/attendanceAnalysics.jsx'
import LastSessionAnalysisPage from './pages/lastSessionAnalysics.jsx'
import CertificateStatusPage from './pages/CertificateStatusPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<GeneralAdminPage />} />
        <Route path="/sessionPage" element={<SessionPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendance-analysis" element={<AttendanceAnalysis />} />
        <Route path="/last-session-analysis" element={<LastSessionAnalysisPage />} />
        <Route path="/certificate-status" element={<CertificateStatusPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)


