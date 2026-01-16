"use client"

import { useEffect, useRef } from "react"
import { Worker, Viewer, DocumentLoadEvent } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/page-navigation/lib/styles/index.css"
import { XCircle } from "lucide-react"

interface PdfViewerProps {
  file: string
  page?: number
  onClose?: () => void
}

export default function PdfViewer({ file, page = 1, onClose }: PdfViewerProps) {
  // --- Plugins Configuration ---
  const defaultLayout = defaultLayoutPlugin({
    sidebarTabs: () => [], // Hides the sidebar tabs (bookmarks/thumbnails)
  })

  const pageNav = pageNavigationPlugin()
  const jumpRequested = useRef(false)

  // Handle initial page jump
  const handleDocumentLoad = (e: DocumentLoadEvent) => {
    if (!jumpRequested.current && page > 1) {
      jumpRequested.current = true
      pageNav.jumpToPage && pageNav.jumpToPage(page - 1)
    }
  }

  // Ensure file URL is absolute or root-relative
  const fileSrc = file.startsWith("http") ? file : `/${file}`

  return (
    // 1. OUTER CONTAINER: Preserves your Layout/Animation styles from the original file
    <div className="flex flex-col h-full border-l bg-white animate-in fade-in slide-in-from-right-4 duration-300 w-1/2 min-w-125 shadow-xl z-10">
      
      {/* 2. CUSTOM HEADER (From your snippet) */}
      <div className="flex items-center justify-between bg-gray-100 p-2 border-b shrink-0">
        <span className="text-xs font-semibold text-blue-700 truncate max-w-100 ml-1">
          {decodeURIComponent(file.split(/[/\\]/).pop() || "Document")}
        </span>

        {onClose && (
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 3. VIEWER CONTENT */}
      <div className="flex-1 overflow-hidden relative bg-slate-50">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileSrc}
            plugins={[defaultLayout, pageNav]}
            onDocumentLoad={handleDocumentLoad}
            initialPage={page - 1}
          />
        </Worker>
      </div>
    </div>
  )
}