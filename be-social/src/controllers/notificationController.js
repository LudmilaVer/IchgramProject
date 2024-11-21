// Импортируем необходимые модели
import Notification from '../models/notificationModel.js';
import Like from '../models/likeModel.js';
import Follow from '../models/followModel.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

// Получение всех уведомлений пользователя
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId; // ID пользователя, для которого запрашиваются уведомления

    // Получаем все посты пользователя
    const likedPosts = await Post.find({ user_id: userId }).select("_id");
    const likedPostIds = likedPosts.map((post) => post._id); // Массив ID постов

    // Получаем лайки для постов пользователя
    const likes = await Like.find({ post_id: { $in: likedPostIds } })
      .populate("user_id", "username profile_image") // Подгружаем данные пользователей, поставивших лайки
      .populate("post_id", "image_url") // Подгружаем данные постов
      .sort({ created_at: -1 }); // Сортируем по дате (от новых к старым)

    // Получаем подписчиков пользователя
    const follows = await Follow.find({ followed_user_id: userId })
      .populate("follower_user_id", "username profile_image") // Подгружаем данные подписчиков
      .sort({ created_at: -1 }); // Сортируем по дате (от новых к старым)

    // Формируем уведомления для лайков
    const likeNotifications = likes.map((like) => ({
      _id: like._id, // ID уведомления
      type: "like", // Тип уведомления
      user: like.user_id, // Пользователь, поставивший лайк
      post_id: like.post_id, // Пост, который был лайкнут
      created_at: like.created_at, // Дата создания
    }));

    // Формируем уведомления для подписок
    const followNotifications = follows.map((follow) => ({
      _id: follow._id, // ID уведомления
      type: "follow", // Тип уведомления
      user: follow.follower_user_id, // Подписавшийся пользователь
      created_at: follow.created_at, // Дата создания
    }));

    // Объединяем все уведомления и сортируем их по дате
    const notifications = [...likeNotifications, ...followNotifications].sort(
      (a, b) => b.created_at - a.created_at // Новые уведомления идут первыми
    );

    // Отправляем уведомления пользователю
    res.status(200).json(notifications);
  } catch (error) {
    // Обрабатываем ошибки
    console.error("Ошибка при получении уведомлений:", error);
    res.status(500).json({ error: "Ошибка при получении уведомлений" });
  }
};

// Создание нового уведомления
export const createNotification = async (req, res) => {
  const { userId, type, content } = req.body; // Данные уведомления из тела запроса

  try {
    const user = await User.findById(userId); // Проверяем, существует ли пользователь

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Создаем новое уведомление
    const notification = new Notification({
      user_id: userId,
      type, // Тип уведомления (лайк, подписка и т.д.)
      content, // Дополнительное содержимое
      created_at: new Date(), // Дата создания
    });

    await notification.save(); // Сохраняем уведомление в базе данных
    res.status(201).json(notification); // Отправляем успешный ответ
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании уведомления' });
  }
};

// Удаление уведомления
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId); // Ищем уведомление по ID

    if (!notification) {
      return res.status(404).json({ error: 'Уведомление не найдено' });
    }

    await Notification.findByIdAndDelete(req.params.notificationId); // Удаляем уведомление
    res.status(200).json({ message: 'Уведомление удалено' }); // Отправляем успешный ответ
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении уведомления' });
  }
};

// Обновление статуса уведомления (прочитано/непрочитано)
export const updateNotificationStatus = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId); // Ищем уведомление по ID

    if (!notification) {
      return res.status(404).json({ error: 'Уведомление не найдено' });
    }

    notification.is_read = req.body.is_read; // Обновляем статус уведомления
    await notification.save(); // Сохраняем изменения

    res.status(200).json(notification); // Отправляем успешный ответ
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении статуса уведомления' });
  }
};
