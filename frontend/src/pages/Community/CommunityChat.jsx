import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
    FaPaperPlane,
    FaPaperclip,
    FaTrash,
    FaEdit,
    FaEllipsisV,
    FaFile,
    FaImage,
    FaFilePdf,
    FaFileWord,
    FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getMessages, sendMessage, deleteMessage, editMessage } from '../../services/api/chatService';

function CommunityChat() {
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [showOptions, setShowOptions] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await getMessages(50, 0);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() && !selectedFile) {
            return;
        }

        try {
            setSending(true);

            let fileUrl = null;
            let fileName = null;
            let fileType = null;
            let fileSize = null;

            // Handle file upload (simplified - in production, upload to cloud storage)
            if (selectedFile) {
                // For demo, we'll use a placeholder URL
                fileUrl = URL.createObjectURL(selectedFile);
                fileName = selectedFile.name;
                fileType = selectedFile.type;
                fileSize = selectedFile.size;
            }

            if (editingMessage) {
                // Edit existing message
                await editMessage(editingMessage._id, newMessage);
                toast.success('Message updated');
                setEditingMessage(null);
            } else {
                // Send new message
                await sendMessage({
                    content: newMessage,
                    fileUrl,
                    fileName,
                    fileType,
                    fileSize
                });
            }

            setNewMessage('');
            setSelectedFile(null);
            fetchMessages();
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleDeleteMessage = async (messageId, deleteForEveryone = false) => {
        try {
            await deleteMessage(messageId, deleteForEveryone);
            toast.success(deleteForEveryone ? 'Message deleted for everyone' : 'Message deleted for you');
            fetchMessages();
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const handleEditMessage = (message) => {
        setEditingMessage(message);
        setNewMessage(message.content);
        setShowOptions(null);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const getFileIcon = (fileType) => {
        if (fileType?.startsWith('image/')) return <FaImage className="text-blue-500" />;
        if (fileType === 'application/pdf') return <FaFilePdf className="text-red-500" />;
        if (fileType?.includes('word')) return <FaFileWord className="text-blue-600" />;
        return <FaFile className="text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6 shadow-lg">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold">Community Chat</h1>
                    <p className="text-blue-100 mt-1">Connect with students and instructors</p>
                </div>
            </div>

            {/* Chat Container */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
                    {/* Messages Area */}
                    <div className="h-full flex flex-col">
                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <AnimatePresence>
                                {messages.map((message) => {
                                    const isOwn = message.sender?._id === user?._id;
                                    const isDeleted = message.deletedForEveryone;

                                    if (isDeleted) {
                                        return (
                                            <div key={message._id} className="text-center text-gray-400 text-sm italic">
                                                This message was deleted
                                            </div>
                                        );
                                    }

                                    return (
                                        <motion.div
                                            key={message._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                                                {/* Sender Info */}
                                                {!isOwn && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                                            {message.senderName?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            {message.senderName}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${message.senderRole === 'instructor'
                                                                ? 'bg-purple-100 text-purple-600'
                                                                : message.senderRole === 'admin'
                                                                    ? 'bg-red-100 text-red-600'
                                                                    : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            {message.senderRole}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Message Bubble */}
                                                <div className="relative group">
                                                    <div className={`rounded-2xl px-4 py-3 ${isOwn
                                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {/* Message Content */}
                                                        {message.content && (
                                                            <p className="break-words">{message.content}</p>
                                                        )}

                                                        {/* File Attachment */}
                                                        {message.fileUrl && (
                                                            <div className={`mt-2 p-3 rounded-lg ${isOwn ? 'bg-white bg-opacity-20' : 'bg-white'
                                                                }`}>
                                                                <div className="flex items-center gap-3">
                                                                    {getFileIcon(message.fileType)}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-gray-800'
                                                                            }`}>
                                                                            {message.fileName}
                                                                        </p>
                                                                        <p className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'
                                                                            }`}>
                                                                            {formatFileSize(message.fileSize)}
                                                                        </p>
                                                                    </div>
                                                                    <a
                                                                        href={message.fileUrl}
                                                                        download={message.fileName}
                                                                        className={`text-sm font-semibold ${isOwn ? 'text-white' : 'text-purple-600'
                                                                            } hover:underline`}
                                                                    >
                                                                        Download
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Edited Indicator */}
                                                        {message.edited && (
                                                            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'
                                                                }`}>
                                                                (edited)
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Message Options */}
                                                    {isOwn && (
                                                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition">
                                                            <button
                                                                onClick={() => setShowOptions(showOptions === message._id ? null : message._id)}
                                                                className="p-2 rounded-full hover:bg-gray-200 transition"
                                                            >
                                                                <FaEllipsisV className="text-gray-600" />
                                                            </button>

                                                            {showOptions === message._id && (
                                                                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl py-2 z-10 min-w-[150px]">
                                                                    <button
                                                                        onClick={() => handleEditMessage(message)}
                                                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                                                                    >
                                                                        <FaEdit /> Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteMessage(message._id, false)}
                                                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                                                                    >
                                                                        <FaTrash /> Delete for me
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteMessage(message._id, true)}
                                                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                                                                    >
                                                                        <FaTrash /> Delete for everyone
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Timestamp */}
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t p-4 bg-gray-50">
                            {editingMessage && (
                                <div className="mb-2 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-blue-600">Editing message</span>
                                    <button
                                        onClick={() => {
                                            setEditingMessage(null);
                                            setNewMessage('');
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {selectedFile && (
                                <div className="mb-2 p-3 bg-white rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getFileIcon(selectedFile.type)}
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 rounded-full hover:bg-gray-200 transition"
                                    disabled={sending}
                                >
                                    <FaPaperclip className="text-gray-600 text-xl" />
                                </button>

                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                    disabled={sending}
                                />

                                <button
                                    type="submit"
                                    disabled={sending || (!newMessage.trim() && !selectedFile)}
                                    className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? (
                                        <FaSpinner className="animate-spin text-xl" />
                                    ) : (
                                        <FaPaperPlane className="text-xl" />
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityChat;
