const MODELS = [
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    type: "free",
    enabled: true,
    description: "Lightning fast, high quality reasoning."
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    type: "pro",
    enabled: true,
    description: "Advanced reasoning for complex algorithms."
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    type: "pro",
    enabled: true,
    description: "Industry-leading code generation."
  },
  {
    id: "google/gemini-pro-1.5",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    type: "free",
    enabled: true,
    description: "Massive context window for full-system design."
  }
];

module.exports = MODELS;
