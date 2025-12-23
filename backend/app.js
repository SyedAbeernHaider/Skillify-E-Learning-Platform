require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const Message = require('./models/Message');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/authRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 1000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// Serve static files from uploads directory
app.use('/uploads', express.static('public/uploads'));

// Socket.IO Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.user.firstName} ${socket.user.lastName} (${socket.user.role})`);

  // Handle joining a specific course room
  socket.on('join_course', (courseId) => {
    const roomName = `course_${courseId}`;
    socket.join(roomName);
    console.log(`👥 User ${socket.user.firstName} joined room: ${roomName}`);

    // Broadcast user joined to that specific course
    socket.to(roomName).emit('user_joined', {
      userId: socket.user._id,
      userName: `${socket.user.firstName} ${socket.user.lastName}`,
      userRole: socket.user.role,
    });
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      const { courseId, content, fileUrl, fileName, fileType, fileSize } = data;

      if (!courseId) {
        return socket.emit('message_error', { message: 'Course ID is required' });
      }

      // Create message in database
      const message = await Message.create({
        courseId,
        sender: socket.user._id,
        senderName: `${socket.user.firstName} ${socket.user.lastName}`,
        senderRole: socket.user.role,
        content,
        fileUrl,
        fileName,
        fileType,
        fileSize,
      });

      await message.populate('sender', 'firstName lastName email role profileImage');

      // Broadcast to all users in the specific course room
      io.to(`course_${courseId}`).emit('new_message', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { message: 'Failed to send message' });
    }
  });

  // Handle message deletion
  socket.on('delete_message', async (data) => {
    try {
      const { messageId, deleteForEveryone, courseId } = data;
      const message = await Message.findById(messageId);

      if (!message) {
        return socket.emit('delete_error', { message: 'Message not found' });
      }

      if (deleteForEveryone) {
        if (message.sender.toString() !== socket.user._id.toString()) {
          return socket.emit('delete_error', { message: 'Not authorized' });
        }
        message.deletedForEveryone = true;
        await message.save();
        // Emit to course room if courseId provided, otherwise generic
        if (courseId) {
          io.to(`course_${courseId}`).emit('message_deleted', { messageId, deleteForEveryone: true });
        } else {
          // Fallback for logic where courseId might be missing in older clients, though we expect it
          socket.emit('message_deleted', { messageId, deleteForEveryone: true });
        }

      } else {
        if (!message.deletedFor.includes(socket.user._id)) {
          message.deletedFor.push(socket.user._id);
          await message.save();
        }
        socket.emit('message_deleted', { messageId, deleteForEveryone: false });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      socket.emit('delete_error', { message: 'Failed to delete message' });
    }
  });

  // Handle message edit
  socket.on('edit_message', async (data) => {
    try {
      const { messageId, content, courseId } = data;
      const message = await Message.findById(messageId);

      if (!message) {
        return socket.emit('edit_error', { message: 'Message not found' });
      }

      if (message.sender.toString() !== socket.user._id.toString()) {
        return socket.emit('edit_error', { message: 'Not authorized' });
      }

      message.content = content;
      message.edited = true;
      message.editedAt = new Date();
      await message.save();
      await message.populate('sender', 'firstName lastName email role profileImage');

      if (courseId) {
        io.to(`course_${courseId}`).emit('message_edited', message);
      } else {
        socket.emit('message_edited', message);
      }
    } catch (error) {
      console.error('Error editing message:', error);
      socket.emit('edit_error', { message: 'Failed to edit message' });
    }
  });

  // Handle typing indicator
  socket.on('typing_start', (data) => {
    const { courseId } = data;
    if (courseId) {
      socket.to(`course_${courseId}`).emit('user_typing', {
        userId: socket.user._id,
        userName: `${socket.user.firstName} ${socket.user.lastName}`,
      });
    }
  });

  socket.on('typing_stop', (data) => {
    const { courseId } = data;
    if (courseId) {
      socket.to(`course_${courseId}`).emit('user_stopped_typing', {
        userId: socket.user._id,
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.user.firstName} ${socket.user.lastName}`);
    // We can't easily know which rooms they were in to broadcast 'user_left' to specific rooms 
    // without tracking it. But typically socket.io handles room leave on disconnect.
    // For now, simpler implementation:
    // Ideally we would track which course they are looking at, but 'disconnect' happens globally.
    // A disconnect fires when the socket closes.
  });
});

// API Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Skillify E-Learning Platform API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

server.listen(PORT, () => {
  console.log(`🚀 SERVER STARTED AT PORT ${PORT}`);
  console.log(`📚 Skillify E-Learning Platform API`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💬 Socket.IO enabled for real-time chat`);
});  