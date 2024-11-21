// src/Pages/Posts/Posts.jsx
import React from "react";
import PostCont from './PostsCont';
import styles from './Posts.module.css';

function Posts({ post, onClose }) {
  console.log("Post in Posts component:", post);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.postCon}>
          <PostCont post={post} />
        </div>
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Posts;
