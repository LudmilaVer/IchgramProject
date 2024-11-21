// src/Pages/CreatePost/CreatePost.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import CreatePosts from "./CreatePosts";
import { $api } from "../../utils/api.ts";

import styles from "./CreatePost.module.css";

function CreatePost() {
  const navigate = useNavigate();

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
      console.log("Пост успешно создан", response.data);

      navigate("/profile");
    } catch (error) {
      if (error.response) {
        console.error("Ошибка при создании поста:", error.response.data);
        alert(`Ошибка: ${error.response.data.message || "Не удалось создать пост"}`);
      } else if (error.request) {
        console.error("Сервер не ответил. Проверьте соединение:", error.request);
        alert("Сервер не ответил. Проверьте соединение.");
      } else {
        console.error("Ошибка при настройке запроса:", error.message);
        alert(`Ошибка: ${error.message}`);
      }
    }
  };


  return (
    <div className={styles.createPost}>
      <div className={styles.createPostFix}>
        
          <CreatePosts onShare={handleShare} />
        
      </div>
      <div className="back"></div>
      <div className={styles.searchBack}>
        <HomePage />
      </div>
    </div>
  );
}

export default CreatePost;
