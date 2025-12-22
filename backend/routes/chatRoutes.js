const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat routes require authentication
router.get('/messages', protect, chatController.getMessages);
router.post('/messages', protect, chatController.sendMessage);
router.delete('/messages/:messageId', protect, chatController.deleteMessage);
router.put('/messages/:messageId/read', protect, chatController.markAsRead);
router.put('/messages/:messageId', protect, chatController.editMessage);

module.exports = router;
