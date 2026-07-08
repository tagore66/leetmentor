import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";

import { askAI } from "../services/aiService";
import { getMessages } from "../services/messageService";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export type Message = {
  role: "user" | "assistant";
  content: string;
  model?: string;
  mode?: string;
  attachments?: any[];
};

export default function AIWorkspace() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-chat-v3-0324");
  const [selectedMode, setSelectedMode] = useState("Mentor");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputPrompt, setInputPrompt] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const autoPromptRef = useRef(false);

  useEffect(() => {
    // Intercept contextual problem navigation
    const problem = searchParams.get("problem");
    const mode = searchParams.get("mode");
    
    if (problem && mode && !autoPromptRef.current && messages.length === 0) {
      autoPromptRef.current = true;
      setSelectedMode(mode);
      
      const prompt = `I am looking at the problem "${problem}" on LeetCode. Can you help me in "${mode}" mode?`;
      
      // Clean up URL so it doesn't trigger again on refresh
      searchParams.delete("problem");
      searchParams.delete("mode");
      setSearchParams(searchParams);
      
      // We must use a timeout to let the state settle before sending
      setTimeout(() => {
        handleSend(prompt, mode);
      }, 100);
    }
  }, [searchParams, messages.length]);

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const loadMessages = async (id: string) => {
    try {
      const res = await getMessages(id);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
  };

  useKeyboardShortcuts({
    onSearch: () => {
      if (!isSidebarOpen) setIsSidebarOpen(true);
      setTimeout(() => {
        document.getElementById('sidebar-search-input')?.focus();
      }, 100);
    },
    onNewChat: handleNewChat,
    onFocusInput: () => {
      document.getElementById('chat-input')?.focus();
    }
  });

  const handleSend = async (prompt: string, overrideMode?: string, attachments?: any[]) => {
    if (!prompt.trim() && (!attachments || attachments.length === 0)) return;
    const currentMode = overrideMode || selectedMode;

    const userMessage: Message = {
      role: "user",
      content: prompt,
      attachments,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);

      const res = await askAI(
        prompt,
        conversationId,
        selectedModel,
        currentMode,
        attachments
      );
      if (res.data.conversationId && !conversationId) {
        setConversationId(res.data.conversationId);
      }

      const aiMessage: Message = {
        role: "assistant",
        content: res.data.reply,
        model: selectedModel,
        mode: currentMode,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.log(err);
      const errorMessage: Message = {
        role: "assistant",
        content: "⚠️ **Error:** " + (err.response?.data?.message || "Failed to get AI response. Check API key or model credits."),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-neutral-800 overflow-hidden">
      <Sidebar 
        currentConversationId={conversationId} 
        onSelectConversation={setConversationId}
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col w-full">
        <Topbar 
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <ChatWindow
          messages={messages}
          loading={loading}
          selectedMode={selectedMode}
          onSuggestionClick={(prompt) => {
            setInputPrompt(prompt);
            setTimeout(() => {
              document.getElementById('chat-input')?.focus();
            }, 10);
          }}
          onSelectConversation={setConversationId}
        />

        <ChatInput
          loading={loading}
          onSend={handleSend}
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
          prompt={inputPrompt}
          setPrompt={setInputPrompt}
        />
      </div>
    </div>
  );
}