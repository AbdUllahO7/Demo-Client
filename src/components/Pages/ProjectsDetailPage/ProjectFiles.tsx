"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { FileText, Download, File, FileImage, FileArchive, Files, ExternalLink, Maximize2, Minimize2, ZoomIn, ZoomOut, Printer } from 'lucide-react'

interface ProjectFilesProps {
  project: {
    _id: string
    createdAt?: string
    elements: {
      _id: string
      name: string
      type: string
      defaultContent: string
      fileUrl?: string
      fileMimeType?: string
      createdAt?: string
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
  createdAt?: string
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

  // Get title and description for current language
  const getProjectInfo = () => {
    if (!project?.elements) return { title: "", description: "" }

    const titleElement = project.elements.find(el => el.name === "Title" && el.type === "text")
    const descriptionElement = project.elements.find(el => el.name === "Description" && el.type === "text")

    return {
      title: titleElement ? getTranslatedContent(titleElement, language) : "",
      description: descriptionElement ? getTranslatedContent(descriptionElement, language) : ""
    }
  }

  // Get file icon based on file type
  const getFileIcon = (fileUrl: string, mimeType?: string) => {
    const extension = fileUrl.split(".").pop()?.toLowerCase()
    const type = mimeType?.toLowerCase()

    if (type?.includes("pdf") || extension === "pdf") {
      return <FileText className="h-4 w-4 text-red-600" />
    }
    if (type?.includes("image") || ["jpg", "jpeg", "png", "gif", "svg"].includes(extension || "")) {
      return <FileImage className="h-4 w-4 text-blue-600" />
    }
    if (type?.includes("word") || ["doc", "docx"].includes(extension || "")) {
      return <FileText className="h-4 w-4 text-blue-600" />
    }
    if (type?.includes("excel") || ["xls", "xlsx"].includes(extension || "")) {
      return <FileText className="h-4 w-4 text-green-600" />
    }
    if (type?.includes("powerpoint") || ["ppt", "pptx"].includes(extension || "")) {
      return <FileText className="h-4 w-4 text-orange-600" />
    }
    if (["zip", "rar", "7z", "tar"].includes(extension || "")) {
      return <FileArchive className="h-4 w-4 text-purple-600" />
    }
    return <File className="h-4 w-4 text-gray-600" />
  }

  // Get file type for display
  const getFileType = (fileUrl: string, mimeType?: string): string => {
    const extension = fileUrl.split(".").pop()?.toLowerCase()
    const type = mimeType?.toLowerCase()

    if (type?.includes("pdf") || extension === "pdf") return "PDF"
    if (type?.includes("image")) return "Image"
    if (type?.includes("word") || ["doc", "docx"].includes(extension || "")) return "Word"
    if (type?.includes("excel") || ["xls", "xlsx"].includes(extension || "")) return "Excel"
    if (type?.includes("powerpoint") || ["ppt", "pptx"].includes(extension || "")) return "PowerPoint"
    if (["zip", "rar", "7z", "tar"].includes(extension || "")) return "Archive"
    return extension?.toUpperCase() || "File"
  }

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Unknown date"
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Get all file elements for the current language
  const getLanguageFiles = (): FileData[] => {
    if (!project?.elements || project.elements.length === 0) {
      return []
    }

    const files: FileData[] = []

    // Find file elements that match the current language
    const fileElements = project.elements.filter(
      (element) => element.type === "file" && element.fileUrl && element.name.includes(language.toUpperCase()),
    )

    fileElements.forEach((element) => {
      // Extract display name from translations or element name
      const displayName =
        getTranslatedContent(element, language) ||
        element.defaultContent ||
        element.name.replace(/File \w+ \d+/, "").trim() ||
        `File ${files.length + 1}`

      files.push({
        element,
        displayName,
        fileUrl: element.fileUrl!,
        fileType: getFileType(element.fileUrl!, element.fileMimeType),
        language: language,
        createdAt: element.createdAt || project.createdAt
      })
    })

    return files
  }

  // Get files for current language
  const currentLanguageFiles = getLanguageFiles()
  const projectInfo = getProjectInfo()

  // Set first file as selected by default
  useEffect(() => {
    if (currentLanguageFiles.length > 0 && !selectedFile) {
      setSelectedFile(currentLanguageFiles[0])
    } else if (currentLanguageFiles.length === 0) {
      setSelectedFile(null)
    } else if (selectedFile && !currentLanguageFiles.find((f) => f.element._id === selectedFile.element._id)) {
      // If current selected file is not in the new language files, select the first one
      setSelectedFile(currentLanguageFiles[0])
    }
  }, [currentLanguageFiles, language])

  // Handle file download - direct download without opening
  const handleFileDownload = (file: FileData, event: React.MouseEvent) => {
    event.stopPropagation()
    
    // Create a temporary link and trigger download
    const link = document.createElement("a")
    link.href = file.fileUrl
    link.download = `${file.displayName}.${file.fileUrl.split(".").pop()}`
    link.style.display = 'none'
    
    // Add to DOM, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle file view
  const handleFileView = (file: FileData) => {
    setSelectedFile(file)
  }

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50))
  }

  // Handle print functionality - print the selected file
  const handlePrint = () => {
    if (!selectedFile) {
      // If no file is selected, show message
      alert("Please select a file from the sidebar to print")
      return
    }

    if (selectedFile.fileType === "PDF") {
      // For PDF files, open in new window and print
      const printWindow = window.open(selectedFile.fileUrl, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    } else if (selectedFile.fileType === "Image") {
      // For images, create a print-friendly version
      const printContent = `
        <html>
          <head>
            <title>Print - ${selectedFile.displayName}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                font-family: Arial, sans-serif; 
              }
              .header { 
                text-align: center; 
                margin-bottom: 20px; 
              }
              .title { 
                font-size: 18px; 
                font-weight: bold; 
                margin-bottom: 5px; 
              }
              .subtitle { 
                font-size: 12px; 
                color: #666; 
                margin-bottom: 20px; 
              }
              img { 
                max-width: 100%; 
                max-height: 80vh; 
                object-fit: contain; 
                border: 1px solid #ddd;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 10px;
                color: #999;
              }
              @media print {
                body { margin: 0; padding: 10px; }
                .footer { position: fixed; bottom: 10px; width: 100%; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">${selectedFile.displayName}</div>
              <div class="subtitle">${selectedFile.fileType} - ${selectedFile.createdAt ? formatDate(selectedFile.createdAt) : 'No date'}</div>
            </div>
            <img src="${selectedFile.fileUrl}" alt="${selectedFile.displayName}" onload="window.print(); window.close();" />
            <div class="footer">
              Printed on: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </body>
        </html>
      `
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
      }
    } else {
      // For other file types, open in new window for external printing
      const printWindow = window.open(selectedFile.fileUrl, '_blank')
      if (printWindow) {
        // Try to trigger print after a short delay
        setTimeout(() => {
          try {
            printWindow.print()
          } catch (error) {
            console.log("Auto-print not supported for this file type")
          }
        }, 1000)
      } else {
        // Fallback: show message
        alert(`${selectedFile.fileType} files will open in a new window. Please use your browser's print function (Ctrl+P or Cmd+P) to print the document.`)
        window.open(selectedFile.fileUrl, '_blank')
      }
    }
  }

  // Check if project.elements is not found or empty
  if (!project?.elements || project.elements.length === 0) {
    return null
  }

  // Don't render if no files and no title/description
  if (currentLanguageFiles.length === 0 && !projectInfo.title && !projectInfo.description) {
    return null
  }

  // Group files by type
  const filesByType = currentLanguageFiles.reduce((acc, file) => {
    if (!acc[file.fileType]) {
      acc[file.fileType] = []
    }
    acc[file.fileType].push(file)
    return acc
  }, {} as Record<string, FileData[]>)

  return (
    <div className="w-full min-h-screen ">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {projectInfo.title || "Project Files"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={!selectedFile}
              title={selectedFile ? `Print ${selectedFile.displayName}` : "Select a file to print"}
            >
              <Printer className="h-4 w-4" />
              {selectedFile ? "Print File" : "Print"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Description Section */}
            {projectInfo.description && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {projectInfo.description}
                </div>
              </div>
            )}

            {/* File Content Viewer */}
            {selectedFile ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              

                {/* File Content */}
                <div
                  className={`relative ${
                    isFullscreen ? "fixed inset-0 bg-white dark:bg-gray-900 z-50" : "h-[100vh]"
                  }`}
                >
                  {/* Fullscreen Exit Button */}
                  {isFullscreen && (
                    <Button
                      className="absolute top-4 right-4 z-10 shadow-lg"
                      onClick={() => setIsFullscreen(false)}
                    >
                      <Minimize2 className="h-4 w-4 mr-2" />
                      Exit Fullscreen
                    </Button>
                  )}

                  {/* File Viewer */}
                  {selectedFile.fileType === "PDF" ? (
                    <iframe
                      src={`${selectedFile.fileUrl}#zoom=${zoomLevel}&view=FitH&toolbar=0&navpanes=0&scrollbar=1`}
                      className="w-full h-full border-0"
                      title={`${selectedFile.displayName} Viewer`}
                    />
                  ) : selectedFile.fileType === "Image" ? (
                    <div className="w-full h-full flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800">
                      <img
                        src={selectedFile.fileUrl || "/placeholder.svg"}
                        alt={selectedFile.displayName}
                        className="max-w-full max-h-full object-contain"
                        style={{
                          transform: `scale(${zoomLevel / 100})`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800">
                      <div className="text-center">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 inline-block">
                          {getFileIcon(selectedFile.fileUrl, selectedFile.element.fileMimeType)}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {selectedFile.displayName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                          This file type cannot be previewed. You can download or open it externally.
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
                            onClick={(e) => handleFileDownload(selectedFile, e)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* No File Selected State */
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Files className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Select a file to preview</p>
                  <p className="text-sm">Click on any file from the sidebar to view its content and enable printing</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Files Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-red-700 px-4 py-3">
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {currentLanguageFiles.map((file, index) => (
                    <div
                      key={file.element._id}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                        selectedFile?.element._id === file.element._id
                          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleFileView(file)}
                    >
                      <div className="flex-shrink-0">
                        {getFileIcon(file.fileUrl, file.element.fileMimeType)}
                      </div>
                          
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {file.displayName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {file.fileType}
                        </p>
                
                      </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleFileDownload(file, e)}
                        className="h-6 w-6 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}