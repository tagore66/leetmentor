import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Bot, Sparkles, BrainCircuit, Bug, Zap, Target, RefreshCw, MessageSquare } from "lucide-react";

const Typewriter = ({ text, delay = 0, speed = 25 }: { text: string, delay?: number, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [text, delay, speed]);

  return <span>{displayedText}</span>;
};

export default function InteractiveDemo() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const timings = [
      1500, // 0: Open LeetCode
      1500, // 1: Detect Problem
      2500, // 2: Context Ready
      6000, // 3: Smart Hint
      5000, // 4: Debug
      4000, // 5: Complexity
      4000, // 6: Sync
      4000  // 7: Ending
    ];
    
    const timeout = setTimeout(() => {
      setScene((s) => (s + 1) % 8);
    }, timings[scene]);
    
    return () => clearTimeout(timeout);
  }, [scene]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      animate={{ y: [0, -4, 0] }}
      whileHover={{ 
        scale: 1.02, 
        filter: 'brightness(1.05)',
        boxShadow: '0px 20px 60px -15px rgba(56,189,248,0.15)'
      }}
      className="relative w-full aspect-[16/10] bg-[#0c0c0e] rounded-3xl border border-[#232323] shadow-2xl overflow-hidden flex flex-col group transition-all duration-700"
      style={{ animationDuration: '6s', animationIterationCount: 'infinite' }}
    >
      {/* Browser Chrome */}
      <div className="w-full h-12 bg-[#09090B] border-b border-[#232323] flex items-center px-4 gap-4 shrink-0 z-20 relative">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
        <div className="flex-1 max-w-xl mx-auto h-7 bg-[#141414] rounded-md border border-[#232323] flex items-center justify-center text-[11px] text-white/40 font-mono transition-colors overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span 
              key={scene >= 6 && scene !== 7 ? "sync" : "leetcode"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2"
            >
              {scene >= 6 && scene !== 7 ? (
                <>🔒 app.leetmentor.com/workspace</>
              ) : (
                <>🔒 leetcode.com/problems/two-sum</>
              )}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex bg-[#0f0f11]">
        
        {/* LEETCODE MAIN CONTENT (Scenes 0-5) */}
        <AnimatePresence>
          {scene < 6 && (
            <motion.div 
              exit={{ opacity: 0, scale: 0.98 }} 
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex gap-4 p-6 overflow-hidden"
            >
              {/* LeetCode Problem Description Area */}
              <div className="flex-1 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 opacity-70 flex flex-col gap-4">
                <div className="w-1/3 h-6 bg-[#2a2a2a] rounded-md"></div>
                <div className="flex gap-2">
                  <div className="w-12 h-5 bg-green-500/10 rounded-full"></div>
                  <div className="w-16 h-5 bg-neutral-800 rounded-full"></div>
                </div>
                <div className="w-full h-3 bg-[#2a2a2a] rounded-md mt-4"></div>
                <div className="w-5/6 h-3 bg-[#2a2a2a] rounded-md"></div>
                <div className="w-4/6 h-3 bg-[#2a2a2a] rounded-md"></div>
              </div>

              {/* LeetCode Code Editor Area */}
              <div className="flex-[1.2] bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 opacity-70 font-mono text-[11px] leading-relaxed relative overflow-hidden">
                <div className="text-emerald-400/70 mb-2">class Solution {'{'}</div>
                <div className="pl-4 text-blue-400/70 mb-2">public int[] twoSum(int[] nums, int target) {'{'}</div>
                
                <AnimatePresence mode="wait">
                  {scene >= 4 && scene <= 5 ? (
                    <motion.div 
                      key="buggy-code"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="pl-8"
                    >
                      <div className="text-white/40">for (int i = 0; i {'<'} nums.length; i++) {'{'}</div>
                      <motion.div 
                        animate={scene === 4 ? { backgroundColor: ['rgba(244,63,94,0)', 'rgba(244,63,94,0.15)', 'rgba(244,63,94,0)'] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="pl-4 text-white/40 rounded py-0.5"
                      >
                        for (int j = 0; j {'<'} nums.length; <span className="text-rose-400">i++</span>) {'{'}
                      </motion.div>
                      <div className="pl-8 text-white/40">if (nums[i] + nums[j] == target) {'{'}</div>
                      <div className="pl-12 text-white/40">return new int[] {'{'}i, j{'}'};</div>
                      <div className="pl-8 text-white/40">{'}'}</div>
                      <div className="pl-4 text-white/40">{'}'}</div>
                      <div className="text-white/40">{'}'}</div>
                    </motion.div>
                  ) : (
                    <motion.div key="empty-code" exit={{ opacity: 0 }} className="pl-8 text-white/20">
                      // Write your solution here...
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="pl-4 text-blue-400/70 mt-2">{'}'}</div>
                <div className="text-emerald-400/70">{'}'}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WEB WORKSPACE SYNC (Scene 6) */}
        <AnimatePresence>
          {scene === 6 && (
            <motion.div 
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-[#09090B] flex"
            >
              <div className="w-64 border-r border-[#232323] p-4 flex flex-col gap-4">
                 <div className="h-8 bg-[#141414] rounded-lg border border-[#232323]"></div>
                 <div className="space-y-2">
                   <div className="text-[10px] text-white/40 uppercase font-semibold px-2">History</div>
                   <div className="h-8 bg-white/5 rounded-lg border border-white/5 flex items-center px-3 gap-2 text-xs font-medium text-white/80">
                     <MessageSquare size={12} />
                     Two Sum Debugging
                   </div>
                   <div className="h-8 bg-transparent rounded-lg flex items-center px-3 gap-2 text-xs font-medium text-white/40">
                     <MessageSquare size={12} />
                     Valid Palindrome
                   </div>
                 </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                 <motion.div 
                   initial={{ scale: 0.9, opacity: 0, y: 20 }}
                   animate={{ scale: 1, opacity: 1, y: 0 }}
                   transition={{ delay: 0.4 }}
                   className="flex flex-col items-center gap-4"
                 >
                   <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                     <RefreshCw size={24} className="text-emerald-400" />
                   </div>
                   <h2 className="text-2xl font-bold tracking-tight text-white">Workspace Synced</h2>
                   <p className="text-neutral-400 text-sm">Continue exactly where you left off.</p>
                 </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EXTENSION PANEL OVERLAY (Scenes 1-5) */}
        <AnimatePresence>
          {scene >= 1 && scene <= 5 && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-6 top-6 bottom-6 w-[340px] bg-[#0c0c0e] rounded-2xl border border-[#2a2a2a] shadow-2xl flex flex-col z-30"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#232323] flex items-center gap-2">
                <div className="w-7 h-7 bg-white rounded-[8px] flex items-center justify-center">
                  <Code2 size={14} className="text-black" />
                </div>
                <span className="font-semibold text-[13px]">LeetMentor</span>
              </div>
              
              <div className="p-4 flex-1 flex flex-col gap-4 overflow-hidden relative">
                
                {/* Scene 1-2: Problem Detection */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#141414] border border-[#232323] rounded-xl p-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                    <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Problem Detected</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white/90">Two Sum</h4>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">Easy</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/60 font-medium">Java</span>
                  </div>
                </motion.div>

                {/* Scene 2: Context Ready & Actions */}
                <AnimatePresence>
                  {scene === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="flex gap-3 items-start mb-4">
                        <div className="w-7 h-7 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex items-center justify-center shrink-0">
                          <Bot size={14} className="text-white" />
                        </div>
                        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl rounded-tl-sm p-3 text-xs leading-relaxed text-neutral-300 shadow-sm">
                          <Typewriter key="context" text="Context Ready. I already understand this problem. How would you like me to help?" speed={15} />
                        </div>
                      </div>
                      
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                        className="grid grid-cols-2 gap-2 mt-4"
                      >
                        {[
                          { icon: Sparkles, text: "Smart Hint", color: "text-amber-400" },
                          { icon: BrainCircuit, text: "Explain", color: "text-purple-400" },
                          { icon: Bug, text: "Debug", color: "text-rose-400" },
                          { icon: Zap, text: "Optimize", color: "text-blue-400" },
                          { icon: Target, text: "Complexity", color: "text-cyan-400" }
                        ].map((btn, i) => (
                          <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl border border-[#2a2a2a] bg-[#141414] text-xs font-medium ${i === 0 ? 'border-amber-500/30 bg-amber-500/5 text-amber-500' : 'text-neutral-300'}`}>
                            <btn.icon size={13} className={btn.color} />
                            {btn.text}
                          </div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scene 3: Smart Hint */}
                <AnimatePresence>
                  {scene === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 items-start mt-2"
                    >
                      <div className="w-7 h-7 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-amber-400" />
                      </div>
                      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl rounded-tl-sm p-3 text-[13px] leading-relaxed text-neutral-200 shadow-sm">
                        <Typewriter key="hint" text="Notice that every number needs a matching complement. Can you think of a data structure that gives O(1) lookup?" speed={25} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scene 4: Debug */}
                <AnimatePresence>
                  {scene === 4 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 items-start mt-2"
                    >
                      <div className="w-7 h-7 bg-rose-500/10 rounded-lg border border-rose-500/20 flex items-center justify-center shrink-0">
                        <Bug size={14} className="text-rose-400" />
                      </div>
                      <div className="bg-[#1a1a1a] border border-rose-500/20 rounded-2xl rounded-tl-sm p-3 text-[13px] leading-relaxed text-neutral-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-rose-500/0 via-rose-500 to-rose-500/0"></div>
                        <Typewriter key="debug" text="I found an issue. Your left pointer never changes inside the loop. Would you like another hint?" delay={300} speed={25} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scene 5: Complexity */}
                <AnimatePresence>
                  {scene === 5 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 items-start mt-2 w-full"
                    >
                      <div className="w-7 h-7 bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <Target size={14} className="text-cyan-400" />
                      </div>
                      <div className="bg-[#1a1a1a] border border-cyan-500/20 rounded-2xl rounded-tl-sm p-4 w-full shadow-sm">
                        <div className="text-xs text-neutral-400 font-medium mb-3">Time Complexity</div>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-1">Current</span>
                            <span className="font-mono text-rose-400 font-medium bg-rose-500/10 px-2 py-1 rounded">O(n²)</span>
                          </div>
                          <motion.div 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-neutral-600"
                          >
                            →
                          </motion.div>
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider mb-1">Suggested</span>
                            <motion.span 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1.5, type: "spring" }}
                              className="font-mono text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
                            >
                              O(n log n)
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input Mockup */}
              <div className="p-3 border-t border-[#232323] bg-[#0c0c0e]">
                <div className="w-full h-9 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center px-3 text-[11px] text-neutral-500">
                  Ask a follow up...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SCENE 7: ENDING OVERLAY */}
        <AnimatePresence>
          {scene === 7 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                  <Code2 size={28} className="text-black" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">LeetMentor</h1>
                <p className="text-neutral-400 text-lg font-light tracking-wide">Think Better. Code Faster.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
