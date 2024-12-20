import React, { useState } from 'react';
import { ChatAssistantProps } from '../../types/security';
import { MessageCircle, CheckCircle2, Send, X, Maximize2, Minimize2 } from 'lucide-react';

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  selectedLogs,
  onMarkInnocuous,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'log' | 'question' | 'answer';
    content: string;
    timestamp: string;
    severity?: string;
    source?: string;
  }>>([]);

  if (selectedLogs.length === 0) {
    return null;
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setConversation(prev => [
      ...prev,
      {
        type: 'question',
        content: message,
        timestamp: new Date().toISOString(),
      },
      {
        type: 'answer',
        content: 'This is a simulated AI response. In a real implementation, this would be connected to an AI service that analyzes the logs and provides insights.',
        timestamp: new Date().toISOString(),
      }
    ]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-200 ${
      isExpanded ? 'w-[800px] h-[600px]' : 'w-96'
    }`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">AI Analysis</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {selectedLogs.length} log{selectedLogs.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className={`flex flex-col ${isExpanded ? 'h-[calc(600px-130px)]' : 'max-h-96'}`}>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {selectedLogs.map((log) => (
            <div key={log.id} className="mb-4 last:mb-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    log.severity === 'high' ? 'bg-red-500' :
                    log.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{log.message}</p>
                  {log.aiAnalysis && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">Analysis:</p>
                      <p>{log.aiAnalysis}</p>
                    </div>
                  )}
                  {onMarkInnocuous && !log.isInnocuous && (
                    <button
                      onClick={() => onMarkInnocuous(log.id)}
                      className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark as Safe
                    </button>
                  )}
                </div>
              </div>
              {log.source && (
                <div className="mt-2 ml-5 text-xs text-gray-500">
                  Source: {log.source}
                </div>
              )}
            </div>
          ))}

          {conversation.map((item, index) => (
            <div
              key={index}
              className={`flex ${item.type === 'question' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`rounded-lg p-3 max-w-[80%] ${
                item.type === 'question'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{item.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a follow-up question..."
              className="flex-1 resize-none border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 