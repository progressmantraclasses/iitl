import React, { useEffect, useState, useRef } from "react";
import { Menu, X, Users, Shield, Camera, Mail } from 'lucide-react';
import io from "socket.io-client";
import Webcam from "react-webcam";
import axios from "axios";

// Connect to Flask-SocketIO
const socket = io("http://localhost:5001");

const CCTVFeed = () => {
  const [alert, setAlert] = useState(null);
   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const webcamRef = useRef(null);

  useEffect(() => {
    socket.on("receive-alert", (data) => {
      console.log("Received Alert:", data); // Debugging
      setAlert(data);
      setTimeout(() => setAlert(null), 5000);
    });

    return () => socket.off("receive-alert"); // Proper cleanup
  }, []);

  // Function to capture frame and send for detection
  const captureFrame = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob);

      try {
        const response = await axios.post("http://localhost:5001/detect", formData);
        const detectedItems = response.data;
        setDetectedObjects(detectedItems);
        console.log("Detected Objects:", detectedItems);

      } catch (error) {
        console.error("Error detecting objects:", error);
      }
    }
  };

  // Automatically capture frames every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">CrowdSafe</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-900 hover:text-blue-600">Admin</a>
              <a href="#" className="text-gray-900 hover:text-blue-600">Heatmaps</a>
              <a href="#" className="text-gray-900 hover:text-blue-600">CCTV</a>
              <a href="#" className="text-gray-900 hover:text-blue-600">Contact</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">Home</a>
              <a href="#" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">Admin</a>
              <a href="#" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">Heatmaps</a>
              <a href="#" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">CCTV</a>
              <a href="#" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">Contact</a>
            </div>
          </div>
        )}
      </nav>
    <div className="p-4">
      <h2 className="text-2xl font-bold">Live CCTV Feed</h2>
      <Webcam ref={webcamRef} className="w-full h-64 border-2" screenshotFormat="image/jpeg" />

      <button 
        onClick={() => socket.emit("receive-alert", { message: "🚨 Fake Weapon Alert! 🚨" })}
        className="mt-2 p-2 bg-red-600 text-white"
      >
        Send Fake Alert
      </button>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Live CCTV Detection:{alert && <div className="text-blue">Detected total Number of Person's:    {alert.person_count}</div>}</h3>
        {alert && <div className="bg-red-500 text-white p-2">{alert.message}</div>}
        <ul>
          {detectedObjects.map((obj, index) => (
            <li key={index} className="text-gray-700">
              {obj.label} - {Math.round(obj.confidence * 100)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
     {/* Footer */}
     <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">
                Leading provider of crowd management solutions for safer public spaces.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: info@crowdsafe.com</li>
                <li className="text-gray-400">Phone: (555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-l-lg w-full text-gray-900"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 CrowdSafe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CCTVFeed;
