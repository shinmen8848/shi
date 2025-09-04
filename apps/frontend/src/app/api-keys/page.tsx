'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'

interface ApiKey {
  id: string
  name: string
  key_preview: string
  usage_count: number
  last_used_at?: string
  expires_at?: string
  is_active: boolean
  created_at: string
}

export default function ApiKeysPage() {
  const { user } = useAuthStore()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyExpiry, setNewKeyExpiry] = useState('')

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    // Simulate API call
    setTimeout(() => {
      setApiKeys([
        {
          id: '1',
          name: 'Development Key',
          key_preview: 'sk-1234...abcd',
          usage_count: 150,
          last_used_at: '2024-01-15T10:30:00Z',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Production Key',
          key_preview: 'sk-5678...efgh',
          usage_count: 2500,
          last_used_at: '2024-01-15T14:20:00Z',
          expires_at: '2024-12-31T23:59:59Z',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z'
        }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return

    // Simulate API call
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key_preview: `sk-${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      usage_count: 0,
      is_active: true,
      created_at: new Date().toISOString()
    }

    setApiKeys(prev => [newKey, ...prev])
    setNewKeyName('')
    setNewKeyExpiry('')
    setShowCreateModal(false)
  }

  const handleToggleKey = (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, is_active: !key.is_active } : key
    ))
  }

  const handleDeleteKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(prev => prev.filter(key => key.id !== id))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="glass border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">API Keys</h1>
            <p className="text-dark-400">Manage your API keys and monitor usage</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create New Key
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-400 mb-2">{apiKeys.length}</div>
            <div className="text-dark-400">Total Keys</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {apiKeys.filter(key => key.is_active).length}
            </div>
            <div className="text-dark-400">Active Keys</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              {apiKeys.reduce((sum, key) => sum + key.usage_count, 0)}
            </div>
            <div className="text-dark-400">Total Requests</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {apiKeys.filter(key => key.last_used_at && 
                new Date(key.last_used_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <div className="text-dark-400">Used Today</div>
          </div>
        </div>

        {/* API Keys List */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Your API Keys</h2>
          
          {apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔑</div>
              <h3 className="text-xl font-medium mb-2">No API keys yet</h3>
              <p className="text-dark-400 mb-6">Create your first API key to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create API Key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <motion.div
                  key={key.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-800 rounded-lg p-6 border border-dark-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium">{key.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          key.is_active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-dark-300 font-mono bg-dark-700 px-3 py-2 rounded mb-3 inline-block">
                        {key.key_preview}
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-dark-400">Usage:</span>
                          <span className="ml-2 font-medium">{key.usage_count.toLocaleString()} requests</span>
                        </div>
                        <div>
                          <span className="text-dark-400">Last used:</span>
                          <span className="ml-2 font-medium">
                            {key.last_used_at 
                              ? new Date(key.last_used_at).toLocaleDateString()
                              : 'Never'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-dark-400">Created:</span>
                          <span className="ml-2 font-medium">
                            {new Date(key.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-6">
                      <button
                        onClick={() => handleToggleKey(key.id)}
                        className={`px-3 py-1 rounded text-sm ${
                          key.is_active 
                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {key.is_active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-semibold mb-6">Create New API Key</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Key Name</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Development Key"
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Expiry (Optional)</label>
                <select
                  value={newKeyExpiry}
                  onChange={(e) => setNewKeyExpiry(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">Never expires</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim()}
                className="btn-primary flex-1"
              >
                Create Key
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}