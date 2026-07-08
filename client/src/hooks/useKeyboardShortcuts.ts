import { useEffect } from "react";

type ShortcutActions = {
  onSearch: () => void;
  onNewChat: () => void;
  onFocusInput: () => void;
};

export function useKeyboardShortcuts({ onSearch, onNewChat, onFocusInput }: ShortcutActions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onSearch();
      }
      
      // Ctrl/Cmd + N for New Chat
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onNewChat();
      }

      // Ctrl/Cmd + Shift + L for Focus Input
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        onFocusInput();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearch, onNewChat, onFocusInput]);
}
