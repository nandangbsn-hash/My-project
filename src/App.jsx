import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import DoubtHelper from './pages/DoubtHelper'
import HomeworkPage from './pages/HomeworkPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/homework"
          element={
            <ProtectedRoute requiredRole="student">
              <HomeworkPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/doubt"
          element={
            <ProtectedRoute requiredRole="student">
              <DoubtHelper />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}

const Dashboard = () => {
  const { profile } = require('./contexts/AuthContext').useAuth()
  const navigate = require('react-router-dom').useNavigate()

  if (profile?.role === 'student') {
    return <Navigate to="/student/dashboard" replace />
  } else if (profile?.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-neutral-500">Loading your dashboard...</p>
      </div>
    </div>
  )
}

export default App
