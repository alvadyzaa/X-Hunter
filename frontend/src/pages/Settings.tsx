import { useAnalyzeStore } from '../store/useAnalyzeStore';
import { useToastStore } from '../store/useToastStore';
import { Save, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { apiKey, setApiKey, aiModel } = useAnalyzeStore();
  const [localKey, setLocalKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{status: 'idle'|'success'|'error', message: string}>({status: 'idle', message: ''});

  const handleSave = () => {
    setApiKey(localKey);
    const modelLabel = aiModel === 'gemini-2.0-flash' ? 'Gemini 2.0 Flash' : 
                       aiModel === 'gemini-2.0-pro-exp-02-05' ? 'Gemini 2.0 Pro Exp' : 'Gemini 1.5 Pro';
    useToastStore.getState().addToast(`Settings saved successfully! Using ${modelLabel}`, 'success');
    useToastStore.getState().addToast(`Settings saved successfully! Using ${modelLabel}`, 'success');
  };

  const handleTestKey = async () => {
    if (!localKey) {
      setTestResult({ status: 'error', message: 'Please enter an API key first' });
      return;
    }
    
    setIsTesting(true);
    setTestResult({ status: 'idle', message: '' });
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${localKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }], generationConfig: { maxOutputTokens: 1 } })
      });
      
      if (response.ok) {
        setTestResult({ status: 'success', message: 'API Key is Valid and has Quota left! ✨' });
      } else if (response.status === 429) {
        setTestResult({ status: 'error', message: 'Too Many Requests: This Key has run out of Quota.' });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err: any = await response.json().catch(() => ({}));
        setTestResult({ status: 'error', message: err.error?.message || 'Invalid API Key' });
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      setTestResult({ status: 'error', message: 'Network error analyzing key' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-2xl mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">API Configuration</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your Google Gemini API Key to use the analysis engine. This key is saved locally in your browser and never sent anywhere other than the Edge worker for processing.</p>
        
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">Gemini API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              id="apiKey"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
          <select
            id="aiModel"
            value={useAnalyzeStore((state) => state.aiModel)}
            onChange={(e) => useAnalyzeStore.getState().setAiModel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white"
          >
            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast, Free Tier Default)</option>
            <option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro Exp (Powerful, Higher Request Limit with Paid Key)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Legacy Pro, Larger Context)</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Switching to "Pro" models requires an API key associated with a billing-enabled Google Cloud account to avoid rate limits.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Template Manager (AI Persona)</h2>
          <p className="text-sm text-gray-500 mb-4">Inject custom instructions or define a specific persona for the AI (e.g., "Write like Elon Musk" or "Act as a B2B SaaS copywriter").</p>
          
          <label htmlFor="customPersona" className="block text-sm font-medium text-gray-700 mb-2">Custom Instructions</label>
          <textarea
            id="customPersona"
            rows={4}
            value={useAnalyzeStore((state) => state.customPersona)}
            onChange={(e) => useAnalyzeStore.getState().setCustomPersona(e.target.value)}
            placeholder="E.g., Gunakan gaya bahasa kasual ala anak Jaksel. Selalu berikan 1 emoji di akhir kalimat."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button 
            onClick={handleSave}
            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
          
          <button 
            onClick={handleTestKey}
            disabled={isTesting}
            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center transition-all disabled:opacity-50 shadow-sm"
          >
            {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Test Key & Check Quota
          </button>
        </div>
        
        {testResult.status !== 'idle' && (
          <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 text-sm border ${
            testResult.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {testResult.status === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
            <p className="font-medium">{testResult.message}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-md font-semibold text-gray-900 mb-3">How to get a free API Key</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
            <li>Go to <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">aistudio.google.com</a></li>
            <li>Sign in with your Google account</li>
            <li>Click on <strong>Get API key</strong> in the left sidebar</li>
            <li>Click the <strong>Create API key</strong> button</li>
            <li>Copy the generated key and paste it in the field above</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
            <strong>Note on limits:</strong> The free tier of Gemini allows 15 requests per minute, meaning you may hit a "Too Many Requests" error if you generate multiple tweets quickly. Waiting a minute usually resolves this.
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-red-100 bg-red-50/30 -mx-6 -mb-6 p-6 rounded-b-2xl">
          <h3 className="text-md font-semibold text-red-700 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-600/80 mb-4">
            If the application becomes unresponsive or you want to delete all your local data (History, Settings, API Keys), you can perform a factory reset. This action cannot be undone.
          </p>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete all data? This cannot be undone.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Factory Reset & Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
