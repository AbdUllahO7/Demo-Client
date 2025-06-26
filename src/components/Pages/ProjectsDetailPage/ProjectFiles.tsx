"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Download, 
  Eye, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  File,
  FileImage,
  FileArchive,
  Share2,
  Globe
} from "lucide-react"

interface ProjectFilesProps {
  project: {
    _id: string
    elements: {
      _id: string
      name: string
      type: string
      defaultContent: string
      fileUrl?: string
      fileMimeType?: string
      translations: {
        _id: string
        content: string
        language: {
          languageID: string
        }
      }[]
    }[]
  }
  clients?: {
    _id?: string
    elements: {
      _id: string
      name: string
      type: string
      defaultContent: string
      translations: {
        _id: string
        content: string
        language: {
          languageID: string
        }
      }[]
    }[]
  }
}

interface FileData {
  element: any
  displayName: string
  fileUrl: string
  fileType: string
  language: string
}

export const ProjectFiles: React.FC<ProjectFilesProps> = ({ project, clients }) => {
  const { language } = useLanguage()
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [zoomLevel, setZoomLevel] = useState<number>(100)

  // Helper function to get translated content
  const getTranslatedContent = (element: any, lang: string): string => {
    if (!element) {
      return ""
    }
    if (!element.translations || !element.translations?.length) {
      return element.defaultContent || ""
    }

    const translation = element.translations?.find((t: any) => t.language.languageID === lang)
    const content = translation ? translation.content : element.defaultContent
    return content || ""
  }

  // Get file icon based on file type
  const getFileIcon = (fileUrl: string, mimeType?: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase()
    const type = mimeType?.toLowerCase()

    if (type?.includes('pdf') || extension === 'pdf') {
      return <FileText className="h-4 w-4" />
    }
    if (type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) {
      return <FileImage className="h-4 w-4" />
    }
    if (['zip', 'rar', '7z', 'tar'].includes(extension || '')) {
      return <FileArchive className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  // Get file type for display
  const getFileType = (fileUrl: string, mimeType?: string): string => {
    const extension = fileUrl.split('.').pop()?.toLowerCase()
    const type = mimeType?.toLowerCase()

    if (type?.includes('pdf') || extension === 'pdf') return 'PDF'
    if (type?.includes('image')) return 'Image'
    if (type?.includes('word') || ['doc', 'docx'].includes(extension || '')) return 'Word'
    if (type?.includes('excel') || ['xls', 'xlsx'].includes(extension || '')) return 'Excel'
    if (type?.includes('powerpoint') || ['ppt', 'pptx'].includes(extension || '')) return 'PowerPoint'
    if (['zip', 'rar', '7z', 'tar'].includes(extension || '')) return 'Archive'
    return extension?.toUpperCase() || 'File'
  }

  // Get all file elements for the current language
  const getLanguageFiles = (): FileData[] => {
    if (!project?.elements || project.elements.length === 0) {
      return []
    }

    const files: FileData[] = []
    
    // Find file elements that match the current language
    const fileElements = project.elements.filter(element => 
      element.type === 'file' && 
      element.fileUrl &&
      element.name.includes(language.toUpperCase())
    )

    fileElements.forEach(element => {
      // Extract display name from translations or element name
      const displayName = getTranslatedContent(element, language) || 
                          element.defaultContent || 
                          element.name.replace(/File \w+ \d+/, '').trim() ||
                          `File ${files.length + 1}`

      files.push({
        element,
        displayName,
        fileUrl: element.fileUrl!,
        fileType: getFileType(element.fileUrl!, element.fileMimeType),
        language: language
      })
    })

    return files
  }

  // Get files for current language
  const currentLanguageFiles = getLanguageFiles()

  // Set last file as selected by default (most recently added)
  useEffect(() => {
    if (currentLanguageFiles.length > 0 && !selectedFile) {
      setSelectedFile(currentLanguageFiles[currentLanguageFiles.length - 1])
    } else if (currentLanguageFiles.length === 0) {
      setSelectedFile(null)
    } else if (selectedFile && !currentLanguageFiles.find(f => f.element._id === selectedFile.element._id)) {
      // If current selected file is not in the new language files, select the last one
      setSelectedFile(currentLanguageFiles[currentLanguageFiles.length - 1])
    }
  }, [currentLanguageFiles, language])

  // Handle file download
  const handleDownload = (file: FileData) => {
    const link = document.createElement("a")
    link.href = file.fileUrl
    link.download = `${file.displayName}.${file.fileUrl.split('.').pop()}`
    link.click()
  }

  // Handle file share
  const handleShare = (file: FileData) => {
    if (navigator.share) {
      navigator.share({
        title: file.displayName,
        url: file.fileUrl,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(file.fileUrl)
    }
  }

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50))
  }

  // NOW it's safe to have early returns - ALL HOOKS have been called above
  
  // Check if project.elements is not found or empty
  if (!project?.elements || project.elements.length === 0) {
    return null
  }

  // Don't render if no files
  if (currentLanguageFiles.length === 0) {
    return null
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 ">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-gray-700" />
            </div>
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
              <Globe className="h-3 w-3" />
              {language.toUpperCase()}
            </Badge>
          </div>
          <span className="text-sm text-gray-500 flex items-center gap-2">
            {currentLanguageFiles.length}
                          <FileText className="h-6 w-6 text-gray-700" />
 
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] container mx-auto max-w-7xl">
        {/* Sidebar - Only show if multiple files */}
        {currentLanguageFiles.length > 1 && (
          <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <File className="h-4 w-4" />
                Related Files
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-1">
                {currentLanguageFiles.map((file, index) => (
                  <button
                    key={file.element._id}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                      selectedFile?.element._id === file.element._id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 ${
                        selectedFile?.element._id === file.element._id ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {getFileIcon(file.fileUrl, file.element.fileMimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.displayName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {file.fileType}
                        </p>
                      </div>
                      {selectedFile?.element._id === file.element._id && (
                        <Eye className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Viewer */}
        <div className="flex-1 flex flex-col">
          {selectedFile && (
            <>
              {/* File Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      {getFileIcon(selectedFile.fileUrl, selectedFile.element.fileMimeType)}
                      <span className="font-medium line-clamp-1">{selectedFile.displayName}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {selectedFile.fileType}
                    </Badge>
                  </div>

                  {/* Navigation and Actions */}
                  <div className="flex items-center gap-2">
                    {/* File Navigation */}
                    {currentLanguageFiles.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentIndex = currentLanguageFiles.findIndex(f => f.element._id === selectedFile.element._id)
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentLanguageFiles.length - 1
                            setSelectedFile(currentLanguageFiles[prevIndex])
                          }}
                          title="Previous file"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-gray-500 px-2">
                          {currentLanguageFiles.findIndex(f => f.element._id === selectedFile.element._id) + 1} / {currentLanguageFiles.length}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentIndex = currentLanguageFiles.findIndex(f => f.element._id === selectedFile.element._id)
                            const nextIndex = currentIndex < currentLanguageFiles.length - 1 ? currentIndex + 1 : 0
                            setSelectedFile(currentLanguageFiles[nextIndex])
                          }}
                          title="Next file"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-gray-200 mx-2" />
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(selectedFile.fileUrl, "_blank")}
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(selectedFile)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(selectedFile)}
                        title="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>

                      {/* Zoom Controls for PDFs */}
                      {selectedFile.fileType === 'PDF' && (
                        <>
                          <div className="w-px h-6 bg-gray-200 mx-2" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomOut}
                            disabled={zoomLevel <= 50}
                            title="Zoom out"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-gray-500 px-2 min-w-[50px] text-center">
                            {zoomLevel}%
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomIn}
                            disabled={zoomLevel >= 200}
                            title="Zoom in"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <div className="w-px h-6 bg-gray-200 mx-2" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                      >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Content */}
              <div
                className={`flex-1 relative ${
                  isFullscreen 
                    ? "fixed inset-0  z-50" 
                    : "bg-gray-100"
                }`}
              >
                {/* Fullscreen Exit Button */}
                {isFullscreen && (
                  <Button
                    variant="secondary"
                    className="absolute top-4 right-4 z-10"
                    onClick={() => setIsFullscreen(false)}
                    title="Exit fullscreen"
                  >
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Exit Fullscreen
                  </Button>
                )}

                {/* File Viewer */}
                {selectedFile.fileType === 'PDF' ? (
                  <iframe
                    src={`${selectedFile.fileUrl}#zoom=${zoomLevel}&view=FitH&toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-full border-0"
                    title={`${selectedFile.displayName} Viewer`}
                  />
                ) : selectedFile.fileType === 'Image' ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={selectedFile.fileUrl}
                      alt={selectedFile.displayName}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      style={{
                        transform: `scale(${zoomLevel / 100})`,
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-white rounded-lg p-8 shadow-lg max-w-md">
                      <div className="text-gray-400 mb-4 flex justify-center">
                        {getFileIcon(selectedFile.fileUrl, selectedFile.element.fileMimeType)}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {selectedFile.displayName}
                      </h3>
                      <p className="text-gray-600 mb-6 text-sm">
                        This file type cannot be previewed in the browser.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button
                          onClick={() => window.open(selectedFile.fileUrl, "_blank")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open File
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDownload(selectedFile)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}