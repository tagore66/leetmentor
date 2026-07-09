import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Loader2 } from 'lucide-react';
import './index.css';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';

function Popup() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Check if we have a token in local storage
    chrome.storage.local.get(['leetai_token'], (result) => {
      if (result.leetai_token) {
        setToken(result.leetai_token as string);
      }
      setIsLoading(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('https://leetmentor-ltjj.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        // Save to chrome storage
        chrome.storage.local.set({ leetai_token: data.token }, () => {
          setToken(data.token);
        });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    chrome.storage.local.remove(['leetai_token'], () => {
      setToken(null);
    });
  };

  if (isLoading) {
    return (
      <div className="w-[300px] h-[200px] flex items-center justify-center bg-[#050505] text-white">
        <Loader2 className="animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="w-[300px] p-6 bg-[#050505] text-white font-sans text-center">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 mx-auto flex items-center justify-center mb-4">
        <div className="w-4 h-4 bg-white rounded-sm"></div>
      </div>
      <h1 className="text-lg font-semibold tracking-wide mb-1">LeetMentor</h1>
      
      {!token ? (
        <>
          <p className="text-xs text-neutral-400 mb-6">Sign in to sync with LeetAI</p>
          
          {error && (
            <div className="mb-4 p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <Input
              type="email"
              fullWidth
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs py-2.5"
              required
            />
            <Input
              type="password"
              fullWidth
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-xs py-2.5"
              required
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoggingIn}
              className="py-2.5 text-xs"
            >
              {isLoggingIn ? <Loader2 size={14} className="animate-spin" /> : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 text-[10px] text-neutral-500">
            Don't have an account? <a href="http://localhost:5173/register" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Sign up on Web</a>
          </div>
        </>
      ) : (
        <>
          <p className="text-xs text-neutral-400 mb-6">Your AI Coding Companion</p>
          
          <div className="bg-neutral-900 rounded-lg p-3 text-xs text-left mb-6 border border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="font-medium text-neutral-200">Extension Active</span>
            </div>
            <p className="text-neutral-500">Go to any LeetCode problem to see the floating assistant.</p>
          </div>

          <div className="flex flex-col gap-2">
            <a 
              href="http://localhost:5173/account#extension" 
              target="_blank"
              rel="noreferrer"
              className="block w-full"
            >
              <Button variant="primary" fullWidth className="py-2 text-xs">
                Manage Settings
              </Button>
            </a>
            
            <Button
              variant="danger"
              fullWidth
              onClick={handleLogout}
              className="py-2 text-xs bg-transparent hover:bg-red-500/10"
            >
              Sign Out
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
