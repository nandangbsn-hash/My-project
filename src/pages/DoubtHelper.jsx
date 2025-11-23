import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Image as ImageIcon, Mic, X, Loader } from 'lucide-react'

export default function DoubtHelper() {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSend = async () => {
    if (!input.trim() && !image) return

    const userMessage = {
      id: Date.now(),
      text: input,
      image,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setImage(null)
    setLoading(true)

    try {
      const { error } = await supabase.from('doubt_questions').insert([
        {
          student_id: user?.id,
          question_text: input,
          question_image_url: image,
          subject: profile?.class,
          is_anonymous: isAnonymous,
          ai_answer: 'Processing your question...',
        },
      ])

      if (error) throw error

      const aiMessage = {
        id: Date.now() + 1,
        text: 'Great question! This appears to be about ' + input.substring(0, 50) + '... Our AI system is analyzing this and will provide detailed explanations, key points, and relevant resources soon.',
        references: [
          { title: 'Khan Academy', url: '#' },
          { title: 'Related Videos', url: '#' },
        ],
        sender: 'ai',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error saving question:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error processing your question. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Ask Your Doubt</h1>
              <p className="text-neutral-500">Get instant AI-powered explanations</p>
            </div>

            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💡</span>
                </div>
                <p className="text-neutral-500 text-lg">
                  Ask any question about your studies. You can type, upload an image, or describe your doubt.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    'Explain quadratic equations',
                    'How does photosynthesis work?',
                    'Help with this math problem',
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion)}
                      className="p-4 rounded-lg border border-primary-200 hover:bg-primary-50 transition text-neutral-700 text-sm"
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4 mb-8">
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-lg p-4 ${
                          msg.sender === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-white border border-neutral-200 text-neutral-900'
                        }`}
                      >
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="uploaded"
                            className="rounded mb-2 max-h-32 object-cover"
                          />
                        )}
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        {msg.references && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-semibold opacity-80">References:</p>
                            {msg.references.map((ref, i) => (
                              <a
                                key={i}
                                href={ref.url}
                                className="block text-xs underline hover:opacity-80"
                              >
                                {ref.title}
                              </a>
                            ))}
                          </div>
                        )}
                        <span className="text-xs opacity-70 mt-2 block">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </motion.div>
        </div>

        <div className="border-t border-neutral-200 bg-white p-4 lg:p-6">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence>
              {image && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-4 relative inline-block"
                >
                  <img
                    src={image}
                    alt="preview"
                    className="h-24 rounded-lg border border-primary-200 object-cover"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 bg-danger-500 text-white rounded-full p-1 hover:bg-danger-600 transition"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mb-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isAnonymous
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {isAnonymous ? 'Anonymous' : 'Ask Publicly'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition text-neutral-600"
                title="Upload image"
              >
                <ImageIcon size={20} />
              </button>

              <button
                className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition text-neutral-600"
                title="Voice input"
              >
                <Mic size={20} />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your question..."
                className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />

              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && !image)}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center gap-2"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
