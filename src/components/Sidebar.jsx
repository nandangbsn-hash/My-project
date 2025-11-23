import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Home, BookOpen, HelpCircle, BarChart3 } from 'lucide-react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const studentMenuItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: Home },
    { label: 'Homework', path: '/student/homework', icon: BookOpen },
    { label: 'Ask Doubt', path: '/student/doubt', icon: HelpCircle },
  ]

  const teacherMenuItems = [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: Home },
    { label: 'Analytics', path: '/teacher/analytics', icon: BarChart3 },
  ]

  const menuItems = profile?.role === 'teacher' ? teacherMenuItems : studentMenuItems

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 lg:hidden z-40 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 p-6 shadow-lg lg:static lg:translate-x-0 z-40"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
            SH
          </div>
          <span className="font-bold text-lg text-neutral-900">SchoolHub</span>
        </div>

        <div className="mb-8 p-3 bg-primary-50 rounded-lg">
          <p className="text-sm text-neutral-600">Logged in as</p>
          <p className="font-semibold text-neutral-900">{profile?.name}</p>
          <p className="text-xs text-primary-600 capitalize">{profile?.role}</p>
        </div>

        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-neutral-700 hover:bg-danger-50 transition text-danger-600"
        >
          <LogOut size={20} />
          Logout
        </button>
      </motion.aside>
    </>
  )
}
