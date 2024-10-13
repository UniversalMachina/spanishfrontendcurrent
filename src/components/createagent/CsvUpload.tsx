import React, { useState, useEffect } from 'react'
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
  const [existingCsv, setExistingCsv] = useState<boolean>(false)

  useEffect(() => {
    checkExistingCsv()
  }, [])

  const checkExistingCsv = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/csv/${username}`, { responseType: 'blob' })
      if (response.status === 200) {
        setExistingCsv(true)
        setCsvFileName(`${username}_phone_numbers.csv`)
      }
    } catch (error) {
      console.error('Error checking for existing CSV:', error)
      setExistingCsv(false)
    }
  }

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
      setExistingCsv(true);
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
      link.setAttribute('download', `${username}_phone_numbers.csv`)
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
      setExistingCsv(false)
      setCsvFileName(null)
      setCsvFile(null)
      alert('CSV deleted successfully')
    } catch (error) {
      console.error('Error deleting CSV:', error)
      alert('Failed to delete CSV')
    }
  }

  const importGoogleSheets = async () => {
    try {
      await axios.post(`${apiBaseUrl}/import_googlesheets/${username}`);
      alert('Phone numbers imported successfully from Google Sheets');
      checkExistingCsv();  // Refresh the existing CSV status
    } catch (error) {
      console.error('Error importing from Google Sheets:', error);
      alert('Failed to import from Google Sheets');
    }
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <CardHeader>
        <CardTitle>CSV Management</CardTitle>
        <CardDescription className="text-purple-100">
          Upload, download, or delete CSV files with phone numbers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {existingCsv ? (
          <div>
            <p className="text-sm text-purple-100 mb-4">Existing file: {csvFileName}</p>
            <div className="flex space-x-4">
              <Button onClick={downloadCsv} className="bg-white text-purple-600 hover:bg-purple-100">
                Download CSV
              </Button>
              <Button onClick={deleteCsv} className="bg-red-600 text-white hover:bg-red-700">
                <Trash className="mr-2 h-4 w-4" />
                Delete CSV
              </Button>
            </div>
          </div>
        ) : (
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
        )}

        {csvFileName && !existingCsv && (
          <div className="mt-4">
            <p className="text-sm text-purple-100">File uploaded: {csvFileName}</p>
          </div>
        )}

        {/* Add this new button */}
        <div className="mt-4">
          <Button onClick={importGoogleSheets} className="bg-green-600 text-white hover:bg-green-700">
            Import from Google Sheets
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
