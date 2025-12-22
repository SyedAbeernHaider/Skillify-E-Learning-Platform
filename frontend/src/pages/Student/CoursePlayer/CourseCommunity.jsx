import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaComments, FaPaperPlane, FaSpinner, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CoursePlayerLayout from '../../../components/CoursePlayerLayout';
import socketService from '../../../services/socketService';
import { getMessages } from '../../../services/api/chatService';

function CourseCommunity() {
    const { courseId } = useParams();
    const { user, token } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typingUsers, setTypingUsers] = useState([]);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        // Fetch initial messages
        fetchHistory();

        // Connect socket
        socketService.connect(token);

        // Join this course room
        socketService.joinCourse(courseId);

        // Setup listeners
        setupSocketListeners();

        return () => {
            socketService.removeAllListeners();
        };
    }, [courseId, token]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await getMessages(50, 0, courseId);
            if (response.success) {
                setMessages(response.data.messages || []);
                scrollToBottom();
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load chat history');
        } finally {
            setLoading(false);
        }
    };

    const setupSocketListeners = () => {
        socketService.onNewMessage((message) => {
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        });

        socketService.onUserJoined((user) => {
            setOnlineUsers((prev) => {
                if (!prev.find(u => u.userId === user.userId)) {
                    return [...prev, user];
                }
                return prev;
            });
            toast.info(`${user.userName} joined the chat`);
        });

        socketService.onUserLeft((user) => {
            setOnlineUsers((prev) => prev.filter(u => u.userId !== user.userId));
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
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        socketService.sendMessage(newMessage.trim(), courseId);
        setNewMessage('');
        socketService.stopTyping(courseId);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socketService.startTyping(courseId);

        typingTimeoutRef.current = setTimeout(() => {
            socketService.stopTyping(courseId);
        }, 1000);
    };

    return (
        <CoursePlayerLayout>
            <div className="course-community">
                <h1 className="page-title">💬 Course Community Chat</h1>

                <div className="community-container">
                    {/* Participants Sidebar */}
                    <div className="participants-sidebar">
                        <h3>Online Participants ({onlineUsers.length})</h3>
                        <div className="participants-list">
                            {/* Always show self */}
                            <div className="participant-item">
                                <div className="participant-avatar">
                                    {user?.firstName?.[0]}
                                </div>
                                <div className="participant-info">
                                    <p className="participant-name">{user?.firstName} {user?.lastName} (You)</p>
                                    <span className="participant-status online">
                                        🟢 Online
                                    </span>
                                </div>
                                <span className={`instructor-badge ${user?.role === 'instructor' ? '' : 'student-badge'}`}>
                                    {user?.role === 'instructor' ? 'Instructor' : 'Student'}
                                </span>
                            </div>

                            {onlineUsers.map((participant) => (
                                participant.userId !== user?._id && (
                                    <div key={participant.userId} className="participant-item">
                                        <div className="participant-avatar">
                                            {participant.userName[0]}
                                        </div>
                                        <div className="participant-info">
                                            <p className="participant-name">{participant.userName}</p>
                                            <span className="participant-status online">
                                                🟢 Online
                                            </span>
                                        </div>
                                        {participant.userRole === 'instructor' && (
                                            <span className="instructor-badge">Instructor</span>
                                        )}
                                    </div>
                                )
                            ))}

                            {onlineUsers.length === 0 && (
                                <p className="text-gray-500 text-sm mt-2">Waiting for others to join...</p>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="chat-area">
                        <div className="messages-container">
                            {loading && (
                                <div className="flex justify-center items-center h-full">
                                    <FaSpinner className="animate-spin text-4xl text-purple-600" />
                                </div>
                            )}

                            {!loading && messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    <FaComments className="text-4xl mx-auto mb-2 opacity-50" />
                                    <p>No messages yet. Be the first to say hello!</p>
                                </div>
                            )}

                            {messages.map((msg) => {
                                const isOwn = msg.sender?._id === user?._id || msg.sender === user?._id;
                                const senderName = msg.senderName || (msg.sender?.firstName ? `${msg.sender.firstName} ${msg.sender.lastName}` : 'User');

                                return (
                                    <div
                                        key={msg._id || msg.id}
                                        className={`message ${isOwn ? 'own-message' : ''}`}
                                    >
                                        <div className="message-avatar">
                                            {senderName[0]}
                                        </div>
                                        <div className="message-content">
                                            <div className="message-header">
                                                <span className="message-sender">{senderName}</span>
                                                {msg.senderRole === 'instructor' && (
                                                    <span className="instructor-tag">Instructor</span>
                                                )}
                                                <span className="message-time">
                                                    {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="message-text">{msg.content}</p>
                                        </div>
                                    </div>
                                )
                            })}
                            {/* Typing Indicator */}
                            {typingUsers.length > 0 && (
                                <div className="text-sm text-gray-500 italic ml-4 mb-2">
                                    {typingUsers.map(u => u.userName).join(', ')} is typing...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="message-input-container">
                            <textarea
                                value={newMessage}
                                onChange={handleTyping}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message... (Press Enter to send)"
                                rows="3"
                            />
                            <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                <FaPaperPlane /> Send
                            </button>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .course-community {
                        max-width: 1400px;
                        margin: 0 auto;
                    }

                    .page-title {
                        font-size: 2rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 2rem;
                    }

                    .community-container {
                        display: grid;
                        grid-template-columns: 300px 1fr;
                        gap: 2rem;
                        height: calc(100vh - 200px);
                    }

                    .participants-sidebar {
                        background: white;
                        border-radius: 12px;
                        padding: 1.5rem;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        overflow-y: auto;
                    }

                    .participants-sidebar h3 {
                        font-size: 1.125rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 1rem 0;
                    }

                    .participants-list {
                        display: flex;
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .participant-item {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.75rem;
                        background: #f9fafb;
                        border-radius: 8px;
                    }

                    .participant-avatar {
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: 700;
                        flex-shrink: 0;
                    }

                    .participant-info {
                        flex: 1;
                    }

                    .participant-name {
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0 0 0.25rem 0;
                        font-size: 0.875rem;
                    }

                    .participant-status {
                        font-size: 0.75rem;
                    }

                    .participant-status.online {
                        color: #10b981;
                    }

                    .participant-status.offline {
                        color: #6b7280;
                    }

                    .instructor-badge, .instructor-tag {
                        background: #667eea;
                        color: white;
                        padding: 0.25rem 0.5rem;
                        border-radius: 4px;
                        font-size: 0.75rem;
                        font-weight: 600;
                    }
                    
                    .student-badge {
                        background: #3b82f6; 
                    }

                    .chat-area {
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        display: flex;
                        flex-direction: column;
                    }

                    .messages-container {
                        flex: 1;
                        padding: 1.5rem;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .message {
                        display: flex;
                        gap: 0.75rem;
                    }

                    .message.own-message {
                        flex-direction: row-reverse;
                    }

                    .message.own-message .message-content {
                        background: #ede9fe;
                    }

                    .message-avatar {
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: 700;
                        flex-shrink: 0;
                    }

                    .message-content {
                        background: #f9fafb;
                        padding: 1rem;
                        border-radius: 12px;
                        max-width: 70%;
                    }

                    .message-header {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        margin-bottom: 0.5rem;
                    }

                    .message-sender {
                        font-weight: 600;
                        color: #1f2937;
                        font-size: 0.875rem;
                    }

                    .message-time {
                        font-size: 0.75rem;
                        color: #6b7280;
                        margin-left: auto;
                    }

                    .message-text {
                        color: #374151;
                        margin: 0;
                        line-height: 1.5;
                    }

                    .message-input-container {
                        padding: 1.5rem;
                        border-top: 1px solid #e5e7eb;
                        display: flex;
                        gap: 1rem;
                    }

                    .message-input-container textarea {
                        flex: 1;
                        padding: 0.75rem;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        resize: none;
                        font-family: inherit;
                        font-size: 0.875rem;
                    }

                    .message-input-container textarea:focus {
                        outline: none;
                        border-color: #667eea;
                    }

                    .message-input-container button {
                        padding: 0.75rem 1.5rem;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        transition: transform 0.2s;
                    }

                    .message-input-container button:hover:not(:disabled) {
                        transform: translateY(-2px);
                    }

                    .message-input-container button:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }

                    @media (max-width: 1024px) {
                        .community-container {
                            grid-template-columns: 1fr;
                        }

                        .participants-sidebar {
                            max-height: 200px;
                        }
                    }
                `}</style>
            </div>
        </CoursePlayerLayout>
    );
}

export default CourseCommunity;
