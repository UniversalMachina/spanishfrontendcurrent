import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { SidebarComponent } from "../../components/sidebar";
import { Dashboard } from "../../components/dashboard";
import { CreateVoiceAgentComponent } from "../../components/createagent/CreateVoiceAgentComponent";

function AudioRecoder() {
  const { tab } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="flex">
      <SidebarComponent />
      <main className="flex-1">
        <CreateVoiceAgentComponent />

        {/* Add more conditional renders based on the tab */}
      </main>
    </div>
  );
}

export default AudioRecoder;