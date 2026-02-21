import { useNavigate } from 'react-router-dom';
import InputBox from '../components/InputBox';
import { useMutation } from '@tanstack/react-query';
import { analyzePost } from '../api/client';
import { useAnalyzeStore } from '../store/useAnalyzeStore';
import { useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { inputText, setAnalysisResult, apiKey, aiModel, language } = useAnalyzeStore();
  const [brainstormIdeas, setBrainstormIdeas] = useState<string[]>([]);
  const [originalKeyword, setOriginalKeyword] = useState<string>('');

  const t = {
    morning: language === 'id' ? 'Selamat Pagi' : 'Good Morning',
    afternoon: language === 'id' ? 'Selamat Siang' : 'Good Afternoon',
    evening: language === 'id' ? 'Selamat Malam' : 'Good Evening',
    peeps: language === 'id' ? 'Kawan' : 'Peeps',
    subtitle: language === 'id' ? 'Apa rencana tweet kamu hari ini?' : 'What are you planning to tweet today?',
    brainstorm: language === 'id' ? 'Ide Brainstorm untuk' : 'Brainstorm Ideas for',
    clickToUse: language === 'id' ? 'Klik untuk pakai ide ini' : 'Click to use this idea',
    analyzeTopic: language === 'id' ? 'Analisa topik' : 'Analyze topic',
    evaluateDraft: language === 'id' ? 'Evaluasi draft' : 'Evaluate draft',
    localBrainstorm: language === 'id' ? 'Brainstorm Lokal' : 'Local Brainstorm',
    generateIdeas: language === 'id' ? 'Buat ide dari keyword (0 Kuota API)' : 'Generate ideas from your keyword (0 API Cost)',
  };

  const mutation = useMutation({
    mutationFn: analyzePost,
    onSuccess: (data) => {
      setAnalysisResult(data);
      useAnalyzeStore.getState().addHistory({
        text: useAnalyzeStore.getState().inputText,
        result: data
      });
      navigate('/result');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Analysis Error:", error);
    }
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.morning;
    if (hour < 18) return t.afternoon;
    return t.evening;
  };

  const handleBrainstorm = () => {
    let seed = inputText.trim();
    if (brainstormIdeas.includes(seed) || !seed) {
      seed = originalKeyword || 'Productivity';
    } else {
      setOriginalKeyword(seed);
    }

    const indoWords = ['di', 'ke', 'dan', 'yang', 'ini', 'itu', 'untuk', 'dengan', 'dari', 'kalau', 'bisa', 'ada', 'apa', 'bagaimana', 'cara', 'buat', 'gue', 'lo', 'aku', 'kamu', 'gak', 'nggak', 'tidak', 'terus', 'soal', 'bikin', 'gimana'];
    const words = seed.toLowerCase().split(/[\s,.-]+/);
    const isIndo = words.some(w => indoWords.includes(w));

    const templates = isIndo ? [
      "Bahas tuntas soal [Topic]:",
      "Kenyataan pahit tentang [Topic] yang jarang diomongin orang:",
      "5 mitos terbesar soal [Topic] yang masih sering dipercaya:",
      "Cara paling gampang buat paham [Topic] tanpa pusing:",
      "Jangan ngaku paham [Topic] kalau lo belum tau 3 hal ini:",
      "Realita di balik [Topic] yang nggak seindah kelihatannya:",
      "Step-by-step lengkap buat mulai [Topic] dari nol:",
      "Semua orang bahas [Topic], tapi banyak yang kelewatan rahasia ini:",
      "Gimana gue manfaatin [Topic] buat ningkatin produktivitas:",
      "Kesalahan fatal pemula pas nyoba nge-eksekusi [Topic]:",
      "Jujur aja, [Topic] itu kadang overrated. Ini alasannya:",
      "Tools & trik favorit gue pas lagi ngulik soal [Topic]:",
      "Kalau lo lagi stuck soal [Topic], coba baca thread ini:",
      "Thread: Rekomendasi resource gratis buat belajar [Topic]",
      "Kenapa 99% orang gagal di [Topic], dan cara biar lo masuk yang 1%:",
      "Berhenti belajar [Topic] pake cara lama. Lakuin trick ini aja:",
      "Framework simpel buat bikin urusan [Topic] jadi super gampang:"
    ] : [
      "Let's talk about [Topic] and why most people get it wrong:",
      "The harsh truth about [Topic] nobody wants to admit:",
      "5 massive myths about [Topic] you need to stop believing:",
      "How to actually understand [Topic] without losing your mind:",
      "Don't claim you know [Topic] until you've mastered these 3 things:",
      "The completely underrated side of [Topic]:",
      "A complete step-by-step roadmap to dominate [Topic]:",
      "Everyone is talking about [Topic], but they're missing the big picture:",
      "How I leverage [Topic] to 10x my daily results:",
      "The biggest mistake beginners make with [Topic] (and how to fix it):",
      "Hot take: [Topic] is overrated. Here's what actually matters:",
      "My top 5 favorite tools that make [Topic] 10x easier:",
      "If you're feeling stuck with [Topic], read this thread:",
      "A mega-thread of the best free resources to learn [Topic]:",
      "Why 99% of people fail at [Topic], and how to be the top 1%:",
      "Stop approaching [Topic] the old way. Try this framework instead:",
      "The ultimate guide to simplifying [Topic] in 2024:"
    ];

    // Pick 3 random unique ideas
    const shuffled = [...templates].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 3).map(t => t.replace(/\[Topic\]/g, seed));
    
    setBrainstormIdeas(picked);
  };

  return (
    <div className="flex flex-col items-center flex-start pt-16 md:pt-24 min-h-[80vh] px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{getGreeting()}, {t.peeps}</h1>
      <p className="text-gray-500 mb-10 text-center">{t.subtitle}</p>
      
      <InputBox 
        onSubmit={() => {
          // As requested: Store original input as originalKeyword on Analyze
          setOriginalKeyword(inputText.trim());
          mutation.mutate({ text: inputText, apiKey, model: aiModel });
        }} 
        isPending={mutation.isPending} 
      />

      {brainstormIdeas.length > 0 && (
        <div className="w-full max-w-3xl mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span role="img" aria-label="sparkles">✨</span> {t.brainstorm} "{originalKeyword}"
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {brainstormIdeas.map((idea, idx) => (
              <div 
                key={idx}
                onClick={() => useAnalyzeStore.getState().setInputText(idea)}
                className="p-4 bg-white border border-blue-100 rounded-xl cursor-pointer shadow-sm hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all group"
              >
                <p className="text-sm text-gray-800 group-hover:text-blue-900 font-medium">{idea}</p>
                <div className="mt-2 text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">{t.clickToUse}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
        <div 
          onClick={() => {
            useAnalyzeStore.getState().setInputText("AI in Web3");
            setOriginalKeyword("AI in Web3");
            mutation.mutate({ text: "AI in Web3", apiKey, model: aiModel });
          }}
          className="p-4 bg-white border border-gray-100 rounded-xl cursor-pointer shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all"
        >
          <h4 className="text-sm font-medium text-gray-900 mb-1">{t.analyzeTopic}</h4>
          <p className="text-xs text-gray-500">"AI in Web3"</p>
        </div>
        <div 
          onClick={() => {
            useAnalyzeStore.getState().setInputText("5 steps to scale your SaaS over the next 90 days:");
            setOriginalKeyword("5 steps to scale your SaaS over the next 90 days:");
            mutation.mutate({ text: "5 steps to scale your SaaS over the next 90 days:", apiKey, model: aiModel });
          }}
          className="p-4 bg-white border border-gray-100 rounded-xl cursor-pointer shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all"
        >
          <h4 className="text-sm font-medium text-gray-900 mb-1">{t.evaluateDraft}</h4>
          <p className="text-xs text-gray-500 line-clamp-1">5 steps to scale your SaaS over the next 90 days:</p>
        </div>
        <div 
          onClick={handleBrainstorm}
          className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all"
        >
          <h4 className="text-sm font-medium text-blue-900 mb-1 flex items-center gap-1.5">
            <span role="img" aria-label="brain">🧠</span> {t.localBrainstorm}
          </h4>
          <p className="text-xs text-blue-600/80">{t.generateIdeas}</p>
        </div>
      </div>
    </div>
  );
}
