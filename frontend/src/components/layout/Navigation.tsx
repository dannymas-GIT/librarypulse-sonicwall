import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  Monitor,
  AlertTriangle,
  Lock,
  Filter,
  Activity,
  Network,
  FileText,
  Settings,
  ChevronDown
} from 'lucide-react';

const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  children?: { to: string; label: string }[];
}> = ({ to, icon, label, children }) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg relative group";
  const activeClasses = "bg-primary-50 text-primary-700 hover:bg-primary-100";

  if (children) {
    return (
      <div className="relative group">
        <div className={`${baseClasses} cursor-pointer`}>
          {icon}
          <span>{label}</span>
          <ChevronDown className="w-4 h-4 ml-1" />
        </div>
        <div className="absolute hidden group-hover:block top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-[200px] z-50">
          {children.map(child => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `block px-4 py-2 text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-primary-50 text-primary-700' : ''}`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ''}`}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center h-16 gap-2">
          <div className="flex-shrink-0 mr-8">
            <img src="/sonicwall-logo.png" alt="SonicWall" className="h-8" />
          </div>

          <NavItem
            to="/security"
            icon={<Shield className="w-5 h-5" />}
            label="Security"
            children={[
              { to: "/security", label: "Overview" },
              { to: "/security/ips", label: "Intrusion Prevention" },
              { to: "/security/anti-virus", label: "Anti-Virus" },
              { to: "/security/content-filtering", label: "Content Filtering" },
              { to: "/security/vpn", label: "VPN" },
              { to: "/security/threat-prevention", label: "Threat Prevention" },
            ]}
          />

          <NavItem
            to="/device"
            icon={<Monitor className="w-5 h-5" />}
            label="Device"
            children={[
              { to: "/device", label: "Overview" },
              { to: "/device/performance", label: "Performance" },
              { to: "/device/licensing", label: "Licensing" },
            ]}
          />

          <NavItem
            to="/logs"
            icon={<FileText className="w-5 h-5" />}
            label="Logs"
          />

          <NavItem
            to="/settings"
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
          />
        </div>
      </div>
    </nav>
  );
}; 