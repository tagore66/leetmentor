import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import type { Message } from "../../pages/AIWorkspace";
import { motion } from "framer-motion";
import { Code2, Bug, BookOpen, Zap, Target, FileText, Clock, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useExtension } from "../../hooks/useExtension";
import { getConversations } from "../../services/conversationService";

type Props = {
  messages: Message[];
  loading: boolean;
  selectedMode?: string;
  onSuggestionClick?: (prompt: string) => void;
  onSelectConversation?: (id: string) => void;
};

export default function ChatWindow({ messages, loading, selectedMode, onSuggestionClick, onSelectConversation }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { isExtensionInstalled } = useExtension();
  const [recentChats, setRecentChats] = useState<any[]>([]);

  useEffect(() => {
    if (messages.length === 0) {
      getConversations().then(res => {
        setRecentChats(res.data.conversations.slice(0, 3));
      }).catch(console.error);
    }
  }, [messages.length]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center mt-12 md:mt-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-8">
                <div className="w-6 h-6 bg-black rounded-sm"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-medium text-white mb-3 tracking-tight">
                👋 Welcome back, {user?.name ? user.name.split(" ")[0] : "Developer"}
              </h1>

              <div className="flex justify-center mb-6">
                {isExtensionInstalled ? (
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-emerald-400">Extension Connected</span>
                  </div>
                ) : (
                  <a href="https://chrome.google.com/webstore/detail/leetmentor" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-neutral-500 animate-pulse"></div>
                    <span className="text-neutral-400">Extension Not Installed</span>
                    <span className="text-white ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">Install</span>
                  </a>
                )}
              </div>

              <p className="text-neutral-400 text-base md:text-lg max-w-xl mx-auto mb-10">
                {selectedMode === "Interview" ? "Ready for a mock interview? Let's begin." :
                 selectedMode === "Debug" ? "Paste your code and I'll help find bugs." :
                 selectedMode === "Study Plan" ? "Let's build your personalized learning plan." :
                 selectedMode === "Hint" ? "What problem are you stuck on?" :
                 selectedMode === "Complexity" ? "Analyze the efficiency of your solution." :
                 selectedMode === "Explain" ? "What algorithm should I explain?" :
                 "What would you like to build today?"}
              </p>

              {recentChats.length > 0 && (
                <div className="max-w-2xl mx-auto mb-10 text-left">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-2">
                    <Clock size={12} /> Recent Conversations
                  </div>
                  <div className="bg-[#0a0a0a] border border-neutral-800/50 rounded-2xl overflow-hidden divide-y divide-neutral-800/50">
                    {recentChats.map((chat: any) => {
                      const timeAgo = chat.createdAt 
                        ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.ceil((new Date(chat.createdAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 'day')
                        : 'Recently';

                      return (
                        <button
                          key={chat._id}
                          onClick={() => onSelectConversation && onSelectConversation(chat._id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                              <MessageSquare size={14} />
                            </div>
                            <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                              {chat.title}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-500 group-hover:text-neutral-400">
                            {timeAgo}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
                {(() => {
                  if (selectedMode === "Interview") {
                    return [
                      { icon: <Target size={16} />, title: "Start DSA Interview", desc: "Simulate a 45-min coding round." },
                      { icon: <BookOpen size={16} />, title: "System Design", desc: "Mock a system design interview." },
                      { icon: <FileText size={16} />, title: "Behavioral", desc: "Practice leadership principles." },
                    ];
                  }
                  if (selectedMode === "Debug") {
                    return [
                      { icon: <Bug size={16} />, title: "Debug Python", desc: "Why is my Python code failing?" },
                      { icon: <Bug size={16} />, title: "Debug C++", desc: "Help me find the segfault in C++." },
                      { icon: <Bug size={16} />, title: "Debug Java", desc: "Fix this NullPointerException." },
                    ];
                  }
                  if (selectedMode === "Hint") {
                    return [
                      { icon: <Zap size={16} />, title: "Give me a hint", desc: "I'm stuck on Two Sum." },
                      { icon: <Code2 size={16} />, title: "Explain this testcase", desc: "Why did this testcase fail?" },
                      { icon: <Target size={16} />, title: "Next step", desc: "What should I do next?" },
                    ];
                  }
                  const defaultChips = [
                    { icon: <Code2 size={16} />, title: "Explain an Algorithm", desc: "How does BFS work?" },
                    { icon: <Bug size={16} />, title: "Debug my Code", desc: "Why is it throwing NPE?" },
                    { icon: <Zap size={16} />, title: "Optimize Solution", desc: "Make it O(N) time." },
                    { icon: <BookOpen size={16} />, title: "System Design", desc: "Design a Rate Limiter." },
                    { icon: <Target size={16} />, title: "Mock Interview", desc: "Simulate a Google loop." },
                    { icon: <FileText size={16} />, title: "Study Plan", desc: "Plan for DP mastery." },
                    { icon: <Code2 size={16} />, title: "Explain this problem", desc: "I don't understand Two Sum." },
                    { icon: <Zap size={16} />, title: "Next step", desc: "What should I do next?" },
                    { icon: <Bug size={16} />, title: "Find the logic flaw", desc: "Why does my code output 0?" },
                  ];
                  return defaultChips.sort(() => 0.5 - Math.random()).slice(0, 6);
                })().map((chip, i) => (
                  <motion.div 
                    key={i}
                    onClick={() => {
                      if (onSuggestionClick) onSuggestionClick(chip.desc);
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                    className="bg-[#0a0a0a] border border-neutral-800/50 p-4 rounded-2xl text-left hover:bg-neutral-900 transition-colors cursor-pointer group flex flex-col justify-between h-full"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors">
                        {chip.icon}
                      </div>
                      <div className="font-medium text-neutral-200 text-sm">{chip.title}</div>
                    </div>
                    <div className="text-[13px] text-neutral-500 line-clamp-1">{chip.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatBubble
              key={index}
              role={message.role}
              content={message.content}
              model={message.model}
              mode={message.mode}
              onActionClick={onSuggestionClick}
            />
          ))
        )}

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-neutral-400 bg-neutral-900/50 w-fit p-3 px-5 rounded-xl border border-neutral-800"
          >
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm font-medium">Generating...</span>
          </motion.div>
        )}

        <div ref={bottomRef} />

      </div>
    </div>
  );
}