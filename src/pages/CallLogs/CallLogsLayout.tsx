import React from "react";
import { useParams } from "react-router-dom";
import { SidebarComponent } from "../../components/sidebar";

import { AudioRecorderComponent } from "../../components/audio-recorder"; // Import the AudioRecorderComponent
import CallDataDisplay from "./CallDataDisplay";
import { useLogin } from '../../LoginContext'

function CallLogsLayout() {
  const { username } = useLogin();


  return (
    <div className="flex">
      <SidebarComponent />
      <main className="flex-1">
      <div className="p-[80px] mx-auto">


     <CallDataDisplay username= {username}/>
     </div>
      </main>
    </div>
  );
}

export default CallLogsLayout;