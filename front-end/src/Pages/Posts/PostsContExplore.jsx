// PostsCont.jsx

import React from "react";
import PostPage from "./PostPage";
import styles from "./Posts.module.css";

function PostsContExplore({ post }) {
  console.log("Post in PostsCont:", post);
  return (
    <div className={styles.poster}>
      <div className={styles.posterIMG}>
        <img src={post.image_url} alt={post.caption || "Post image"} />
      </div>
      <div className={styles.posterLeft}>
        <PostPage user={post.user_id} post={post} />
      </div>
    </div>
  );
}

export default PostsContExplore;
