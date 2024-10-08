import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'
import { useLogin } from '../../LoginContext'

export function CsvUpload({  }) {
  const { username } = useLogin();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvFileName, setCsvFileName] = useState<string | null>(null)

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCsvFile(file)
    }
  }

  const uploadCsv = async () => {
    if (!csvFile) return;
  
    const formData = new FormData();
    formData.append('file', csvFile);
  
    try {
      await axios.post(`${apiBaseUrl}/uploadcsv/${username}`, formData);
      setCsvFileName(csvFile.name);
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed');
    }
  };
  

  const downloadCsv = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/csv/${username}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', csvFileName || 'phone_numbers.csv')
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Error downloading CSV:', error)
      alert('Failed to download CSV')
    }
  }

  const deleteCsv = async () => {
    try {
      await axios.delete(`${apiBaseUrl}/csv/${username}`)
      setCsvFileName(null)
      alert('CSV deleted successfully')
    } catch (error) {
      console.error('Error deleting CSV:', error)
      alert('Failed to delete CSV')
    }
  }

  return (
    <Card className="mb-8 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <CardHeader>
        <CardTitle>Upload CSV</CardTitle>
        <CardDescription className="text-purple-100">
          Upload a CSV file with phone numbers to call
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="flex-grow bg-white text-gray-900"
          />
          <Button onClick={uploadCsv} className="bg-white text-purple-600 hover:bg-purple-100">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>

        {csvFileName && (
          <div className="mt-4">
            <p className="text-sm text-purple-100">File uploaded: {csvFileName}</p>
            <Button onClick={downloadCsv} className="mt-2 bg-white text-purple-600 hover:bg-purple-100">
              Download CSV
            </Button>
            <Button onClick={deleteCsv} className="mt-2 ml-4 bg-red-600 text-white hover:bg-red-700">
              <Trash className="mr-2 h-4 w-4" />
              Delete CSV
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
