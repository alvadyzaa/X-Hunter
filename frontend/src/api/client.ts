import { useToastStore } from '../store/useToastStore';
import { useAnalyzeStore } from '../store/useAnalyzeStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const REQUEST_CACHE = new Map<string, any>();

export const analyzePost = async ({ text, apiKey, model }: { text: string, apiKey: string, model?: string }) => {
  const cacheKey = `analyze_${text}_${model}`;
  if (REQUEST_CACHE.has(cacheKey)) {
    return REQUEST_CACHE.get(cacheKey);
  }

  const store = useAnalyzeStore.getState();
  store.trackApiUsage();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (apiKey) {
    headers['X-Gemini-Key'] = apiKey;
  }
  if (model) {
    headers['X-Gemini-Model'] = model;
  }

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, customPersona: store.customPersona }),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to analyze the content';
    if (response.status === 429) {
      errorMsg = '⚠️ API Limit (15 RPM) Reached! Please wait 1 minute before analyzing again.';
    } else {
      const errorData = await response.json().catch(() => ({}));
      errorMsg = errorData.error || errorMsg;
    }
    useToastStore.getState().addToast(errorMsg, 'error');
    throw new Error(errorMsg);
  }

  const data = await response.json();
  REQUEST_CACHE.set(cacheKey, data);
  return data;
};

const _generateContent = async (endpoint: string, payload: any, enableCache = false) => {
  const cacheKey = `${endpoint}_${JSON.stringify(payload)}`;
  if (enableCache && REQUEST_CACHE.has(cacheKey)) {
    return REQUEST_CACHE.get(cacheKey);
  }

  const store = useAnalyzeStore.getState();
  store.trackApiUsage();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (payload.apiKey) {
    headers['X-Gemini-Key'] = payload.apiKey;
    delete payload.apiKey; // Don't send API key in body
  }
  if (payload.model) {
    headers['X-Gemini-Model'] = payload.model;
    delete payload.model;
  }

  if (store.customPersona) {
    payload.customPersona = store.customPersona;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to generate content';
    if (response.status === 429) {
      errorMsg = '⚠️ API Limit (15 RPM) Reached! Please wait 1 minute before generating again.';
    } else {
      const errorData = await response.json().catch(() => ({}));
      errorMsg = errorData.error || errorMsg;
    }
    useToastStore.getState().addToast(errorMsg, 'error');
    throw new Error(errorMsg);
  }

  const data = await response.json();
  if (enableCache) {
    REQUEST_CACHE.set(cacheKey, data.result);
  }
  return data.result;
};

export const generateHook = (text: string, apiKey: string, model: string) => _generateContent('/api/generate-hook', { text, apiKey, model });
export const generateTweet = (text: string, apiKey: string, model: string) => _generateContent('/api/generate-tweet', { text, apiKey, model });
export const generateThread = (text: string, apiKey: string, model: string) => _generateContent('/api/generate-thread', { text, apiKey, model });
export const rewriteTweet = (text: string, style: 'safer'|'viral'|'controversial', apiKey: string, model: string) => _generateContent('/api/rewrite', { text, style, apiKey, model });
export const suggestAngle = (text: string, apiKey: string, model: string) => _generateContent('/api/angle', { text, apiKey, model }, true);
export const suggestFormat = (text: string, apiKey: string, model: string) => _generateContent('/api/format', { text, apiKey, model }, true);
export const generatePoll = (text: string, apiKey: string, model: string) => _generateContent('/api/poll', { text, apiKey, model }, true);
