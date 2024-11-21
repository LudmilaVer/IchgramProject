import multer from 'multer';

// Настройка multer
const storage = multer.memoryStorage(); // Хранить файлы в памяти
const upload = multer({ storage });

export default upload;