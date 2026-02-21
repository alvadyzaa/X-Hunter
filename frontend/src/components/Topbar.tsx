import { Menu, Zap, Info, AlertTriangle, FileText } from 'lucide-react';
import { useAnalyzeStore } from '../store/useAnalyzeStore';
import { useEffect, useState } from 'react';
import InfoModal from './InfoModal';

export default function Topbar() {
  const { setSidebarOpen, apiUsage } = useAnalyzeStore();
  const [quota, setQuota] = useState(15);
  const [nextReset, setNextReset] = useState<number | null>(null);
  
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'how-to' | 'disclaimer' | 'changelog'}>({
    isOpen: false, type: 'how-to'
  });

  const openModal = (type: 'how-to' | 'disclaimer' | 'changelog') => {
    setModalState({ isOpen: true, type });
  };

  useEffect(() => {
    // Update quota calculation every second to reflect fading timestamps
    const interval = setInterval(() => {
      const now = Date.now();
      const recentUsage = [...useAnalyzeStore.getState().apiUsage].filter(time => now - time < 60000);
      setQuota(15 - recentUsage.length);
      
      if (recentUsage.length > 0) {
        const oldest = Math.min(...recentUsage);
        const secondsUntilReset = Math.max(0, Math.ceil((60000 - (now - oldest)) / 1000));
        setNextReset(secondsUntilReset);
      } else {
        setNextReset(null);
      }
    }, 1000);
    
    // Initial calculation
    const now = Date.now();
    const recentUsage = [...useAnalyzeStore.getState().apiUsage].filter(time => now - time < 60000);
    setQuota(15 - recentUsage.length);

    return () => clearInterval(interval);
  }, [apiUsage]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-4 md:px-6 bg-gray-50/90 backdrop-blur-sm border-b border-gray-100 flex-wrap gap-y-2">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden sm:flex items-center gap-1">
            <button 
              onClick={() => openModal('how-to')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Info className="w-4 h-4" />
              How to Use?
            </button>
            <button 
              onClick={() => openModal('disclaimer')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Disclaimer
            </button>
            <button 
              onClick={() => openModal('changelog')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Changelog
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile menu triggers */}
          <div className="sm:hidden flex items-center mr-2">
             <button onClick={() => openModal('disclaimer')} className="p-1.5 text-gray-500"><AlertTriangle className="w-4 h-4" /></button>
             <button onClick={() => openModal('how-to')} className="p-1.5 text-gray-500"><Info className="w-4 h-4" /></button>
          </div>
          <div 
            title={nextReset !== null ? `Next quota refresh in ${nextReset} seconds` : "Full quota available"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-help ${quota <= 2 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow'}`}
          >
            <Zap className={`w-3.5 h-3.5 ${quota <= 2 ? 'text-red-500' : 'text-yellow-500'}`} fill="currentColor" />
            <span>
              <span className="hidden sm:inline">Free Tier API Quota: </span>
              <span className="sm:hidden">API: </span>
              {Math.max(0, quota)}/15
            </span>
          </div>
        </div>
      </header>
      
      <InfoModal 
        isOpen={modalState.isOpen} 
        type={modalState.type} 
        onClose={() => setModalState({ ...modalState, isOpen: false })} 
      />
    </>
  );
}
