"'use client'"
import React from 'react';

import { Bell, ChevronDown, Search, PlayCircle, StopCircle, UploadCloud, HelpCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const JoobiLogo = () => (
  <svg width="100" height="32" viewBox="0 417.81 136.234" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FEDB00" d="M64.256.629c35.611.216 64.479 29.201 63.725 65.384-.725 34.723-28.772 62.649-63.996 62.607C27.563 128.577-.223 99.138.001 64.302.231 28.603 29.1.559 64.256.629zm36.346 65.621c-.676-20.172-17.079-36.356-38.03-35.558-20.723.79-35.737 17.896-35.147 37.531.619 20.578 17.321 36.131 37.438 35.582 21.473-.485 36.167-18.042 35.739-37.455z"/>
    <path fill="#030303" d="M348.368 37.092c15.368-8.189 27.481-6.531 35.496 4.595 7.623 10.582 6.264 26.358-3.049 35.375-8.812 8.532-21.193 8.566-32.126.108-.161.148-.474.322-.453.433.719 3.796-.87 4.968-4.575 4.525-2.834-.338-5.753-.234-8.611-.018-2.616.197-3.587-.331-3.569-3.334.147-25.12.144-50.241.003-75.36-.017-2.945.855-3.569 3.545-3.388 3.483.233 7.004.211 10.491.003 2.349-.14 2.931.615 2.903 2.915-.124 10.622-.055 21.246-.055 31.868v1.278zm22.374 20.759c.062-6.818-4.653-11.727-11.291-11.755-6.456-.028-11.289 4.791-11.361 11.326-.074 6.799 4.677 11.705 11.337 6.645 0 11.254-4.593 11.315-11.276z"/>
  </svg>
)

export function AudioRecorderComponent() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcription, setTranscription] = useState("''")
  const [analysis, setAnalysis] = useState("''")

  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "'0'")}:${remainingSeconds.toString().padStart(2, "'0'")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcba03]/10 to-[#5ad3ce]/10 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <JoobiLogo />
            <div className="ml-4 w-64 bg-white rounded-full p-2 flex items-center shadow-md">
              <Search className="text-gray-400 w-5 h-5 ml-2" />
              <input type="text" placeholder="Search" className="ml-2 outline-none flex-1" />
              <ChevronDown className="text-gray-400 w-5 h-5 mr-2" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-[#eb2f5b] text-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-shadow text-sm lg:text-base lg:px-6">
                  Upgrade
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <h3 className="font-medium leading-none">Want other AI solutions?</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Leave your info so we can get in contact.</p>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <input type="text" placeholder="Name" className="flex-1 px-3 py-2 border border-zinc-200 rounded dark:border-zinc-800" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="email" placeholder="Email" className="flex-1 px-3 py-2 border border-zinc-200 rounded dark:border-zinc-800" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="url" placeholder="LinkedIn URL" className="flex-1 px-3 py-2 border border-zinc-200 rounded dark:border-zinc-800" />
                    </div>
                    <button className="bg-[#eb2f5b] text-white rounded-full px-4 py-2">Submit</button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-white text-[#fcba03] rounded-full px-4 py-2 flex items-center shadow-md hover:shadow-lg transition-shadow text-sm lg:text-base lg:px-6">
                  <span className="hidden sm:inline">Additional Credits</span>
                  <div className="w-5 h-5 bg-[#5ad3ce] rounded-full ml-2"></div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <h3 className="font-medium leading-none">Schedule a Meeting</h3>
                  <div className="grid gap-2">
                    <button className="bg-[#fcba03] text-white rounded-full px-4 py-2">Schedule Online Meeting</button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Bell className="text-[#fcba03] w-6 h-6" />
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-[#fcba03] font-bold">JD</span>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="bg-white rounded-3xl p-4 lg:p-6 relative overflow-hidden shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-[#5ad3ce] bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <PlayCircle className="w-6 h-6 text-[#5ad3ce]" />
            </div>
            <div className="flex items-center">
              <h2 className="text-xl lg:text-2xl font-bold text-[#fcba03]">Audio Recorder</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="ml-2 text-[#eb2f5b] hover:text-[#fcba03] transition-colors">
                    <HelpCircle className="w-5 h-5" />
                    <span className="sr-only">How does it work?</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>How Audio Recorder Works</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-500 mb-4">
                    The Audio Recorder tool allows you to record or upload audio for transcription and analysis. Here's a quick guide on how to use it effectively.
                  </p>
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=y-__U6UGVJfkcRvN"
                      title="Audio Recorder Explanation"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <p className="text-gray-600 mb-6">Record or upload audio for transcription and analysis</p>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`${
                  isRecording ? "'bg-gray-200 text-gray-600'" : "'bg-[#eb2f5b] text-white'"
                } rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-shadow flex items-center w-full sm:w-auto justify-center`}
              >
                {isRecording ? (
                  <>
                    <StopCircle className="w-5 h-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Start Recording
                  </>
                )}
              </button>
              <button className="bg-[#5ad3ce] text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-shadow flex items-center w-full sm:w-auto justify-center">
                <UploadCloud className="w-5 h-5 mr-2" />
                Upload Audio
              </button>
            </div>
            {isRecording && (
              <p className="text-center text-lg font-semibold">{formatTime(recordingTime)}</p>
            )}
            <div>
              <label htmlFor="transcription" className="block text-sm font-medium text-gray-700 mb-1">
                Transcription
              </label>
              <textarea
                id="transcription"
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 rounded-2xl border border-zinc-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5ad3ce] dark:border-zinc-800"
                placeholder="Your audio transcription will appear here..."
                readOnly
              ></textarea>
            </div>
            <div>
              <label htmlFor="analysis" className="block text-sm font-medium text-gray-700 mb-1">
                AI Analysis
              </label>
              <select
                id="analysis"
                className="w-full px-4 py-2 rounded-full border border-zinc-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5ad3ce] dark:border-zinc-800"
              >
                <option>Summary</option>
                <option>Key Quotes</option>
                <option>Sales Coach Tips</option>
                <option>Custom Analysis</option>
              </select>
            </div>
            <div>
              <textarea
                value={analysis}
                onChange={(e) => setAnalysis(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 rounded-2xl border border-zinc-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5ad3ce] dark:border-zinc-800"
                placeholder="AI analysis results will appear here..."
                readOnly
              ></textarea>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <button
                onClick={() => {
                  // Here you would implement the logic to generate the analysis
                  setAnalysis("'Generated analysis based on the transcription...'")
                }}
                className="bg-[#eb2f5b] text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
              >
                Generate Analysis
              </button>
              <p className="text-gray-600">
                Credits remaining: <span className="font-bold text-[#fcba03]">2</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}