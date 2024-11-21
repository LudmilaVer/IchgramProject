// src/Pages/PostList.jsx
import React, { useEffect, useState } from "react";
import { $api } from "../utils/api.ts";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await $api.get("/post");
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке постов:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Загрузка постов...</div>;
  }

  return (
    <div>
      <h2>Список постов</h2>
      {posts.length === 0 ? (
        <p>Нет доступных постов</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
            <h3>Пользователь: {post.user_id.username}</h3>
            <img src={post.image_url} alt="Post" style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
            <p>Подпись: {post.caption}</p>
            <p>Лайки: {post.likes_count}</p>
            <p>Комментарии: {post.comments_count}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;
