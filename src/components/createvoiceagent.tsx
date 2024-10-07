"'use client'"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Play, Pause, Phone, Bot, Mic } from "lucide-react"

export function CreateVoiceAgentComponent() {
  const [isRecording, setIsRecording] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [knowledgeBase, setKnowledgeBase] = useState<File | null>(null)

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCsvFile(file)
    }
  }

  const handleKnowledgeBaseUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setKnowledgeBase(file)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Implement actual recording logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Create Voice Agent</h1>
        
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

        <Card className="mb-8 bg-gradient-to-br from-green-500 to-teal-600 text-white">
          <CardHeader>
            <CardTitle>Agent Prompt</CardTitle>
            <CardDescription className="text-green-100">Enter the prompt for your voice agent</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your prompt here..."
              className="min-h-[100px] bg-white text-gray-900"
            />
          </CardContent>
        </Card>

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

        <Card className="mb-8 bg-gradient-to-br from-pink-500 to-red-600 text-white">
          <CardHeader>
            <CardTitle>Test Voice Agent</CardTitle>
            <CardDescription className="text-pink-100">Speak to your voice agent to test it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <Button 
                onClick={toggleRecording} 
                className={`bg-white hover:bg-red-100 rounded-full p-4 ${isRecording ? "'text-red-600'" : "'text-pink-600'"}`}
              >
                {isRecording ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
              <span className="text-sm font-medium">
                {isRecording ? "'Tap to stop'" : "'Tap to speak'"}
              </span>
            </div>
            {isRecording && (
              <p className="mt-4 text-center text-sm text-pink-100">Recording... Speak now</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700">
            <Bot className="mr-2 h-5 w-5" />
            Create Agent
          </Button>
          <Button size="lg" variant="outline" className="bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-100">
            <Phone className="mr-2 h-5 w-5" />
            Execute Calls
          </Button>
        </div>
      </div>
    </div>
  )
}