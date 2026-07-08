import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Send, Paperclip, Code, Image as ImageIcon, Mic, Cpu, X, FileText } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import PasteCodeModal from "./PasteCodeModal";

type Attachment = {
  type: "image" | "file" | "code";
  name: string;
  data: string; // base64 or text content
};

type Props = {
  loading: boolean;
  onSend: (prompt: string, overrideMode?: string, attachments?: Attachment[]) => void;
  selectedMode?: string;
  onModeChange?: (mode: string) => void;
  prompt: string;
  setPrompt: (val: string | ((prev: string) => string)) => void;
};

const MODES = ["Mentor", "Hint", "Debug", "Explain", "Complexity", "Interview", "Roadmap"];

export default function ChatInput({
  loading,
  onSend,
  selectedMode = "Mentor",
  onModeChange,
  prompt,
  setPrompt
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt, attachments.length]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setPrompt((prev: string) => prev + (prev.endsWith(' ') ? '' : ' ') + finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const send = () => {
    if (!prompt.trim() && attachments.length === 0) return;
    onSend(prompt, selectedMode, attachments);
    setPrompt("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        setAttachments(prev => [...prev, { type, name: file.name, data }]);
      };
      if (type === "image") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
    e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    items.forEach(item => {
      if (item.type.indexOf('image') === 0) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const data = event.target?.result as string;
            setAttachments(prev => [...prev, { type: "image", name: "Pasted Image", data }]);
          };
          reader.readAsDataURL(file);
        }
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image/');
      reader.onload = (event) => {
        const data = event.target?.result as string;
        setAttachments(prev => [...prev, { type: isImage ? "image" : "file", name: file.name, data }]);
      };
      if (isImage) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setPrompt("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const getPlaceholder = () => {
    if (isRecording) return "Listening...";
    switch (selectedMode) {
      case "Debug": return "Paste your broken code... (Shift+Enter for new line)";
      case "Hint": return "What problem are you stuck on? (Shift+Enter for new line)";
      case "Explain": return "What algorithm should I explain? (Shift+Enter for new line)";
      case "Complexity": return "Paste your code to analyze... (Shift+Enter for new line)";
      case "Interview": return "Ready for your mock interview? (Shift+Enter for new line)";
      case "Roadmap": return "What topic do you want to master? (Shift+Enter for new line)";
      default: return "Ask a coding question... (Shift+Enter for new line)";
    }
  };

  return (
    <>
      <div 
        className="p-4 md:p-6 bg-gradient-to-t from-black via-black/90 to-transparent sticky bottom-0 z-20 font-sans"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="max-w-4xl mx-auto relative">
          <div className={`bg-[#0a0a0a] border ${isRecording ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-neutral-800 focus-within:border-neutral-500'} rounded-2xl p-2 transition-all shadow-sm flex flex-col`}>
            
            {/* Attachments Preview Area */}
            {attachments.length > 0 && (
              <div className="flex gap-2 p-2 overflow-x-auto custom-scrollbar border-b border-neutral-800/50 mb-2">
                {attachments.map((att, idx) => (
                  <div key={idx} className="relative group shrink-0 w-16 h-16 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden">
                    {att.type === "image" ? (
                      <img src={att.data} alt={att.name} className="w-full h-full object-cover" />
                    ) : att.type === "code" ? (
                      <Code size={20} className="text-cyan-400" />
                    ) : (
                      <FileText size={20} className="text-neutral-400" />
                    )}
                    <button 
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={10} />
                    </button>
                    {att.type !== "image" && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-center text-white truncate px-1 py-0.5">
                        {att.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <textarea
              id="chat-input"
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              onPaste={handlePaste}
              className="w-full bg-transparent p-3 outline-none text-white placeholder:text-neutral-500 text-sm resize-none min-h-[44px]"
              placeholder={getPlaceholder()}
              rows={1}
              autoFocus
            />
            
            <div className="flex items-center justify-between px-2 pt-2 relative">
              <div className="flex items-center gap-0.5 md:gap-1">
                
                {/* Hidden File Inputs */}
                <input type="file" ref={fileInputRef} className="hidden" multiple accept=".txt,.js,.py,.java,.cpp,.c,.html,.css,.json,.md" onChange={(e) => handleFileChange(e, "file")} />
                <input type="file" ref={imageInputRef} className="hidden" multiple accept="image/*" onChange={(e) => handleFileChange(e, "image")} />

                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2 !px-2.5 !py-1.5" title="Attach file">
                  <Paperclip size={15} />
                  <span className="hidden sm:inline font-medium text-xs">Attach</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => imageInputRef.current?.click()} className="gap-2 !px-2.5 !py-1.5" title="Add Image">
                  <ImageIcon size={15} />
                  <span className="hidden sm:inline font-medium text-xs">Image</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsCodeModalOpen(true)} className="gap-2 !px-2.5 !py-1.5" title="Paste Code">
                  <Code size={15} />
                  <span className="hidden sm:inline font-medium text-xs">Paste Code</span>
                </Button>

                {/* Mode Selector */}
                <div className="relative">
                  <Button 
                    variant={isModeOpen ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => setIsModeOpen(!isModeOpen)} 
                    className="gap-2 !px-2.5 !py-1.5"
                    title="Select Mode"
                  >
                    <Cpu size={15} className={selectedMode !== "Mentor" ? "text-cyan-400" : ""} />
                    <span className="hidden sm:inline font-medium text-xs">{selectedMode}</span>
                  </Button>
                  <AnimatePresence>
                    {isModeOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 w-40 bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-xl overflow-hidden z-30 p-1 flex flex-col gap-0.5"
                      >
                        {MODES.map(m => (
                          <Button
                            key={m}
                            variant={selectedMode === m ? "secondary" : "ghost"}
                            size="sm"
                            fullWidth
                            onClick={() => {
                              onModeChange?.(m);
                              setIsModeOpen(false);
                            }}
                            className="!justify-start font-normal"
                          >
                            {m}
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <IconButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleRecording} 
                  className={isRecording ? 'text-red-500 hover:text-red-400 hover:bg-red-500/10 animate-pulse' : ''} 
                  title="Voice Input"
                >
                  <Mic size={15} />
                </IconButton>
              </div>
              
              <Button
                variant={loading || (!prompt.trim() && attachments.length === 0) ? "secondary" : "primary"}
                size="sm"
                disabled={loading || (!prompt.trim() && attachments.length === 0)}
                onClick={send}
                className="!px-2 !py-2 h-8 w-8 ml-2 !rounded-lg"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                ) : (
                  <Send size={15} className={(!prompt.trim() && attachments.length === 0) ? "text-neutral-500" : "text-black"} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PasteCodeModal 
        isOpen={isCodeModalOpen} 
        onClose={() => setIsCodeModalOpen(false)} 
        onSave={(code, lang) => {
          setAttachments(prev => [...prev, { type: "code", name: `Code (${lang})`, data: code }]);
        }}
      />
    </>
  );
}