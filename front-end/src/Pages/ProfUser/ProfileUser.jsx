import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { followUser, unfollowUser, fetchUserById } from "../../store/slices/userSlice";
import Posts from "../Posts/Posts";
import styles from "../Profile/Profile.module.css";

const placeholderImage = "https://netsh.pp.ua/wp-content/uploads/2017/08/Placeholder-1.png";

function ProfileUser() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedPost, setSelectedPost] = useState(null); // Инициализируем состояние для выбранного поста

  const followingUsers = useSelector((state) => state.user.followingUsers);
  const viewedUser = useSelector((state) => state.user.viewedUser);
  const authUserId = useSelector((state) => state.auth.userId);
  const status = useSelector((state) => state.user.status);

  // Проверяем подписку на уровне Redux
  const isFollowing = followingUsers.includes(userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId)); // Загружаем данные просматриваемого пользователя
    }
  }, [dispatch, userId]);

  if (status === "loading" || !viewedUser) return <div>Loading...</div>;

  const handleFollowToggle = async () => {
    if (!authUserId || !userId) {
      console.error("Отсутствует authUserId или userId");
      return;
    }

    try {
      if (isFollowing) {
        await dispatch(unfollowUser(userId)); // Передаем userId целевого пользователя
      } else {
        await dispatch(followUser(userId)); // Передаем userId целевого пользователя
      }

      // Обновляем данные просматриваемого пользователя для актуализации счетчиков
      dispatch(fetchUserById(userId));
    } catch (error) {
      console.error("Ошибка при подписке/отписке:", error);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost({ ...post, viewedUser });
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className={styles.profile}>
      <div className={styles.profileMain}>
        <div className={styles.profileHeader}>
          <div className={styles.profileLogo}>
            <button className={styles.profileBtn}>
              <img src={viewedUser?.profile_image || placeholderImage} alt="Profile" />
            </button>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileContent_it}>
              <h3>{viewedUser?.username || "Username"}</h3>
              <div className={styles.profileBtnCont}>
                <button
                  className={`${styles.profileLink} p_14Bold_black`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
                <button
                  className={`${styles.profileLink_2} p_14Bold_black`}
                  onClick={() => navigate("/messages")}
                >
                  message
                </button>
              </div>
            </div>
            <div className={styles.profilePosts}>
              <p>
                <span className="p_16Bold">{viewedUser?.posts_count || 0}</span> posts
              </p>
              <p>
                <span className="p_16Bold">{viewedUser?.followers_count || 0}</span> followers
              </p>
              <p>
                <span className="p_16Bold">{viewedUser?.following_count || 0}</span> following
              </p>
            </div>
            <div className={styles.profilePosts_content}>
              <p className="p_14Small">• {viewedUser?.bio || "User bio not provided."}</p>
              <p className={`${styles.name} p_14Small`}>{viewedUser?.full_name}</p>
            </div>
          </div>
        </div>
        
        {/* Список постов */}
        <div className={styles.profileList}>
          {viewedUser?.posts?.length > 0 ? (
            viewedUser.posts.map((post, index) => (
              <div key={post._id} className={styles.profileList_cont}>
                <div
                  className={styles.profileList_cont_img}
                  onClick={() => handlePostClick(post)}
                >
                  <img src={post.image_url || placeholderImage} alt={`post-${index}`} />
                </div>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
      
      {/* Модальное окно с постом */}
      {selectedPost && <Posts post={selectedPost} onClose={handleCloseModal} />}
    </div>
  );
}

export default ProfileUser;
