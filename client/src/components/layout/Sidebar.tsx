import { useEffect, useState, useRef } from "react";
import { getConversations, deleteConversation, updateConversation } from "../../services/conversationService";
import { Search, Plus, MessageSquare, Trash2, Edit2, Pin, PinOff, PanelLeftClose, User, LogOut, ChevronUp, Check, X, CreditCard, Keyboard, Palette, Puzzle, BarChart2 } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Conversation = {
  _id: string;
  title: string;
  isPinned?: boolean;
  createdAt?: string;
};

type SidebarProps = {
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  isOpen?: boolean;
  toggleSidebar?: () => void;
};

export default function Sidebar({ currentConversationId, onSelectConversation, onNewChat, isOpen = true, toggleSidebar }: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, [currentConversationId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadConversations = async () => {
    try {
      const res = await getConversations();
      setConversations(res.data.conversations);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (currentConversationId === id) {
        onNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await updateConversation(id, editTitle);
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, title: editTitle } : c))
      );
      setEditingId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTogglePin = async (e: React.MouseEvent, id: string, currentPinned: boolean) => {
    e.stopPropagation();
    try {
      await updateConversation(id, undefined, !currentPinned);
      setConversations((prev) => {
        const updated = prev.map((c) => (c._id === id ? { ...c, isPinned: !currentPinned } : c));
        // Sort conversations: pinned first, then by whatever order they had
        return updated.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return 0;
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const groupConversations = () => {
    const pinned = conversations.filter(c => c.isPinned && c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const unpinned = conversations.filter(c => !c.isPinned && c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const groups: { [key: string]: Conversation[] } = {
      "Today": [],
      "Yesterday": [],
      "Previous 7 Days": [],
      "Older": []
    };
    
    unpinned.forEach(c => {
      if (!c.createdAt) {
        groups["Older"].push(c);
        return;
      }
      const d = new Date(c.createdAt);
      if (d >= today) groups["Today"].push(c);
      else if (d >= yesterday) groups["Yesterday"].push(c);
      else if (d >= lastWeek) groups["Previous 7 Days"].push(c);
      else groups["Older"].push(c);
    });
    
    return { pinned, groups };
  };

  const { pinned, groups } = groupConversations();

  const renderChat = (chat: Conversation) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      key={chat._id}
      onClick={() => onSelectConversation(chat._id)}
      className={`group p-2.5 rounded-xl cursor-pointer flex justify-between items-center transition-all duration-200 border border-transparent ${
        currentConversationId === chat._id
          ? "bg-neutral-900 border-neutral-800 shadow-sm"
          : "hover:bg-neutral-900/50 hover:border-neutral-800/50"
      }`}
    >
      {editingId === chat._id ? (
        <div className="flex items-center w-full gap-2" onClick={(e) => e.stopPropagation()}>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-sm flex-1"
            autoFocus
          />
          <div className="flex items-center gap-1">
            <IconButton variant="ghost" size="sm" onClick={(e) => handleSaveEdit(e, chat._id)}>
              <Check size={16} />
            </IconButton>
            <IconButton variant="ghost" size="sm" onClick={handleCancelEdit}>
              <X size={16} />
            </IconButton>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 overflow-hidden">
            {chat.isPinned ? (
              <Pin size={16} className="text-neutral-300 fill-neutral-300" />
            ) : (
              <MessageSquare size={16} className={currentConversationId === chat._id ? "text-white" : "text-neutral-600"} />
            )}
            <span className={`truncate text-sm font-medium ${currentConversationId === chat._id ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"}`}>
              {chat.title}
            </span>
          </div>
          <div className="hidden group-hover:flex items-center gap-1.5 text-neutral-400 pl-2">
            <IconButton
              variant="ghost" size="sm"
              onClick={(e) => handleTogglePin(e, chat._id, !!chat.isPinned)}
              title={chat.isPinned ? "Unpin chat" : "Pin chat"}
            >
              {chat.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
            </IconButton>
            <IconButton
              variant="ghost" size="sm"
              onClick={(e) => handleEdit(e, chat._id, chat.title)}
            >
              <Edit2 size={14} />
            </IconButton>
            <IconButton
              variant="ghost" size="sm"
              onClick={(e) => handleDelete(e, chat._id)}
              className="hover:text-rose-400"
            >
              <Trash2 size={14} />
            </IconButton>
          </div>
        </>
      )}
    </motion.div>
  );

  return (
    <motion.div 
      initial={false}
      animate={{ width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 }}
      className="bg-[#050505] border-r border-neutral-900 flex flex-col shadow-2xl relative z-10 text-white font-sans overflow-hidden whitespace-nowrap"
    >
      <div className="p-6 pb-4 w-80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-black rounded-sm"></div>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">LeetMentor</h1>
          </div>
          {toggleSidebar && (
            <IconButton variant="ghost" size="sm" onClick={toggleSidebar} title="Close sidebar">
              <PanelLeftClose size={18} />
            </IconButton>
          )}
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={onNewChat}
          className="gap-2 mt-2"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
          <Input
            id="sidebar-search-input"
            fullWidth
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#0a0a0a]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6 mt-2 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        <AnimatePresence>
          {pinned.length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-2 pb-1">Pinned</div>
              {pinned.map(chat => renderChat(chat))}
            </div>
          )}
          
          {Object.entries(groups).map(([label, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={label} className="space-y-1">
                <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-2 pb-1">{label}</div>
                {items.map(chat => renderChat(chat))}
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer / User Area */}
      <div className="w-80 p-3 border-t border-neutral-900 mt-auto bg-[#050505] relative" ref={profileMenuRef}>
        <AnimatePresence>
          {isProfileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-3 right-3 mb-2 bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
            >
              <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Account</div>
              <button onClick={() => navigate('/account#general')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors">
                <User size={16} /><span>Profile</span>
              </button>
              <button onClick={() => navigate('/account#billing')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors">
                <CreditCard size={16} /><span>Billing</span>
              </button>
              <button onClick={() => navigate('/account#general')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors">
                <BarChart2 size={16} /><span>Usage</span>
              </button>
              <div className="h-px bg-neutral-800 my-1"></div>
              <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">App Settings</div>
              <button onClick={() => navigate('/account#ai-preferences')} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors">
                <div className="flex items-center gap-3"><Keyboard size={16} /><span>Keyboard Shortcuts</span></div>
                <div className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 border border-neutral-700">Ctrl+K</div>
              </button>
              <button onClick={() => navigate('/account#appearance')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors">
                <Palette size={16} /><span>Appearance</span>
              </button>
              <button onClick={() => navigate('/account#extension')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors">
                <Puzzle size={16} /><span>Extension Settings</span>
              </button>
              <div className="h-px bg-neutral-800 my-1"></div>
              <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                <LogOut size={16} /><span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-inner">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-white group-hover:text-white">{user?.name || 'User'}</div>
            <div className="text-xs text-neutral-500">Free Plan</div>
          </div>
          <ChevronUp size={16} className={`text-neutral-500 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}