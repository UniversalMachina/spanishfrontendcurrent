'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Phone, Pause, Mic } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TestVoiceAgent() {
  const [isRecording, setIsRecording] = useState(false)

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Implement actual recording logic here
  }

  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-br from-pink-500 to-red-600 text-white">
        <CardHeader>
          <CardTitle>Test Voice Agent</CardTitle>
          <CardDescription className="text-pink-100">Speak to your voice agent to test it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Button 
              onClick={toggleRecording} 
              className={`bg-white hover:bg-red-100 rounded-full p-6 ${isRecording ? "text-red-600" : "text-pink-600"}`}
            >
              {isRecording ? (
                <Pause className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>
            <span className="text-sm font-medium">
              {isRecording ? "Tap to stop" : "Tap to speak"}
            </span>
          </div>
          {isRecording && (
            <p className="mt-4 text-center text-sm text-pink-100">Recording... Speak now</p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-center mt-4">
        <Button size="lg" variant="outline" className="bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-100">
          <Phone className="mr-2 h-5 w-5" />
          Execute Calls
        </Button>
      </div>
    </div>
  )
}
