import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Clock, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function StudentDashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [homework, setHomework] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    overdue: 0,
  })

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const { data } = await supabase
          .from('homework_tasks')
          .select('*')
          .order('deadline', { ascending: true })
          .limit(5)

        setHomework(data || [])

        if (data) {
          const now = new Date()
          const pending = data.filter((h) => new Date(h.deadline) > now).length
          const overdue = data.filter((h) => new Date(h.deadline) < now).length

          setStats({
            pending,
            completed: 0,
            overdue,
          })
        }
      } catch (error) {
        console.error('Error fetching homework:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomework()
  }, [])

  const getUrgencyColor = (deadline) => {
    const now = new Date()
    const daysLeft = Math.ceil((new Date(deadline) - now) / (1000 * 60 * 60 * 24))

    if (daysLeft < 0) return 'border-danger-500 bg-danger-50'
    if (daysLeft < 2) return 'border-warning-500 bg-warning-50'
    return 'border-success-500 bg-success-50'
  }

  const getUrgencyBadge = (deadline) => {
    const now = new Date()
    const daysLeft = Math.ceil((new Date(deadline) - now) / (1000 * 60 * 60 * 24))

    if (daysLeft < 0) return { text: 'Overdue', color: 'text-danger-600' }
    if (daysLeft === 0) return { text: 'Today', color: 'text-danger-600' }
    if (daysLeft === 1) return { text: '1 day left', color: 'text-warning-600' }
    return { text: `${daysLeft} days left`, color: 'text-success-600' }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                Welcome back, {profile?.name}!
              </h1>
              <p className="text-neutral-500">Class {profile?.class}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  label: 'Pending Tasks',
                  value: stats.pending,
                  icon: Clock,
                  color: 'from-primary-500 to-primary-600',
                },
                {
                  label: 'Completed',
                  value: stats.completed,
                  icon: CheckCircle,
                  color: 'from-success-500 to-success-600',
                },
                {
                  label: 'Overdue',
                  value: stats.overdue,
                  icon: AlertCircle,
                  color: 'from-danger-500 to-danger-600',
                },
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-6 shadow-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-opacity-80 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <Icon size={32} className="text-white text-opacity-30" />
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-neutral-900">Upcoming Homework</h2>
                    <button
                      onClick={() => navigate('/student/homework')}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2"
                    >
                      View All <ArrowRight size={16} />
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  ) : homework.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto mb-3 text-success-500" size={32} />
                      <p className="text-neutral-500">No pending homework!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {homework.map((hw, idx) => {
                        const urgency = getUrgencyBadge(hw.deadline)
                        return (
                          <motion.div
                            key={hw.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`border-l-4 rounded-lg p-4 ${getUrgencyColor(hw.deadline)}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-neutral-900 mb-1">
                                  {hw.title}
                                </h3>
                                <p className="text-sm text-neutral-600 mb-2">{hw.subject}</p>
                                <div className="flex items-center gap-4">
                                  <span className="text-xs font-medium px-2 py-1 bg-white rounded">
                                    {hw.category}
                                  </span>
                                  <span className={`text-xs font-semibold ${urgency.color}`}>
                                    {urgency.text}
                                  </span>
                                </div>
                              </div>
                              <Calendar size={18} className="text-neutral-400 flex-shrink-0" />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => navigate('/student/doubt')}
                  className="w-full bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group mb-6"
                >
                  <HelpCircle size={32} className="mx-auto mb-3 group-hover:scale-110 transition" />
                  <p className="font-bold text-lg">Ask a Doubt</p>
                  <p className="text-sm text-white text-opacity-80 mt-2">
                    Get instant help from AI
                  </p>
                </motion.button>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Quick Tips</h3>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    <li className="flex gap-2">
                      <span className="text-primary-500 font-bold">•</span>
                      <span>Submit homework before deadline</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary-500 font-bold">•</span>
                      <span>Ask doubts anytime with AI</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary-500 font-bold">•</span>
                      <span>Check notifications regularly</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
