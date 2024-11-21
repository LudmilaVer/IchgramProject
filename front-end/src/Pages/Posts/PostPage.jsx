import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTimeAgo } from "../../utils/time.js";
import { addComment, fetchComments } from "../../store/slices/postSlice";
import {
  fetchPostLikes,
  likePost,
  unlikePost,
} from "../../store/slices/likeSlice";
import {
  followUser,
  unfollowUser,
  fetchCurrentUser,
} from "../../store/slices/userSlice";
import smileIcon from "../../images/svg/smile.svg";
import heartIcon from "../../images/svg/Heart.svg";
import heartRedIcon from "../../images/svg/Heart-red.svg";
import styles from "./PostPage.module.css";

const popularEmojis = ["😂", "😍", "😢", "👏", "🔥", "🥳", "❤️"];

function PostPage({ user, post }) {
  const [commentText, setCommentText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false); // состояние загрузки комментариев

  const dispatch = useDispatch();

  const comments = useSelector((state) => state.post.comments[post?._id]) || [];
  const currentUserId = useSelector((state) => state.auth.userId);
  const followingUsers = useSelector((state) => state.user.followingUsers);
  const postLikes =
    useSelector((state) => state.likes.likesByPost[post._id]) || [];
  const isLikedByCurrentUser = postLikes.some(
    (like) => like.user_id === currentUserId
  );
  const likesCount = postLikes.length;

  // Функция загрузки комментариев с сервера
  const loadComments = useCallback(async () => {
    setIsLoadingComments(true);
    await dispatch(fetchComments(post._id));
    setIsLoadingComments(false);
  }, [dispatch, post._id]);

  useEffect(() => {
    loadComments();
    dispatch(fetchPostLikes(post._id));
  }, [loadComments, dispatch, post._id]);

  const isFollowing = followingUsers.includes(user._id);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    if (isLikedByCurrentUser) {
      dispatch(unlikePost({ postId: post._id, userId: currentUserId }));
    } else {
      dispatch(likePost({ postId: post._id, userId: currentUserId }));
    }
  };

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await dispatch(unfollowUser(user._id));
    } else {
      await dispatch(followUser(user._id));
    }
    dispatch(fetchCurrentUser());
  };

  const handleEmojiClick = (emoji) => {
    setCommentText(commentText + emoji);
    setShowEmojis(false);
  };

  const onSendComment = async () => {
    if (!commentText.trim()) return;

    await dispatch(addComment({ postId: post._id, comment_text: commentText }));
    setCommentText(""); // Очищаем поле ввода

    loadComments(); // Перезагружаем комментарии после отправки нового
  };

  return (
    <div className={styles.postPage}>
      <div className={styles.header}>
        <Link to={`/profuser/${user._id}`} className={styles.headerBtn}>
          <img
            src={user.profile_image || "default-image-url"}
            alt="Profile"
            className={styles.avatar}
          />
          <p className={styles.username}>{user.username || "Unknown User"}</p>
        </Link>
        <button className={styles.followButton} onClick={handleFollowToggle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>

      <div>
        <div className={styles.description}>{post.caption}</div>
        <div className={styles.comments}>
          {isLoadingComments ? (
            <p>Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className={styles.comment}>
                <div className={styles.text}>
                  <img
                    src={
                      comment.user_id?.profile_image ||
                      "default-profile-image-url"
                    }
                    alt="Profile"
                    className={styles.commentAvatar}
                  />
                  <div className={styles.commentsText}>
                    <span className={styles.commentUsername}>
                      {comment.user_id?.username || "Anonymous"}
                    </span>{" "}
                    {comment.comment_text}
                    <div className={styles.like_5}>
                      <span>{getTimeAgo(comment.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.likesSection}>
          <div className={styles.likesSectionHeart}>
            <button
              className={styles.likesSectionBTN}
              onClick={handleLikeToggle}
            >
              <img
                src={isLikedByCurrentUser ? heartRedIcon : heartIcon}
                alt="Like"
              />
            </button>
            <span>{likesCount} likes</span>
          </div>
          <p className="p_10_400">1 day ago</p>
        </div>
        <div className={styles.commentInput}>
          <button
            className={styles.commentInputBtn}
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <img src={smileIcon} alt="Emoji" />
          </button>
          <input
            type="text"
            placeholder="Add comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className={styles.commentInputBtn2} onClick={onSendComment}>
            Send
          </button>
        </div>
      </div>
      {showEmojis && (
        <div className={styles.emojiPicker}>
          {popularEmojis.map((emoji) => (
            <span
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className={styles.emoji}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostPage;
