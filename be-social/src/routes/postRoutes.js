import express from 'express';
import { createPost, getPostById, updatePost, deletePost, getUserPosts, getAllPosts } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createPost);
router.get('/all', authMiddleware, getUserPosts);
router.get('/single/:postId', authMiddleware, getPostById);
router.delete('/:postId', authMiddleware, deletePost);
router.put('/:postId', authMiddleware, updatePost);

// Маршрут для получения всех постов
router.get('/', getAllPosts);

// Маршрут для получения поста по ID
router.get('/:postId', getPostById);

// Маршрут для создания поста
router.post('/', createPost);


export default router;
