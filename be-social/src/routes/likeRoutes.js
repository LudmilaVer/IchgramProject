import express from 'express';
import { getPostLikes, likePost, unlikePost } from '../controllers/likeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Маршрут для получения лайков поста
router.get('/:postId', authMiddleware, getPostLikes);

// Маршрут для добавления лайка посту
router.post('/:postId', authMiddleware, likePost);

// Маршрут для удаления лайка с поста
router.delete('/:postId', authMiddleware, unlikePost);

export default router;

