'use client'

import { useState } from 'react'
// import { base_api_path as defaultBasePath } from '@/utils/reportList'

export default function DownloadList({ 
  filePaths = [], 
  base_api_path, // Accepts prop or defaults to your utility import
  title = 'Download Files' 
}) {
  const [downloadStates, setDownloadStates] = useState({})
  // Extracts filename from path
  const getFileName = (path) => path.split(/[/\\]/).pop()

  // Constructs full URL ensuring proper slash joining
  const getFullUrl = (filePath) => {
    // Return early if filePath is already a full URL (http/https)
    if (/^https?:\/\//i.test(filePath)) return filePath;
    
    // Ensure no double slashes when joining base path and file path
    const cleanBase = (base_api_path || '').replace(/\/+$/, '');
    const cleanPath = filePath.replace(/^\/+/, '');
    
    return cleanBase ? `${cleanBase}/${cleanPath}` : filePath;
  }

  const handleDownload = async (filePath, index) => {
    setDownloadStates((prev) => ({
      ...prev,
      [index]: { downloading: true, progress: 0 },
    }))

    const fullUrl = getFullUrl(filePath)
    const fileName = getFileName(filePath)

    try {
      const response = await fetch(fullUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch ${fullUrl}`)
      }

      const contentLength = response.headers.get('content-length')

      if (!contentLength) {
        const blob = await response.blob()
        saveBlob(blob, fileName)
        setDownloadStates((prev) => ({
          ...prev,
          [index]: { downloading: false, progress: 100 },
        }))
        return
      }

      const total = parseInt(contentLength, 10)
      let loaded = 0
      const reader = response.body.getReader()
      const chunks = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        loaded += value.length

        const percent = Math.round((loaded / total) * 100)
        setDownloadStates((prev) => ({
          ...prev,
          [index]: { downloading: true, progress: percent },
        }))
      }

      const blob = new Blob(chunks, {
        type: 'application/octet-stream',
      })

      saveBlob(blob, fileName)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setDownloadStates((prev) => ({
        ...prev,
        [index]: { ...prev[index], downloading: false },
      }))
    }
  }

  const saveBlob = (blob, name) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = name
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 border rounded-xl shadow-sm md:w-3/4 w-[90vw]">
      <div className="flex items-center justify-between border-b border-gray-400 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
        <ul className="divide-y divide-gray-300">
          {filePaths.map((filePath, index) => {
            const fileName = getFileName(filePath)
            const fileState = downloadStates[index] || { downloading: false, progress: 0 }

            return (
              <li key={index} className="py-3 flex flex-col space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-700 truncate" title={fileName.split('.x')[0]}>
                    {fileName.split('.x')[0]}
                  </span>

                  <button
                    onClick={() => handleDownload(filePath, index)}
                    disabled={fileState.downloading }
                    className="px-3 py-1 text-xs font-semibold text-white bg-slate-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors shrink-0"
                  >
                    {fileState.downloading ? 'Downloading...' : 'Download'}
                  </button>
                </div>

                {fileState.downloading && (
                  <div className="w-full space-y-1">
                    <progress
                      value={fileState.progress}
                      max="100"
                      className="w-full h-2 rounded overflow-hidden [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-600 [&::-moz-progress-bar]:bg-blue-600"
                    />
                    <div className="text-xs text-right text-gray-500 font-mono">
                      {fileState.progress}%
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      
    </div>
  )
}