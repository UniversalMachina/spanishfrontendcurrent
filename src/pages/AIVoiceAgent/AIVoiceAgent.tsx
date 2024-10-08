import React from "react";
import { useParams } from "react-router-dom";
import { SidebarComponent } from "../../components/sidebar";
import { Dashboard } from "../../components/dashboard";
import { AudioRecorderComponent } from "../../components/audio-recorder"; // Import the AudioRecorderComponent
import { TestVoiceAgent } from "../../components/createagent/TestVoiceAgent";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function AIVoiceAgent() {
  const navigate = useNavigate(); // Initialize useNavigate


  return (
    <div className="flex">
      <SidebarComponent />
      <main className="flex-1">
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
      <TestVoiceAgent />

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/voice-agent")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
        >
          Back to Voice Agent
        </button>
      </div>
      </div>
      </div>
      </main>

    </div>
  );
}

export default AIVoiceAgent;