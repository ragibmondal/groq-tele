import { useState, useEffect } from 'react';

const BotStatus = () => {
  const [status, setStatus] = useState('Checking...');
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/telegram');
        const data = await response.json();
        setStatus(data.status || 'Bot is running');
        setLastCheck(new Date().toLocaleString());
      } catch (error) {
        setStatus('Error checking bot status');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Telegram Bot Status</h1>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className={`h-3 w-3 rounded-full ${status.includes('running') ? 'bg-green-400' : 'bg-red-400'}`}></div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">{status}</h3>
                </div>
              </div>
            </div>
            
            {lastCheck && (
              <p className="text-sm text-gray-500">
                Last checked: {lastCheck}
              </p>
            )}
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">How to use:</h4>
              <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                <li>Search for your bot on Telegram</li>
                <li>Start a conversation with the bot</li>
                <li>Send any message to get a response</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotStatus;