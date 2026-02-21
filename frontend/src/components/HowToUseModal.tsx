import { X, Sparkles, Zap, BrainCircuit, History } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HowToUseModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      <div 
        className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">How to Use X-Hunter Efficiently</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <p className="text-gray-600 leading-relaxed text-sm">
            Maximize your Free Tier Gemini API quota (15 requests per minute) with these advanced features built directly into X-Hunter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
              <History className="w-6 h-6 text-blue-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">History Cache (0 API Cost)</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                When you click "Analyze", the result is saved to the History menu. Re-opening a past analysis, or re-submitting the exact same text, fetches directly from the browser cache without consuming your API quota.
              </p>
            </div>
            
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
              <Zap className="w-6 h-6 text-yellow-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Smart Quota Tracking</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The Topbar displays your remaining requests (e.g., 15/15). Every time you hit the API, it drops by 1. Hover over the badge to see exactly when the quota will replenish (takes 60 seconds per request).
              </p>
            </div>
          </div>

          <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <BrainCircuit className="w-6 h-6 text-black shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Local Idea Brainstorming</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  Not sure what to tweet about? Use the "Brainstorm Locally" option on the Dashboard. This engine uses proven viral formulas to generate dozens of ideas instantly within your browser, using absolutely Zero API quota.
                </p>
              </div>
            </div>
          </div>
          
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
