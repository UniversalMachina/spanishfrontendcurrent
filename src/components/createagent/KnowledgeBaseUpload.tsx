'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaTrash } from 'react-icons/fa'
import { useLogin } from '../../LoginContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function KnowledgeBaseUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [files, setFiles] = useState<any[]>([])
  const [embeddingStatus, setEmbeddingStatus] = useState('not_started')
  const { username } = useLogin()

  useEffect(() => {
    if (username) {
      fetchFiles()
    }
  }, [username])

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/files`, {
        params: { user_id: username }
      })
      setFiles(response.data)
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      const fileType = selectedFile.type
      if (fileType === 'application/pdf' || fileType === 'text/plain') {
        setFile(selectedFile)
        setUploadStatus('')
      } else {
        setFile(null)
        setUploadStatus('Only PDF and text files are allowed')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a valid file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', username)

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadStatus('File uploaded successfully')
      fetchFiles()
    } catch (error) {
      setUploadStatus('Error uploading file')
      console.error('Error uploading file:', error)
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/files/${fileId}`, {
        params: { user_id: username }
      })
      setUploadStatus('File deleted successfully')
      fetchFiles()
    } catch (error) {
      setUploadStatus('Error deleting file')
      console.error('Error deleting file:', error)
    }
  }

  const generateEmbeddings = async () => {
    if (files.length === 0) {
      setUploadStatus('Please upload files before generating embeddings')
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/embeddings`, {
        user_id: username
      })
      setEmbeddingStatus('processing')
      checkEmbeddingStatus()
    } catch (error) {
      setEmbeddingStatus('error')
      console.error(error)
    }
  }

  const checkEmbeddingStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/embeddings/status/${username}`)
      setEmbeddingStatus(response.data.status)

      if (response.data.status === 'processing') {
        setEmbeddingStatus('processing')
      } else {
        setEmbeddingStatus('not_started')
      }
    } catch (error) {
      setEmbeddingStatus('error')
      console.error(error)
    }
  }

  return (
    <Card className="mb-8 bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription className="text-yellow-100">Upload a PDF or text file as knowledge base</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="flex-grow bg-white text-gray-900"
          />
          <Button onClick={handleUpload} className="bg-white text-orange-600 hover:bg-orange-100">
            <FileText className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        {uploadStatus && <p className="mt-2 text-sm text-yellow-100">{uploadStatus}</p>}
        
        {/* List of Uploaded Files */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
          {files.length > 0 ? (
            <table className="min-w-full table-auto border-collapse border border-yellow-300">
              <thead>
                <tr className="bg-orange-500">
                  <th className="border border-yellow-300 p-2">File Name</th>
                  <th className="border border-yellow-300 p-2">File Type</th>
                  <th className="border border-yellow-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-orange-500">
                    <td className="border border-yellow-300 p-2">{file.file_name}</td>
                    <td className="border border-yellow-300 p-2">{file.file_type}</td>
                    <td className="border border-yellow-300 p-2 flex justify-around">
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-yellow-100 hover:text-yellow-200"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-yellow-100">No files uploaded yet.</p>
          )}
        </div>

        {/* Generate Embeddings Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Generate Embeddings from All Files</h3>
          <Button
            onClick={generateEmbeddings}
            disabled={embeddingStatus === 'processing' || files.length === 0}
            className="w-full bg-white text-orange-600 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Embeddings
          </Button>
          {/* ... embedding status messages ... */}
        </div>
      </CardContent>
    </Card>
  )
}
