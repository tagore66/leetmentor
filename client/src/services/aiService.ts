import api from "./api";

export const askAI = async (
  prompt: string,
  conversationId: string | null,
  model: string,
  mode: string,
  attachments?: any[]
) => {
  const token = localStorage.getItem("token");

  return await api.post(
    "/ai/ask",
    {
      prompt,
      conversationId,
      model,
      mode,
      attachments
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getModels = async () => {
  const token = localStorage.getItem("token");
  return await api.get("/ai/models", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};