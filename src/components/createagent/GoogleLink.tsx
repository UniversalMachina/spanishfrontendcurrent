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

  const handleGoogleLogin = (): void => {
    window.location.href = 'http://localhost:5000/api/google/calendar/init';
  };

  const fetchEvents = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/google/calendar/events');
      if (response.ok) {
        const data: CalendarEvent[] = await response.json();
        setEvents(data);
      } else {
        setError('Failed to fetch events');
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

        {error && (
          <p className="mt-4 text-red-500">{error}</p>
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