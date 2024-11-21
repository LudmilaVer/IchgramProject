// Импортируем bcrypt для хэширования паролей
import bcrypt from 'bcrypt';
// Импортируем модель пользователя
import User from '../models/userModel.js';
// Импортируем функцию для генерации токенов
import generateToken from '../config/jwt.js';

// Генерация временного пароля
const generateTemporaryPassword = () => {
  // Создает 8-значный случайный пароль
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Регистрация пользователя
export const register = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  try {
    // Проверяем, существует ли уже пользователь с таким email или именем
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      // Если пользователь найден, возвращаем ошибку
      return res.status(400).json({ message: 'Пользователь с таким email или именем уже существует' });
    }

    // Хэшируем пароль для безопасного хранения
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя с зашифрованным паролем
    const user = new User({
      username,
      email,
      password: hashedPassword,
      full_name,
    });

    // Сохраняем пользователя в базе данных
    await user.save();

    // Генерируем токен для авторизации пользователя
    const token = generateToken(user);

    // Отправляем ответ с токеном и данными пользователя
    res.status(201).json({ token, user });
  } catch (error) {
    // Обработка ошибок на сервере
    res.status(500).json({ message: 'Ошибка регистрации', error: error.message });
  }
};

// Логин пользователя
export const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Ищем пользователя по email или имени пользователя
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      // Если пользователь не найден, возвращаем ошибку
      return res.status(400).json({ message: 'Неверный email/имя пользователя или пароль' });
    }

    // Сравниваем введенный пароль с хэшем из базы данных
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Если пароли не совпадают, возвращаем ошибку
      return res.status(400).json({ message: 'Неверный email/имя пользователя или пароль' });
    }

    // Генерируем токен
    const token = generateToken(user);

    // Отправляем ответ с токеном и данными пользователя
    res.status(200).json({ token, user });
  } catch (error) {
    // Обработка ошибок на сервере
    res.status(500).json({ message: 'Ошибка авторизации', error: error.message });
  }
};

// Сброс пароля пользователя
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Ищем пользователя с валидным токеном и непросроченным временем
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      // Если пользователь не найден, возвращаем ошибку
      return res.status(400).json({ message: 'Токен недействителен или срок его действия истек' });
    }

    // Хэшируем новый пароль и сбрасываем токен сброса
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    // Обработка ошибок
    res.status(500).json({ message: 'Ошибка сброса пароля', error: error.message });
  }
};

// Запрос на сброс пароля
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Ищем пользователя по email
    const user = await User.findOne({ email });

    if (!user) {
      // Если пользователь не найден, возвращаем ошибку
      return res.status(404).json({ message: 'Пользователь с таким email не найден' });
    }

    // Генерация временного пароля
    const tempPassword = generateTemporaryPassword();
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    // Сохраняем временный пароль в базе данных
    user.password = hashedTempPassword;
    user.resetPasswordToken = undefined; // Сброс токена
    user.resetPasswordExpires = undefined; // Сброс времени действия токена
    await user.save();

    // Отправляем временный пароль в ответ
    res.status(200).json({ tempPassword });
  } catch (error) {
    // Обработка ошибок
    res.status(500).json({ message: 'Ошибка обновления пароля', error: error.message });
  }
};
