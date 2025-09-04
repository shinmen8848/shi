'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="glass border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shinmen Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-dark-300">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8">Welcome to Shinmen</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chat Playground */}
            <Link href="/chat" className="card hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Chat Playground</h3>
                  <p className="text-dark-400">AI-powered conversations</p>
                </div>
              </div>
              <p className="text-dark-300">
                Start chatting with AI models using custom providers and configurations.
              </p>
            </Link>

            {/* Web IDE */}
            <Link href="/ide" className="card hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Web IDE</h3>
                  <p className="text-dark-400">Code in the browser</p>
                </div>
              </div>
              <p className="text-dark-300">
                Full-featured Monaco Editor with syntax highlighting and real-time collaboration.
              </p>
            </Link>

            {/* API Keys */}
            <Link href="/api-keys" className="card hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">API Keys</h3>
                  <p className="text-dark-400">Manage your keys</p>
                </div>
              </div>
              <p className="text-dark-300">
                Generate, manage, and monitor your API keys with detailed analytics.
              </p>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Quick Stats</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="card text-center">
                <div className="text-2xl font-bold text-primary-400 mb-2">0</div>
                <div className="text-dark-400">Chat Sessions</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">0</div>
                <div className="text-dark-400">IDE Projects</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">0</div>
                <div className="text-dark-400">API Keys</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">0</div>
                <div className="text-dark-400">API Calls</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}