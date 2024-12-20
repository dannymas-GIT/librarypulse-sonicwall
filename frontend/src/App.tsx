import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/layout/Layout'
import { SecurityDashboard } from './pages/SecurityDashboard'
import { ThreatPrevention } from './pages/security/ThreatPrevention'
import { VPN } from './pages/security/VPN'
import { IDS } from './pages/security/IDS'
import { Logs } from './pages/logs/Logs'
import { ContentFiltering } from './pages/security/ContentFiltering'
import { Licensing } from './pages/Licensing'

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<SecurityDashboard />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/threat-prevention" element={<ThreatPrevention />} />
          <Route path="/ids" element={<IDS />} />
          <Route path="/vpn" element={<VPN />} />
          <Route path="/content-filtering" element={<ContentFiltering />} />
          <Route path="/licensing" element={<Licensing />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  )
}

export default App 