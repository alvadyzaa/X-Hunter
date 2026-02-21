import { X, Sparkles, Zap, BrainCircuit, History, AlertTriangle, FileText, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

type ModalType = 'how-to' | 'disclaimer' | 'changelog';

export default function InfoModal({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: ModalType }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (type === 'disclaimer') {
      return (
        <div className="space-y-6">
          <div className="p-5 bg-red-50/50 rounded-xl border border-red-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Penting: Data Disimpan Lokal</h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-3">
                  Website ini masih menggunakan <strong>Local Storage Browser</strong> (penyimpanan lokal di browser Anda).
                  <br /><br />
                  Artinya, jika Anda berpindah ke device lain (dari HP ke Laptop) atau jika Anda melakukan <i>Clear Cache Browser</i>, maka semua data history, pengaturan, dan API Key Anda <strong>akan hilang</strong>.
                  <br /><br />
                  Pada pembaruan ke depannya (update mendatang), kami akan segera memakai Database cloud permanen. Untuk saat ini, harap maklum karena website ini masih dalam tahap <strong>"Alpha"</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'changelog') {
      return (
        <div className="space-y-6">
          <div className="relative border-l border-gray-200 ml-3 space-y-8">
            
            <div className="relative pl-6">
              <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white" />
              <h3 className="font-semibold text-gray-900 text-sm">v2.0 (Alpha) - V2 Features Unlocked</h3>
              <p className="text-xs text-gray-500 mb-2">21 Feb 2026, 20:30 WIB</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4 marker:text-gray-300">
                <li>Added: <strong>Template Manager</strong> di halaman Settings buat setting Persona AI kamu sendiri.</li>
                <li>Added: Fitur <strong>Live Search</strong> di menu History. Canggih!</li>
                <li>Added: Menu <strong>Disclaimer & Changelog</strong>.</li>
                <li>Added: Header Title Branding "Hunt the Algorithm by Keith".</li>
                <li>Updated: Modul How to Use disesuaikan dengan fitur terbaru.</li>
              </ul>
            </div>

            <div className="relative pl-6">
              <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white" />
              <h3 className="font-semibold text-gray-900 text-sm">v1.5 (Alpha) - Brainstorm Expansion</h3>
              <p className="text-xs text-gray-500 mb-2">21 Feb 2026, 20:00 WIB</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4 marker:text-gray-300">
                <li>Added: 25+ Template <strong>Local Brainstorm</strong> untuk Bahasa Indonesia dan Inggris.</li>
                <li>Fixed: Bug Local Brainstorm menimpa teks kolom input.</li>
                <li>Added: UX Shadow Polish pada tombol dan kartu.</li>
                <li>Update: Penamaan menu Analyze menjadi History.</li>
              </ul>
            </div>

            <div className="relative pl-6">
              <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white" />
              <h3 className="font-semibold text-gray-900 text-sm">v1.0 (Alpha) - Initial Launch</h3>
              <p className="text-xs text-gray-500 mb-2">21 Feb 2026</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4 marker:text-gray-300">
                <li>Engine: Analisa topic & evaluasi draft pakai Gemini API.</li>
                <li>Engine: Generation Content Hooks, Threads, Polls.</li>
                <li>Feature: Export to PDF.</li>
              </ul>
            </div>

          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <p className="text-gray-600 leading-relaxed text-sm">
          Maximize your Free Tier Gemini API quota (15 requests per minute) with these advanced features built directly into X-Hunter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
            <History className="w-6 h-6 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">History & Search (0 API)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              When you analyze, results save to History. Use the <strong>Search</strong> bar to quickly find past topics. Re-loading a cached query saves your API quota.
            </p>
          </div>
          
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
            <Settings className="w-6 h-6 text-purple-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Custom AI Personas</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Head securely to Settings to configure your <strong>Template Manager</strong>. You can inject custom prompt instructions like "Write in the voice of Elon Musk".
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
            <Zap className="w-6 h-6 text-yellow-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Smart Quota Tracking</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Hover over the quota badge (e.g., 15/15) to see precisely when your throttled API requests will refresh (60 seconds recovery rate).
            </p>
          </div>

          <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
            <BrainCircuit className="w-6 h-6 text-black mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Zero-API Brainstorm</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Use the "Local Brainstorm" option to generate dozen of viral hook formulas locally in your browser. Costs 0 API credits!
            </p>
          </div>
        </div>
      </div>
    );
  };

  const titles = {
    'how-to': { icon: Sparkles, text: 'How to Use X-Hunter', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    'disclaimer': { icon: AlertTriangle, text: 'Disclaimer', color: 'text-red-600', bg: 'bg-red-100' },
    'changelog': { icon: FileText, text: 'Changelog', color: 'text-gray-700', bg: 'bg-gray-200' },
  };

  const currentTitle = titles[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      <div 
        className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'} ${type === 'changelog' ? 'max-h-[85vh] flex flex-col' : ''}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentTitle.bg} ${currentTitle.color}`}>
              <currentTitle.icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{currentTitle.text}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderContent()}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            {type === 'disclaimer' ? 'Saya Mengerti' : 'Got it, thanks!'}
          </button>
        </div>
      </div>
    </div>
  );
}
