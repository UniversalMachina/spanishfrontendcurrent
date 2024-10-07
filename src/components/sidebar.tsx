"'use client'"

import React from 'react';
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLogin } from "../LoginContext"; // Import the useLogin hook

const sidebarItems = [
  { name: "Dashboard", tab: "dashboard" },
  { name: "Voice Agent", tab: "voice-agent" }, // Added Audio Recorder
]

export function SidebarComponent() {
  const [activeTab, setActiveTab] = useState("overview")
  const navigate = useNavigate()
  const { logout } = useLogin(); // Get the logout function from the context

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    navigate(`/${tab}`)
  }

  const handleLogout = () => {
    logout();
    navigate("/logout");
  };

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen sticky top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Voice Agent</h1>
      </div>
      <nav className="mt-6">
        {sidebarItems.map((item) => (
          <button
            key={item.name}
            className={`flex items-center w-full px-4 py-2 mt-1 text-sm ${
              activeTab === item.tab
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            } transition-colors duration-200`}
            onClick={() => handleTabClick(item.tab)}
          >
            {item.name}
          </button>
        ))}
        <button
          className="flex items-center w-full px-4 py-2 mt-1 text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </aside>
  )
}