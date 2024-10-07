'use client'

import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AgentPrompt() {
  return (
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
  )
}
