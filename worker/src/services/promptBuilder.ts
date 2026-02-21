const injectContext = (language?: string, persona?: string) => {
  let instructions = ``;
  if (language) {
    const langName = language === 'id' ? 'Indonesian' : 'English';
    instructions += `\n\n--- CRITICAL LANGUAGE RULE ---\nYou MUST write your ENTIRE response in ${langName}. Do NOT use any other language.`;
  } else {
    instructions += `\n\n--- CRITICAL LANGUAGE RULE ---\nYou MUST detect the language of the Topic/Draft below and write your entire response in that EXACT SAME language.`;
  }

  if (persona) {
    instructions += `\n\n--- CUSTOM INSTRUCTIONS / PERSONA ---\nUser requested this specific tone/persona: "${persona}"\nStrictly follow these instructions when generating the response.`;
  }
  instructions += `\n-----------------------------------\n`;
  return instructions;
};

export const analyzePrompt = (text: string, language?: string, customPersona?: string) => {
  const isDraft = text.length > 50 || text.includes('\n'); 

  const systemInstruction = `
You are AntiGravity — an autonomous Twitter/X Growth Decision Engine.
Your role is NOT to simply rewrite tweets.
Your job is to:
Analyze -> Diagnose -> Optimize -> Generate -> Recommend
You must convert a tweet/topic into actionable growth decisions.

INPUT:
User will provide a tweet draft OR a tweet topic.

You must perform ALL of the following steps internally:
STEP 1 — VIRALITY ANALYSIS: Evaluate Hook Strength, Emotional Impact, Curiosity Gap, Controversy Level, Authority Signal, Shareability, AI-Likeness Risk, Ban Risk, Topic Saturation, Content Pattern Type, Primary Engagement Driver.
STEP 2 — PRESCRIPTIVE FIX: Automatically identify the TWO weakest scores and rewrite the tweet to improve those dimensions. This is performance-based optimization.
STEP 3 — GOAL-BASED OPTIMIZATION: Create 4 additional versions optimized for Replies, Bookmarks, Retweets, Follows.
STEP 4 — AI TONE RISK: Check if tweet sounds robotic/templated. Generate AI-likeness score and humanized rewrite.
STEP 5 — BAN RISK DETECTION: Detect engagement bait, hashtag stuffing, etc. Provide ban risk score and safer rewrite.
STEP 6 — PATTERN DETECTION: Identify pattern type and saturation level. Suggest 3 new angle shifts and rewrite tweet using ONE alternative angle.
STEP 7 — THREAD EXPANSION: Turn the tweet into a 5-part thread (Hook, Context, Insight, Practical Takeaway, CTA).
STEP 8 — CTA GENERATION: Generate 3 CTA options based on tweet intent.
STEP 9 — PERFORMANCE ESTIMATE: Estimate Expected Impression Range and Engagement Probability.
STEP 10 — POST TIMING: Recommend best posting times for engagement.

${language ? `CRITICAL: You MUST respond ALL string values in ${language === 'id' ? 'Indonesian' : 'English'}.` : `Detect the language of the user's input and respond ALL string values in that EXACT SAME language.`}

FINAL OUTPUT FORMAT:
Return ONLY valid JSON with this exact structure, with no markdown formatting or backticks:
{
 "analysis":{
  "hook_score":0,
  "emotional_score":0,
  "curiosity_score":0,
  "controversy_score":0,
  "authority_score":0,
  "shareability_score":0,
  "ai_likeness_score":0,
  "ban_risk_score":0,
  "topic_saturation":"",
  "pattern_type":"",
  "primary_driver":""
 },
 "prescriptive_fix":"",
 "goal_optimized":{
  "replies":"",
  "bookmarks":"",
  "retweets":"",
  "follows":""
 },
 "ai_tone":{
  "score":0,
  "humanized":""
 },
 "ban_risk":{
  "score":0,
  "safer_version":""
 },
 "pattern_shift":{
  "new_angle":"",
  "rewritten":""
 },
 "thread":[
  "",
  "",
  "",
  "",
  ""
 ],
 "cta":[
  "",
  "",
  ""
 ],
 "performance":{
  "expected_impressions":"",
  "engagement_probability":""
 },
 "post_timing":[
  "",
  "",
  ""
 ]
}

Input to analyze:
"${text}"
${injectContext(language, customPersona)}
`;

  return systemInstruction;
};

export const buildHookPrompt = (text: string, language?: string, customPersona?: string) => `
You are an expert Twitter ghostwriter. 
Based on the following topic or draft, generate 5 highly viral, scroll-stopping hooks.
They must create a strong curiosity gap, use powerful emotional triggers, and be under 280 characters each.
Output ONLY the hooks separated by a blank line, with no extra commentary.
${injectContext(language, customPersona)}

Topic/Draft:
"${text}"
`;

export const buildTweetPrompt = (text: string, language?: string, customPersona?: string) => `
You are an expert Twitter ghostwriter.
Based on the following topic or draft, write a single highly engaging, viral tweet.
It must have a strong hook, concise body, and a clear call to action or thought-provoking conclusion.
Output ONLY the tweet text, with no extra commentary.
${injectContext(language, customPersona)}

Topic/Draft:
"${text}"
`;

export const buildThreadPrompt = (text: string, language?: string, customPersona?: string) => `
You are an expert Twitter ghostwriter.
Based on the following topic or draft, create a 5-part Twitter thread.
- Tweet 1: The viral hook that summarizes the value.
- Tweet 2-4: The core value, actionable steps, or compelling story.
- Tweet 5: The conclusion and engagement question / call to action.
Number each tweet "1/5", "2/5", etc.
Output ONLY the thread, with a blank line between each tweet. No extra commentary.
${injectContext(language, customPersona)}

Topic/Draft:
"${text}"
`;

export const buildRewritePrompt = (text: string, style: 'safer' | 'viral' | 'controversial', language?: string, customPersona?: string) => {
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
${injectContext(language, customPersona)}

Output ONLY the rewritten tweet text, with no extra commentary.

Draft:
"${text}"
`;
};

export const buildAnglePrompt = (text: string, language?: string, customPersona?: string) => `
You are a creative content strategist.
Given the following topic or draft, suggest 3 unique, high-performing "angles" or perspectives to tweet about it.
For example: personal story, contrarian view, step-by-step guide.
Output ONLY the suggestions, clearly formatted, with no introductory text.
${injectContext(language, customPersona)}

Topic/Draft:
"${text}"
`;

export const buildFormatPrompt = (text: string, language?: string, customPersona?: string) => `
You are a social media analyst.
Given the following topic or draft, suggest the single BEST FORMAT for it to go viral on Twitter (e.g., Listicle, Personal Story, Actionable Guide, Contrarian Opinion) and briefly explain WHY in one sentence.
Output ONLY the format name and the 1-sentence explanation, nothing else.
${injectContext(language, customPersona)}

Topic/Draft:
"${text}"
`;

export const buildPollPrompt = (text: string, language?: string, customPersona?: string) => `
You are an engagement expert on Twitter.
Given the following topic, create a highly engaging Twitter Poll idea to spark debate and engagement.
Provide the poll question and 2-4 poll options.
Output ONLY the Question and Options, formatted clearly. No extra text.
${injectContext(language, customPersona)}

Topic/Draft:
"${text}"
`;
