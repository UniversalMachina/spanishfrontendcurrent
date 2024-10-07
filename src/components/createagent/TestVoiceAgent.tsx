'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Phone, Pause, Mic } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogin } from '../../LoginContext' // Adjust the path as needed

interface Message {
  text: string;
  sender: string;
}

export function TestVoiceAgent() {
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<Message[]>([]);
  const [interimText, setInterimText] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);
  const { username } = useLogin(); // Get the username from context

  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onend = handleSpeechEnd;
      recognitionRef.current.onerror = handleSpeechError;
    }
  }, []);

  useEffect(() => {
    if (interimText) {
      handleStopRecording();
    }
  }, [interimText]);

  const handleSpeechResult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    setInterimText(interimTranscript);

    if (finalTranscript) {
      setInterimText('');
      handleSendMessage(finalTranscript);
    }

    clearTimeout(recognitionRef.current.timeoutId);
    recognitionRef.current.timeoutId = setTimeout(() => {
      if (interimTranscript) {
        setInterimText('');
        handleSendMessage(interimTranscript);
      }
    }, 2000);
  };

  const handleSpeechEnd = () => {
    setIsRecording(false);
    setInterimText('');
  };

  const handleSpeechError = (event: any) => {
    console.error('Speech recognition error', event.error);
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      handleStopRecording();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  }

  const handleSendMessage = async (message: string) => {
    setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);

    if (controller) {
      controller.abort();
    }

    const newController = new AbortController();
    setController(newController);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/voice_stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId, user_id: username }),
        signal: newController.signal,
      });

      const reader = response.body!.getReader();
      const mediaSource = new MediaSource();

      mediaSource.addEventListener('sourceopen', () => {
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

        const appendChunk = async () => {
          try {
            const { done, value } = await reader.read();
            if (done) {
              mediaSource.endOfStream();
              return;
            }

            if (sourceBuffer.updating) {
              sourceBuffer.addEventListener('updateend', appendChunk, { once: true });
            } else {
              sourceBuffer.appendBuffer(value);
              appendChunk();
            }
          } catch (err: any) {
            if (err.name === 'AbortError') {
              console.log('Stream aborted');
            } else {
              console.error('Error while appending buffer:', err);
            }
          }
        };

        appendChunk();
      });

      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(mediaSource);
        audioRef.current.play();
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch request was aborted');
      } else {
        console.error('Error fetching audio:', error);
      }
    }
  };

  const handleStopRecording = () => {
    if (controller) {
      controller.abort();
      setController(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    }
  };

  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-br from-pink-500 to-red-600 text-white">
        <CardHeader>
          <CardTitle>Test Voice Agent</CardTitle>
          <CardDescription className="text-pink-100">Speak to your voice agent to test it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Button 
              onClick={toggleRecording} 
              className={`bg-white hover:bg-red-100 rounded-full p-6 ${isRecording ? "text-red-600" : "text-pink-600"}`}
            >
              {isRecording ? (
                <Pause className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>
            <span className="text-sm font-medium">
              {isRecording ? "Tap to stop" : "Tap to speak"}
            </span>
          </div>
          {isRecording && (
            <p className="mt-4 text-center text-sm text-pink-100">Recording... Speak now</p>
          )}
          {interimText && (
            <div className="mt-4 px-4 py-2 bg-white text-gray-600 italic rounded-lg">
              {interimText}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-4">
        <Button size="lg" variant="outline" className="bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-100">
          <Phone className="mr-2 h-5 w-5" />
          Execute Calls
        </Button>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}

