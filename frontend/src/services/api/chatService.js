import api from '../../config/api';

// Get messages with pagination
export const getMessages = async (limit = 50, skip = 0, courseId = null) => {
    let url = `/chat/messages?limit=${limit}&skip=${skip}`;
    if (courseId) {
        url += `&courseId=${courseId}`;
    }
    const response = await api.get(url);
    return response.data;
};

// Send message
export const sendMessage = async (messageData) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
};

// Delete message
export const deleteMessage = async (messageId, deleteForEveryone = false) => {
    const response = await api.delete(`/chat/messages/${messageId}`, {
        data: { deleteForEveryone }
    });
    return response.data;
};

// Mark message as read
export const markAsRead = async (messageId) => {
    const response = await api.put(`/chat/messages/${messageId}/read`);
    return response.data;
};

// Edit message
export const editMessage = async (messageId, content) => {
    const response = await api.put(`/chat/messages/${messageId}`, { content });
    return response.data;
};
