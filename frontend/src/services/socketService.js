import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io('http://localhost:1000', {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to Socket.IO server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message);
        });

        this.socket.on('disconnect', () => {
            console.log('🔌 Disconnected from Socket.IO server');
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Join course room
    joinCourse(courseId) {
        if (!this.socket) return;
        this.socket.emit('join_course', courseId);
    }

    // Send message
    sendMessage(content, courseId, fileData = null) {
        if (!this.socket) return;

        this.socket.emit('send_message', {
            content,
            courseId,
            fileUrl: fileData?.fileUrl,
            fileName: fileData?.fileName,
            fileType: fileData?.fileType,
            fileSize: fileData?.fileSize
        });
    }

    // Delete message
    deleteMessage(messageId, courseId, deleteForEveryone = false) {
        if (!this.socket) return;

        this.socket.emit('delete_message', {
            messageId,
            courseId,
            deleteForEveryone
        });
    }

    // Edit message
    editMessage(messageId, courseId, content) {
        if (!this.socket) return;

        this.socket.emit('edit_message', {
            messageId,
            courseId,
            content
        });
    }

    // Typing indicators
    startTyping(courseId) {
        if (!this.socket) return;
        this.socket.emit('typing_start', { courseId });
    }

    stopTyping(courseId) {
        if (!this.socket) return;
        this.socket.emit('typing_stop', { courseId });
    }

    // Event listeners
    onNewMessage(callback) {
        if (!this.socket) return;
        this.socket.on('new_message', callback);
    }

    onMessageDeleted(callback) {
        if (!this.socket) return;
        this.socket.on('message_deleted', callback);
    }

    onMessageEdited(callback) {
        if (!this.socket) return;
        this.socket.on('message_edited', callback);
    }

    onUserJoined(callback) {
        if (!this.socket) return;
        this.socket.on('user_joined', callback);
    }

    onUserLeft(callback) {
        if (!this.socket) return;
        this.socket.on('user_left', callback);
    }

    onUserTyping(callback) {
        if (!this.socket) return;
        this.socket.on('user_typing', callback);
    }

    onUserStoppedTyping(callback) {
        if (!this.socket) return;
        this.socket.on('user_stopped_typing', callback);
    }

    // Remove listeners
    removeAllListeners() {
        if (!this.socket) return;
        this.socket.removeAllListeners();
    }
}

export default new SocketService();
