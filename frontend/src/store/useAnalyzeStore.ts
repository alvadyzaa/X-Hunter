/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryItem {
  id: string;
  text: string;
  result: AntiGravityAnalysisResult;
  date: number;
}

export interface AntiGravityAnalysisResult {
  analysis: {
    hook_score: number;
    emotional_score: number;
    curiosity_score: number;
    controversy_score: number;
    authority_score: number;
    shareability_score: number;
    ai_likeness_score: number;
    ban_risk_score: number;
    topic_saturation: string;
    pattern_type: string;
    primary_driver: string;
  };
  prescriptive_fix: string;
  goal_optimized: {
    replies: string;
    bookmarks: string;
    retweets: string;
    follows: string;
  };
  ai_tone: {
    score: number;
    humanized: string;
  };
  ban_risk: {
    score: number;
    safer_version: string;
  };
  pattern_shift: {
    new_angle: string;
    rewritten: string;
  };
  thread: string[];
  cta: string[];
  performance: {
    expected_impressions: string;
    engagement_probability: string;
  };
  post_timing: string[];
}

interface AnalyzeState {
  inputText: string;
  setInputText: (text: string) => void;
  analysisResult: AntiGravityAnalysisResult | null;
  setAnalysisResult: (result: AntiGravityAnalysisResult) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  customPersona: string;
  setCustomPersona: (persona: string) => void;
  resetState: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  
  // History & Quota Tracking
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
  clearHistory: () => void;
  apiUsage: number[];
  trackApiUsage: () => void;
}

export const useAnalyzeStore = create<AnalyzeState>()(
  persist(
    (set) => ({
      inputText: '',
      setInputText: (text) => set({ inputText: text }),
      analysisResult: null,
      setAnalysisResult: (result) => set({ analysisResult: result }),
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      aiModel: 'gemini-2.5-flash-lite',
      setAiModel: (model) => set({ aiModel: model }),
      customPersona: '',
      setCustomPersona: (persona) => set({ customPersona: persona }),
      resetState: () => set({ inputText: '', analysisResult: null }),
      isSidebarOpen: false,
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      language: 'id',
      setLanguage: (lang) => set({ language: lang }),
      
      history: [],
      addHistory: (item) => set((state) => {
        // Prevent duplicate adjacent history entries
        if (state.history.length > 0 && state.history[0].text === item.text) {
          return state;
        }
        const newHistory = [
          { ...item, id: Math.random().toString(36).substring(2, 9), date: Date.now() },
          ...state.history
        ].slice(0, 50); // Keep last 50
        return { history: newHistory };
      }),
      clearHistory: () => set({ history: [] }),
      
      apiUsage: [],
      trackApiUsage: () => set((state) => {
        const now = Date.now();
        // Remove old usage entries (older than 1 minute)
        const recentUsage = state.apiUsage.filter(time => now - time < 60000);
        return { apiUsage: [...recentUsage, now] };
      }),
    }),
    {
      name: 'pre-tweet-storage',
      partialize: (state) => ({ 
        apiKey: state.apiKey, 
        aiModel: state.aiModel,
        customPersona: state.customPersona,
        history: state.history,
        language: state.language
      }), // Persist API key, model, persona, history, and language
    }
  )
);
