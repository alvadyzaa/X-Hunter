import { Home, Clock, Settings as SettingsIcon, Plus, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAnalyzeStore } from '../store/useAnalyzeStore';

export default function Sidebar() {
  const location = useLocation();
  const { resetState, isSidebarOpen, setSidebarOpen } = useAnalyzeStore();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'History', path: '/analyze', icon: Clock },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-screen px-4 py-6 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">X-Hunter</h2>
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 bg-blue-100 rounded border border-blue-200">ALPHA</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Hunt the Algorithm by <a href="https://x.com/miegrains" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Keith</a>
            </p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900 p-1 -mt-4">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <Link 
          to="/analyze" 
          onClick={() => { resetState(); setSidebarOpen(false); }}
          className="flex items-center justify-center w-full px-4 py-2 mb-6 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Analysis
        </Link>

        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-2 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
