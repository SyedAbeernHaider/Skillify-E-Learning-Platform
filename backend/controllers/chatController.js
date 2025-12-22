const Message = require('../models/Message');

// @desc    Get all messages
// @route   GET /api/chat/messages
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const { limit = 50, skip = 0, courseId } = req.query;

        let query = {
            $and: [
                { deletedForEveryone: false },
                { deletedFor: { $ne: req.user._id } }
            ]
        };

        if (courseId) {
            query.courseId = courseId;
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('sender', 'firstName lastName email role profileImage');

        const total = await Message.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                messages: messages.reverse(), // Reverse to show oldest first
                total,
                hasMore: total > (parseInt(skip) + messages.length)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Send message
// @route   POST /api/chat/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { content, fileUrl, fileName, fileType, fileSize, courseId } = req.body;

        if (!content && !fileUrl) {
            return res.status(400).json({
                success: false,
                message: 'Message must have content or file'
            });
        }

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        const message = await Message.create({
            courseId,
            sender: req.user._id,
            senderName: `${req.user.firstName} ${req.user.lastName}`,
            senderRole: req.user.role,
            content,
            fileUrl,
            fileName,
            fileType,
            fileSize
        });

        await message.populate('sender', 'firstName lastName email role profileImage');

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete message
// @route   DELETE /api/chat/messages/:messageId
// @access  Private
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { deleteForEveryone } = req.body;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        if (deleteForEveryone) {
            // Only sender can delete for everyone
            if (message.sender.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this message for everyone'
                });
            }

            message.deletedForEveryone = true;
            await message.save();

            res.status(200).json({
                success: true,
                message: 'Message deleted for everyone'
            });
        } else {
            // Delete for me only
            if (!message.deletedFor.includes(req.user._id)) {
                message.deletedFor.push(req.user._id);
                await message.save();
            }

            res.status(200).json({
                success: true,
                message: 'Message deleted for you'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Mark message as read
// @route   PUT /api/chat/messages/:messageId/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Check if already marked as read
        const alreadyRead = message.readBy.some(
            r => r.user.toString() === req.user._id.toString()
        );

        if (!alreadyRead) {
            message.readBy.push({
                user: req.user._id,
                readAt: new Date()
            });
            await message.save();
        }

        res.status(200).json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Edit message
// @route   PUT /api/chat/messages/:messageId
// @access  Private
exports.editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Only sender can edit
        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to edit this message'
            });
        }

        message.content = content;
        message.edited = true;
        message.editedAt = new Date();
        await message.save();

        await message.populate('sender', 'firstName lastName email role profileImage');

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
