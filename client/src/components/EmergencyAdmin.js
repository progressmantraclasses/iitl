import React, { useEffect, useState } from "react";
import axios from "axios";

const EmergencyAdmin = () => {
  const [reports, setReports] = useState([]);
  const [reportCount, setReportCount] = useState(0);

  // Fetch emergency reports from backend
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/emergencyreports");
      setReports(response.data);
      setReportCount(response.data.length);
    } catch (error) {
      console.error("Error fetching emergency reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚨 Emergency Reports</h1>
      <p className="text-lg font-semibold">Total Messages Received: {reportCount}</p>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Latitude</th>
              <th className="py-2 px-4 border">Longitude</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 border">{report.latitude}</td>
                <td className="py-2 px-4 border">{report.longitude}</td>
                <td className="py-2 px-4 border">
                 
                    <img
                    src={`http://localhost:5000${report.imageUrl}`}
                      alt="Emergency"
                      className="h-16 w-16 object-cover rounded"
                    />
                 
                </td>
                <td className="py-2 px-4 border">{new Date(report.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmergencyAdmin;
