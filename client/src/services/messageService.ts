import api from "./api";

export const getMessages = async (
    conversationId: string
) => {

    const token = localStorage.getItem("token");

    return await api.get(
        `/messages/${conversationId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};