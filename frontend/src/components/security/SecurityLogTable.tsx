import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, Brain, Loader2, Filter, X } from 'lucide-react';
import { SecurityLog, SecurityLogTableProps } from '../../types/security';
import { ChatAssistant } from './ChatAssistant';

export const SecurityLogTable: React.FC<SecurityLogTableProps> = ({
  logs,
  onUpdateLog,
  onAnalyzeLogs,
}) => {
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showChatAssistant, setShowChatAssistant] = useState(false);
  const [analyzedLogs, setAnalyzedLogs] = useState<SecurityLog[]>([]);
  const [filters, setFilters] = useState({
    severity: '',
    category: '',
    timeRange: '24h'
  });

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
  };

  const handleAnalyzeSelected = async () => {
    if (!onAnalyzeLogs) return;
    
    setIsAnalyzing(true);
    try {
      const selectedLogEntries = logs.filter(log => selectedLogs.has(log.id));
      await onAnalyzeLogs(selectedLogEntries);
      setAnalyzedLogs(selectedLogEntries);
      setShowChatAssistant(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMarkInnocuous = (logId: string) => {
    if (onUpdateLog) {
      onUpdateLog(logId, { isInnocuous: true });
      setAnalyzedLogs(prevLogs => 
        prevLogs.map(log => 
          log.id === logId ? { ...log, isInnocuous: true } : log
        )
      );
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
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>

              {selectedLogs.size > 0 && (
                <button
                  onClick={handleAnalyzeSelected}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Brain className="h-5 w-5" />
                  )}
                  <span>Analyze Selected</span>
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-6">
                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                  <select
                    value={filters.timeRange}
                    onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>

                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 self-end"
                >
                  <X className="h-5 w-5" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedLogs.size === filteredLogs.length}
                    onChange={() => {
                      if (selectedLogs.size === filteredLogs.length) {
                        setSelectedLogs(new Set());
                      } else {
                        setSelectedLogs(new Set(filteredLogs.map(log => log.id)));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className={`${log.isInnocuous ? 'bg-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
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
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.message}
                    {log.aiAnalysis && (
                      <div className="mt-1 text-xs text-gray-500">
                        <strong>AI Analysis:</strong>{' '}
                        {log.aiAnalysis}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {onUpdateLog && (
                      <button
                        onClick={() => onUpdateLog(log.id, { isInnocuous: !log.isInnocuous })}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full transition-colors ${
                          log.isInnocuous
                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        }`}
                      >
                        {log.isInnocuous ? (
                          <AlertCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                        )}
                        {log.isInnocuous ? 'Mark as Threat' : 'Mark Safe'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showChatAssistant && analyzedLogs.length > 0 && (
        <ChatAssistant
          selectedLogs={analyzedLogs}
          onMarkInnocuous={handleMarkInnocuous}
        />
      )}
    </>
  );
}; 