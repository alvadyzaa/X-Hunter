import { Hono } from 'hono'
import { analyzePrompt } from '../services/promptBuilder'
import { callGeminiJSON } from '../services/geminiApi'

export const analyzeRoute = new Hono<{ Bindings: { GEMINI_API_KEY: string } }>()

analyzeRoute.post('/', async (c) => {
  try {
    const { text, customPersona } = await c.req.json();
    
    if (!text || typeof text !== 'string') {
      return c.json({ error: 'Text input is required' }, 400);
    }

    const providedKey = c.req.header('X-Gemini-Key');
    const defaultKey = c.env.GEMINI_API_KEY;
    const apiKey = providedKey || defaultKey;
    
    const model = c.req.header('X-Gemini-Model') || 'gemini-2.5-flash';

    if (!apiKey) {
      return c.json({ error: 'Gemini API key not configured or provided' }, 500);
    }

    // 1. Build context-aware prompt
    const prompt = analyzePrompt(text, customPersona);

    // 2. Call Gemini
    const result = await callGeminiJSON(apiKey, prompt, model);

    // 3. Return structured payload
    return c.json(result);

  } catch (err: any) {
    console.error('Analysis Route Error:', err);
    return c.json({ error: err.message || 'Internal Server Error' }, 500);
  }
})
