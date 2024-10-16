import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarEvent {
  summary: string;
  start: string;
}

const GoogleCalendarAuth: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEventsVisible, setIsEventsVisible] = useState<boolean>(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('message', handleAuthMessage);
    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/google/calendar/auth-status');
      if (response.ok) {
        const data: { isAuthenticated: boolean } = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        if (data.isAuthenticated) {
          fetchEvents();
        }
      }
    } catch (error) {
      setError('Error checking auth status');
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (forceNewAccount: boolean = false): Promise<void> => {
    try {
      const url = forceNewAccount 
        ? 'http://localhost:5000/api/google/calendar/init?force_new_account=true'
        : 'http://localhost:5000/api/google/calendar/init';

      const response = await fetch(url, {
        redirect: 'manual' // This prevents automatic redirect
      });

      if (response.type === 'opaqueredirect') {
        // This means we got a redirect
        const authWindow = window.open(url, 'Google Calendar Auth', 'width=500,height=600');
        if (!authWindow) {
          setError('Popup blocked. Please allow popups for this website.');
        }
      } else if (response.ok) {
        // If we get a success message, update the state
        setIsAuthenticated(true);
        fetchEvents();
      } else {
        const errorData = await response.json();
        setError(`Authentication failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError('Error initiating Google login');
      console.error('Error initiating Google login:', error);
    }
  };

  const handleAuthMessage = (event: MessageEvent): void => {
    if (event.data.status === 'success') {
      setIsAuthenticated(true);
      setError(null);
      fetchEvents();
    } else if (event.data.error) {
      setError(`Authentication failed: ${event.data.error}`);
    }
  };

  const fetchEvents = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/google/calendar/events');
      if (response.ok) {
        const data: CalendarEvent[] = await response.json();
        setEvents(data);
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch events: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError('Error fetching events');
      console.error('Error fetching events:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Card className="mb-8 bg-gradient-to-br from-green-500 to-teal-600 text-white">
      <CardHeader>
        <CardTitle className="text-white">Google Calendar Management</CardTitle>
        <CardDescription className="text-green-100">
          Connect and manage your Google Calendar events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {!isAuthenticated ? (
          <Button
            onClick={() => handleGoogleLogin()}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Connect Google Calendar
          </Button>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-xl font-semibold text-white">Connected to Google Calendar</p>
            <Button
              onClick={fetchEvents}
              className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline mb-4"
            >
              Refresh Events
            </Button>
            <Button
              onClick={() => handleGoogleLogin(true)}
              className="w-full px-4 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
            >
              Login with Different Account
            </Button>
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Upcoming Events:</h3>
              <Button
                onClick={() => setIsEventsVisible(!isEventsVisible)}
                className="text-sm text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none focus:shadow-outline"
              >
                {isEventsVisible ? 'Hide' : 'Show'}
              </Button>
            </div>
            {isEventsVisible && (
              <ul className="space-y-2">
                {events.map((event, index) => (
                  <li key={index} className="p-2 bg-gray-50 rounded">
                    <p className="font-medium text-black">{event.summary}</p>
                    <p className="text-sm text-gray-600">{new Date(event.start).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarAuth;
