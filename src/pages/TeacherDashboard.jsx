import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import { motion } from 'framer-motion'
import { FileText, Users, HelpCircle, TrendingUp, Plus, ArrowRight } from 'lucide-react'

export default function TeacherDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    homework: 0,
    students: 0,
    doubts: 0,
    notes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showNewHomework, setShowNewHomework] = useState(false)
  const [recentHomework, setRecentHomework] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [homeworkData, doubtsData, notesData] = await Promise.all([
          supabase.from('homework_tasks').select('*', { count: 'exact' }).eq('teacher_id', profile?.id),
          supabase.from('doubt_questions').select('*', { count: 'exact' }).eq('subject', profile?.subject),
          supabase.from('class_notes').select('*', { count: 'exact' }).eq('teacher_id', profile?.id),
        ])

        setStats({
          homework: homeworkData.count || 0,
          students: 0,
          doubts: doubtsData.count || 0,
          notes: notesData.count || 0,
        })

        setRecentHomework(homeworkData.data?.slice(0, 5) || [])
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (profile?.id) {
      fetchStats()
    }
  }, [profile])

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
              <p className="text-neutral-500">Teaching {profile?.subject}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: 'Homework Created',
                  value: stats.homework,
                  icon: FileText,
                  color: 'from-primary-500 to-primary-600',
                },
                {
                  label: 'Students',
                  value: stats.students,
                  icon: Users,
                  color: 'from-secondary-500 to-secondary-600',
                },
                {
                  label: 'Doubts to Review',
                  value: stats.doubts,
                  icon: HelpCircle,
                  color: 'from-warning-500 to-warning-600',
                },
                {
                  label: 'Class Notes',
                  value: stats.notes,
                  icon: TrendingUp,
                  color: 'from-success-500 to-success-600',
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
                    <h2 className="text-xl font-bold text-neutral-900">Recent Assignments</h2>
                    <button
                      onClick={() => setShowNewHomework(true)}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition flex items-center gap-2"
                    >
                      <Plus size={18} />
                      New Assignment
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  ) : recentHomework.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto mb-3 text-neutral-300" size={32} />
                      <p className="text-neutral-500">No assignments yet</p>
                      <button
                        onClick={() => setShowNewHomework(true)}
                        className="mt-4 text-primary-600 font-medium hover:text-primary-700"
                      >
                        Create your first assignment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentHomework.map((hw, idx) => (
                        <motion.div
                          key={hw.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="border-l-4 border-primary-500 bg-primary-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-neutral-900 mb-1">
                                {hw.title}
                              </h3>
                              <p className="text-sm text-neutral-600">{hw.subject}</p>
                              <span className="text-xs font-medium text-primary-600 mt-2 inline-block">
                                {hw.category}
                              </span>
                            </div>
                            <ArrowRight size={18} className="text-neutral-400 flex-shrink-0" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6"
                >
                  <h3 className="font-bold text-neutral-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowNewHomework(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg font-medium text-primary-700 transition"
                    >
                      <Plus size={18} />
                      Create Assignment
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg font-medium text-neutral-700 transition">
                      <FileText size={18} />
                      Upload Notes
                    </button>
                  </div>
                </motion.div>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Tips</h3>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    <li className="flex gap-2">
                      <span className="text-primary-500 font-bold">•</span>
                      <span>Create clear deadlines</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary-500 font-bold">•</span>
                      <span>Review student doubts daily</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary-500 font-bold">•</span>
                      <span>Upload class notes regularly</span>
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
