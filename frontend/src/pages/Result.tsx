import { useAnalyzeStore } from '../store/useAnalyzeStore';
import { useToastStore } from '../store/useToastStore';
import { useNavigate } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';
import SuggestionCard from '../components/SuggestionCard';
import GeneratedContentCard from '../components/GeneratedContentCard';
import { ArrowLeft, Sparkles, MessageSquare, Layers, Repeat, Target, LayoutTemplate, HelpCircle, Download } from 'lucide-react';
import { useState } from 'react';
import * as api from '../api/client';

export default function Result() {
  const { analysisResult, inputText, apiKey, aiModel } = useAnalyzeStore();
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!analysisResult) {
    return (
      <div className="text-center mt-20">
        <p>No results found.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 underline mt-4">Go back</button>
      </div>
    );
  }

  const { overallScore, metrics, suggestions, type, saturationLevel } = analysisResult;

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
    } catch (err: any) {
      setError(err.message || 'Failed to generate content');
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    // Add a temporary class to fix text colors for printing if needed, or leave as is.
    const opt = {
      margin:       10,
      filename:     `X-Hunter_Results_${Date.now()}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    useToastStore.getState().addToast('Preparing PDF...', 'info');
    
    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default().set(opt).from(element).save().then(() => {
        useToastStore.getState().addToast('PDF Downloaded!', 'success');
      }).catch((err: any) => {
        useToastStore.getState().addToast('Failed to generate PDF', 'error');
        console.error(err);
      });
    });
  };

  const actionButtons = [
    { id: 'hook', icon: Sparkles, label: 'Viral Hooks', action: () => api.generateHook(inputText, apiKey, aiModel) },
    { id: 'tweet', icon: MessageSquare, label: 'Full Tweet', action: () => api.generateTweet(inputText, apiKey, aiModel) },
    { id: 'thread', icon: Layers, label: 'Thread (5 parts)', action: () => api.generateThread(inputText, apiKey, aiModel) },
    { id: 'rewrite-safer', icon: Repeat, label: 'Rewrite (Safer)', action: () => api.rewriteTweet(inputText, 'safer', apiKey, aiModel) },
    { id: 'rewrite-viral', icon: Repeat, label: 'Rewrite (Viral)', action: () => api.rewriteTweet(inputText, 'viral', apiKey, aiModel) },
    { id: 'rewrite-controversial', icon: Repeat, label: 'Rewrite (Controversial)', action: () => api.rewriteTweet(inputText, 'controversial', apiKey, aiModel) },
    { id: 'angle', icon: Target, label: 'Content Angles', action: () => api.suggestAngle(inputText, apiKey, aiModel) },
    { id: 'format', icon: LayoutTemplate, label: 'Best Format', action: () => api.suggestFormat(inputText, apiKey, aiModel) },
    { id: 'poll', icon: HelpCircle, label: 'Poll Ideas', action: () => api.generatePoll(inputText, apiKey, aiModel) },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Editor
        </button>
        <button 
          onClick={handleExportPDF}
          className="flex items-center text-sm px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-medium"
        >
          <Download className="w-4 h-4 mr-2" /> Export to PDF
        </button>
      </div>

      <div id="pdf-content" className="bg-gray-50 pb-8 px-2 md:px-0">
        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200">
          <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-md mb-3">
            Original {type === 'draft' ? 'Draft' : 'Keyword Topic'}
          </span>
          <p className="text-lg text-gray-900 italic font-medium leading-relaxed">"{inputText}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 md:col-span-3 p-8 bg-black rounded-2xl text-white flex items-center justify-between">
            <div>
              <h2 className="text-sm text-gray-400 font-medium mb-1">Overall Virality Score</h2>
              <p className="text-5xl font-bold">{overallScore}<span className="text-xl text-gray-500">/100</span></p>
            </div>
            <div className="text-right">
              <h2 className="text-sm text-gray-400 font-medium mb-1">Topic Saturation</h2>
              <p className="text-2xl font-semibold capitalize">{saturationLevel}</p>
            </div>
          </div>

          <ScoreCard title="Hook Strength" score={metrics.hook_strength} tooltip="How well the first line grabs attention to stop the scroll" />
          <ScoreCard title="Emotional Impact" score={metrics.emotional_impact} tooltip="How strongly the tweet evokes emotion (joy, anger, surprise, etc.)" />
          <ScoreCard title="Curiosity Gap" score={metrics.curiosity_gap} tooltip="The contrast between what you say and what you hold back to drive engagement" />
          <ScoreCard title="Controversy Level" score={metrics.controversy_level} tooltip="How polarizing the content is, driving algorithmic debate" />
          <ScoreCard title="Content Format" score={metrics.detected_format} type="text" tooltip="The recommended style or format (e.g. Listicle, Story, Hot Take)" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4 px-2 md:px-0">AI Suggestions</h3>
        <div className="space-y-4 mb-8">
          {suggestions.map((s: string, i: number) => (
            <SuggestionCard key={i} text={s} />
          ))}
        </div>
        
        {/* We purposely don't want the active builder buttons mixed into the PDF download natively,
            but since they are inside the div, they will be captured. We'll accept that for now to keep it simple,
            or we can exclude them by moving the ID. I'll include the buttons in the PDF because they show the 'state' of tools available */}
        
        <div data-html2canvas-ignore className="pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2 mt-4 px-2 md:px-0">Active Tweet Builder</h3>
          <p className="text-sm text-gray-500 mb-6 px-2 md:px-0">Turn your idea into ready-to-publish content instantly.</p>
          
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
