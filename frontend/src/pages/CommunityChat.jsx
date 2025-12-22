import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaSpinner, FaTrash, FaEdit, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import socketService from '../services/socketService';
import { getMessages } from '../services/api/chatService';
import DashboardLayout from '../components/DashboardLayout';

function CommunityChat() {
    const { user, token } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        connectSocket();

        return () => {
            socketService.disconnect();
        };
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await getMessages(100, 0);
            setMessages(response.data.messages || []);
        } catch (error) {
            toast.error('Failed to load messages');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const connectSocket = () => {
        socketService.connect(token);

        socketService.onNewMessage((message) => {
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        });

        socketService.onMessageDeleted(({ messageId, deleteForEveryone }) => {
            if (deleteForEveryone) {
                setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
            }
        });

        socketService.onMessageEdited((editedMessage) => {
            setMessages((prev) =>
                prev.map((msg) => (msg._id === editedMessage._id ? editedMessage : msg))
            );
        });

        socketService.onUserJoined((data) => {
            setOnlineUsers((prev) => [...prev, data]);
            toast.info(`${data.userName} joined the chat`);
        });

        socketService.onUserLeft((data) => {
            setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        });

        socketService.onUserTyping((data) => {
            setTypingUsers((prev) => {
                if (!prev.find((u) => u.userId === data.userId)) {
                    return [...prev, data];
                }
                return prev;
            });
        });

        socketService.onUserStoppedTyping((data) => {
            setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        if (editingMessage) {
            socketService.editMessage(editingMessage._id, newMessage.trim());
            setEditingMessage(null);
        } else {
            socketService.sendMessage(newMessage.trim());
        }

        setNewMessage('');
        socketService.stopTyping();
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socketService.startTyping();

        typingTimeoutRef.current = setTimeout(() => {
            socketService.stopTyping();
        }, 1000);
    };

    const handleDeleteMessage = (messageId, isOwn) => {
        if (window.confirm('Delete this message?')) {
            socketService.deleteMessage(messageId, isOwn);
        }
    };

    const handleEditMessage = (message) => {
        setEditingMessage(message);
        setNewMessage(message.content);
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setNewMessage('');
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isOwnMessage = (message) => {
        return message.sender?._id === user._id || message.sender === user._id;
    };

    if (loading) {
        return (
            <DashboardLayout role={user.role}>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading chat...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role={user.role}>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    💬 Community Chat
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Connect with students and instructors
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaUsers className="text-green-500" />
                                <span>{onlineUsers.length + 1} online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
                        {/* Messages Area */}
                        <div className="h-full flex flex-col">
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <AnimatePresence>
                                    {messages.map((message, index) => {
                                        const isOwn = isOwnMessage(message);
                                        const showAvatar = index === 0 || messages[index - 1]?.sender?._id !== message.sender?._id;

                                        return (
                                            <motion.div
                                                key={message._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}
                                            >
                                                {!isOwn && showAvatar && (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                        {message.senderName?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                {!isOwn && !showAvatar && <div className="w-8" />}

                                                <div className={`max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                                                    {showAvatar && (
                                                        <div className="flex items-center gap-2 mb-1 px-1">
                                                            <span className="text-xs font-semibold text-gray-700">
                                                                {message.senderName}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${message.senderRole === 'instructor'
                                                                    ? 'bg-purple-100 text-purple-600'
                                                                    : 'bg-blue-100 text-blue-600'
                                                                }`}>
                                                                {message.senderRole}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="group relative">
                                                        <div className={`rounded-2xl px-4 py-2 ${isOwn
                                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                                                : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            <p className="text-sm break-words">{message.content}</p>
                                                            {message.edited && (
                                                                <span className="text-xs opacity-70 italic">
                                                                    (edited)
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-1 mt-1 px-1">
                                                            <span className="text-xs text-gray-500">
                                                                {formatTime(message.createdAt || message.timestamp)}
                                                            </span>

                                                            {isOwn && (
                                                                <div className="opacity-0 group-hover:opacity-100 transition flex gap-1 ml-2">
                                                                    <button
                                                                        onClick={() => handleEditMessage(message)}
                                                                        className="text-xs text-blue-600 hover:text-blue-700"
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteMessage(message._id, true)}
                                                                        className="text-xs text-red-600 hover:text-red-700"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {/* Typing Indicator */}
                                {typingUsers.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2 text-sm text-gray-500 italic"
                                    >
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span>
                                            {typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                                        </span>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="border-t bg-gray-50 p-4">
                                {editingMessage && (
                                    <div className="mb-2 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                                        <span className="text-sm text-blue-700">
                                            <FaEdit className="inline mr-2" />
                                            Editing message
                                        </span>
                                        <button
                                            onClick={cancelEdit}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={handleTyping}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || sending}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                                    >
                                        {sending ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                {editingMessage ? 'Update' : 'Send'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default CommunityChat;
