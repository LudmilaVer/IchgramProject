import express from 'express';
import { 
  getUserProfile, 
  getCurrentUserProfile, 
  updateUserProfile, 
  uploadProfileImage, 
  getAllUsers 
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage(); // Сохраняем файл в памяти для передачи в Cloudinary
const upload = multer({ storage });

// Получение профиля текущего пользователя
router.get('/current', authMiddleware, getCurrentUserProfile);

// Получение профиля конкретного пользователя по ID
router.get('/:userId', getUserProfile);

// Получение всех пользователей
router.get('/', getAllUsers);

// Обновление профиля текущего пользователя с загрузкой изображения
router.put('/current', authMiddleware, upload.single('profile_image'), updateUserProfile);



export default router;
