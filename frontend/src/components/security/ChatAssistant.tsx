import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

interface ChatAssistantProps {
    selectedLogs: { id: string; category: string; severity: string; message: string; source: string; }[];
    onMarkInnocuous: (logId: string) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ selectedLogs, onMarkInnocuous }) => {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const socket = io('http://localhost:4000'); // Adjust the server URL

    useEffect(() => {
        // Mock data for demonstration
        setChatHistory([
            "Log analysis complete. No issues found.",
            "Consider reviewing the following logs for potential threats.",
            "Log ID 1234 marked as innocuous."
        ]);

        socket.on('analysis', (analysis: string[]) => {
            setChatHistory(analysis);
        });

        // Automatically request analysis when selectedLogs change
        if (selectedLogs.length > 0) {
            socket.emit('analyzeLogs', selectedLogs);
        }

        return () => {
            socket.off('analysis');
        };
    }, [selectedLogs]);

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = () => {
        if (userInput.trim()) {
            socket.emit('userMessage', userInput);
            setUserInput('');
        }
    };

    return (
        <div className="chat-assistant p-6 bg-white rounded-lg shadow-lg max-w-full mx-auto h-3/4">
            <div className="log-details mb-4">
                {selectedLogs.map(log => (
                    <div key={log.id} className="mb-2">
                        <div className="text-lg font-bold">Log ID: {log.id}</div>
                        <div className="text-sm text-gray-700">Category: {log.category}</div>
                        <div className="text-sm text-gray-700">Severity: {log.severity}</div>
                        <div className="text-sm text-gray-700">Message: {log.message}</div>
                        <div className="text-sm text-gray-700">Source: {log.source}</div>
                    </div>
                ))}
            </div>
            <div className="chat-history mb-4 overflow-y-auto h-3/4">
                {chatHistory.length === 0 ? (
                    <div className="text-gray-500">No analysis available. Please select logs to analyze.</div>
                ) : (
                    chatHistory.map((message, index) => (
                        <div key={index} className="chat-message text-black">
                            {message}
                        </div>
                    ))
                )}
            </div>
            <div className="chat-input mb-4">
                <input
                    type="text"
                    value={userInput}
                    onChange={handleUserInput}
                    placeholder="Ask a follow-up question..."
                    className="w-full p-2 border rounded"
                />
                <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded">
                    Send
                </button>
            </div>
            <div className="flex justify-end space-x-4">
                {selectedLogs.map(log => (
                    <button key={log.id} onClick={() => onMarkInnocuous(log.id)} className="p-2 bg-green-500 text-white rounded">
                        Mark {log.id} as Innocuous
                    </button>
                ))}
            </div>
            <div className="citation-info text-sm text-gray-600 mt-4">
                <div>Citation: [Citation Details]</div>
            </div>
        </div>
    );
}; 