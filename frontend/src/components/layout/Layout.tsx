import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Activity,
  Network,
  FileText,
  ChevronDown,
  Settings,
  Bell,
  User,
  BarChart2,
  Lock,
  Wifi,
  Globe,
  AlertTriangle,
  MonitorPlay,
  PieChart,
  LineChart,
  Database
} from 'lucide-react';

const mainNavItems = [
  {
    label: 'Dashboard',
    icon: PieChart,
    path: '/',
  },
  {
    label: 'Security',
    icon: Shield,
    items: [
      { path: '/logs', label: 'Security Logs', icon: Database },
      { path: '/threat-prevention', label: 'Threat Prevention', icon: AlertTriangle },
      { path: '/ids', label: 'Intrusion Detection', icon: Lock },
      { path: '/content-filtering', label: 'Content Filtering', icon: FileText },
    ]
  },
  {
    label: 'Network',
    icon: Network,
    items: [
      { path: '/vpn', label: 'VPN', icon: Lock },
    ]
  },
  {
    label: 'Licensing',
    icon: BarChart2,
    path: '/licensing',
  }
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownClick = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isActive = (path: string) => location.pathname === path;
  const isDropdownActive = (items: Array<{ path: string }>) => 
    items.some(item => location.pathname === item.path);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <div className="flex-shrink-0 py-12 pr-12">
              <Link to="/" className="flex items-center">
                <img 
                  src="/images/librarypulselogo.jpg" 
                  alt="LibraryPulse Logo" 
                  className="h-24 w-auto"
                />
              </Link>
            </div>

            {/* Navigation and Controls */}
            <div className="flex items-center justify-between flex-1 ml-12">
              <div className="hidden md:flex md:space-x-8">
                {mainNavItems.map((item) => (
                  <div key={item.label} className="relative inline-block text-left">
                    {item.path ? (
                      <Link
                        to={item.path}
                        className={`inline-flex items-center px-4 py-2 text-lg font-bold rounded-md ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDropdownClick(item.label)}
                          className={`inline-flex items-center px-4 py-2 text-lg font-bold rounded-md ${
                            isDropdownActive(item.items || [])
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <item.icon className="h-5 w-5 mr-2" />
                          {item.label}
                          <ChevronDown className={`ml-2 h-5 w-5 transform transition-transform ${
                            openDropdown === item.label ? 'rotate-180' : ''
                          }`} />
                        </button>

                        {openDropdown === item.label && item.items && (
                          <div className="absolute z-10 left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.path}
                                  to={subItem.path}
                                  className={`group flex items-center px-4 py-3 text-lg font-bold ${
                                    isActive(subItem.path)
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <subItem.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Settings className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button className="flex items-center max-w-xs bg-gray-50 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">Open user menu</span>
                    <User className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}; 