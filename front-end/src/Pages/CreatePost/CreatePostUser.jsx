// src/Pages/CreatePost/CreatePost.jsx

import React, { useState } from "react";
// import HomePage from "../HomePage/HomePage";
import CreatePosts from "./CreatePosts.jsx";
import PostActions from "./PostActions.jsx";
import { $api } from "../../utils/api.ts"; // Убедитесь, что $api настроен для работы с Axios

import styles from "./CreatePost.module.css";

function CreatePost() {
  const [isPostShared, setIsPostShared] = useState(false);

  const handleShare = async ({ text, image }) => {
    const formData = new FormData();
    formData.append("caption", text);
    formData.append("image", image);

    try {
      const response = await $api.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Пост успешно создан", response.data); // Подтверждаем успех
      setIsPostShared(true); // Устанавливаем состояние при успешной отправке
    } catch (error) {
      if (error.response) {
        // Ошибка, полученная от сервера
        console.error("Ошибка при создании поста:", error.response.data);
        alert(
          `Ошибка: ${error.response.data.message || "Не удалось создать пост"}`
        );
      } else if (error.request) {
        // Проблема с запросом
        console.error(
          "Сервер не ответил. Проверьте соединение:",
          error.request
        );
        alert("Сервер не ответил. Проверьте соединение.");
      } else {
        // Другая ошибка
        console.error("Ошибка при настройке запроса:", error.message);
        alert(`Ошибка: ${error.message}`);
      }
    }
  };

  return (
    <div className={styles.createPost}>
      <div>
        {!isPostShared ? (
          <CreatePosts onShare={handleShare} />
        ) : (
          <div className={styles.createPostCenter}>
            <PostActions />
          </div>
        )}
      </div>
      <div className="back"></div>
    </div>
  );
}

export default CreatePost;
