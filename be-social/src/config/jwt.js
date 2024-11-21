// Импортируем библиотеку jsonwebtoken для создания токенов
import jwt from 'jsonwebtoken';

// Функция для генерации токена
const generateToken = (user) => {
  // Создаем токен, используя уникальный идентификатор пользователя и секретный ключ
  return jwt.sign(
    { user_id: user._id }, // Полезная нагрузка токена (идентификатор пользователя)
    process.env.JWT_SECRET, // Секретный ключ для подписи токена
    {
      expiresIn: '7h', // Указываем срок действия токена (7 часов)
    }
  );
};

// Экспортируем функцию, чтобы она могла использоваться в других частях проекта
export default generateToken;
