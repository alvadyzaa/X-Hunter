import { useAnalyzeStore } from '../store/useAnalyzeStore';
import { useToastStore } from '../store/useToastStore';
import { Save, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { apiKey, setApiKey, language } = useAnalyzeStore();
  const [localKey, setLocalKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{status: 'idle'|'success'|'error', message: string}>({status: 'idle', message: ''});
  const [activeTab, setActiveTab] = useState<'aistudio' | 'gcp'>('aistudio');

  const t = {
    settingsTitle: language === 'id' ? 'Pengaturan' : 'Settings',
    apiConfig: language === 'id' ? 'Konfigurasi API' : 'API Configuration',
    apiDesc: language === 'id' ? 'Masukkan Google Gemini API Key kamu untuk menggunakan mesin analisa. Key ini disimpan secara lokal di browsermu dan tidak pernah dikirim kemanapun selain worker.' : 'Enter your Google Gemini API Key to use the analysis engine. This key is saved locally in your browser and never sent anywhere other than the Edge worker for processing.',
    apiKeyLabel: language === 'id' ? 'Gemini API Key' : 'Gemini API Key',
    aiModelLabel: language === 'id' ? 'Model AI' : 'AI Model',
    flashLite: language === 'id' ? 'Gemini Flash Lite (Tercepat & Paling Ringan)' : 'Gemini Flash Lite (Fastest & Most Lightweight)',
    modelDesc: language === 'id' ? 'Model yang dipilih adalah versi yang paling stabil dan ringan untuk key kamu.' : 'Selected model is the most robust and lightweight version available for your key.',
    templateManager: language === 'id' ? 'Manajer Template (Persona AI)' : 'Template Manager (AI Persona)',
    templateDesc: language === 'id' ? 'Masukkan instruksi khusus atau tentukan persona spesifik untuk AI (misal: "Tulis seperti pro" atau "Berpindah peran sebagai b2b copywriter").' : 'Inject custom instructions or define a specific persona for the AI (e.g., "Write like Elon Musk" or "Act as a B2B SaaS copywriter").',
    customInstLabel: language === 'id' ? 'Instruksi Khusus' : 'Custom Instructions',
    customInstPlaceholder: language === 'id' ? 'Contoh: Gunakan gaya bahasa kasual ala anak Jaksel. Selalu berikan 1 emoji di akhir kalimat.' : 'E.g., Gunakan gaya bahasa kasual ala anak Jaksel. Selalu berikan 1 emoji di akhir kalimat.',
    saveSettings: language === 'id' ? 'Simpan Pengaturan' : 'Save Settings',
    testKeyBtn: language === 'id' ? 'Tes Key & Cek Kuota' : 'Test Key & Check Quota',
    saved: language === 'id' ? 'Pengaturan berhasil disimpan! Memakai ' : 'Settings saved successfully! Using ',
    testEmpty: language === 'id' ? 'Tolong masukkan API Key dulu' : 'Please enter an API key first',
    testSuccess: language === 'id' ? 'API Key Valid dan Kuota masih ada! ✨' : 'API Key is Valid and has Quota left! ✨',
    testQuota: language === 'id' ? 'Terlalu Banyak Request (429): Jika kamu pakai cloud baru, HARUS aktifkan Tagihan di Console Google Cloud.' : 'Too Many Requests (429): If this is a new Google Cloud key, you MUST enable Billing in Google Cloud Console first.',
    testInvalid: language === 'id' ? 'API Key Tidak Valid' : 'Invalid API Key',
    testNetwork: language === 'id' ? 'Gagal nyambung jaringan' : 'Network error analyzing key',
    howToGet: language === 'id' ? 'Cara mendapatkan Gemini API Key' : 'How to get a Gemini API Key',
    viaStudio: language === 'id' ? 'Lewat Google AI Studio (Paling Disarankan)' : 'Via Google AI Studio (Recommended)',
    viaCloud: language === 'id' ? 'Lewat Google Cloud Console' : 'Via Google Cloud Console',
    step1Studio: language === 'id' ? 'Buka platform' : 'Go to',
    step1Studio2: language === 'id' ? 'dan login pakai akun Google kamu.' : 'and sign in.',
    step2Studio: language === 'id' ? 'Di pojok kiri atas halaman, klik tombol' : 'In the top left corner, click on',
    step3Studio: language === 'id' ? 'Klik tombol warna biru' : 'Click the blue',
    step4Studio: language === 'id' ? 'Biar gampang, tinggal klik buat di project yang baru otomatis.' : 'For the easiest setup, choose an existing project or let it create a new one automatically.',
    step5Studio: language === 'id' ? 'Salin kunci kodenya terus tempel di form atas.' : 'Copy the generated key and paste it in the field above.',
    recommendStudio: language === 'id' ? 'Kenapa Disarankan? Key dari AI Studio benar-benar pas buat akses santai gratis, hampir ga pernah error kena kuota batas tagihan (Terlalu Banyak Request).' : 'Recommended: Keys generated via AI Studio are perfect for free-tier personal use and rarely hit unexpected billing-related "Too Many Requests" errors.',
    step1Gcp: language === 'id' ? 'Buka portal' : 'Go to',
    step1Gcp2: language === 'id' ? 'dan login pakai akun Google kamu.' : 'and sign in.',
    step2Gcp: language === 'id' ? 'Bikin satu Project baru atau pilih yang udah ada.' : 'Create a new Project (or select an existing one).',
    step3Gcp: language === 'id' ? 'Ke menu APIs & Services > Library terus cari "Gemini API". Pencet Enable (Aktifkan).' : 'Go to APIs & Services > Library and search for "Gemini API". Click Enable.',
    step4Gcp: language === 'id' ? 'Balik ke menu APIs & Services > Credentials (Kredensial).' : 'Go to APIs & Services > Credentials.',
    step5Gcp: language === 'id' ? 'Pencet + CREATE CREDENTIALS terus pilih API key.' : 'Click + CREATE CREDENTIALS and select API key.',
    step6Gcp: language === 'id' ? 'Salin kunci kodenya terus tempel di form atas.' : 'Copy the generated key and paste it in the field above.',
    noteGcp: language === 'id' ? 'Senggol Kuota: Kalo baru daftar Cloud, kadang harus isi akun pembayaran (Billing) dulu sebelum gratisan Gemini kebuka, kalau nggak siap-siap kena error Too Many Requests.' : 'Note on Quota: New Google Cloud accounts might require you to set up a Billing Account to access the free tier quota for Gemini, otherwise you will receive a Too Many Requests error.',
    dangerZone: language === 'id' ? 'Kawasan Bahaya' : 'Danger Zone',
    dangerDesc: language === 'id' ? 'Kalo app crash atau kamu mau reset bersih data (Histori, Setting, Kunci API), langsung aja ratakan semua pengaturan awal. Hati-hati, tak bisa dibatalkan lho.' : 'If the application becomes unresponsive or you want to delete all your local data (History, Settings, API Keys), you can perform a factory reset. This action cannot be undone.',
    factoryReset: language === 'id' ? 'Reset Ulang & Hapus Seluruh Data' : 'Factory Reset & Clear All Data',
    confirmReset: language === 'id' ? 'Beneran mau hapus beres total datanya? Gak ada cara nyesal setelah ini.' : 'Are you sure you want to delete all data? This cannot be undone.'
  };

  const handleSave = () => {
    setApiKey(localKey);
    const modelLabel = 'Gemini Flash Lite';
    useToastStore.getState().addToast(`${t.saved} ${modelLabel}`, 'success');
  };

  const handleTestKey = async () => {
    if (!localKey) {
      setTestResult({ status: 'error', message: t.testEmpty });
      return;
    }
    
    setIsTesting(true);
    setTestResult({ status: 'idle', message: '' });
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${localKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }], generationConfig: { maxOutputTokens: 1 } })
      });
      
      if (response.ok) {
        setTestResult({ status: 'success', message: t.testSuccess });
      } else if (response.status === 429) {
        setTestResult({ status: 'error', message: t.testQuota });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err: any = await response.json().catch(() => ({}));
        setTestResult({ status: 'error', message: err.error?.message || t.testInvalid });
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      setTestResult({ status: 'error', message: t.testNetwork });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-2xl mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.settingsTitle}</h1>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.apiConfig}</h2>
        <p className="text-sm text-gray-500 mb-6">{t.apiDesc}</p>
        
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">{t.apiKeyLabel}</label>
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
          <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 mb-2">{t.aiModelLabel}</label>
          <select
            id="aiModel"
            value={useAnalyzeStore((state) => state.aiModel)}
            onChange={(e) => useAnalyzeStore.getState().setAiModel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white"
          >
            <option value="gemini-2.5-flash-lite">{t.flashLite}</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">
            {t.modelDesc}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.templateManager}</h2>
          <p className="text-sm text-gray-500 mb-4">{t.templateDesc}</p>
          
          <label htmlFor="customPersona" className="block text-sm font-medium text-gray-700 mb-2">{t.customInstLabel}</label>
          <textarea
            id="customPersona"
            rows={4}
            value={useAnalyzeStore((state) => state.customPersona)}
            onChange={(e) => useAnalyzeStore.getState().setCustomPersona(e.target.value)}
            placeholder={t.customInstPlaceholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button 
            onClick={handleSave}
            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4 mr-2" />
            {t.saveSettings}
          </button>
          
          <button 
            onClick={handleTestKey}
            disabled={isTesting}
            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
          >
            {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            {t.testKeyBtn}
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
          <h3 className="text-md font-semibold text-gray-900 mb-4">{t.howToGet}</h3>
          
          <div className="flex space-x-2 border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('aistudio')}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'aistudio' 
                  ? 'text-black' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.viaStudio}
              {activeTab === 'aistudio' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('gcp')}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'gcp' 
                  ? 'text-black' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.viaCloud}
              {activeTab === 'gcp' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full" />
              )}
            </button>
          </div>

          {activeTab === 'aistudio' ? (
            <div className="animate-in fade-in duration-300">
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                <li>{t.step1Studio} <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a> {t.step1Studio2}</li>
                <li>{t.step2Studio} <strong>Get API key</strong>.</li>
                <li>{t.step3Studio} <strong>Create API key</strong>.</li>
                <li>{t.step4Studio}</li>
                <li>{t.step5Studio}</li>
              </ol>
              <div className="mt-4 p-3 bg-green-50 text-green-800 text-xs rounded-lg border border-green-100">
                <strong>{t.recommendStudio}</strong>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                <li>{t.step1Gcp} <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a> {t.step1Gcp2}</li>
                <li>{t.step2Gcp}</li>
                <li>{t.step3Gcp}</li>
                <li>{t.step4Gcp}</li>
                <li>{t.step5Gcp}</li>
                <li>{t.step6Gcp}</li>
              </ol>
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
                <strong>{t.noteGcp}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-red-100 bg-red-50/30 -mx-6 -mb-6 p-6 rounded-b-2xl">
          <h3 className="text-md font-semibold text-red-700 mb-2">{t.dangerZone}</h3>
          <p className="text-sm text-red-600/80 mb-4">
            {t.dangerDesc}
          </p>
          <button 
            onClick={() => {
              if (window.confirm(t.confirmReset)) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            {t.factoryReset}
          </button>
        </div>
      </div>
    </div>
  );
}
