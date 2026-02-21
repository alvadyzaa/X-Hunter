import { useNavigate } from 'react-router-dom';
import { useAnalyzeStore } from '../store/useAnalyzeStore';
import { Clock, ChevronRight, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

export default function Analyze() {
  const navigate = useNavigate();
  const { history, clearHistory, setInputText, setAnalysisResult } = useAnalyzeStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleHistoryClick = (item: any) => {
    setInputText(item.text);
    setAnalysisResult(item.result);
    navigate('/result');
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const filteredHistory = history.filter(item => 
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analysis History</h1>
          <p className="text-gray-500 text-sm">Review your past tweet topics and generated results without eating into your API quota.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              title="Clear All History"
              className="flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No history yet</h3>
          <p className="text-gray-500 text-sm text-center max-w-sm">
            Head to the Dashboard and analyze your first tweet topic to see it appear here.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.length === 0 && searchQuery && (
             <div className="text-center py-8 text-gray-500 text-sm">
                No results found for "{searchQuery}"
             </div>
          )}
          {filteredHistory.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleHistoryClick(item)}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-gray-50 p-2 rounded-lg text-gray-400 group-hover:text-black group-hover:bg-gray-100 transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                    {item.text}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDate(item.date)}</span>
                    <span>•</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">Cached</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
