'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function KnowledgeBaseUpload() {
  const [knowledgeBase, setKnowledgeBase] = useState<File | null>(null)

  const handleKnowledgeBaseUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setKnowledgeBase(file)
    }
  }

  return (
    <Card className="mb-8 bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription className="text-yellow-100">Upload a PDF or text file as knowledge base</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept=".pdf,.txt"
            onChange={handleKnowledgeBaseUpload}
            className="flex-grow bg-white text-gray-900"
          />
          <Button className="bg-white text-orange-600 hover:bg-orange-100">
            <FileText className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        {knowledgeBase && (
          <p className="mt-2 text-sm text-yellow-100">File uploaded: {knowledgeBase.name}</p>
        )}
      </CardContent>
    </Card>
  )
}
