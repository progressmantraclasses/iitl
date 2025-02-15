import React from 'react';
import { Menu, X, Users, Shield, Camera, Mail } from 'lucide-react';
import CrowdVisualization from './CrowdVisualization';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const features = [
    {
      title: "Real-time Crowd Monitoring",
      description: "Advanced AI algorithms to analyze crowd density and movement patterns in real-time",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Security Integration",
      description: "End-to-end encryption and secure data handling with multi-factor authentication",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "CCTV Integration",
      description: "Seamless integration with existing CCTV infrastructure for comprehensive monitoring",
      icon: <Camera className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
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

      
          
         {/* Hero Section */}
<div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Text content */}
      <div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Smart Crowd Management Solutions
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Revolutionizing crowd safety with real-time monitoring and AI-powered analytics
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Get Started
        </button>
      </div>
      
      {/* Visualization */}
      <div className="w-full">
        <CrowdVisualization />
      </div>
    </div>
  </div>
</div>
  
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
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

export default HomePage;



