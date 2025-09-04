'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Editor } from '@monaco-editor/react'

interface FileNode {
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
}

export default function IDEPage() {
  const [files, setFiles] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'index.js',
          type: 'file',
          content: `// Welcome to Shinmen IDE
console.log('Hello, World!');

function greet(name) {
  return \`Hello, \${name}! Welcome to Shinmen.\`;
}

const message = greet('Developer');
console.log(message);`
        },
        {
          name: 'styles.css',
          type: 'file',
          content: `/* Shinmen IDE Styles */
body {
  font-family: 'Inter', sans-serif;
  background: #0f172a;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}`
        }
      ]
    },
    {
      name: 'README.md',
      type: 'file',
      content: `# Shinmen Project

Welcome to your new project in Shinmen IDE!

## Features

- Monaco Editor integration
- Real-time collaboration
- AI-powered code assistance
- Multi-language support

## Getting Started

1. Edit files in the file explorer
2. Use the integrated terminal
3. Chat with AI for code help
4. Deploy with one click

Happy coding! 🚀`
    }
  ])

  const [activeFile, setActiveFile] = useState<FileNode | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']))

  useEffect(() => {
    // Set default active file
    if (files[0]?.children?.[0]) {
      setActiveFile(files[0].children[0])
    }
  }, [])

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderName)) {
        newSet.delete(folderName)
      } else {
        newSet.add(folderName)
      }
      return newSet
    })
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node, index) => (
      <div key={`${node.name}-${depth}-${index}`}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-dark-700 rounded ${
            activeFile?.name === node.name ? 'bg-primary-600/20 text-primary-400' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.name)
            } else {
              setActiveFile(node)
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              <svg
                className={`w-4 h-4 mr-2 transition-transform ${
                  expandedFolders.has(node.name) ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            </>
          ) : (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.name) && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  const getLanguageFromFileName = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript'
      case 'ts':
      case 'tsx':
        return 'typescript'
      case 'css':
        return 'css'
      case 'html':
        return 'html'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      case 'py':
        return 'python'
      default:
        return 'plaintext'
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* File Explorer */}
      <div className="w-80 sidebar border-r border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Explorer</h2>
        </div>
        <div className="p-2">
          {renderFileTree(files)}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="glass border-b border-white/10 px-4 py-2">
          {activeFile && (
            <div className="flex items-center">
              <div className="bg-dark-700 px-3 py-1 rounded-t-lg border-b-2 border-primary-500">
                <span className="text-sm">{activeFile.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1">
          {activeFile ? (
            <Editor
              height="100%"
              language={getLanguageFromFileName(activeFile.name)}
              value={activeFile.content}
              onChange={(value) => {
                if (activeFile && value !== undefined) {
                  setActiveFile({ ...activeFile, content: value })
                }
              }}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                bracketPairColorization: { enabled: true },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-dark-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium mb-2">No file selected</h3>
                <p>Select a file from the explorer to start editing</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="h-48 glass border-t border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Terminal</h3>
            <button className="btn-secondary text-sm">
              Clear
            </button>
          </div>
          <div className="bg-dark-800 rounded-lg p-4 h-32 overflow-y-auto font-mono text-sm">
            <div className="text-green-400">$ Welcome to Shinmen IDE Terminal</div>
            <div className="text-dark-400">Ready for commands...</div>
          </div>
        </div>
      </div>

      {/* Right Panel - AI Assistant */}
      <div className="w-80 sidebar border-l border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <div className="p-4">
          <div className="bg-dark-800 rounded-lg p-4 mb-4">
            <div className="text-sm text-dark-300 mb-2">💡 Tip</div>
            <div className="text-sm">
              Ask me about your code! I can help with debugging, optimization, and explanations.
            </div>
          </div>
          
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm">
              🔍 Explain this code
            </button>
            <button className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm">
              🐛 Find bugs
            </button>
            <button className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm">
              ⚡ Optimize performance
            </button>
            <button className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm">
              📝 Add comments
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}