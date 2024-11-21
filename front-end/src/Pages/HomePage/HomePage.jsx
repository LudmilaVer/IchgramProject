// HomePage.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../store/slices/userSlice";
import { fetchPosts } from "../../store/slices/postSlice";
import Ok from "../../images/svg/Ok.svg";
import styles from "./HomePage.module.css";
import HomeFile from "./HomeFile";

function HomePage() {
  
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const posts = useSelector((state) => state.post.posts);
  const userStatus = useSelector((state) => state.user.status);
  const postStatus = useSelector((state) => state.post.status);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, userStatus, postStatus]);

  if (userStatus === "loading" || postStatus === "loading") {
    return <div>Загрузка...</div>;
  }

  if (userStatus === "failed" || postStatus === "failed") {
    return <div>Ошибка при загрузке данных пользователей или постов</div>;
  }

  return (
    <div className={`${styles.homepage} ${styles.fadeIn}`}>
      <div className={styles.homepage_up}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <HomeFile key={post._id} user={post.user_id} post={post} users={users} />
          ))
        ) : (
          <p>Нет доступных постов</p>
        )}
      </div>
      <div className={styles.homepage_down}>
        <div className={styles.down_img}>
          <img src={Ok} alt="All updates seen" />
        </div>
        <p>You've seen all the updates</p>
        <p className="p_punkt">You have viewed all new publications</p>
      </div>
    </div>
  );
}

export default HomePage;
