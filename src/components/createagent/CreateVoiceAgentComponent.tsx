'use client'

import React from 'react';
import { CsvUpload } from './CsvUpload'
import { AgentPrompt } from './AgentPrompt'
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload'
import { TestVoiceAgent } from './TestVoiceAgent'
import { useNavigate } from 'react-router-dom';

export function CreateVoiceAgentComponent() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Create Voice Agent</h1>
        <AgentPrompt />
        <KnowledgeBaseUpload /> 
        {/* <CsvUpload />
        
        <KnowledgeBaseUpload /> */}
        {/* <TestVoiceAgent /> */}

        <button
          onClick={() => navigate("/voice-agent-use")}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
        >
          Go to Voice Agent Use
        </button>
      </div>
    </div>
  )
}
