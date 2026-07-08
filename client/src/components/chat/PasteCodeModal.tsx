import { useState, useRef, useEffect } from "react";
import { X, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (code: string, language: string) => void;
};

const LANGUAGES = [
  "javascript", "typescript", "python", "java", "cpp", "c", "csharp", "go", "rust", "php", "ruby", "swift", "kotlin", "sql", "html", "css", "json", "bash", "plaintext"
];

export default function PasteCodeModal({ isOpen, onClose, onSave }: Props) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!code.trim()) return;
    onSave(code, language);
    setCode("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700">
                <Code2 size={16} className="text-neutral-300" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Paste Code</h3>
                <p className="text-xs text-neutral-500">Attach a code snippet to your message</p>
              </div>
            </div>
            <IconButton variant="ghost" onClick={onClose} title="Close">
              <X size={18} />
            </IconButton>
          </div>
          
          <div className="p-4 bg-neutral-950 flex flex-col flex-1 min-h-[300px]">
            <div className="mb-3">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-neutral-900 text-neutral-300 text-xs px-3 py-1.5 rounded-md border border-neutral-800 outline-none focus:border-neutral-600 cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full flex-1 bg-transparent text-sm text-neutral-300 font-mono outline-none resize-none placeholder:text-neutral-700"
              spellCheck={false}
            />
          </div>
          
          <div className="p-4 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-900/50">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleSave}
              disabled={!code.trim()}
            >
              Attach Code
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
