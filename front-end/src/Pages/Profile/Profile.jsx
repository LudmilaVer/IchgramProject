// src/components/Profile/Profile.js

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/slices/userSlice";
import { deletePost } from "../../store/slices/postSlice";
import ProfilePosts from "../Posts/ProfilePosts";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import IMG from "../../images/png/empty.jpg"

const placeholderImage =
  "https://netsh.pp.ua/wp-content/uploads/2017/08/Placeholder-1.png";

function Profile() {
  const dispatch = useDispatch();
  const [selectedPost, setSelectedPost] = useState(null);
  const { currentUser, status, error } = useSelector((state) => state.user);
  console.log("Profile User ID:", currentUser._id); // Лог в Profile
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Ошибка загрузки профиля: {error}</div>;

  if (!currentUser) {
    return <div>Данные профиля не найдены.</div>;
  }

  const handlePostClick = (post) => {
    setSelectedPost({ ...post, currentUser });
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId)).then(() => {
      setSelectedPost(null); // Закрыть модальное окно после удаления
    });
  };

  return (
    <div className={styles.profile}>
      <div className={styles.profileMain}>
        <div className={styles.profileHeader}>
          <div className={styles.profileLogo}>
            <button className={styles.profileBtn}>
              <img
                src={currentUser.profile_image || IMG}
                alt="User Avatar"
              />
            </button>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileContent_it}>
              <p className={`${styles.profileLink_1} h3_20`}>
                {currentUser.username || "Username"}
              </p>
              <button
                className={`${styles.profileLinkMyProf} p_14Bold_black`}
                onClick={() => navigate("/edit")}
              >
                Edit profile
              </button>
            </div>
            <div className={styles.profilePosts}>
              <p>
                <span className="p_16Bold">{currentUser.posts_count || 0}</span>{" "}
                posts
              </p>
              <p>
                <span className="p_16Bold">
                  {currentUser.followers_count || 0}
                </span>{" "}
                followers
              </p>
              <p>
                <span className="p_16Bold">
                  {currentUser.following_count || 0}
                </span>{" "}
                following
              </p>
            </div>
            <div className={styles.profilePosts_content}>
              <p className="p_14Small">
                {currentUser.bio || "No bio available."}
              </p>
              <p className={`${styles.name} p_14Small`}>
                {currentUser?.full_name}
              </p>
            </div>
          </div>
        </div>
        {/* Список постов */}
        <div className={styles.profileList}>
          {currentUser?.posts?.length > 0 ? (
            currentUser.posts.map((post, index) => (
              <div key={post._id} className={styles.profileList_cont}>
                <div
                  className={styles.profileList_cont_img}
                  onClick={() => handlePostClick(post)}
                >
                  <img
                    src={post.image_url || placeholderImage}
                    alt={`post-${index}`}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
      {/* Модальное окно с постом */}
      {selectedPost && (
        <ProfilePosts
          post={selectedPost}
          onClose={handleCloseModal}
          currentUser={currentUser}
          onCancel={handleCloseModal}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
}

export default Profile;
