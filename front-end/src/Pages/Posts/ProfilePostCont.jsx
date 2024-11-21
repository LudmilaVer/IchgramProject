// src/Pages/Posts/PostsCont.jsx
import React from "react";
import ProfilePostPage from "./ProfilePostPage";
import styles from "./Posts.module.css";

function ProfilePostCont({ post, user, toggleView }) {
  return (
    <div className={styles.poster}>
      <div className={styles.posterIMG}>
        <img src={post.image_url} alt={post.caption || "Post image"} />
      </div>
      <div className={styles.posterLeft}>
        <ProfilePostPage user={user} post={post} toggleView={toggleView} /> {/* Передаем user и post в PostPage */}
      </div>
    </div>
  );
}

export default ProfilePostCont;
