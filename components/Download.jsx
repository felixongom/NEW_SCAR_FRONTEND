'use client'

export default function DownloadList({ 
  filePaths = [], 
  base_api_path, 
  title = 'Download Files' 
}) {
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

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 border rounded-xl shadow-sm md:w-3/4 w-[90vw]">
      <div className="flex items-center justify-between border-b border-gray-400 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <ul className="divide-y divide-gray-300">
        {filePaths.map((filePath, index) => {
          const fileName = getFileName(filePath)
          const fullUrl = getFullUrl(filePath)

          return (
            <li key={index} className="py-3 flex flex-col space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-700 truncate" title={fileName.split('.x')[0]}>
                  {fileName.split('.x')[0]}
                </span>

                <a
                  href={fullUrl}
                  download={fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs font-semibold text-white bg-slate-600 hover:bg-red-700 rounded-lg transition-colors shrink-0 text-center"
                >
                  Download
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}