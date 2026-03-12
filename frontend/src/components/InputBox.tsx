import { useAnalyzeStore } from '../store/useAnalyzeStore';
import { Send } from 'lucide-react';

function notifyAdsInteraction() {
  if (typeof window === 'undefined') return;
  const callback = (window as typeof window & { onUserSearchPerformed?: () => void }).onUserSearchPerformed;
  if (typeof callback === 'function') callback();
}

export default function InputBox({ onSubmit, isPending }: { onSubmit: () => void, isPending: boolean }) {
  const { inputText, setInputText, language } = useAnalyzeStore();

  const t = {
    placeholder: language === 'id' ? 'Minta AI analisa topik atau draft tweet...' : 'Ask AI to analyze a topic or draft a tweet...',
    evaluates: language === 'id' ? 'Mengevaluasi Saturasi, Hook, & Dampak' : 'Evaluates Saturation, Hook, & Impact',
    analyzing: language === 'id' ? 'Menganalisa...' : 'Analyzing...',
    analyze: language === 'id' ? 'Analisa' : 'Analyze'
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isPending) {
        notifyAdsInteraction();
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all">
      <textarea
        className="w-full p-4 min-h-[160px] text-lg outline-none resize-none placeholder-gray-400"
        placeholder={t.placeholder}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {t.evaluates}
        </span>
        <button
          onClick={() => {
            notifyAdsInteraction();
            onSubmit();
          }}
          disabled={!inputText.trim() || isPending}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          {isPending ? t.analyzing : t.analyze}
          {!isPending && <Send className="w-4 h-4 ml-2" />}
        </button>
      </div>
    </div>
  );
}
