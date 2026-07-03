import { useState } from "react";
import api from "../services/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentPrompt = prompt;
    setPrompt("");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/ai/ask",
        {
          prompt: currentPrompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage: Message = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-10">

      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        AI Mentor
      </h1>

      <div className="w-full max-w-4xl">

        <div className="bg-slate-900 rounded-xl p-6 h-[500px] overflow-y-auto mb-6">

          {messages.length === 0 ? (
            <p className="text-gray-400">
              Ask me anything about DSA...
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 ${
                  message.role === "user"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] rounded-xl p-4 whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-cyan-500 text-black"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}

          {loading && (
            <p className="text-gray-400 animate-pulse">
              AI is thinking...
            </p>
          )}

        </div>

        <div className="flex gap-4">

          <input
            className="flex-1 p-4 rounded-lg bg-slate-800 outline-none"
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-cyan-500 px-6 rounded-lg font-bold"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

        </div>

      </div>

    </div>
  );
}