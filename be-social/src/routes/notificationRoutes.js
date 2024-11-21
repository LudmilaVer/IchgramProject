import express from 'express';
import { getUserNotifications, createNotification, deleteNotification, updateNotificationStatus } from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Получение всех уведомлений пользователя
router.get('/:userId/notifications', authMiddleware, getUserNotifications);

// Создание нового уведомления
router.post('/notifications', authMiddleware, createNotification);

// Удаление уведомления
router.delete('/notifications/:notificationId', authMiddleware, deleteNotification);

// Обновление статуса уведомления
router.patch('/notifications/:notificationId', authMiddleware, updateNotificationStatus);

export default router;