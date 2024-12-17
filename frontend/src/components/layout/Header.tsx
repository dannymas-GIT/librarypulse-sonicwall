import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <Shield className="h-8 w-8 text-blue-600 transition-colors group-hover:text-blue-700" />
              <div className="absolute inset-0 bg-blue-600/10 rounded-lg transform scale-110 transition-transform group-hover:scale-125" />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                SonicWall
              </span>
              <span className="ml-1 text-sm text-gray-600">Security Dashboard</span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 