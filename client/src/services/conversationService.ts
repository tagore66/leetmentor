import api from "./api";

export const getConversations = async () => {
  const token = localStorage.getItem("token");

  return await api.get(
    "/conversations",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createConversation = async () => {
  const token = localStorage.getItem("token");

  return await api.post(
    "/conversations",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateConversation = async (id: string, title?: string, isPinned?: boolean) => {
  const token = localStorage.getItem("token");

  const data: any = {};
  if (title !== undefined) data.title = title;
  if (isPinned !== undefined) data.isPinned = isPinned;

  return await api.put(
    `/conversations/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteConversation = async (id: string) => {
  const token = localStorage.getItem("token");

  return await api.delete(
    `/conversations/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};