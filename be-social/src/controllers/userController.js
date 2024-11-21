// Импортируем модели пользователей и вспомогательные модули
import User from '../models/userModel.js';
import getUserIdFromToken from '../utils/helpers.js';
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Настройка multer для загрузки изображений
const storage = multer.memoryStorage(); // Сохраняем файл в оперативной памяти
const upload = multer({ storage }); // Используем память для временного хранения

// Получение профиля текущего пользователя
export const getCurrentUserProfile = async (req, res) => {
  try {
    // Ищем текущего пользователя по ID из токена
    const user = await User.findById(req.user._id)
      .select("-password") // Исключаем поле `password`
      .populate({
        path: "posts", // Загружаем связанные посты
        model: "Post",
        select: "image_url caption created_at", // Выбираем нужные поля постов
      });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.status(200).json(user); // Отправляем данные профиля клиенту
  } catch (error) {
    res.status(500).json({
      message: "Ошибка получения профиля текущего пользователя",
      error: error.message,
    });
  }
};

// Получение профиля пользователя по ID
export const getUserProfile = async (req, res) => {
  const userId = req.params.userId; // Извлекаем ID пользователя из параметров запроса

  try {
    // Ищем пользователя вместе с его постами
    const user = await User.findById(userId)
      .select('-password') // Исключаем пароль
      .populate({
        path: 'posts', // Загружаем связанные посты
        model: 'Post',
        select: 'image_url caption created_at', // Выбираем только нужные поля постов
      });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json(user); // Отправляем данные профиля клиенту
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка получения профиля пользователя',
      error: error.message,
    });
  }
};

// Обновление профиля текущего пользователя
export const updateUserProfile = async (req, res) => {
  const userId = getUserIdFromToken(req); // Получаем ID текущего пользователя из токена

  try {
    const user = await User.findById(userId); // Ищем пользователя в базе данных
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { username, bio, full_name } = req.body; // Извлекаем данные из тела запроса

    // Обновляем данные пользователя, если они указаны
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (full_name) user.full_name = full_name;

    // Обновление изображения профиля
    if (req.file) {
      try {
        // Загружаем изображение в Cloudinary и сохраняем URL
        const imageUrl = await uploadImageToCloudinary(req.file.buffer);
        user.profile_image = imageUrl;
      } catch (error) {
        console.error("Ошибка загрузки изображения в Cloudinary:", error);
        return res.status(500).json({ message: "Ошибка загрузки изображения" });
      }
    }

    const updatedUser = await user.save(); // Сохраняем изменения в базе данных
    res.status(200).json(updatedUser); // Отправляем обновлённый профиль клиенту
  } catch (error) {
    console.error("Ошибка обновления профиля:", error);
    res.status(500).json({
      message: "Ошибка обновления профиля",
      error: error.message,
    });
  }
};

// Получение всех пользователей
export const getAllUsers = async (req, res) => {
  try {
    // Ищем всех пользователей и подгружаем связанные посты
    const users = await User.find()
      .select('-password') // Исключаем поле `password`
      .populate({
        path: 'posts', // Загружаем связанные посты
        select: 'image_url caption created_at', // Указываем нужные поля постов
      });

    res.status(200).json(users); // Отправляем данные всех пользователей клиенту
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка при получении пользователей',
      error: error.message,
    });
  }
};

// Экспорт загрузки изображения для использования в маршрутах
export const uploadProfileImage = upload.single('profile_image'); // Настройка multer для обработки одиночного файла
