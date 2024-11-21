// PostsCont.jsx

import React from "react";
import PostPage from "./PostPage";
import styles from "./Posts.module.css";

function PostsCont({ post }) {
  console.log("Post in PostsCont:", post);

  const viewedUser = post?.user || post?.viewedUser;

  if (!post || !viewedUser) {
    return <div>Loading post...</div>; 
  }


  return (
    <div className={styles.poster}>
      <div className={styles.posterIMG}>
        <img src={post.image_url} alt={post.caption || "Post image"} />
      </div>
      <div className={styles.posterLeft}>
        <PostPage user={viewedUser} post={post} />
      </div>
    </div>
  );
}

export default PostsCont;
