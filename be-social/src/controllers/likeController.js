// Импортируем модель лайков
import Like from '../models/likeModel.js';
// Импортируем модель постов
import Post from '../models/postModel.js';
// Импортируем mongoose для проверки валидности ID
import mongoose from 'mongoose';

// Получение лайков для поста
export const getPostLikes = async (req, res) => {
  const { postId } = req.params;

  // Проверяем, является ли ID поста валидным ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  try {
    // Находим все лайки для указанного поста
    const likes = await Like.find({ post_id: postId });

    // Отправляем лайки в ответе
    res.status(200).json(likes);
  } catch (error) {
    // Обрабатываем ошибки
    res.status(500).json({ error: 'Ошибка при получении лайков', details: error.message });
  }
};

// Лайк поста
export const likePost = async (req, res) => {
  const { postId } = req.params; // ID поста из параметров запроса
  const userId = req.user._id; // ID пользователя из middleware аутентификации

  try {
    // Проверяем, существует ли пост
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    // Проверяем, существует ли уже лайк от пользователя на этот пост
    const existingLike = await Like.findOne({ post_id: postId, user_id: userId });
    if (existingLike) {
      return res.status(400).json({ error: 'Пост уже лайкнут' });
    }

    // Создаем новый лайк
    const like = new Like({ post_id: postId, user_id: userId });
    await like.save();

    // Увеличиваем счетчик лайков у поста
    post.likes_count += 1;
    await post.save();

    // Отправляем успешный ответ с созданным лайком
    res.status(201).json(like);
  } catch (error) {
    // Обрабатываем ошибки
    res.status(500).json({ error: 'Ошибка при лайке поста', details: error.message });
  }
};

// Удаление лайка (анлайк)
export const unlikePost = async (req, res) => {
  const { postId } = req.params; // ID поста из параметров запроса
  const userId = req.user._id; // ID пользователя из middleware аутентификации

  try {
    // Проверяем, существует ли лайк
    const like = await Like.findOne({ post_id: postId, user_id: userId });
    if (!like) {
      return res.status(404).json({ error: 'Лайк не найден' });
    }

    // Удаляем лайк из базы данных
    await Like.findByIdAndDelete(like._id);

    // Уменьшаем счетчик лайков у поста
    const post = await Post.findById(postId);
    post.likes_count = Math.max(0, post.likes_count - 1); // Убедимся, что счетчик не уходит в отрицательное значение
    await post.save();

    // Отправляем успешный ответ
    res.status(200).json({ message: 'Лайк удалён' });
  } catch (error) {
    // Обрабатываем ошибки
    res.status(500).json({ error: 'Ошибка при удалении лайка', details: error.message });
  }
};
