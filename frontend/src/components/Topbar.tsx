import { Menu, Zap, Info, AlertTriangle, FileText, Globe } from 'lucide-react';
import { useAnalyzeStore } from '../store/useAnalyzeStore';
import { useEffect, useState } from 'react';
import InfoModal from './InfoModal';

export default function Topbar() {
  const { setSidebarOpen, apiUsage, language, setLanguage } = useAnalyzeStore();
  const [quota, setQuota] = useState(15);
  const [nextReset, setNextReset] = useState<number | null>(null);

  const t = {
    howTo: language === 'id' ? 'Cara Pakai?' : 'How to Use?',
    disclaimer: language === 'id' ? 'Peringatan' : 'Disclaimer',
    changelog: language === 'id' ? 'Pembaruan' : 'Changelog',
    apiQuota: language === 'id' ? 'Sisa Kuota API: ' : 'Free Tier API Quota: ',
    api: language === 'id' ? 'API: ' : 'API: '
  };

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuota(15 - recentUsage.length);

    return () => clearInterval(interval);
  }, [apiUsage]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between w-full h-auto py-3 md:py-4 px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-gray-100 flex-wrap gap-y-3 shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:flex items-center gap-3 md:gap-4 ml-2 mt-1">
            <button 
              onClick={() => openModal('how-to')}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Info className="w-4 h-4 text-blue-500" />
              {t.howTo}
            </button>
            <button 
              onClick={() => openModal('disclaimer')}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              {t.disclaimer}
            </button>
            <button 
              onClick={() => openModal('changelog')}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <FileText className="w-4 h-4 text-gray-500" />
              {t.changelog}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 md:mt-1">
          {/* Mobile menu triggers */}
          <div className="md:hidden flex items-center gap-2 mr-1">
             <button onClick={() => openModal('disclaimer')} className="p-2 bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-gray-900 rounded-xl transition-all active:scale-95"><AlertTriangle className="w-4 h-4 text-yellow-500" /></button>
             <button onClick={() => openModal('how-to')} className="p-2 bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-gray-900 rounded-xl transition-all active:scale-95"><Info className="w-4 h-4 text-blue-500" /></button>
          </div>
          
          <button 
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            title={language === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Indonesian'}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 shadow-sm text-gray-700 hover:text-gray-900 font-semibold text-xs md:text-sm rounded-xl transition-all active:scale-95"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            <span className="uppercase">{language}</span>
          </button>

          <div 
            title={nextReset !== null ? `Next quota refresh in ${nextReset} seconds` : "Full quota available"}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-help ${quota <= 2 ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' : 'bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md'}`}
          >
            <Zap className={`w-4 h-4 ${quota <= 2 ? 'text-red-500' : 'text-yellow-500'}`} fill="currentColor" />
            <span>
              <span className="hidden sm:inline">{t.apiQuota}</span>
              <span className="sm:hidden">{t.api}</span>
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
