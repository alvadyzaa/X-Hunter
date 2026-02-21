import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import Result from './pages/Result';
import Settings from './pages/Settings';
import ToastContainer from './components/ToastContainer';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Topbar />
          <main className="w-full grow px-6 py-8">
            <div className="w-full max-w-5xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/result" element={<Result />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
