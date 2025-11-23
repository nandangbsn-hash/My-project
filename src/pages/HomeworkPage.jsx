import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import { motion } from 'framer-motion'
import { Calendar, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function HomeworkPage() {
  const [homework, setHomework] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const { data } = await supabase
          .from('homework_tasks')
          .select('*')
          .order('deadline', { ascending: true })

        setHomework(data || [])
      } catch (error) {
        console.error('Error fetching homework:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomework()
  }, [])

  const filteredHomework = homework.filter((hw) => {
    if (filter === 'all') return true
    if (filter === 'overdue') {
      return new Date(hw.deadline) < new Date()
    }
    if (filter === 'pending') {
      return new Date(hw.deadline) > new Date()
    }
    return true
  })

  const getStatusIcon = (deadline) => {
    const now = new Date()
    if (new Date(deadline) < now) {
      return <AlertCircle className="text-danger-500" size={20} />
    }
    return <Clock className="text-warning-500" size={20} />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">All Assignments</h1>
              <p className="text-neutral-500">Track and manage your homework</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Filter size={20} className="text-neutral-400" />
                {['all', 'pending', 'overdue'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filter === f
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <span className="text-sm text-neutral-500 ml-auto">
                  {filteredHomework.length} items
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredHomework.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-neutral-100">
                <CheckCircle className="mx-auto mb-3 text-success-500" size={32} />
                <p className="text-neutral-500">No assignments to show</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredHomework.map((hw, idx) => {
                  const daysLeft = Math.ceil(
                    (new Date(hw.deadline) - new Date()) / (1000 * 60 * 60 * 24)
                  )
                  const isOverdue = daysLeft < 0

                  return (
                    <motion.div
                      key={hw.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition ${
                        isOverdue ? 'border-l-danger-500 bg-danger-50' : 'border-l-primary-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                            {hw.title}
                          </h3>
                          {hw.description && (
                            <p className="text-neutral-600 text-sm mb-3">{hw.description}</p>
                          )}
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-medium px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                              {hw.subject}
                            </span>
                            <span className="text-xs font-medium px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full">
                              {hw.category}
                            </span>
                            {hw.priority === 'high' && (
                              <span className="text-xs font-medium px-3 py-1 bg-danger-100 text-danger-700 rounded-full">
                                High Priority
                              </span>
                            )}
                          </div>
                        </div>
                        {getStatusIcon(hw.deadline)}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-neutral-400" />
                          <span className="text-neutral-600">
                            Due {formatDistanceToNow(new Date(hw.deadline), { addSuffix: true })}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            isOverdue ? 'text-danger-600' : 'text-primary-600'
                          }`}
                        >
                          {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
