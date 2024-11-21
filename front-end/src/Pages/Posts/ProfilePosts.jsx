import React, { useState } from "react";
import ProfilePostCont from './ProfilePostCont';
import PostActions from '../CreatePost/PostActions'; // Альтернативный компонент
import styles from './Posts.module.css';

function ProfilePosts({ post, onClose, currentUser, onCancel, onDelete }) {
  const [isAlternateView, setIsAlternateView] = useState(false);

  const toggleView = () => {
    setIsAlternateView(!isAlternateView);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.postCon}>
          {isAlternateView ? (
            <PostActions post={post} user={currentUser} onCancel={onCancel} onDelete={() => onDelete(post._id)} />
          ) : (
            <ProfilePostCont post={post} user={currentUser} toggleView={toggleView} />
          )}
        </div>
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ProfilePosts;
