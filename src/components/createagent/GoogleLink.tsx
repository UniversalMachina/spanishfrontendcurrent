import React, { useState, useEffect } from 'react';

interface CalendarEvent {
  summary: string;
  start: string;
}

const GoogleCalendarAuth: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/google/calendar/init', {
        redirect: 'manual' // This prevents automatic redirect
      });

      if (response.type === 'opaqueredirect') {
        // This means we got a redirect
        const authWindow = window.open('http://localhost:5000/api/google/calendar/init', 'Google Calendar Auth', 'width=500,height=600');
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {!isAuthenticated ? (
          <button
            onClick={handleGoogleLogin}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Connect Google Calendar
          </button>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-xl font-semibold text-green-600">Connected to Google Calendar</p>
            <button
              onClick={fetchEvents}
              className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
            >
              Refresh Events
            </button>
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold">Upcoming Events:</h3>
            <ul className="space-y-2">
              {events.map((event, index) => (
                <li key={index} className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">{event.summary}</p>
                  <p className="text-sm text-gray-600">{new Date(event.start).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCalendarAuth;