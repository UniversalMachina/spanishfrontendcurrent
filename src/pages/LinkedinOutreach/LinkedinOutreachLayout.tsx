import React from "react";
import { useParams } from "react-router-dom";
import { SidebarComponent } from "../../components/sidebar";
import { Dashboard } from "../../components/dashboard";
import { AudioRecorderComponent } from "../../components/audio-recorder"; // Import the AudioRecorderComponent

function DashboardLayout() {


  return (
    <div className="flex">
      <SidebarComponent />
      <main className="flex-1">
     <Dashboard />
   
      </main>
    </div>
  );
}

export default DashboardLayout;