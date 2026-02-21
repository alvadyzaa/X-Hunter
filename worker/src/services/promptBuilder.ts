const injectPersona = (persona?: string) => persona ? `\n\n--- CUSTOM INSTRUCTIONS / PERSONA ---\nUser requested this specific tone/persona: "${persona}"\nStrictly follow these instructions when generating the response.\n-----------------------------------\n` : '';

export const analyzePrompt = (text: string, customPersona?: string) => {
  const isDraft = text.length > 50 || text.includes('\n'); // Simple heuristic

  const systemInstruction = `
You are a highly analytical AI Twitter strategist. 
Analyze the following input. Determine if it's a keyword/topic or a draft tweet.
Detect the language of the user's input and respond in the same language for string values (like suggestions or format).
Provide a JSON response ONLY with the following structure:
{
  "type": "draft" | "keyword",
  "overallScore": number (0-100),
  "saturationLevel": "Low" | "Medium" | "High",
  "metrics": {
    "hook_strength": number (0-100),
    "emotional_impact": number (0-100),
    "clarity": number (0-100),
    "relatability": number (0-100),
    "controversy_level": number (0-100),
    "curiosity_gap": number (0-100),
    "scroll_stop_score": number (0-100),
    "detected_format": "Listicle" | "Story" | "Statement" | "Question" | "Thread" | "Hot Take" | "Unknown" (Detect actual format based on content)
  },
  "suggestions": ["string", "string", "string"]
}

Evaluate strictly based on modern Twitter/X algorithms: hook strength, scroll-stopping ability, emotional resonance, clarity, and curiosity generation.

Input to analyze:
"${text}"
${injectPersona(customPersona)}
`;

  return systemInstruction;
};

export const buildHookPrompt = (text: string, customPersona?: string) => `
You are an expert Twitter ghostwriter. 
Based on the following topic or draft, generate 5 highly viral, scroll-stopping hooks.
They must create a strong curiosity gap, use powerful emotional triggers, and be under 280 characters each.
Output ONLY the hooks separated by a blank line, with no extra commentary.
${injectPersona(customPersona)}

Topic/Draft:
"${text}"
`;

export const buildTweetPrompt = (text: string, customPersona?: string) => `
You are an expert Twitter ghostwriter.
Based on the following topic or draft, write a single highly engaging, viral tweet.
It must have a strong hook, concise body, and a clear call to action or thought-provoking conclusion.
Output ONLY the tweet text, with no extra commentary.
${injectPersona(customPersona)}

Topic/Draft:
"${text}"
`;

export const buildThreadPrompt = (text: string, customPersona?: string) => `
You are an expert Twitter ghostwriter.
Based on the following topic or draft, create a 5-part Twitter thread.
- Tweet 1: The viral hook that summarizes the value.
- Tweet 2-4: The core value, actionable steps, or compelling story.
- Tweet 5: The conclusion and engagement question / call to action.
Number each tweet "1/5", "2/5", etc.
Output ONLY the thread, with a blank line between each tweet. No extra commentary.
${injectPersona(customPersona)}

Topic/Draft:
"${text}"
`;

export const buildRewritePrompt = (text: string, style: 'safer' | 'viral' | 'controversial', customPersona?: string) => {
  let styleInstruction = "";
  if (style === 'safer') {
    styleInstruction = "Make it more professional, balanced, and less prone to backlash.";
  } else if (style === 'viral') {
    styleInstruction = "Make it more punchy, relatable, use stronger emotional words, and format for maximum engagement.";
  } else if (style === 'controversial') {
    styleInstruction = "Make it highly polarizing, challenge common beliefs, and spark intense debate.";
  }

  return `
You are an expert Twitter copywriter. 
Rewrite the following draft tweet to match this style: ${style}.
${styleInstruction}
${injectPersona(customPersona)}

Output ONLY the rewritten tweet text, with no extra commentary.

Draft:
"${text}"
`;
};

export const buildAnglePrompt = (text: string, customPersona?: string) => `
You are a creative content strategist.
Given the following topic or draft, suggest 3 unique, high-performing "angles" or perspectives to tweet about it.
For example: personal story, contrarian view, step-by-step guide.
Output ONLY the suggestions, clearly formatted, with no introductory text.
${injectPersona(customPersona)}

Topic/Draft:
"${text}"
`;

export const buildFormatPrompt = (text: string, customPersona?: string) => `
You are a social media analyst.
Given the following topic or draft, suggest the single BEST FORMAT for it to go viral on Twitter (e.g., Listicle, Personal Story, Actionable Guide, Contrarian Opinion) and briefly explain WHY in one sentence.
Output ONLY the format name and the 1-sentence explanation, nothing else.
${injectPersona(customPersona)}

Topic/Draft:
"${text}"
`;

export const buildPollPrompt = (text: string, customPersona?: string) => `
You are an engagement expert on Twitter.
Given the following topic, create a highly engaging Twitter Poll idea to spark debate and engagement.
Provide the poll question and 2-4 poll options.
Output ONLY the Question and Options, formatted clearly. No extra text.
${injectPersona(customPersona)}

Topic/Draft:
"${text}"
`;
