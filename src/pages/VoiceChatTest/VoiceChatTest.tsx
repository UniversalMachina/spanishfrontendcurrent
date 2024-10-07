import React, { useState, useEffect, useRef } from 'react';
import { useLogin } from '../../LoginContext'; // Adjust the path as needed

interface Message {
  text: string;
  sender: string;
}

const VoiceChatbot_Interaction_Page: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
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
      handleStopClick();
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
    setIsListening(false);
    setInterimText('');
  };

  const handleSpeechError = (event: any) => {
    console.error('Speech recognition error', event.error);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      handleStopClick();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

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

  const handleStopClick = () => {
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
    <>
      <div className="flex w-[1150px] h-[700px] pt-[20px]">
        <div className="flex-1">
          <div className="w-full max-w-[1000px] mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 font-poppins">
            <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
              <ChatBox messages={messages} />
              {interimText && (
                <div className="px-4 py-2 bg-gray-200 text-gray-600 italic rounded-lg mx-4 my-2">
                  {interimText}
                </div>
              )}
              <div className="px-4 py-2 bg-gray-100 border-t">
                <button
                  onClick={toggleListening}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
                >
                  {isListening ? 'Stop Listening & Audio' : 'Start Listening'}
                </button>
                <audio ref={audioRef} className="hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ChatBox: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatBoxRef}>
      {messages.map((message, index) => (
        <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
          <div className={`rounded-lg p-3 max-w-[75%] ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoiceChatbot_Interaction_Page;