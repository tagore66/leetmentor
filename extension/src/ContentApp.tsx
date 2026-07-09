import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, User, Settings, ChevronDown, CheckCircle2, Lock, Lightbulb, Bug, BrainCircuit, Activity, FileJson, Paperclip, StopCircle, Bot, Copy, RotateCcw, MessageSquareCode, Code2, LogOut, Zap, TestTube2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { detectPlatform } from "./platform";
import type { PlatformAdapter } from "./platform";
import { Button } from "./components/ui/Button";
import { IconButton } from "./components/ui/IconButton";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const AI_MODES = [
  { id: "Mentor", icon: Sparkles, color: "text-[#06B6D4]", glow: "shadow-[0_0_12px_rgba(6,182,212,0.4)]", border: "border-[#06B6D4]/70" },
  { id: "Hint", icon: Lightbulb, color: "text-[#F59E0B]", glow: "shadow-[0_0_12px_rgba(245,158,11,0.4)]", border: "border-[#F59E0B]/70" },
  { id: "Debug", icon: Bug, color: "text-[#EF4444]", glow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]", border: "border-[#EF4444]/70" },
  { id: "Explain", icon: BrainCircuit, color: "text-[#8B5CF6]", glow: "shadow-[0_0_12px_rgba(139,92,246,0.4)]", border: "border-[#8B5CF6]/70" },
  { id: "Complexity", icon: Activity, color: "text-[#3B82F6]", glow: "shadow-[0_0_12px_rgba(59,130,246,0.4)]", border: "border-[#3B82F6]/70" }
];

const MODELS = [
  { id: "deepseek/deepseek-chat-v3-0324", name: "DeepSeek V3", premium: false },
  { id: "openai/gpt-4o", name: "GPT-4o", premium: true },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", premium: true }
];

// Reusable physics configuration
const springPhysics: any = { type: "spring", damping: 25, stiffness: 200, mass: 0.8 };

export default function ContentApp() {
  const [isOpen, setIsOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [showEmailSignup, setShowEmailSignup] = useState(false);
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [adapter, setAdapter] = useState<PlatformAdapter | null>(null);
  const [isBootingContext, setIsBootingContext] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  
  const [userData, setUserData] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);

  const [aiMode, setAiMode] = useState("Mentor");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  // Dynamic Placeholder
  const placeholders = [
    "Ask for a hint...",
    "Debug my code...",
    "Explain the approach...",
    "Optimize my solution...",
    "Why is this failing?",
    "What's my complexity?",
    "Generate edge cases..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const [contextData, setContextData] = useState({
    title: "",
    difficulty: "",
    language: ""
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("https://leetmentor-ltjj.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        chrome.storage.local.set({ leetai_token: data.token }, () => {
          setIsAuthenticated(true);
          setUserData(data.user);
        });
      } else {
        setAuthError(data.message || "Login failed");
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to connect to server");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("https://leetmentor-ltjj.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        handleLogin(e);
      } else {
        setAuthError(data.message || "Registration failed");
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to connect to server");
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleGoogleLogin = async () => {
    setAuthError("");
    setIsLoggingIn(true);
    try {
      const clientId = "dummy_client_id_for_now"; 
      if (clientId === "dummy_client_id_for_now") {
         setTimeout(() => {
            setAuthError("Google Login requires a valid Client ID configured in the backend.");
            setIsLoggingIn(false);
         }, 800);
         return;
      }
      
      const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=id_token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20email%20profile&nonce=random`;

      chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, async (redirectUrl) => {
          if (chrome.runtime.lastError || !redirectUrl) {
            setAuthError(chrome.runtime.lastError?.message || "Google Login cancelled");
            setIsLoggingIn(false);
            return;
          }
          const urlParams = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
          const idToken = urlParams.get("id_token");
          if (idToken) {
            const res = await fetch("https://leetmentor-ltjj.onrender.com/api/auth/google", {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: idToken })
            });
            const data = await res.json();
            if (res.ok && data.token) {
              chrome.storage.local.set({ leetai_token: data.token }, () => {
                setIsAuthenticated(true);
                setUserData(data.user);
              });
            } else setAuthError(data.message || "Google Login failed");
          }
          setIsLoggingIn(false);
      });
    } catch (err: any) {
      setAuthError(err.message);
      setIsLoggingIn(false);
    }
  };

  const handleGithubLogin = () => {
     setAuthError("");
     setIsLoggingIn(true);
     setTimeout(() => {
        setAuthError("GitHub Login endpoint not yet implemented in backend.");
        setIsLoggingIn(false);
     }, 800);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setIsCheckingSession(true);
      try {
        const response: any = await new Promise((resolve) => {
          try {
            chrome.runtime.sendMessage({ type: "FETCH_API", endpoint: "/user/profile" }, (res) => {
              if (chrome.runtime.lastError) resolve(null);
              else resolve(res);
            });
          } catch (e) {
            resolve(null);
          }
        });
        
        if (response?.success && response?.data?.user) {
          setIsAuthenticated(true);
          setUserData(response.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        // slight delay to ensure the shimmer is visible just for a premium feel
        setTimeout(() => setIsCheckingSession(false), 800);
      }
    };
    
    fetchSettings();
  }, [isOpen]); // re-check when opened in case they logged in on website

  useEffect(() => {
    if (isOpen) {
      const adapterInstance = detectPlatform();
      setAdapter(adapterInstance);
      if (adapterInstance) {
        const title = adapterInstance.getProblemTitle();
        const diff = adapterInstance.getDifficulty();
        setContextData({
          title,
          difficulty: diff,
          language: adapterInstance.getLanguage()
        });

      }
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (isOpen) {
      // Only boot if we have no messages (new session) or not authenticated
      if (!isAuthenticated || messages.length === 0) {
        setIsBootingContext(true);
        setBootStep(0);
        
        const sequence = async () => {
          await new Promise(r => setTimeout(r, 400));
          setBootStep(1);
          await new Promise(r => setTimeout(r, 400));
          setBootStep(2);
          await new Promise(r => setTimeout(r, 400));
          setBootStep(3);
          await new Promise(r => setTimeout(r, 400));
          setBootStep(4);
          await new Promise(r => setTimeout(r, 500));
          setIsBootingContext(false);
        };
        
        sequence();
      }
    }
  }, [isOpen, isAuthenticated, messages.length]);

  const handleSend = async (customPrompt?: string, forceMode?: string) => {
    const text = customPrompt || input;
    if (!text.trim() && !customPrompt) return;

    const currentMode = forceMode || aiMode;
    if (forceMode) setAiMode(forceMode);

    let textToSend = text;

    if (customPrompt) {
       textToSend = customPrompt;
    }

    let context = "";
    if (adapter) {
      context = `Platform: ${window.location.hostname}\nProblem: ${adapter.getProblemTitle()}\nDifficulty: ${adapter.getDifficulty()}\nLanguage: ${adapter.getLanguage()}\n\nCurrent Code:\n${adapter.getCurrentCode()}`;
    }

    const fullPrompt = `${context}\n\nUser Question:\n${textToSend}`;

    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setInput("");
    setIsGenerating(true);

    // Create placeholder for assistant message
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      abortControllerRef.current = new AbortController();
      
      const { leetai_token } = await chrome.storage.local.get("leetai_token");
      
      const res = await fetch("https://leetmentor-ltjj.onrender.com/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${leetai_token}`
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          conversationId: conversationId,
          model: selectedModel,
          mode: currentMode,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
         throw new Error("Failed to connect to AI");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let assistantMessage = "";
      if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (let line of lines) {
                if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.type === 'meta') {
                             if (data.conversationId) setConversationId(data.conversationId);
                        } else if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                            assistantMessage += data.choices[0].delta.content;
                            setMessages(prev => {
                              const updated = [...prev];
                              updated[updated.length - 1].content = assistantMessage;
                              return updated;
                            });
                        }
                    } catch (e) {}
                }
            }
          }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
         setMessages(prev => {
           const updated = [...prev];
           updated[updated.length - 1].content = "⚠️ **Error:** " + err.message;
           return updated;
         });
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
     if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsGenerating(false);
     }
  };

  const handleLogout = () => {
    chrome.storage.local.remove(['leetai_token'], () => {
      setIsAuthenticated(false);
      setUserData(null);
    });
  };

  if (!isOpen) {
    return (
      <div className="font-sans text-white fixed z-[9999999] inset-0 pointer-events-none">
        {/* Floating Button - Linear/Apple Style */}
        <AnimatePresence>
          <motion.div
            ref={dragRef}
            drag
            dragMomentum={false}
            dragElastic={0.05}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            transition={springPhysics}
            className="fixed right-8 bottom-8 w-12 h-12 flex items-center justify-center cursor-pointer pointer-events-auto group z-50 animate-float"
          >
            {/* Rotating & Breathing B/W outer ring */}
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ 
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-transparent via-[#555555] to-white/90 opacity-100 pointer-events-none"
            />
            
            {/* Inner Matte Button */}
            <div className="absolute inset-0 rounded-full bg-[#09090B] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.9)] z-10 overflow-hidden border border-[#232323] transition-colors duration-500">
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <Code2 size={24} strokeWidth={2.5} className="text-white/90 group-hover:text-white transition-colors duration-500 relative z-20" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="font-sans text-white fixed z-[9999999] inset-0 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.8 }}
            className="absolute top-0 right-0 h-full w-[480px] bg-[#09090B] border-l border-[#232323] shadow-2xl pointer-events-auto flex flex-col"
          >
            
            {/* --- LOADING SESSION STATE --- */}
            {isCheckingSession ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#09090B]">
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#111111] border border-[#232323] flex items-center justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer"></div>
                    <MessageSquareCode size={24} className="text-white/80 relative z-10" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[13px] font-medium text-white/90">Checking your session...</span>
                    <div className="h-1 w-24 bg-[#111111] rounded-full overflow-hidden">
                      <div className="h-full bg-white/20 animate-pulse-glow rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : !isAuthenticated ? (

              /* --- PREMIUM ONBOARDING STATE --- */
              <div className="flex-1 flex flex-col p-8 bg-[#09090B] relative overflow-y-auto custom-scrollbar">
                 <div className="absolute top-5 left-6 flex flex-col z-10 pointer-events-none">
                   <span className="text-[13px] font-bold tracking-tight text-white/90">LeetMentor</span>
                   <span className="text-[9px] font-medium tracking-widest text-white/40 uppercase mt-[2px]">AI Pair Programmer</span>
                 </div>
                 
                 <IconButton variant="ghost" onClick={() => setIsOpen(false)} className="absolute top-5 right-5 z-10">
                    <X size={16} />
                 </IconButton>

                 <div className="flex-1 flex flex-col max-w-[340px] mx-auto w-full mt-12 pb-10 justify-center">
                    
                    {isBootingContext ? (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col gap-4 text-[13px] font-mono w-full px-4"
                      >
                         <div className="text-[#38BDF8] mb-4">Detecting Problem...</div>
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootStep >= 1 ? 1 : 0 }} className="flex gap-2 items-center"><span className="text-emerald-400">✓</span> Reading Title</motion.div>
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootStep >= 2 ? 1 : 0 }} className="flex gap-2 items-center"><span className="text-emerald-400">✓</span> Reading Description</motion.div>
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootStep >= 3 ? 1 : 0 }} className="flex gap-2 items-center"><span className="text-emerald-400">✓</span> Detecting Language</motion.div>
                         <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: bootStep >= 4 ? 1 : 0, y: bootStep >= 4 ? 0 : 5 }} className="flex gap-2 items-center mt-4 text-emerald-400">✓ Ready to assist.</motion.div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        {/* Context Detection Header */}
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
                          className="w-full bg-[#111111] border border-white/5 rounded-[16px] p-4 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden"
                        >
                          {/* Subtle looping animation background */}
                          <motion.div 
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                            className="absolute inset-0 opacity-10 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent pointer-events-none"
                          />
                          
                          {(() => {
                            const hasContext = contextData.title && contextData.title !== "Unknown LeetCode Problem";
                            return (
                              <>
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                   <div className={`w-2 h-2 rounded-full ${hasContext ? 'bg-emerald-400 animate-pulse' : 'bg-[#333333]'}`}></div>
                                   <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${hasContext ? 'text-emerald-400' : 'text-white/40'}`}>
                                     {hasContext ? 'Problem Detected' : 'Waiting for Context'}
                                   </span>
                                </div>
                                
                                <div className="relative z-10">
                                   {hasContext ? (
                                     <>
                                       <h3 className="text-sm font-semibold text-white/90 mb-1 truncate">{contextData.title}</h3>
                                       <div className="flex items-center gap-3 text-[11px] text-white/50">
                                         <span>{contextData.difficulty || "LeetCode"}</span>
                                         {contextData.language && contextData.language !== "Unknown Language" && (
                                           <>
                                             <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                             <span>{contextData.language}</span>
                                           </>
                                         )}
                                       </div>
                                     </>
                                   ) : (
                                     <>
                                       <h3 className="text-sm font-medium text-white/70 mb-1">Open a problem to begin</h3>
                                       <div className="text-[11px] text-white/40">Navigate to any LeetCode problem</div>
                                     </>
                                   )}
                                </div>
                                
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 relative z-10">
                                   {hasContext ? (
                                     <>
                                       <CheckCircle2 size={14} className="text-[#38BDF8]" />
                                       <span className="text-[11px] font-medium text-white/70">Context Ready</span>
                                     </>
                                   ) : (
                                     <>
                                       <Activity size={14} className="text-white/30" />
                                       <span className="text-[11px] font-medium text-white/40">Ready to connect</span>
                                     </>
                                   )}
                                </div>
                              </>
                            );
                          })()}
                        </motion.div>

                        <div className="text-center mb-8">
                           <motion.h2 
                             initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                             className="text-[22px] font-bold tracking-tight text-white/90 mb-2"
                           >
                             Your AI Pair Programmer
                           </motion.h2>
                           <motion.p 
                             initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                             className="text-[13px] text-white/50"
                           >
                             for Coding Interviews.
                           </motion.p>
                        </div>
                        
                        {!showEmailLogin && !showEmailSignup ? (
                          <>
                            {/* Feature List */}
                            <motion.div 
                              initial="hidden" animate="visible"
                              variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
                              }}
                              className="flex flex-col gap-3 mb-10 text-[13px] text-white/80 px-4"
                            >
                              {[
                                { icon: "◉", text: "Smart Hints" },
                                { icon: "◉", text: "Debug Code" },
                                { icon: "◉", text: "Explain Concepts" },
                                { icon: "◉", text: "Optimize Solution" },
                                { icon: "◉", text: "Complexity Analysis" }
                              ].map((feature, idx) => (
                                <motion.div key={idx} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="flex items-center gap-3">
                                   <span className="text-[12px] text-white/40">{feature.icon}</span>
                                   <span className="font-medium">{feature.text}</span>
                                </motion.div>
                              ))}
                            </motion.div>

                            <motion.div 
                              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                              className="w-full flex flex-col gap-3"
                            >
                              {authError && !showEmailLogin && !showEmailSignup && <div className="text-red-400 text-[11px] mb-2 p-2 bg-red-500/10 rounded-md border border-red-500/20">{authError}</div>}
                              
                              <Button 
                                variant="primary"
                                fullWidth
                                onClick={handleGoogleLogin}
                                disabled={isLoggingIn}
                                className="h-11 gap-2 text-[13px] rounded-[14px]"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                {isLoggingIn ? "Connecting..." : "Continue with Google"}
                              </Button>

                              <Button 
                                variant="secondary"
                                fullWidth
                                onClick={handleGithubLogin}
                                disabled={isLoggingIn}
                                className="h-11 gap-2 text-[13px] rounded-[14px]"
                              >
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                {isLoggingIn ? "Connecting..." : "Continue with GitHub"}
                              </Button>

                              <div className="flex flex-col items-center w-full mt-4 px-2 gap-2">
                                <div className="text-[12px] text-white/50 flex gap-1.5 items-center">
                                   <span>Already have an account?</span>
                                   <Button variant="ghost" size="sm" className="!px-2" onClick={() => setShowEmailLogin(true)}>Login</Button>
                                </div>
                                <div className="text-[12px] text-white/50 flex gap-1.5 items-center">
                                   <span>Create new account</span>
                                   <Button variant="ghost" size="sm" className="!px-2" onClick={() => setShowEmailSignup(true)}>Signup</Button>
                                </div>
                              </div>
                              
                              {/* Trust Indicators */}
                              <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/5 pt-6 w-full">
                                 <div className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-wider font-semibold">
                                    <Lock size={10} /> Secure Authentication
                                 </div>
                                 <div className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-wider font-semibold">
                                    <CheckCircle2 size={10} /> Privacy First
                                 </div>
                                 <div className="text-[9px] text-white/20 mt-1">Your code is never shared without permission.</div>
                              </div>
                            </motion.div>
                          </>
                        ) : showEmailLogin ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                        className="w-full mt-4"
                      >
                         <h3 className="text-sm font-medium text-white/80 mb-6">Sign In to Continue</h3>
                         {authError && <div className="text-red-400 text-[11px] mb-4 p-2 bg-red-500/10 rounded-md border border-red-500/20">{authError}</div>}
                         <form onSubmit={handleLogin} className="space-y-3">
                           <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-11 bg-[#111111] border border-[#232323] rounded-xl px-4 text-[13px] text-white placeholder:text-white/30 focus:border-white/20 outline-none transition-colors shadow-sm" />
                           <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-11 bg-[#111111] border border-[#232323] rounded-xl px-4 text-[13px] text-white placeholder:text-white/30 focus:border-white/20 outline-none transition-colors shadow-sm" />
                           <Button variant="primary" fullWidth type="submit" disabled={isLoggingIn} className="h-11 text-[13px] mt-2">
                             {isLoggingIn ? "Signing in..." : "Sign In"}
                           </Button>
                         </form>
                         <Button variant="ghost" size="sm" onClick={() => { setShowEmailLogin(false); setAuthError(""); }} className="mt-6">
                           ← Back
                         </Button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                        className="w-full mt-4"
                      >
                         <h3 className="text-sm font-medium text-white/80 mb-6">Create an Account</h3>
                         {authError && <div className="text-red-400 text-[11px] mb-4 p-2 bg-red-500/10 rounded-md border border-red-500/20">{authError}</div>}
                         <form onSubmit={handleRegister} className="space-y-3">
                           <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full h-11 bg-[#111111] border border-[#232323] rounded-xl px-4 text-[13px] text-white placeholder:text-white/30 focus:border-white/20 outline-none transition-colors shadow-sm" />
                           <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-11 bg-[#111111] border border-[#232323] rounded-xl px-4 text-[13px] text-white placeholder:text-white/30 focus:border-white/20 outline-none transition-colors shadow-sm" />
                           <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-11 bg-[#111111] border border-[#232323] rounded-xl px-4 text-[13px] text-white placeholder:text-white/30 focus:border-white/20 outline-none transition-colors shadow-sm" />
                           <Button variant="primary" fullWidth type="submit" disabled={isLoggingIn} className="h-11 text-[13px] mt-2">
                             {isLoggingIn ? "Creating..." : "Sign Up"}
                           </Button>
                         </form>
                         <Button variant="ghost" size="sm" onClick={() => { setShowEmailSignup(false); setAuthError(""); }} className="mt-6">
                           ← Back
                         </Button>
                      </motion.div>
                     )}
                     </motion.div>
                    )}
                 </div>
              </div>

            ) : (
              
              /* --- WORKSPACE STATE --- */
              <>
                {/* Header / Context Bar */}
                <div className="px-4 py-3 border-b border-[#232323] bg-[#09090B] z-20 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    
                    {/* User Profile Area (Premium Sync) */}
                    <div className="flex items-center gap-2.5">
                       <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#232323] overflow-hidden flex items-center justify-center shadow-sm">
                          {userData?.profilePicture ? (
                             <img src={userData.profilePicture} alt="User" className="w-full h-full object-cover" />
                          ) : (
                             <User size={14} className="text-white/60" />
                          )}
                       </div>
                       <div className="flex flex-col justify-center">
                          <span className="text-[12px] font-medium text-white/90 leading-tight">
                             {userData?.name || "Developer"}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <span className="text-[10px] text-white/40 leading-tight font-mono">
                                {userData?.settings?.premium ? "PRO PLAN" : "FREE PLAN"}
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a href="http://localhost:5173/account" target="_blank" rel="noreferrer" title="Settings">
                        <IconButton variant="ghost" size="sm">
                          <Settings size={14} />
                        </IconButton>
                      </a>
                      <IconButton variant="ghost" size="sm" onClick={handleLogout} title="Sign out">
                        <LogOut size={14} />
                      </IconButton>
                      <IconButton variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="ml-1" title="Close">
                        <X size={16} />
                      </IconButton>
                    </div>
                  </div>
                  
                  {/* Context & Settings Bar */}
                  <div className="flex items-center justify-between relative mt-1">
                    
                    {/* Minimal Problem Context */}
                    {adapter && contextData.title ? (
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                        <span className="text-[11px] text-white/60 truncate font-medium">{contextData.title}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mr-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 shrink-0"></div>
                        <span className="text-[11px] text-white/40">No problem detected</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Mode Selector Removed (Moved to Chips) */}

                      {/* Model Selector */}
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => { setShowModelDropdown(!showModelDropdown); }}
                        className="gap-1.5 !px-2 !py-1 text-[11px] rounded-md"
                      >
                        <Bot size={11} className="text-white/60" />
                        <span className="text-white/80 truncate max-w-[70px]">{MODELS.find(m => m.id === selectedModel)?.name}</span>
                        <ChevronDown size={11} className="text-white/30" />
                      </Button>
                      <AnimatePresence>
                        {showModelDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 mt-1 w-48 bg-[#111111] border border-[#232323] rounded-lg shadow-xl overflow-hidden z-50"
                          >
                            {MODELS.map(m => (
                              <button key={m.id} disabled={m.premium && !userData?.settings?.premium} onClick={() => { setSelectedModel(m.id); setShowModelDropdown(false); }} className="w-full flex flex-col text-left px-3 py-2 hover:bg-[#1A1A1A] disabled:opacity-50 transition-colors relative">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium text-white/90">{m.name}</span>
                                  {m.premium && <Lock size={10} className="text-white/30" />}
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                
                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar bg-[#09090B]">
                  {isBootingContext ? (
                    <div className="flex flex-col h-full items-center justify-center pt-2 pb-4">
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col gap-4 text-[13px] font-mono w-full max-w-[280px] mx-auto px-4"
                      >
                         <div className="text-[#38BDF8] mb-4">Detecting Problem...</div>
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootStep >= 1 ? 1 : 0 }} className="flex gap-2 items-center"><span className="text-emerald-400">✓</span> Problem found</motion.div>
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootStep >= 2 ? 1 : 0 }} className="flex gap-2 items-center"><span className="text-emerald-400">✓</span> Context loaded</motion.div>
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootStep >= 3 ? 1 : 0 }} className="flex gap-2 items-center"><span className="text-emerald-400">✓</span> {contextData.language || 'Language'} detected</motion.div>
                         <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: bootStep >= 4 ? 1 : 0, y: bootStep >= 4 ? 0 : 5 }} className="flex gap-2 items-center mt-4 text-emerald-400 font-bold">✓ AI Ready</motion.div>
                      </motion.div>
                    </div>
                  ) : messages.length === 0 && contextData.title && contextData.title !== "Unknown LeetCode Problem" ? (
                    <div className="flex flex-col h-full items-center justify-center pt-2 pb-4">
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-[#111111] border border-[#232323] rounded-2xl p-6 w-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative overflow-hidden group">
                          {/* Top subtle glow */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#38BDF8]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                          
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse"></div>
                            <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-widest">Problem Detected</span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-2 leading-tight tracking-tight">Hey {userData?.name?.split(' ')[0] || "Tagore"} 👋</h3>
                          
                          <p className="text-[13px] text-white/60 font-medium mb-5 leading-relaxed">
                            I noticed you're solving <strong className="text-white/90">{contextData.title}</strong> in <strong className="text-white/90">{contextData.language || "your language"}</strong>.
                            <br/><br/>
                            I'm ready whenever you need help. What would you like to do?
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                             <button onClick={() => handleSend("Give me a hint", "Hint")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-[12px] font-medium text-white/90 hover:bg-[#1f1f1f] hover:border-[#404040] transition-colors shadow-sm cursor-pointer">
                               <Lightbulb size={12} className="text-[#FCD34D]" />
                               Smart Hint
                             </button>
                             <button onClick={() => handleSend("Explain the approach", "Explain")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-[12px] font-medium text-white/90 hover:bg-[#1f1f1f] hover:border-[#404040] transition-colors shadow-sm cursor-pointer">
                               <BrainCircuit size={12} className="text-[#A78BFA]" />
                               Explain Approach
                             </button>
                             <button onClick={() => handleSend("Debug my code", "Debug")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-[12px] font-medium text-white/90 hover:bg-[#1f1f1f] hover:border-[#404040] transition-colors shadow-sm cursor-pointer">
                               <Bug size={12} className="text-[#F87171]" />
                               Debug Code
                             </button>
                             <button onClick={() => handleSend("Analyze complexity", "Complexity")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-[12px] font-medium text-white/90 hover:bg-[#1f1f1f] hover:border-[#404040] transition-colors shadow-sm cursor-pointer">
                               <Activity size={12} className="text-[#34D399]" />
                               Analyze Complexity
                             </button>
                             <button onClick={() => handleSend("Optimize solution", "Mentor")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-[12px] font-medium text-white/90 hover:bg-[#1f1f1f] hover:border-[#404040] transition-colors shadow-sm cursor-pointer">
                               <Zap size={12} className="text-[#38BDF8]" />
                               Optimize
                             </button>
                             <button onClick={() => handleSend("Generate test cases", "Mentor")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-[12px] font-medium text-white/90 hover:bg-[#1f1f1f] hover:border-[#404040] transition-colors shadow-sm cursor-pointer">
                               <TestTube2 size={12} className="text-neutral-400" />
                               Test Cases
                             </button>
                          </div>
                       </motion.div>
                    </div>
                  ) : (
                    <AnimatePresence>
                    {messages.map((msg, i) => {
                      let displayContent = msg.content || (isGenerating && i === messages.length - 1 ? "●" : "");
                      let suggestionChips: string[] = [];
                      
                      if (msg.role === "assistant" && displayContent && (!isGenerating || i !== messages.length - 1)) {
                         const match = displayContent.match(/(?:(?:Would you like|How would you like|Options:)[^?:]*[?:]\s*)?((?:[-*]\s+[^\n]+(?:\n|$))+)$/i);
                         if (match) {
                            displayContent = displayContent.replace(match[0], "").trim();
                            suggestionChips = match[1].split('\n').filter((l: string) => l.trim().startsWith('-') || l.trim().startsWith('*')).map((l: string) => l.replace(/^[-*]\s+/, '').trim());
                         }
                      }

                      return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className={`flex gap-3 max-w-[100%] group ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center border overflow-hidden ${msg.role === "user" ? "bg-[#111111] border-[#232323]" : "bg-white border-white"}`}>
                          {msg.role === "user" ? (
                             userData?.profilePicture ? <img src={userData.profilePicture} className="w-full h-full object-cover" /> : <User size={12} className="text-white/60" />
                          ) : <Code2 size={12} className="text-black" />}
                        </div>
                        <div className="flex flex-col gap-1 w-full max-w-[88%]">
                           <div className={`text-[13px] leading-[1.6] px-3 py-2 ${msg.role === "user" ? "bg-[#111111] text-white/90 rounded-xl rounded-tr-sm border border-[#232323]" : "bg-transparent text-white/80"}`}>
                             <ReactMarkdown 
                                 remarkPlugins={[remarkGfm]}
                                 components={{
                                   h1: ({node, ...props}) => <h1 className="text-base font-medium mt-4 mb-2 text-white" {...props} />,
                                   h2: ({node, ...props}) => <h2 className="text-sm font-medium mt-4 mb-2 text-white" {...props} />,
                                   h3: ({node, ...props}) => <h3 className="text-xs font-medium mt-3 mb-1 text-white/90" {...props} />,
                                   ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mb-3 text-white/70" {...props} />,
                                   blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-[#38BDF8]/50 pl-3 py-1 my-3 bg-[#38BDF8]/5 rounded-r-md italic text-white/60 text-xs" {...props} />,
                                   code({node, inline, className, children, ...props}: any) {
                                     const match = /language-(\w+)/.exec(className || '')
                                     return !inline && match ? (
                                       <div className="relative group my-3 border border-[#232323] rounded-lg overflow-hidden shadow-sm">
                                          <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            className="text-[11px] !bg-[#111111] !m-0 !p-3"
                                            {...props}
                                          >
                                            {String(children).replace(/\n$/, '')}
                                          </SyntaxHighlighter>
                                       </div>
                                     ) : (
                                       <code className="bg-[#111111] border border-[#232323] px-1 py-0.5 rounded text-[11px] text-white/80 font-mono" {...props}>
                                         {children}
                                       </code>
                                     )
                                   }
                                 }}
                               >
                                 {displayContent}
                               </ReactMarkdown>
                           </div>
                           
                           {suggestionChips.length > 0 && (
                             <div className="flex flex-wrap gap-1.5 mt-2 mb-1 pl-1">
                               {suggestionChips.map((chip, idx) => (
                                  <button 
                                    key={idx}
                                    onClick={() => handleSend(chip)}
                                    className="text-[11px] font-medium bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 hover:bg-[#38BDF8]/20 hover:border-[#38BDF8]/40 hover:shadow-[0_0_8px_rgba(56,189,248,0.2)] px-3 py-1.5 rounded-full transition-all text-left leading-snug cursor-pointer"
                                  >
                                    {chip}
                                  </button>
                               ))}
                             </div>
                           )}

                           {msg.role === "assistant" && (
                              <div className="flex items-center gap-1 mt-0.5 px-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                                 <IconButton variant="ghost" size="sm" title="Copy"><Copy size={12} /></IconButton>
                                 <IconButton variant="ghost" size="sm" title="Regenerate"><RotateCcw size={12} /></IconButton>
                              </div>
                           )}
                        </div>
                      </motion.div>
                    )})}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* AI Suggestion Chips (Mode Selector) */}
                <div className="pt-2 pb-3 px-4 bg-[#09090B] overflow-x-auto flex items-center gap-2 border-t border-[#232323] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                  {AI_MODES.map(m => {
                    const isSelected = aiMode === m.id;
                    const Icon = m.icon;
                    return (
                      <motion.button
                        key={m.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setAiMode(m.id)}
                        className={`group flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${isSelected ? `bg-[#1a1a1a] ${m.border} ${m.glow}` : "bg-[#111111]/80 border-[#2a2a2a] hover:bg-[#1a1a1a] hover:border-white/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)]"}`}
                      >
                        <Icon size={12} className={`transition-all duration-200 group-hover:scale-110 ${isSelected ? m.color : "text-white/40 group-hover:text-white/80"}`} />
                        <span className={`text-[11px] font-medium transition-colors ${isSelected ? "text-white/90" : "text-white/50 group-hover:text-white/80"}`}>{m.id}</span>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Input Area - Minimal */}
                <div className="px-4 pb-4 pt-1 bg-[#09090B] z-20">
                  <div className="bg-[#111111] border border-[#232323] rounded-xl p-2.5 focus-within:border-[#38BDF8]/50 focus-within:ring-1 focus-within:ring-[#38BDF8]/50 transition-all shadow-sm">
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={placeholders[placeholderIndex]}
                      className="w-full bg-transparent border-none outline-none text-[13px] text-white/90 resize-none min-h-[24px] max-h-[150px] placeholder:text-white/30 custom-scrollbar block py-1 transition-all duration-300"
                    />
                    
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <IconButton variant="ghost" size="sm">
                           <Paperclip size={14} />
                        </IconButton>
                        <IconButton variant="ghost" size="sm">
                           <FileJson size={14} />
                        </IconButton>
                      </div>
                      
                      {isGenerating ? (
                        <Button 
                          variant="danger"
                          size="sm"
                          onClick={handleStop}
                          className="!px-2.5"
                        >
                          <StopCircle size={14} />
                        </Button>
                      ) : (
                        <Button 
                          variant={input.trim() ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => handleSend()}
                          disabled={!input.trim()}
                          className="!px-3"
                        >
                          {input.trim() ? "Send" : <Send size={14} />}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
