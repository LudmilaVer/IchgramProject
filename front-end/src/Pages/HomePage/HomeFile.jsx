import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTimeAgo } from "../../utils/time.js";
import {
  fetchPostLikes,
  likePost,
  unlikePost,
} from "../../store/slices/likeSlice";
import { followUser, unfollowUser } from "../../store/slices/userSlice";
import styles from "./HomeFile.module.css";
import Ava from "../../images/png/ava.jpg";
import Heart from "../../images/svg/Heart.svg";
import RedHeartIcon from "../../images/svg/Heart-red.svg";
import MessageImg from "../../images/svg/message-img.svg";

const placeholderImage =
  "https://netsh.pp.ua/wp-content/uploads/2017/08/Placeholder-1.png";

function HomeFile({ user, post }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.userId);

  const followingUsers = useSelector((state) => state.user.followingUsers);

  const postLikes =
    useSelector((state) => state.likes.likesByPost[post._id]) || [];
  const isLikedByCurrentUser = postLikes.some(
    (like) => like.user_id === currentUserId
  );
  const likesCount = postLikes.length;

  const isFollowing = followingUsers.includes(user._id);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    console.log('Текущий статус лайка:', isLikedByCurrentUser);
    if (isLikedByCurrentUser) {
      dispatch(unlikePost({ postId: post._id, userId: currentUserId }))
        .then(() => console.log('Лайк убран'));
    } else {
      dispatch(likePost({ postId: post._id, userId: currentUserId }))
        .then(() => console.log('Лайк поставлен'));
    }
  };

  useEffect(() => {
    dispatch(fetchPostLikes(post._id));
  }, [dispatch, post._id]);


  const handleFollowToggle = (e) => {
    e.stopPropagation();
    if (isFollowing) {
      dispatch(unfollowUser(user._id));
    } else {
      dispatch(followUser(user._id));
    }
  };

  return (
    <div
      className={styles.container}
      onClick={() => navigate(`/profuser/${user._id}`)}
    >
      <div className={styles.cont_up}>
        <button className={styles.cont_up_ava}>
          <img src={user.profile_image || Ava} alt="avatar" />
        </button>
        <div className={styles.cont_up_text}>
          <p className="p_12Bold">{user.username || "Username"}</p>
          <p className="p_punkt">•</p>
          <p className="p_12SmallGrey">{getTimeAgo(user.created_at)}</p>
          <p className="p_punkt">•</p>
          <button className="buttonAva" onClick={handleFollowToggle}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>

      <div className={styles.cont_medium}>
        <img src={post.image_url || placeholderImage} alt="post" />
      </div>

      <div className={styles.cont_down}>
        <div className={styles.down_button}>
          <button className={styles.heart} onClick={handleLikeToggle}>
            <img src={isLikedByCurrentUser ? RedHeartIcon : Heart} alt="like" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/messages");
            }}
          >
            <img src={MessageImg} alt="message" />
          </button>
        </div>
        <div className={styles.down_like}>
          <p className="p_12Bold">{likesCount} likes</p>
        </div>
        <div className={styles.down_description}>
          <p className="p_12Bold italic">
            <span className="p_12Bold">{user.username || "Username"}</span>{" "}
            {post.caption}
          </p>
        </div>
        <div>
          <p className="p_12SmallGrey">
            View all comments (<span>{post.comments_count || 0}</span>)
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeFile;
