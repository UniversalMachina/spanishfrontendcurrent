import React, { useState, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogin } from '../../LoginContext'
import axios from 'axios'

export function AgentPrompt() {
  const { username } = useLogin();
  const [prompt, setPrompt] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchPrompt();
  }, [username]);

  const fetchPrompt = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/chatbot/${username}`);
      setPrompt(response.data.prompt);
    } catch (error) {
      console.error('Error fetching prompt:', error);
    }
  };

  const updatePrompt = async () => {
    try {
      await axios.post(`${apiBaseUrl}/update/${username}`, { prompt });
      setUpdateStatus('Prompt updated successfully');
    } catch (error) {
      console.error('Error updating prompt:', error);
      setUpdateStatus('Failed to update prompt');
    }
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-green-500 to-teal-600 text-white">
      <CardHeader>
        <CardTitle>Agent Prompt</CardTitle>
        <CardDescription className="text-green-100">Enter the prompt for your voice agent</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="min-h-[100px] bg-white text-gray-900"
        />
        <button
          onClick={updatePrompt}
          className="mt-4 px-4 py-2 bg-white text-green-600 rounded hover:bg-green-100"
        >
          Update Prompt
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