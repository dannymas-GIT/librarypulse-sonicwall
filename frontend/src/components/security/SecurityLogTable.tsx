import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, Brain, Loader2, Filter, X } from 'lucide-react';
import { ChatAssistant } from './ChatAssistant';

interface LogEntry {
  id: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  message: string;
  source: string;
  isInnocuous?: boolean;
  aiAnalysis?: string;
}

interface SecurityLogTableProps {
  logs: LogEntry[];
  onUpdateLog: (logId: string, updates: Partial<LogEntry>) => void;
  onAnalyzeLogs: (logs: LogEntry[]) => Promise<void>;
}

export const SecurityLogTable: React.FC<SecurityLogTableProps> = ({
  logs,
  onUpdateLog,
  onAnalyzeLogs,
}) => {
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    severity: '',
    category: '',
    timeRange: '24h'
  });
  const [isChatVisible, setChatVisible] = useState(false);

  const uniqueCategories = Array.from(new Set(logs.map(log => log.category))).sort();

  const getTimeRangeStart = (range: string) => {
    const now = new Date();
    switch (range) {
      case '1h':
        return new Date(now.getTime() - 3600000);
      case '24h':
        return new Date(now.getTime() - 86400000);
      case '7d':
        return new Date(now.getTime() - 604800000);
      case '30d':
        return new Date(now.getTime() - 2592000000);
      default:
        return new Date(0);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = !filters.severity || log.severity === filters.severity;
    const matchesCategory = !filters.category || log.category === filters.category;
    const matchesTime = new Date(log.timestamp) >= getTimeRangeStart(filters.timeRange);

    return matchesSearch && matchesSeverity && matchesCategory && matchesTime;
  });

  const handleSelectLog = (logId: string) => {
    const newSelected = new Set(selectedLogs);
    if (newSelected.has(logId)) {
      newSelected.delete(logId);
    } else {
      newSelected.add(logId);
    }
    setSelectedLogs(newSelected);
    console.log('Selected Logs:', Array.from(newSelected));
  };

  const handleAnalyzeSelected = async () => {
    setIsAnalyzing(true);
    try {
      const selectedLogEntries = logs.filter(log => selectedLogs.has(log.id));
      await onAnalyzeLogs(selectedLogEntries);
    } finally {
      setIsAnalyzing(false);
      setSelectedLogs(new Set());
    }
  };

  const handleClearFilters = () => {
    setFilters({
      severity: '',
      category: '',
      timeRange: '24h'
    });
    setSearchTerm('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const openChat = () => {
    setChatVisible(true);
    console.log('Chat opened with selected logs:', Array.from(selectedLogs));
  };

  const closeChat = () => {
    setChatVisible(false);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 border rounded-md hover:bg-gray-50 ${
                showFilters ? 'border-blue-500 text-blue-600' : 'border-gray-300 text-gray-600'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            {(showFilters || searchTerm || filters.severity || filters.category) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {selectedLogs.size > 0 && (
              <button
                onClick={() => {
                  console.log('Button should be visible');
                  openChat();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Discuss Selected Logs
              </button>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-1" /> High
              </span>
              <span className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1" /> Medium
              </span>
              <span className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1" /> Low
              </span>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="flex items-center space-x-4 pt-2">
            <select
              value={filters.severity}
              onChange={(e) => setFilters(f => ({ ...f, severity: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(f => ({ ...f, timeRange: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className={log.isInnocuous ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedLogs.has(log.id)}
                    onChange={() => handleSelectLog(log.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                    {log.severity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-lg">
                    {log.message}
                    {log.aiAnalysis && (
                      <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <div className="font-medium mb-1">AI Analysis:</div>
                        {log.aiAnalysis}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onUpdateLog(log.id, { isInnocuous: !log.isInnocuous })}
                    className={`flex items-center space-x-1 px-2 py-1 rounded ${
                      log.isInnocuous
                        ? 'text-green-700 bg-green-50 hover:bg-green-100'
                        : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {log.isInnocuous ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs">
                      {log.isInnocuous ? 'Innocuous' : 'Mark Safe'}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isChatVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={closeChat} className="text-red-500">Close</button>
            <ChatAssistant selectedLogs={Array.from(selectedLogs)} />
          </div>
        </div>
      )}
    </div>
  );
}; 