import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./CreatePost.module.css";
import Cloud from "../../images/svg/Cloud.svg";
import Ava from "../../images/png/ava1.png";

const popularEmojis = [
  "😂", "😍", "😢", "👏", "🔥", "🥳", "❤️", "🤔", "😘", "🎉", "😆", "😊", 
  "😁", "😎", "🤗", "🙌", "👌", "👍", "💪", "🥰", "😜", "🤩", "🤯", "🥺", 
  "😅", "🤣", "😋", "😇", "🤤", "😈", "🥴", "😏", "🤓", "🙄", "😩", "🤥", 
  "😴", "💀", "👻", "😳", "😤", "😱", "💩", "🤡","😂", "😍", "😢", "👏", "🔥", "🥳", "❤️", "🤔", "😘", "🎉", "😆", "😊", "😁", "😎", "🤗", "🙌", "👌", "👍", "💪", "🥰", "😜", "🤩", "🤯", "🥺", "😅", "🤣", "😋", "😇", "🤤", "😈", "🥴", "😏", "🤓", "🙄", "😩", "🤥", "😴", "💀", "👻", "😳", "😤", "😱", "💩","🤣", "😋", "😇", "🤤", "😈", "🥴", "😏", "🤓", "🙄", "😩", "🤥"
];


function CreatePosts({ onShare }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Состояние для отображения смайликов

  const currentUser = useSelector((state) => state.user.currentUser);
  const profileImage = currentUser?.profile_image || Ava;
  const username = currentUser?.username || "Username";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleShareClick = () => {
    if (!image) {
      alert("Пожалуйста, загрузите изображение.");
      return;
    }
    onShare({ text, image });
  };

  const handleEmojiClick = (emoji) => {
    setText((prevText) => prevText + emoji);
    setShowEmojiPicker(false); // Скрываем панель смайликов после выбора
  };

  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Create new post</p>
          <button className={styles.shareButton} onClick={handleShareClick}>
            Share
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.uploadSection}>
            {preview ? (
              <img src={preview} alt="Preview" className={styles.previewImage} />
            ) : (
              <>
                <img src={Cloud} alt="Upload" className={styles.uploadIcon} />
                <p>Upload Image</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.uploadInput}
              style={{ opacity: 0, position: "absolute", cursor: "pointer", top: 0, left: 0, width: "100%", height: "100%" }}
            />
          </div>
          <div className={styles.detailsSection}>
            <div className={styles.userInfo}>
              <img src={profileImage} alt="avatar" className={styles.avatar} />
              <span className={styles.username}>{username}</span>
            </div>
            <textarea
              className={styles.textarea}
              placeholder="Write a caption..."
              maxLength="200"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className={styles.footer}>
              <button
                className={styles.emojiButton}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😊
              </button>
              <span>{text.length}/200</span>
            </div>
            {/* Отображение панели смайликов */}
            
            <div className={styles.footerEnd}>
            {showEmojiPicker && (
              <div className={styles.emojiPicker}>
                {popularEmojis.map((emoji) => (
                  <span
                    key={emoji}
                    className={styles.emoji}
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePosts;
