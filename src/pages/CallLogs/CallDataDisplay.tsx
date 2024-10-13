import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaUser, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaRedoAlt, FaDoorOpen, FaFileAlt, FaSpinner, FaExclamationTriangle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface CallData {
  id: number;
  number: string;
  name: string | null;
  completed: boolean;
  date_completed: string | null;
  attempts: number;
  roomavailable: boolean | null;
  full_transcript: string | null;
}

interface CallDataDisplayProps {
  username: string;
}

const CallDataDisplay: React.FC<CallDataDisplayProps> = ({ username }) => {
  const [callData, setCallData] = useState<CallData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTranscript, setExpandedTranscript] = useState<number | null>(null);

  const fetchCallData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<CallData[]>(`${import.meta.env.VITE_API_BASE_URL}/api/call_data/${username}`);
      if (Array.isArray(response.data)) {
        setCallData(response.data);
      } else {
        setError('Received invalid data format from server');
        console.error('Expected array, got:', response.data);
      }
    } catch (err) {
      setError('Failed to fetch call data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const importGoogleSheets = async () => {
    try {
      await axios.post(`/api/import_googlesheets/${username}`);
      fetchCallData();  // Refresh data after import
    } catch (err) {
      setError('Failed to import Google Sheets data');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCallData();
  }, [username]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64 text-red-500">
      <FaExclamationTriangle className="mr-2" />
      <span>Error: {error}</span>
    </div>
  );

  return (
    <div className="space-y-4 p-4">
      <button 
        onClick={importGoogleSheets} 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Import from Google Sheets
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left"><FaPhoneAlt className="inline mr-2" />Phone Number</th>
              <th className="px-4 py-2 text-left"><FaUser className="inline mr-2" />Name</th>
              <th className="px-4 py-2 text-left"><FaCheckCircle className="inline mr-2" />Completed</th>
              <th className="px-4 py-2 text-left"><FaCalendarAlt className="inline mr-2" />Date Completed</th>
              <th className="px-4 py-2 text-left"><FaRedoAlt className="inline mr-2" />Attempts</th>
              <th className="px-4 py-2 text-left"><FaDoorOpen className="inline mr-2" />Room Available</th>
              <th className="px-4 py-2 text-left"><FaFileAlt className="inline mr-2" />Transcript</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(callData) && callData.length > 0 ? (
              callData.map((call) => (
                <React.Fragment key={call.id}>
                  <tr className="border-t">
                    <td className="px-4 py-2">{call.number}</td>
                    <td className="px-4 py-2">{call.name || 'N/A'}</td>
                    <td className="px-4 py-2">
                      {call.completed ? 
                        <FaCheckCircle className="text-green-500" /> : 
                        <FaTimesCircle className="text-red-500" />
                      }
                    </td>
                    <td className="px-4 py-2">{call.date_completed || 'N/A'}</td>
                    <td className="px-4 py-2">{call.attempts}</td>
                    <td className="px-4 py-2">
                      {call.roomavailable === null ? 'N/A' : 
                        (call.roomavailable ? 
                          <FaCheckCircle className="text-green-500" /> : 
                          <FaTimesCircle className="text-red-500" />
                        )
                      }
                    </td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => setExpandedTranscript(expandedTranscript === call.id ? null : call.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded flex items-center"
                      >
                        {expandedTranscript === call.id ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />}
                        {expandedTranscript === call.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {expandedTranscript === call.id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-2 bg-gray-100">
                        <div className="whitespace-pre-wrap">
                          {call.full_transcript || 'No transcript available'}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center">
                  No call data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallDataDisplay;
