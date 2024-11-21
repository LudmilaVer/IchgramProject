// src/Pages/Posts/Posts.jsx
import React from "react";
import PostsContExplore from './PostsContExplore';
import styles from './Posts.module.css';

function PostsExplore({ post, onClose }) {
  console.log("Post in Posts component:", post);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.postCon}>
          <PostsContExplore post={post} /> {/* Передаем post в PostCont */}
        </div>
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default PostsExplore;
