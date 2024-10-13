import React, { useState, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogin } from '../../LoginContext'
import axios from 'axios'

export function AgentPrompt() {
  const { username } = useLogin();
  const [prompt, setPrompt] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchPromptAndInitialMessage();
  }, [username]);

  const fetchPromptAndInitialMessage = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/chatbot/${username}`);
      setPrompt(response.data.prompt);
      setInitialMessage(response.data.initialMessage);
    } catch (error) {
      console.error('Error fetching prompt and initial message:', error);
    }
  };

  const updatePromptAndInitialMessage = async () => {
    try {
      await axios.post(`${apiBaseUrl}/update/${username}`, { prompt, initialMessage });
      setUpdateStatus('Prompt and initial message updated successfully');
    } catch (error) {
      console.error('Error updating prompt and initial message:', error);
      setUpdateStatus('Failed to update prompt and initial message');
    }
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-green-500 to-teal-600 text-white">
      <CardHeader>
        <CardTitle>Agent Configuration</CardTitle>
        <CardDescription className="text-green-100">Enter the prompt and initial message for your voice agent</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="prompt" className="block mb-2">Prompt:</label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="min-h-[100px] bg-white text-gray-900"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="initialMessage" className="block mb-2">Initial Message:</label>
          <Textarea
            id="initialMessage"
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            placeholder="Enter the initial message here..."
            className="min-h-[100px] bg-white text-gray-900"
          />
        </div>
        <button
          onClick={updatePromptAndInitialMessage}
          className="mt-4 px-4 py-2 bg-white text-green-600 rounded hover:bg-green-100"
        >
          Update Configuration
        </button>
        {updateStatus && (
          <p className={`mt-2 ${updateStatus.includes('successfully') ? 'text-green-200' : 'text-red-200'}`}>
            {updateStatus}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
