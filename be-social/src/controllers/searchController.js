// Импортируем модели пользователей и постов
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

// Поиск пользователей по имени
export const searchUsers = async (req, res) => {
  const { query } = req.query; // Извлекаем параметр запроса `query`

  try {
    // Ищем пользователей, чьи имена соответствуют запросу (регистр игнорируется)
    const users = await User.find({ username: { $regex: query, $options: 'i' } })
      .select('username bio'); // Возвращаем только имя пользователя и биографию

    // Отправляем найденных пользователей клиенту
    res.status(200).json(users);
  } catch (error) {
    // Обрабатываем ошибки
    res.status(500).json({ error: 'Ошибка при поиске пользователей' });
  }
};

// Поиск постов по содержимому
export const searchPosts = async (req, res) => {
  const { query } = req.query; // Извлекаем параметр запроса `query`

  try {
    // Формируем фильтр для поиска, если указан запрос
    const filter = query
      ? {
          $or: [
            { content: { $regex: query, $options: 'i' } }, // Поиск по содержимому поста
            { caption: { $regex: query, $options: 'i' } } // Поиск по заголовку поста
          ]
        }
      : {}; // Если запрос не указан, фильтр пустой (возвращает все посты)

    // Ищем посты, соответствующие фильтру, и подгружаем информацию о пользователях
    const posts = await Post.find(filter).populate('user_id', 'username');

    // Отправляем найденные посты клиенту
    res.status(200).json(posts);
  } catch (error) {
    // Обрабатываем ошибки
    res.status(500).json({ error: 'Ошибка при поиске постов' });
  }
};
