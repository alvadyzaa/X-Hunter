import { Hono } from 'hono'
import { 
  buildHookPrompt, 
  buildTweetPrompt, 
  buildThreadPrompt, 
  buildRewritePrompt, 
  buildAnglePrompt, 
  buildFormatPrompt, 
  buildPollPrompt 
} from '../services/promptBuilder'
import { callGeminiText } from '../services/geminiApi'

export const generateRoutes = new Hono<{ Bindings: { GEMINI_API_KEY: string } }>()

const handleGenerateRequest = async (c: any, buildPromptFn: (text: string, ...args: any[]) => string, extraArgs: any[] = []) => {
  try {
    const body = await c.req.json();
    const { text, customPersona } = body;
    
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

    const prompt = buildPromptFn(text, ...extraArgs, customPersona);
    const resultText = await callGeminiText(apiKey, prompt, model);

    return c.json({ result: resultText });

  } catch (err: any) {
    console.error('Generation Route Error:', err);
    return c.json({ error: err.message || 'Internal Server Error' }, 500);
  }
}

generateRoutes.post('/generate-hook', (c) => handleGenerateRequest(c, buildHookPrompt));
generateRoutes.post('/generate-tweet', (c) => handleGenerateRequest(c, buildTweetPrompt));
generateRoutes.post('/generate-thread', (c) => handleGenerateRequest(c, buildThreadPrompt));

generateRoutes.post('/rewrite', async (c) => {
  try {
    const body = await c.req.json();
    const style = body.style as 'safer' | 'viral' | 'controversial';
    if (!style || !['safer', 'viral', 'controversial'].includes(style)) {
      return c.json({ error: 'Invalid or missing style parameter' }, 400);
    }
    return handleGenerateRequest(c, buildRewritePrompt, [style]);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

generateRoutes.post('/angle', (c) => handleGenerateRequest(c, buildAnglePrompt));
generateRoutes.post('/format', (c) => handleGenerateRequest(c, buildFormatPrompt));
generateRoutes.post('/poll', (c) => handleGenerateRequest(c, buildPollPrompt));
