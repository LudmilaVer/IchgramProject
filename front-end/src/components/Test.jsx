import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/post'); // Убедитесь, что этот URL соответствует вашему API
        if (!response.ok) {
          throw new Error("Ошибка сети или сервера");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>{post.caption}</h3>
            <p>Автор: {post.user_id?.username}</p>
            {post.image_url && <img src={post.image_url} alt="Изображение поста" style={{ width: '100%', maxHeight: '300px' }} />}
            <p>Дата: {new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>Нет доступных постов</p>
      )}
    </div>
  );
};

export default HomePage;
