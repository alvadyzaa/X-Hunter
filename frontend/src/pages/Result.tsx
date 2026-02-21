import { useAnalyzeStore } from '../store/useAnalyzeStore';
import { useToastStore } from '../store/useToastStore';
import { useNavigate } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';
import GeneratedContentCard from '../components/GeneratedContentCard';
import { 
  ArrowLeft, Sparkles, MessageSquare, Layers, Repeat, Target, LayoutTemplate, HelpCircle, Download, 
  Activity, AlertTriangle, TrendingUp, Clock, ShieldCheck, Zap, PenTool
} from 'lucide-react';
import { useState } from 'react';
import * as api from '../api/client';

export default function Result() {
  const { analysisResult, inputText, apiKey, aiModel, language } = useAnalyzeStore();
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const t = {
    noResults: language === 'id' ? 'Tidak ada hasil yang ditemukan.' : 'No results found.',
    goBack: language === 'id' ? 'Kembali' : 'Go back',
    backToEditor: language === 'id' ? 'Kembali ke Editor' : 'Back to Editor',
    exportPdf: language === 'id' ? 'Ekspor ke PDF' : 'Export to PDF',
    originalInput: language === 'id' ? 'Input Asli' : 'Original Input',
    // Analysis
    viralityOverview: language === 'id' ? 'Analisis Viralitas' : 'Virality Analysis',
    hookScore: language === 'id' ? 'Kekuatan Hook' : 'Hook Strength',
    emoScore: language === 'id' ? 'Dampak Emosi' : 'Emotional Impact',
    curiosityScore: language === 'id' ? 'Rasa Penasaran' : 'Curiosity Gap',
    controversyScore: language === 'id' ? 'Kontroversi' : 'Controversy Level',
    authorityScore: language === 'id' ? 'Otoritas' : 'Authority Signal',
    shareabilityScore: language === 'id' ? 'Potensi Share' : 'Shareability',
    topicSat: language === 'id' ? 'Saturasi Topik' : 'Topic Saturation',
    patternType: language === 'id' ? 'Pola Konten' : 'Pattern Type',
    primaryDriver: language === 'id' ? 'Pemicu Utama' : 'Primary Driver',
    // Fixes & Risks
    prescriptiveFix: language === 'id' ? 'Perbaikan Wajib' : 'Prescriptive Fix',
    aiToneRisk: language === 'id' ? 'Risiko Nada AI' : 'AI Tone Risk',
    aiScore: language === 'id' ? 'Skor Menyerupai AI' : 'AI-Likeness Score',
    banRisk: language === 'id' ? 'Risiko Banned/Shadowban' : 'Ban/Shadowban Risk',
    banScore: language === 'id' ? 'Skor Risiko Berbahaya' : 'Danger Risk Score',
    humanizedVer: language === 'id' ? 'Versi Humanis' : 'Humanized Version',
    saferVer: language === 'id' ? 'Versi Lebih Aman' : 'Safer Version',
    // Goals
    goalOptimized: language === 'id' ? 'Optimasi Berdasarkan Tujuan' : 'Goal-Based Optimization',
    tabReplies: language === 'id' ? 'Komentar' : 'Replies',
    tabBookmarks: language === 'id' ? 'Simpanan' : 'Bookmarks',
    tabRetweets: language === 'id' ? 'Retweet' : 'Retweets',
    tabFollows: language === 'id' ? 'Follower Baru' : 'Follows',
    // Pattern & Thread
    patternShift: language === 'id' ? 'Pergeseran Sudut Pandang' : 'Angle Pattern Shift',
    newAngle: language === 'id' ? 'Sudut Baru:' : 'New Angle:',
    threadExpansion: language === 'id' ? 'Ekspansi Thread (5-Bagian)' : 'Thread Expansion (5-Part)',
    part: language === 'id' ? 'Bagian' : 'Part',
    // Perf & CTA
    ctas: language === 'id' ? 'Opsi Call To Action (CTA)' : 'Call To Action (CTA) Options',
    performanceEst: language === 'id' ? 'Estimasi Performa' : 'Performance Estimate',
    impressions: language === 'id' ? 'Proyeksi Impresi' : 'Expected Impressions',
    engagementProb: language === 'id' ? 'Peluang Interaksi' : 'Engagement Probability',
    postTiming: language === 'id' ? 'Rekomendasi Waktu Posting' : 'Recommended Post Timing',
    // Generator
    tweetBuilder: language === 'id' ? 'Pembuat Tweet Aktif' : 'Active Tweet Builder',
    turnIdea: language === 'id' ? 'Buat konten tambahan dengan fitur di bawah ini.' : 'Generate additional content using the tools below.',
    preparing: language === 'id' ? 'Menyiapkan PDF...' : 'Preparing PDF...',
    downloaded: language === 'id' ? 'PDF Terunduh!' : 'PDF Downloaded!',
    failedPdf: language === 'id' ? 'Gagal membuat PDF' : 'Failed to generate PDF',
    btns: {
      hook: language === 'id' ? 'Hook Viral' : 'Viral Hooks',
      tweet: language === 'id' ? 'Tweet Penuh' : 'Full Tweet',
      thread: language === 'id' ? 'Thread (Ide lain)' : 'Alt Thread',
      safer: language === 'id' ? 'Tulis Ulang (Lebih Aman)' : 'Rewrite (Safer)',
      viral: language === 'id' ? 'Tulis Ulang (Viral)' : 'Rewrite (Viral)',
      contro: language === 'id' ? 'Tulis Ulang (Kontroversial)' : 'Rewrite (Controversial)',
      angle: language === 'id' ? 'Sudut Pandang' : 'Content Angles',
      fmt: language === 'id' ? 'Format Terbaik' : 'Best Format',
      poll: language === 'id' ? 'Ide Polling' : 'Poll Ideas',
    }
  };

  const [activeGoalTab, setActiveGoalTab] = useState<'replies'|'bookmarks'|'retweets'|'follows'>('replies');

  if (!analysisResult) {
    return (
      <div className="text-center mt-20">
        <p>{t.noResults}</p>
        <button onClick={() => navigate('/')} className="text-blue-600 underline mt-4">{t.goBack}</button>
      </div>
    );
  }

  // Handle the new structure vs legacy structure gracefully during transition
  const data = analysisResult.analysis ? analysisResult : null;
  
  if (!data) {
    return (
      <div className="text-center mt-20">
        <p>Incompatible data format. Please run a new analysis.</p>
        <button onClick={() => {
          useAnalyzeStore.getState().resetState();
          navigate('/');
        }} className="text-blue-600 underline mt-4">{t.goBack}</button>
      </div>
    );
  }

  const handleGenerate = async (
    type: string,
    title: string,
    action: () => Promise<string>
  ) => {
    setIsGenerating(true);
    setGeneratingType(type);
    setError(null);
    setGeneratedTitle(title);
    setGeneratedContent('');

    try {
      const result = await action();
      setGeneratedContent(result);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err.message || 'Failed to generate content');
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const opt: any = {
      margin:       10,
      filename:     `X-Hunter_Decision_${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    useToastStore.getState().addToast(t.preparing, 'info');
    
    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default().set(opt).from(element).save().then(() => {
        useToastStore.getState().addToast(t.downloaded, 'success');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }).catch((err: any) => {
        useToastStore.getState().addToast(t.failedPdf, 'error');
        console.error(err);
      });
    });
  };

  const actionButtons = [
    { id: 'hook', icon: Sparkles, label: t.btns.hook, action: () => api.generateHook(inputText, apiKey, aiModel) },
    { id: 'tweet', icon: MessageSquare, label: t.btns.tweet, action: () => api.generateTweet(inputText, apiKey, aiModel) },
    { id: 'thread', icon: Layers, label: t.btns.thread, action: () => api.generateThread(inputText, apiKey, aiModel) },
    { id: 'rewrite-safer', icon: Repeat, label: t.btns.safer, action: () => api.rewriteTweet(inputText, 'safer', apiKey, aiModel) },
    { id: 'rewrite-viral', icon: Repeat, label: t.btns.viral, action: () => api.rewriteTweet(inputText, 'viral', apiKey, aiModel) },
    { id: 'rewrite-controversial', icon: Repeat, label: t.btns.contro, action: () => api.rewriteTweet(inputText, 'controversial', apiKey, aiModel) },
    { id: 'angle', icon: Target, label: t.btns.angle, action: () => api.suggestAngle(inputText, apiKey, aiModel) },
    { id: 'format', icon: LayoutTemplate, label: t.btns.fmt, action: () => api.suggestFormat(inputText, apiKey, aiModel) },
    { id: 'poll', icon: HelpCircle, label: t.btns.poll, action: () => api.generatePoll(inputText, apiKey, aiModel) },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> {t.backToEditor}
        </button>
        <button 
          onClick={handleExportPDF}
          className="flex items-center text-sm px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-medium"
        >
          <Download className="w-4 h-4 mr-2" /> {t.exportPdf}
        </button>
      </div>

      <div id="pdf-content" className="bg-gray-50 pb-8 px-2 md:px-0">
        <div className="mb-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded-md mb-3 tracking-wide uppercase">
            {t.originalInput}
          </span>
          <p className="text-lg text-gray-900 font-medium leading-relaxed whitespace-pre-wrap">{inputText}</p>
        </div>

        {/* STEP 1: VIRALITY ANALYSIS */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-2 md:px-0 flex items-center gap-2">
          <Activity className="text-blue-500 w-5 h-5"/> {t.viralityOverview}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-4 mb-2">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{t.topicSat}</p>
              <p className="text-md font-bold text-gray-900 capitalize">{data.analysis.topic_saturation}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{t.patternType}</p>
              <p className="text-md font-bold text-gray-900 capitalize">{data.analysis.pattern_type}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{t.primaryDriver}</p>
              <p className="text-md font-bold text-indigo-600 capitalize">{data.analysis.primary_driver}</p>
            </div>
          </div>

          <ScoreCard title={t.hookScore} score={data.analysis.hook_score} />
          <ScoreCard title={t.emoScore} score={data.analysis.emotional_score} />
          <ScoreCard title={t.curiosityScore} score={data.analysis.curiosity_score} />
          <ScoreCard title={t.controversyScore} score={data.analysis.controversy_score} />
          <ScoreCard title={t.authorityScore} score={data.analysis.authority_score} />
          <ScoreCard title={t.shareabilityScore} score={data.analysis.shareability_score} />
        </div>

        {/* STEP 2: PRESCRIPTIVE FIX & PATTERN SHIFT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-2 md:px-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100 flex items-center gap-2">
              <PenTool className="text-indigo-600 w-4 h-4" />
              <h4 className="font-bold text-indigo-900">{t.prescriptiveFix}</h4>
            </div>
            <div className="p-5 flex-1">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{data.prescriptive_fix}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center gap-2">
              <Repeat className="text-emerald-600 w-4 h-4" />
              <h4 className="font-bold text-emerald-900">{t.patternShift}</h4>
            </div>
            <div className="p-5 flex-1 space-y-3">
              <div className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                {t.newAngle} {data.pattern_shift.new_angle}
              </div>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{data.pattern_shift.rewritten}</p>
            </div>
          </div>
        </div>

        {/* STEP 3: GOAL-BASED OPTIMIZATION */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-2 md:px-0 flex items-center gap-2">
          <Target className="text-purple-500 w-5 h-5"/> {t.goalOptimized}
        </h3>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 px-2 md:px-0 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {['replies', 'bookmarks', 'retweets', 'follows'].map((key) => (
              <button
                key={key}
                onClick={() => setActiveGoalTab(key as any)}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeGoalTab === key 
                    ? 'text-purple-700 bg-purple-50 border-b-2 border-purple-500' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {key === 'replies' ? t.tabReplies : key === 'bookmarks' ? t.tabBookmarks : key === 'retweets' ? t.tabRetweets : t.tabFollows}
              </button>
            ))}
          </div>
          <div className="p-6">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {data.goal_optimized[activeGoalTab]}
            </p>
          </div>
        </div>

        {/* STEP 4 & 5: RISK MANAGEMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-2 md:px-0">
          <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
            <div className="bg-red-50 px-5 py-3 border-b border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-500 w-4 h-4" />
                <h4 className="font-bold text-red-900">{t.banRisk}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${data.ban_risk.score > 50 ? 'bg-red-200 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {t.banScore}: {data.ban_risk.score}/100
              </span>
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.saferVer}</span>
              <p className="mt-2 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{data.ban_risk.safer_version}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="bg-amber-50 px-5 py-3 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-amber-600 w-4 h-4" />
                <h4 className="font-bold text-amber-900">{t.aiToneRisk}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${data.ai_tone.score > 50 ? 'bg-amber-200 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                {t.aiScore}: {data.ai_tone.score}/100
              </span>
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.humanizedVer}</span>
              <p className="mt-2 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{data.ai_tone.humanized}</p>
            </div>
          </div>
        </div>

        {/* STEP 7: THREAD EXPANSION */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-2 md:px-0 flex items-center gap-2">
          <Layers className="text-black w-5 h-5"/> {t.threadExpansion}
        </h3>
        <div className="space-y-4 mb-8 px-2 md:px-0">
          {data.thread.map((part: string, i: number) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
              <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <p className="pl-10 text-gray-800 leading-relaxed whitespace-pre-wrap">{part}</p>
            </div>
          ))}
        </div>

        {/* STEP 8, 9, 10: PERF, CTA, TIMING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-2 md:px-0">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-600"/> {t.performanceEst}</h4>
              <div className="gap-4 flex flex-col">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{t.impressions}</p>
                  <p className="text-lg font-bold text-gray-900">{data.performance.expected_impressions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{t.engagementProb}</p>
                  <p className="text-lg font-bold text-green-600">{data.performance.engagement_probability}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600"/> {t.postTiming}</h4>
              <ul className="space-y-2">
                {data.post_timing.map((time: string, idx: number) => (
                  <li key={idx} className="flex items-center text-sm font-medium text-gray-800 bg-blue-50/50 p-2 rounded border border-blue-100">
                    <Zap className="w-3 h-3 text-yellow-500 mr-2" />
                    {time}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-black text-white p-6 rounded-2xl shadow-sm">
            <h4 className="font-bold mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-white"/> {t.ctas}</h4>
            <div className="space-y-3">
              {data.cta.map((ctaStr: string, idx: number) => (
                <div key={idx} className="bg-white/10 p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                  <p className="text-sm font-medium leading-relaxed">{ctaStr}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div data-html2canvas-ignore className="pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2 mt-4 px-2 md:px-0">{t.tweetBuilder}</h3>
          <p className="text-sm text-gray-500 mb-6 px-2 md:px-0">{t.turnIdea}</p>
          
          <div className="flex flex-wrap gap-3 px-2 md:px-0">
            {actionButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleGenerate(btn.id, btn.label, btn.action)}
                disabled={isGenerating}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  generatingType === btn.id
                    ? 'bg-black text-white shadow-md transform scale-95'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <btn.icon className={`w-4 h-4 mr-2 ${generatingType === btn.id ? 'animate-pulse' : ''}`} />
                {btn.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-6 mx-2 md:mx-0 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
        </div>
        
        {(isGenerating || generatedContent) && (
          <div className="mt-6">
            <GeneratedContentCard 
              title={generatedTitle}
              content={generatedContent}
              isLoading={isGenerating}
            />
          </div>
        )}
      </div>
    </div>
  );
}
