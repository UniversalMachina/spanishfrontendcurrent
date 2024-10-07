import React from "react";
import { useParams } from "react-router-dom";
import { SidebarComponent } from "../../components/sidebar";
import { Dashboard } from "../../components/dashboard";
import { CreateVoiceAgentComponent } from "../../components/createvoiceagent";

function AudioRecoder() {
  const { tab } = useParams();

  return (
    <div className="flex">
      <SidebarComponent />
      <main className="flex-1">


<CreateVoiceAgentComponent/>

        {/* Add more conditional renders based on the tab */}
      </main>
    </div>
  );
}

export default AudioRecoder;