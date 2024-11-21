// Импортируем модель комментариев
import Comment from '../models/commentModel.js';
// Импортируем модель постов
import Post from '../models/postModel.js';

// Получение комментариев к посту
export const getPostComments = async (req, res) => {
  try {
    // Находим все комментарии, связанные с указанным постом
    const comments = await Comment.find({ post_id: req.params.postId })
      .populate('user_id', 'username profile_image'); // Подгружаем данные пользователя (имя и изображение профиля)

    // Возвращаем комментарии в ответе
    res.status(200).json(comments);
  } catch (error) {
    // Обрабатываем ошибки
    res.status(500).json({ error: 'Ошибка при получении комментариев' });
  }
};

// Создание комментария
export const createComment = async (req, res) => {
  const { postId } = req.params; // ID поста из параметров запроса
  const userId = req.user.id; // ID пользователя, полученный из middleware аутентификации
  const { comment_text } = req.body; // Текст комментария из тела запроса

  try {
    // Проверяем, существует ли пост
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Пост не найден' });

    // Создаем новый комментарий
    const comment = new Comment({
      post_id: postId, // ID связанного поста
      user_id: userId, // ID автора комментария
      comment_text, // Текст комментария
      created_at: new Date(), // Текущая дата создания
    });

    // Сохраняем комментарий в базе данных
    await comment.save();

    // Увеличиваем счетчик комментариев у поста
    post.comments_count += 1;
    await post.save();

    // Возвращаем созданный комментарий
    res.status(201).json(comment);
  } catch (error) {
    // Обрабатываем ошибки
    res.status(500).json({ error: 'Ошибка при создании комментария' });
  }
};

// Удаление комментария
export const deleteComment = async (req, res) => {
  const { commentId } = req.params; // ID комментария из параметров запроса

  try {
    // Проверяем, существует ли комментарий
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Комментарий не найден' });

    // Удаляем комментарий из базы данных
    await Comment.findByIdAndDelete(commentId);

    // Уменьшаем счетчик комментариев у поста
    const post = await Post.findById(comment.post_id);
    post.comments_count -= 1;
    await post.save();

    // Отправляем успешный ответ
    res.status(200).json({ message: 'Комментарий удалён' });
  } catch (error) {
    // Обрабатываем ошибки
    res.status(500).json({ error: 'Ошибка при удалении комментария' });
  }
};
