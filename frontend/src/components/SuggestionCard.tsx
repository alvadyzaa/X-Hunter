import { Lightbulb } from 'lucide-react';

export default function SuggestionCard({ text }: { text: string }) {
  return (
    <div className="flex items-start p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
      <Lightbulb className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-yellow-800 leading-relaxed">{text}</p>
    </div>
  );
}
