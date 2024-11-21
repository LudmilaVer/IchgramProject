// Импортируем модель сообщений
import Message from "../models/messageModel.js";

// Загрузка сообщений между двумя пользователями
export const loadMessages = async (userId, targetUserId, socket) => {
  try {
    // Ищем все сообщения между двумя пользователями
    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: targetUserId }, // Сообщения, отправленные пользователем
        { sender_id: targetUserId, receiver_id: userId }, // Сообщения, полученные пользователем
      ],
    }).sort({ created_at: 1 }); // Сортируем сообщения по дате (от старых к новым)

    // Отправляем сообщения через сокет клиенту
    socket.emit("loadMessages", messages);
  } catch (error) {
    // Если произошла ошибка, отправляем её через сокет
    socket.emit("error", { error: "Ошибка при загрузке сообщений" });
  }
};

// Отправка сообщения
export const sendMessage = async (userId, targetUserId, messageText, roomId, io) => {
  try {
    // Создаем новое сообщение
    const message = new Message({
      sender_id: userId, // Отправитель
      receiver_id: targetUserId, // Получатель
      message_text: messageText, // Текст сообщения
      created_at: new Date(), // Дата создания
    });

    // Сохраняем сообщение в базе данных
    await message.save();

    // Отправляем сообщение в комнату через сокет
    io.to(roomId).emit("receiveMessage", message);
  } catch (error) {
    // Логируем ошибку, если она произошла
    console.error("Ошибка при отправке сообщения:", error);
  }
};

// Получение времени последнего сообщения для каждого пользователя
export const getLastMessageDate = async (req, res) => {
  const { userId } = req.params; // ID другого пользователя
  const authUserId = req.user._id; // ID аутентифицированного пользователя

  try {
    // Находим последнее сообщение между двумя пользователями
    const lastMessage = await Message.findOne({
      $or: [
        { sender_id: authUserId, receiver_id: userId }, // Сообщения, отправленные текущим пользователем
        { sender_id: userId, receiver_id: authUserId }, // Сообщения, полученные текущим пользователем
      ],
    })
      .sort({ created_at: -1 }) // Сортируем по дате создания (от новых к старым)
      .select("created_at"); // Получаем только дату создания сообщения

    // Возвращаем дату последнего сообщения
    res.status(200).json({
      lastMessageDate: lastMessage ? lastMessage.created_at : null,
    });
  } catch (error) {
    // Обрабатываем ошибку и отправляем клиенту
    res.status(500).json({
      message: "Ошибка получения времени последнего сообщения",
      error: error.message,
    });
  }
};

// Получение последнего сообщения между двумя пользователями
export const getLastMessageBetweenUsers = async (req, res) => {
  const { userId } = req.params; // ID другого пользователя
  const authUserId = req.user._id; // ID аутентифицированного пользователя

  try {
    // Находим последнее сообщение между двумя пользователями
    const lastMessage = await Message.findOne({
      $or: [
        { sender_id: authUserId, receiver_id: userId }, // Сообщения от текущего пользователя
        { sender_id: userId, receiver_id: authUserId }, // Сообщения текущему пользователю
      ],
    })
      .sort({ created_at: -1 }) // Сортируем по дате создания (от новых к старым)
      .select("created_at message_text"); // Выбираем только дату и текст сообщения

    // Возвращаем текст и дату последнего сообщения
    res.status(200).json({
      lastMessageDate: lastMessage ? lastMessage.created_at : null,
      lastMessageText: lastMessage ? lastMessage.message_text : null,
    });
  } catch (error) {
    // Обрабатываем ошибку и отправляем клиенту
    res.status(500).json({
      message: "Ошибка получения последнего сообщения",
      error: error.message,
    });
  }
};
