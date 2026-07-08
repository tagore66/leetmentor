import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Terminal, Code2, Bot, Layers, ArrowRight, CheckCircle2, 
  MonitorSmartphone, Plus, Sparkles, BrainCircuit
} from "lucide-react";
import InteractiveDemo from "../components/home/InteractiveDemo";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Check if the extension injected the installed flag
    const checkInstall = () => {
      if (document.documentElement.getAttribute('data-leetmentor-installed') === 'true') {
        setIsExtensionInstalled(true);
      }
    };
    
    // Check immediately and also listen for changes just in case it loads slightly after
    checkInstall();
    
    const observer = new MutationObserver(checkInstall);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-leetmentor-installed'] });
    
    return () => observer.disconnect();
  }, []);

  const faqs = [
    { q: "Does this write the code for me?", a: "No. LeetMentor is designed to teach you how to think, not spoon-feed you answers. It acts as a Socratic mentor, guiding you towards the solution with hints, complexity analysis, and edge cases." },
    { q: "Which platforms are supported?", a: "Currently, the Chrome Extension supports LeetCode and HackerRank, with Codeforces and CodeChef coming soon. The Web Workspace can be used independently for any problem." },
    { q: "Do I need a premium API key?", a: "The Free tier gives you basic access. Pro gives you access to premium models like GPT-4o, Claude 3.5 Sonnet, and DeepSeek V3 natively without needing your own API keys." },
    { q: "Will this get me banned on LeetCode?", a: "LeetMentor runs entirely locally in your browser and does not interfere with LeetCode's contest servers. However, we recommend avoiding its use during live rated contests." }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans selection:bg-neutral-800">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 bg-[#09090B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-[10px] flex items-center justify-center shadow-sm">
              <Code2 size={18} strokeWidth={2.5} className="text-black" />
            </div>
            <span className="font-bold text-[17px] tracking-tight">LeetMentor</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm text-neutral-400 hover:text-white transition-colors font-medium">Log in</Link>
            <Link to="/register" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ffffff08] via-transparent to-transparent -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-300 mb-8 uppercase tracking-widest">
              <Sparkles size={12} className="text-[#38BDF8]" />
              Meet your new AI teammate
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              The AI Copilot for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-500">Coding Interviews.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Stop context switching. Get instant Socratic hints, live debugging, and complexity analysis directly inside your favorite coding platforms.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isExtensionInstalled && user ? (
                <a 
                  href="https://chrome.google.com/webstore/detail/leetmentor" 
                  target="_blank" rel="noreferrer"
                  className="w-full sm:w-auto bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-8 py-3.5 rounded-full font-medium hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle2 size={18} />
                  Extension Installed
                </a>
              ) : (
                <a 
                  href="https://chrome.google.com/webstore/detail/leetmentor" 
                  target="_blank" rel="noreferrer"
                  className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
                >
                  Install Chrome Extension
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              )}
              <Link to="/login" className="w-full sm:w-auto bg-[#111111] text-white border border-[#232323] px-8 py-3.5 rounded-full font-medium hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                Open Workspace
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Large Product Preview */}
      <div className="max-w-[1200px] mx-auto px-6 pb-32">
        <InteractiveDemo />
      </div>

      {/* How It Works */}
      <div className="py-24 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-neutral-400 text-lg">Your seamless workflow to interview mastery.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Open LeetCode", desc: "Just navigate to any problem. No manual copying or pasting required." },
              { num: "02", title: "Instant Detection", desc: "LeetMentor instantly reads the context, problem description, and your current code." },
              { num: "03", title: "Ask for Guidance", desc: "Request a Socratic hint, debug help, or complexity analysis without seeing the spoiler." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="text-5xl font-black text-white/5 mb-6">{step.num}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Products Section */}
      <div className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">One Brain. Two Experiences.</h2>
            <p className="text-neutral-400 text-lg">Everything you need to master Data Structures & System Design.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#111111] border border-[#232323] rounded-3xl p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <MonitorSmartphone size={160} />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                <Bot size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Chrome Extension</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed text-lg">
                Works directly on LeetCode. Get contextual hints, code reviews, and testcase explanations without leaving the tab.
              </p>
              <ul className="space-y-4">
                {["In-tab Context Detection", "Progressive Socratic Hints", "Instant Code Debugging", "Complexity Analysis"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-neutral-300 font-medium">
                    <CheckCircle2 size={16} className="text-[#38BDF8]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#111111] border border-[#232323] rounded-3xl p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Terminal size={160} />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                <Layers size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Web Workspace</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed text-lg">
                A premium, distraction-free environment for deep learning, algorithmic problem solving, and complexity analysis.
              </p>
              <ul className="space-y-4">
                {["Socratic Mentoring", "Complexity Analysis", "Saved Conversation History", "Shared Account & Settings"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-neutral-300 font-medium">
                    <CheckCircle2 size={16} className="text-[#38BDF8]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Models */}
      <div className="py-24 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-10">Powered by Elite Intelligence</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-80">
            {["DeepSeek V3", "GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "Llama 3.1"].map((model, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#232323] rounded-full">
                <BrainCircuit size={16} className="text-white/40" />
                <span className="font-semibold text-sm tracking-tight text-white/80">{model}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Platforms */}
      <div className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-10">Works seamlessly with</h3>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Using text representations as placeholders for SVGs */}
             <span className="text-2xl font-black tracking-tighter">LeetCode</span>
             <span className="text-xl font-bold font-mono">HackerRank</span>
             <span className="text-2xl font-bold text-red-500">Codeforces</span>
             <span className="text-2xl font-serif font-bold italic">CodeChef</span>
             <span className="text-2xl font-bold tracking-tight">AtCoder</span>
          </div>
        </div>
      </div>



      {/* FAQ */}
      <div className="py-24 bg-[#09090B]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#111111] border border-[#232323] rounded-2xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between font-medium text-white/90 focus:outline-none"
                >
                  {faq.q}
                  <Plus size={18} className={`text-white/40 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="text-neutral-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-32 relative overflow-hidden bg-black border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent -z-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to ace your next interview?</h2>
          <p className="text-neutral-400 mb-10 text-lg">Join thousands of developers upgrading their interview preparation with AI.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             {isExtensionInstalled ? (
                <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-8 py-4 rounded-full font-medium flex items-center gap-2 cursor-default">
                  <CheckCircle2 size={18} />
                  Extension Installed
                </div>
              ) : (
                <a 
                  href="https://chrome.google.com/webstore/detail/leetmentor" 
                  target="_blank" rel="noreferrer"
                  className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-neutral-200 transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-2"
                >
                  Install Chrome Extension
                  <ArrowRight size={18} />
                </a>
              )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-[#111111] text-center bg-[#09090B]">
        <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} LeetMentor. The AI Copilot for Coding Interviews.</p>
      </footer>
    </div>
  );
}