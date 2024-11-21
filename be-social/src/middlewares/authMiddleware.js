import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  // Извлекаем токен из заголовка Authorization
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Доступ запрещен. Токен не предоставлен." });
  }

  try {
    // Проверка и декодирование токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Логирование для отладки
    console.log("Токен:", token);
    console.log("Пользователь из токена:", decoded.user_id);

    // Поиск пользователя по ID из токена
    const user = await User.findById(decoded.user_id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден." });
    }

    // Сохранение пользователя в запросе для дальнейшего использования
    req.user = user;
    next();
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return res.status(401).json({ message: "Неверный токен." });
  }
};

export default authMiddleware;
