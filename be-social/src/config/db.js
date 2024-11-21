// Импортируем библиотеку mongoose для работы с MongoDB
import mongoose from 'mongoose';

// Создаем асинхронную функцию для подключения к базе данных MongoDB
const connectDB = async () => {
  try {
    // Устанавливаем соединение с MongoDB, используя URI из переменной окружения
    await mongoose.connect(process.env.MONGO_URI, {
      // Используем новый парсер URL для подключения
      useNewUrlParser: true,
      // Включаем унифицированную топологию для более стабильного подключения
      useUnifiedTopology: true,
    });

    // Выводим сообщение в консоль, если подключение успешно
    console.log('MongoDB подключен');
  } catch (error) {
    // Обрабатываем ошибки подключения и выводим их в консоль
    console.error('Ошибка подключения к MongoDB:', error.message);

    // Завершаем процесс с кодом ошибки, если подключение не удалось
    process.exit(1);
  }
};

// Экспортируем функцию подключения, чтобы она была доступна в других файлах проекта
export default connectDB;
