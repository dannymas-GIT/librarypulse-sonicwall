import React from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { SecurityDashboard } from './pages/security/SecurityDashboard';
import { Performance } from './pages/device/Performance';
import { DeviceDashboard } from './pages/device/DeviceDashboard';
import { IPS } from './pages/security/IPS';
import { VPN } from './pages/security/VPN';
import { ContentFiltering } from './pages/security/ContentFiltering';
import { AntiVirus } from './pages/security/AntiVirus';
import { ThreatPrevention } from './pages/security/ThreatPrevention';
import { Licensing } from './pages/device/Licensing';
import { Logs } from './pages/logs/Logs';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<SecurityDashboard />} />
      <Route path="device">
        <Route index element={<DeviceDashboard />} />
        <Route path="performance" element={<Performance />} />
        <Route path="licensing" element={<Licensing />} />
      </Route>
      <Route path="security">
        <Route index element={<SecurityDashboard />} />
        <Route path="ips" element={<IPS />} />
        <Route path="vpn" element={<VPN />} />
        <Route path="content-filtering" element={<ContentFiltering />} />
        <Route path="anti-virus" element={<AntiVirus />} />
        <Route path="threat-prevention" element={<ThreatPrevention />} />
      </Route>
      <Route path="logs" element={<Logs />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
}; 