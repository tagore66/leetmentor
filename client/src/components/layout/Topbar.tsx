import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Lock, Check, PanelLeft } from "lucide-react";

type TopbarProps = {
  selectedModel: string;
  setSelectedModel: (val: string) => void;
  selectedMode: string;
  setSelectedMode: (val: string) => void;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
};

import { getModels } from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";

type ModelType = {
  id: string;
  name: string;
  provider: string;
  type: string;
  enabled: boolean;
  description: string;
};

const MODES = [
  { id: "Mentor", icon: "🧑‍🏫", name: "Mentor Mode", desc: "Socratic guidance" },
  { id: "Hint", icon: "💡", name: "Hint Mode", desc: "Subtle nudges" },
  { id: "Debug", icon: "🐛", name: "Debug Mode", desc: "Find logical flaws" },
  { id: "Explain", icon: "🧠", name: "Explain Mode", desc: "Detailed breakdowns" },
  { id: "Complexity", icon: "⚖️", name: "Complexity", desc: "Time & space analysis" },
];

export default function Topbar({ selectedModel, setSelectedModel, selectedMode, setSelectedMode, isSidebarOpen, toggleSidebar }: TopbarProps) {
  const [models, setModels] = useState<ModelType[]>([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const { user } = useAuth();
  
  const modelRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<HTMLDivElement>(null);
  
  const maxRequests = 100;
  const requestsUsed = user?.usage?.todayRequests || 0;
  const usagePercentage = Math.min((requestsUsed / maxRequests) * 100, 100);

  useEffect(() => {
    getModels().then((res: any) => setModels(res.data.models)).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) setModelOpen(false);
      if (modeRef.current && !modeRef.current.contains(event.target as Node)) setModeOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModelSelect = (model: any) => {
    if (model.type === "pro") {
      setModelOpen(false);
      setShowProModal(true);
      return;
    }
    setSelectedModel(model.id);
    setModelOpen(false);
  };

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    setModeOpen(false);
  };

  const currentModel = models.find(m => m.id === selectedModel) || models[0] || { name: "Loading...", type: "free" };
  const currentMode = MODES.find(m => m.id === selectedMode) || MODES[0];

  return (
    <>
      <div className="h-16 border-b border-neutral-900 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 relative z-30 shadow-sm text-white font-sans">
        <div className="flex items-center gap-3">
          {toggleSidebar && !isSidebarOpen && (
            <IconButton 
              variant="ghost"
              onClick={toggleSidebar}
              title="Open sidebar"
            >
              <PanelLeft size={18} />
            </IconButton>
          )}
          <h1 className="text-lg font-medium tracking-tight text-neutral-200 hidden sm:block">
            Workspace
          </h1>
          <div className="h-4 w-px bg-neutral-800 hidden sm:block"></div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-400">
            <span>{currentMode.icon}</span>
            <span className="hidden sm:inline">{currentMode.name}</span>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          
          {/* AI Usage Widget */}
          <div className="hidden md:flex flex-col items-end mr-2">
            <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-0.5">Free Plan</div>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
              </div>
              <span className="text-xs text-neutral-400 font-medium">{requestsUsed}/{maxRequests}</span>
            </div>
          </div>
          {/* Model Selector */}
          <div className="relative" ref={modelRef}>
            <Button 
              variant="secondary"
              onClick={() => setModelOpen(!modelOpen)}
              className="gap-2"
            >
              <Sparkles size={14} className={currentModel.type === "pro" ? "text-emerald-400" : "text-neutral-400"} />
              <span>{currentModel.name}</span>
              <ChevronDown size={14} className="text-neutral-500" />
            </Button>

            <AnimatePresence>
              {modelOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                >
                  <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">AI Models</div>
                  {models.map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model)}
                      className="w-full text-left px-3 py-2.5 hover:bg-neutral-900 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${model.id === selectedModel ? "bg-white" : "bg-transparent"}`}></div>
                        <span className={`text-sm ${model.id === selectedModel ? "text-white" : "text-neutral-300 group-hover:text-white"}`}>
                          {model.name}
                        </span>
                      </div>
                      {model.type === "pro" && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PRO</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mode Selector */}
          <div className="relative" ref={modeRef}>
            <Button 
              variant="secondary"
              onClick={() => setModeOpen(!modeOpen)}
              className="gap-2"
            >
              <span>{currentMode.name}</span>
              <ChevronDown size={14} className="text-neutral-500" />
            </Button>

            <AnimatePresence>
              {modeOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden py-1 z-50 max-h-[400px] overflow-y-auto custom-scrollbar"
                >
                  <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">AI Modes</div>
                  {MODES.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => handleModeSelect(mode.id)}
                      className="w-full text-left px-3 py-2.5 hover:bg-neutral-900 transition-colors flex items-center gap-3 group"
                    >
                      <div className="text-lg bg-neutral-950 p-1.5 rounded-md border border-neutral-800">{mode.icon}</div>
                      <div>
                        <div className={`text-sm font-medium ${mode.id === selectedMode ? "text-white" : "text-neutral-200 group-hover:text-white"}`}>
                          {mode.name}
                        </div>
                        <div className="text-xs text-neutral-500">{mode.desc}</div>
                      </div>
                      {mode.id === selectedMode && (
                        <Check size={16} className="text-white ml-auto" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Pro Modal */}
      <AnimatePresence>
        {showProModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowProModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-neutral-800">
                  <Lock size={24} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Upgrade to Pro</h2>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                  Unlock GPT-4o, Claude 3.5 Sonnet, and Llama 3 models. Get advanced reasoning and higher rate limits for your interview preparation.
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="primary"
                    fullWidth
                    onClick={() => setShowProModal(false)}
                  >
                    Upgrade Now - $15/mo
                  </Button>
                  <Button 
                    variant="ghost"
                    fullWidth
                    onClick={() => setShowProModal(false)}
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}