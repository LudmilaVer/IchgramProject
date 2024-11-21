// routes/messageRoutes.js

import express from 'express';
import jwt from 'jsonwebtoken';
import { loadMessages, sendMessage, getLastMessageDate, getLastMessageBetweenUsers  } from '../controllers/messageController.js';
import User from '../models/userModel.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Не забудьте также импортировать authMiddleware, если его используете

const router = express.Router();

export const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Доступ запрещен. Токен не предоставлен.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return next(new Error('User not found.'));
    }

    socket.user = user;
    next();
  } catch (error) {
    return next(new Error('Invalid token.'));
  }
};

export const messageSocketHandler = (socket, io) => {
  socket.on('joinRoom', ({ targetUserId }) => {
    const userId = socket.user._id;
    const roomId = [userId, targetUserId].sort().join('_');
    socket.join(roomId);

    loadMessages(userId, targetUserId, socket);
  });

  socket.on('sendMessage', ({ targetUserId, messageText }) => {
    const userId = socket.user._id;
    const roomId = [userId, targetUserId].sort().join('_');
    sendMessage(userId, targetUserId, messageText, roomId, io);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });
};

// Маршрут для получения времени последнего сообщения между пользователями
router.get('/lastMessageDate/:userId', authMiddleware, getLastMessageDate);

// Новый маршрут для получения последнего сообщения между пользователями
router.get('/lastMessageBetweenUsers/:userId', authMiddleware, getLastMessageBetweenUsers);

export default router;
