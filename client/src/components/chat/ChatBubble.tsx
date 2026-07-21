import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, User, Sparkles, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { IconButton } from "../ui/IconButton";
import { Button } from "../ui/Button";
import api from "../../services/api";

type Props = {
  role: "user" | "assistant";
  content: string;
  model?: string;
  mode?: string;
  attachments?: any[];
  onActionClick?: (action: string) => void;
};

export default function ChatBubble({
  role,
  content,
  model,
  mode,
  attachments,
  onActionClick
}: Props) {
  const user = role === "user";
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveNote = async () => {
    if (saved || isSaving) return;
    setIsSaving(true);
    try {
      await api.post("/notes", {
        title: content.substring(0, 40) + "...",
        content: content,
        type: "note",
        tags: ["AI Saved"]
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save note", err);
    } finally {
      setIsSaving(false);
    }
  };

  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (!inline && match) {
      return (
        <div className="relative group my-4 rounded-xl overflow-hidden border border-neutral-800">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <IconButton
              variant="default"
              size="sm"
              onClick={handleCopy}
              className="bg-neutral-800"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </IconButton>
          </div>
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              showLineNumbers={true}
              className="!m-0 text-[13px] !bg-[#050505] !p-4"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }
    return (
      <code className={`${className} bg-neutral-800 px-1.5 py-0.5 rounded-md text-[13px] font-mono text-neutral-200 border border-neutral-700`} {...props}>
        {children}
      </code>
    );
  };

  const Blockquote = ({ children }: any) => (
    <blockquote className="border-l-2 border-emerald-500 bg-emerald-500/10 text-emerald-100 px-4 py-3 rounded-r-lg my-4 italic text-sm">
      {children}
    </blockquote>
  );

  const Heading = ({ level, children }: any) => {
    const styles = {
      1: "text-2xl font-semibold mb-4 mt-6 text-white border-b border-neutral-800 pb-2",
      2: "text-xl font-medium mb-3 mt-5 text-white",
      3: "text-lg font-medium mb-2 mt-4 text-neutral-200",
      4: "text-base font-medium mb-2 mt-4 text-neutral-300",
      5: "text-sm font-medium mb-1 mt-3 text-neutral-400",
      6: "text-xs font-medium mb-1 mt-2 text-neutral-500 uppercase tracking-wider"
    }[level as 1|2|3|4|5|6];
    
    if (level === 1) return <h1 className={styles}>{children}</h1>;
    if (level === 2) return <h2 className={styles}>{children}</h2>;
    if (level === 3) return <h3 className={styles}>{children}</h3>;
    if (level === 4) return <h4 className={styles}>{children}</h4>;
    if (level === 5) return <h5 className={styles}>{children}</h5>;
    return <h6 className={styles}>{children}</h6>;
  };

  // Parse follow-up actions from content
  const extractActions = (text: string) => {
    const actions: string[] = [];
    let cleanText = text;
    
    if (!user) {
      // Match lines exactly like [ Action Name ] or [Action Name]
      const regex = /^\[(.*?)\]\s*$/gm;
      let match;
      while ((match = regex.exec(text)) !== null) {
        actions.push(match[1].trim());
      }
      cleanText = text.replace(/^\[(.*?)\]\s*$/gm, "").trim();
    }
    
    return { cleanText, actions };
  };

  const { cleanText, actions } = extractActions(content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-8 flex gap-4 ${
        user
          ? "justify-end"
          : "justify-start"
      } group/bubble relative`}
    >
      {!user && (
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
          <Sparkles size={16} className="text-black" />
        </div>
      )}

      <div
        className={`max-w-[90%] md:max-w-[85%] leading-relaxed font-sans relative ${
          user
            ? "bg-neutral-900 text-white rounded-2xl rounded-tr-sm border border-neutral-800 shadow-sm p-4 md:p-5"
            : "bg-transparent text-neutral-200 py-1"
        }`}
      >
        {user && attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-neutral-800 rounded-lg p-2 border border-neutral-700">
                {att.type === "image" ? (
                  <img src={att.data} alt={att.name} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="text-xs font-medium text-neutral-300 truncate max-w-[150px]">
                    📎 {att.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none text-[15px]">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{ 
              code: CodeBlock,
              blockquote: Blockquote,
              h1: Heading,
              h2: Heading,
              h3: Heading
            }}
          >
            {cleanText}
          </ReactMarkdown>
        </div>

        {!user && (model || mode) && (
          <div className="mt-4 flex items-center gap-1.5 opacity-60">
            <div className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wide">
              {model?.includes("deepseek") ? "DeepSeek V3" 
                : model?.includes("gemini") ? "Gemini 1.5" 
                : model?.includes("gpt") ? "GPT-4o" 
                : model?.includes("claude") ? "Claude 3.5" 
                : model?.includes("llama") ? "Llama 3" 
                : model || "AI Mentor"}
            </div>
            {mode && (
              <>
                <span className="text-[10px] text-neutral-500">•</span>
                <div className="text-[11px] font-medium text-emerald-400">
                  {mode} Mode
                </div>
              </>
            )}
          </div>
        )}

        {actions.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {actions.map((action, i) => (
              <Button
                key={i}
                variant="secondary"
                size="sm"
                onClick={() => onActionClick?.(action)}
                className="!rounded-full"
              >
                {action}
              </Button>
            ))}
          </div>
        )}

        {!user && (
          <div className="mt-2 flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(content);
              }}
              title="Copy"
            >
              <Copy size={14} />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleSaveNote}
              disabled={isSaving || saved}
              className={saved ? "!text-emerald-400" : ""}
              title={saved ? "Saved" : "Save Note"}
            >
              {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            </IconButton>

          </div>
        )}
      </div>

      {user && (
        <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-1 shadow-sm">
          <User size={16} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}