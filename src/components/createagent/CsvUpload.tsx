'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CsvUpload() {
  const [csvFile, setCsvFile] = useState<File | null>(null)

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCsvFile(file)
    }
  }

  return (
    <Card className="mb-8 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <CardHeader>
        <CardTitle>Upload CSV</CardTitle>
        <CardDescription className="text-purple-100">Upload a CSV file with phone numbers to call</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="flex-grow bg-white text-gray-900"
          />
          <Button className="bg-white text-purple-600 hover:bg-purple-100">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        {csvFile && (
          <p className="mt-2 text-sm text-purple-100">File uploaded: {csvFile.name}</p>
        )}
      </CardContent>
    </Card>
  )
}
