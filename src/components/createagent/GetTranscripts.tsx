import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaUser, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaRedoAlt, FaDoorOpen, FaFileAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useLogin } from '../../LoginContext'



const CallDataDisplay = () => {
  const [callData, setCallData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { username } = useLogin();

  const fetchCallData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/call_data/${username}`);
      setCallData(response.data);
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
      fetchCallData();
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
      <button onClick={importGoogleSheets} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
        Import from Google Sheets
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left"><FaPhoneAlt className="inline mr-2" />Phone Number</th>
            <th className="py-3 px-6 text-left"><FaUser className="inline mr-2" />Name</th>
            <th className="py-3 px-6 text-left"><FaCheckCircle className="inline mr-2" />Completed</th>
            <th className="py-3 px-6 text-left"><FaCalendarAlt className="inline mr-2" />Date Completed</th>
            <th className="py-3 px-6 text-left"><FaRedoAlt className="inline mr-2" />Attempts</th>
            <th className="py-3 px-6 text-left"><FaDoorOpen className="inline mr-2" />Room Available</th>
            <th className="py-3 px-6 text-left"><FaFileAlt className="inline mr-2" />Transcript</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {callData.map((call) => (
            <tr key={call.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{call.number}</td>
              <td className="py-3 px-6 text-left">{call.name || 'N/A'}</td>
              <td className="py-3 px-6 text-left">
                {call.completed ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
              </td>
              <td className="py-3 px-6 text-left">{call.date_completed || 'N/A'}</td>
              <td className="py-3 px-6 text-left">{call.attempts}</td>
              <td className="py-3 px-6 text-left">
                {call.roomavailable === null ? 'N/A' : (call.roomavailable ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />)}
              </td>
              <td className="py-3 px-6 text-left">
                <button 
                  onClick={() => alert(call.full_transcript || 'No transcript available')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallDataDisplay;
