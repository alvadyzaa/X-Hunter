import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface GeneratedContentCardProps {
  content: string;
  isLoading: boolean;
  title: string;
}

export default function GeneratedContentCard({ content, isLoading, title }: GeneratedContentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm animate-pulse">
        <h3 className="text-sm font-bold text-gray-400 mb-4">{title}</h3>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="mt-6 p-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
        <button
          onClick={handleCopy}
          className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-500 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-6 overflow-y-auto max-h-96">
        <pre className="text-gray-800 whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}
