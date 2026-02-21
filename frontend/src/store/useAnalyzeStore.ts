/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryItem {
  id: string;
  text: string;
  result: any;
  date: number;
}

interface AnalyzeState {
  inputText: string;
  setInputText: (text: string) => void;
  analysisResult: any | null;
  setAnalysisResult: (result: any) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  customPersona: string;
  setCustomPersona: (persona: string) => void;
  resetState: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  
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
      aiModel: 'gemini-2.0-flash',
      setAiModel: (model) => set({ aiModel: model }),
      customPersona: '',
      setCustomPersona: (persona) => set({ customPersona: persona }),
      resetState: () => set({ inputText: '', analysisResult: null }),
      isSidebarOpen: false,
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      
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
        history: state.history 
      }), // Persist API key, model, persona, and history
    }
  )
);
