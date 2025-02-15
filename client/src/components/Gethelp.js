import React, { useState, useRef } from "react";
import { Menu, X, Users, Shield, Camera, Mail } from 'lucide-react';
import Webcam from "react-webcam";

const Gethelp = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <MainContent />
    </div>
  );
};

const Header = () => {
      const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    
    
    <header className="bg-red-600 shadow-lg sticky top-0 z-50">
        <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">CrowdSafe</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-900 hover:text-blue-600">Home</a>
            <a href="/admin" className="text-gray-900 hover:text-blue-600">Admin</a>
            <a href="/heatmap" className="text-gray-900 hover:text-blue-600">Heatmaps</a>
            <a href="/cctv" className="text-gray-900 hover:text-blue-600">CCTV</a>
            <a href="/contact" className="text-gray-900 hover:text-blue-600">Contact</a>
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
            <a href="/" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">Home</a>
            <a href="/admin" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">Admin</a>
            <a href="/heatmap" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">Heatmaps</a>
            <a href="cctv" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">CCTV</a>
            <a href="/contact" className="block px-3 py-2 text-gray-900 hover:bg-gray-100">Contact</a>
          </div>
        </div>
      )}
    </nav>
   
    </header>
    
    
  
  );
};

const MainContent = () => {
  return (
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between bg-black shadow-lg mb-2.5">
  <div className="flex items-center">
    <h1 className="ml-4 text-2xl font-bold text-white">
      Emergency Help Center
    </h1>
  </div>
  <div className="flex items-center">
    <i className="fas fa-phone-alt text-white mr-2"></i>
    <span className="text-white font-bold">24/7 Emergency: 911</span>
  </div>
</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="space-y-8">
          <EmergencyButton />
          <EmergencyContacts />
          <ReportEmergency />
        </div>
        <div className="space-y-8">
          <Location />
          <Instructions />
          <HelpStatus />
        </div>
      </div>
    </main>
  );
};


const EmergencyButton = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const triggerEmergency = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const formData = new FormData();
          formData.append("latitude", position.coords.latitude);
          formData.append("longitude", position.coords.longitude);

          // Capture image from webcam
          if (webcamRef.current) {
            const screenshot = webcamRef.current.getScreenshot();
            
            if (screenshot) {
              setCapturedImage(screenshot); // Show the captured image preview
              
              const blob = await (await fetch(screenshot)).blob();
              const file = new File([blob], "screenshot.jpg", { type: "image/jpeg" });
              formData.append("image", file);
            } else {
              alert("Error capturing image. Try again.");
              return;
            }
          }

          const response = await fetch("http://localhost:5000/api/emergencyreport", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Failed to send alert");
          const data = await response.json();
          alert(data.message || "Emergency alert sent!");
        } catch (error) {
          console.error("Error sending emergency alert:", error);
          alert("Failed to send emergency alert. Please try again.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Location access denied. Enable location to send SOS.");
      }
    );
  };

  return (                                 
    <div className="text-center space-y-4">     
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full rounded-lg shadow-lg" />
      
      <button      
        className="rounded-lg bg-red-600 hover:bg-red-800 text-white font-bold py-4 px-8 text-2xl w-full shadow-lg transform transition hover:scale-105"
        onClick={triggerEmergency}     
      >          
        🚨 SOS EMERGENCY            
      </button>
    </div>
  );
};


const EmergencyContacts = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Emergency Contacts</h2>
      <div className="grid grid-cols-2 gap-4">
        <ContactButton color="bg-blue-600" icon="fas fa-shield-alt" label="Police" />
        <ContactButton color="bg-green-600" icon="fas fa-ambulance" label="Ambulance" />
        <ContactButton color="bg-red-600" icon="fas fa-fire-extinguisher" label="Fire Dept" />
        <ContactButton color="bg-yellow-600" icon="fas fa-phone" label="Helpline" />
      </div>
    </div>
  );
};

const ContactButton = ({ color, icon, label }) => {
  return (
    <button className={`rounded-lg flex items-center justify-center ${color} hover:opacity-80 text-white p-4`}>
      <i className={`${icon} mr-2`}></i>
      {label}
    </button>
  );
};

const ReportEmergency = () => {
  const [formData, setFormData] = useState({
    contactNumber: "",
    emergencyType: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const submitEmergency = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("contactNumber", formData.contactNumber);
    data.append("emergencyType", formData.emergencyType);
    data.append("description", formData.description);
    if (formData.file) data.append("file", formData.file);

    try {
      const response = await fetch("http://localhost:5000/api/emergency", {
        method: "POST",
        body: data,
      });
      if (response.ok) alert("Emergency report submitted successfully!");
      else alert("Submission failed.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={submitEmergency} className="bg-white p-6 rounded-xl border border-gray-300 shadow-lg space-y-4">
    {/* Heading and Description */}
    <h2 className="text-2xl font-bold text-black">📢 Report an Emergency</h2>
    <p className="text-gray-600">Fill out the form below to report an emergency. Please provide as much detail as possible.</p>
  
    {/* Contact Number Field */}
    <label className="text-gray-900 font-medium">Contact Number</label>
    <input
      type="tel"
      name="contactNumber"
      placeholder="📞 Enter your contact number"
      required
      value={formData.contactNumber}
      onChange={handleChange}
      className="w-full p-2 border rounded"
    />
  
    {/* Emergency Type Field */}
    <label className="text-gray-900 font-medium">Emergency Type</label>
    <select
      name="emergencyType"
      required
      value={formData.emergencyType}
      onChange={handleChange}
      className="w-full p-2 border rounded"
    >
      <option value="">🚨 Select Emergency Type</option>
      <option value="Medical">🏥 Medical Emergency</option>
      <option value="Fire">🔥 Fire Emergency</option>
      <option value="Security">🔒 Security Threat</option>
    </select>
  
    {/* Description Field */}
    <label className="text-gray-900 font-medium">Description</label>
    <textarea
      name="description"
      placeholder="📝 Describe the emergency in detail..."
      required
      value={formData.description}
      onChange={handleChange}
      className="w-full p-2 border rounded"
    ></textarea>
  
    {/* File Upload Field */}
    <label className="text-gray-900 font-medium">Upload Image/Video</label>
    <input
      type="file"
      accept="image/*,video/*"
      onChange={handleFileChange}
      className="w-full p-2 border rounded"
    />
  
    <button type="submit" className="w-full bg-red-600 text-white py-2 rounded">
      🚀 Submit Report
    </button>
  </form>
  
  
  );
};

const InputField = ({ label, type, required, accept }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type={type} accept={accept} className="rounded-lg mt-1 block w-full border-gray-300" required={required} />
  </div>
);

const SelectField = ({ label, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select className="rounded-lg mt-1 block w-full border-gray-300">
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </div>
);

const TextareaField = ({ label, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea className="rounded-lg mt-1 block w-full border-gray-300" rows="3" required={required}></textarea>
  </div>
);

const Location = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-6 h-96">
      <h2 className="text-xl font-semibold mb-4">Your Location</h2>
      <div className="relative h-full">
        <img src="https://ai-public.creatie.ai/gen_page/map_placeholder_1280x720.png" alt="Map" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
        <button className="rounded-lg absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4">
          <i className="fas fa-share-location mr-2"></i>
          Share Location
        </button>
      </div>
    </div>
  );
};

const Instructions = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Emergency Instructions</h2>
      <InstructionCard title="Medical Emergency" instructions={["Check for breathing and consciousness", "Call emergency services immediately", "Perform CPR if trained", "Keep the person warm and comfortable"]} />
      <InstructionCard title="Fire Emergency" instructions={["Evacuate the building immediately", "Call fire department", "Do not use elevators", "Stay low to avoid smoke inhalation"]} />
    </div>
  );
};

const InstructionCard = ({ title, instructions }) => (
  <div className="border rounded-lg p-4">
    <h3 className="font-medium text-lg mb-2">{title}</h3>
    <ul className="list-disc list-inside text-gray-600">
      {instructions.map((instruction, index) => (
        <li key={index}>{instruction}</li>
      ))}
    </ul>
  </div>
);

const HelpStatus = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Help Status</h2>
      <p className="text-green-600 font-medium">Help is on the way</p>
      <p className="text-green-600 font-medium">ETA: 5 minutes</p>
    </div>
  );
};

export default Gethelp;
