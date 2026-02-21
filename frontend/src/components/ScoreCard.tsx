import { Info } from 'lucide-react';

export default function ScoreCard({ title, score, type = 'progress', tooltip }: { title: string, score: number | string, type?: 'progress' | 'text', tooltip?: string }) {
  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {tooltip && (
          <div className="group relative flex items-center justify-center">
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10 text-center">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900">{score || (type === 'progress' ? 0 : 'Unknown')}</span>
      </div>
      {type === 'progress' && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
          <div 
            className="bg-black h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${Number(score) || 0}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
