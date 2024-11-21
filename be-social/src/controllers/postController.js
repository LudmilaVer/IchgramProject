// Импортируем модели постов и пользователей
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
// Импортируем утилиту для извлечения ID пользователя из токена
import getUserIdFromToken from "../utils/helpers.js";
// Импортируем Cloudinary для загрузки изображений
import { v2 as cloudinary } from "cloudinary";
// Импортируем поток для работы с файлами
import stream from "stream";

// Получение всех постов пользователя
export const getUserPosts = async (req, res) => {
  try {
    // Ищем все посты, принадлежащие текущему пользователю
    const posts = await Post.find({ user_id: getUserIdFromToken(req) });
    res.status(200).json(posts); // Отправляем посты клиенту
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении постов" }); // Обработка ошибок
  }
};

// Создание нового поста
export const createPost = async (req, res) => {
  const userId = getUserIdFromToken(req); // Извлекаем ID пользователя из токена
  const { caption } = req.body; // Извлекаем подпись из тела запроса

  try {
    const bufferStream = new stream.PassThrough(); // Создаем поток для обработки изображения
    bufferStream.end(req.file.buffer); // Передаем файл изображения в поток

    // Загружаем изображение в Cloudinary
    cloudinary.uploader.upload_stream({ resource_type: "image" }, async (error, result) => {
      if (error) {
        console.error("Ошибка загрузки на Cloudinary:", error);
        return res.status(500).json({ message: "Ошибка загрузки изображения" });
      }

      // Создаем новый пост с URL изображения, полученным от Cloudinary
      const post = new Post({
        user_id: userId,
        image_url: result.secure_url,
        caption,
        created_at: new Date(),
      });

      await post.save(); // Сохраняем пост в базе данных

      // Обновляем данные пользователя
      const user = await User.findById(userId);
      if (user) {
        user.posts.push(post._id); // Добавляем ID нового поста в массив постов пользователя
        user.posts_count += 1; // Увеличиваем счетчик постов
        await user.save(); // Сохраняем изменения пользователя
      }

      res.status(201).json(post); // Отправляем клиенту созданный пост
    }).end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при создании поста", details: error.message });
  }
};

// Удаление поста
export const deletePost = async (req, res) => {
  const { postId } = req.params; // Извлекаем ID поста из параметров запроса

  try {
    const post = await Post.findById(postId); // Проверяем, существует ли пост
    if (!post) return res.status(404).json({ error: "Пост не найден" });

    await Post.findByIdAndDelete(postId); // Удаляем пост из базы данных

    // Уменьшаем количество постов у пользователя
    const user = await User.findById(post.user_id);
    if (user) {
      user.posts_count -= 1;
      user.posts = user.posts.filter(id => id.toString() !== postId); // Удаляем пост из массива
      await user.save();
    }

    res.status(200).json({ message: "Пост удалён" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении поста" });
  }
};

// Получение поста по ID
export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    // Находим пост и подгружаем данные пользователя
    const post = await Post.findById(postId).populate("user_id", "username");
    if (!post) return res.status(404).json({ error: "Пост не найден" });

    res.status(200).json(post); // Отправляем пост клиенту
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении поста" });
  }
};

// Обновление поста
export const updatePost = async (req, res) => {
  const { postId } = req.params; // Извлекаем ID поста из параметров запроса
  const { caption, image_url } = req.body; // Извлекаем обновленные данные из тела запроса

  try {
    const post = await Post.findById(postId); // Проверяем, существует ли пост
    if (!post) return res.status(404).json({ error: "Пост не найден" });

    if (caption !== undefined) post.caption = caption; // Обновляем подпись
    if (image_url !== undefined) post.image_url = image_url; // Обновляем URL изображения

    await post.save(); // Сохраняем изменения
    res.status(200).json(post); // Отправляем обновленный пост клиенту
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении поста" });
  }
};

// Получение всех постов
export const getAllPosts = async (req, res) => {
  try {
    // Ищем все посты и подгружаем данные пользователей
    const posts = await Post.find().populate('user_id', 'username profile_image created_at');
    res.status(200).json(posts); // Отправляем посты клиенту
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении постов", details: error.message });
  }
};
