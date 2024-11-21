// MessagesPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import socket from "../../utils/socket";
import { useSelector, useDispatch } from "react-redux";
import { fetchLastMessageForUser, fetchUsers } from "../../store/slices/userSlice";
import ItCareer from "../../components/itcareer/ItCareer";
import Nik from "../../images/png/empty.jpg";
import smileIcon from "../../images/svg/smile.svg";
import send from "../../images/png/send.png";
import MessageText from "./MessageText";
import styles from "./MessagePage.module.css";

const popularEmojis = ["😂", "😍", "😢", "👏", "🔥", "🥳", "❤️"];

function MessagesPage() {
  const { userId: paramUserId } = useParams();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.user.currentUser);
  const [targetUser, setTargetUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [activeUserId, setActiveUserId] = useState(paramUserId);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Определим lastMessageDate на основе targetUser
  const lastMessageDate = useSelector((state) =>
    targetUser ? state.user.lastMessages[targetUser._id]?.lastMessageDate : null
  );

  useEffect(() => {
    dispatch(fetchUsers()).then((res) => {
      const usersList = res.payload;
      if (usersList && usersList.length > 0) {
        const initialUser = paramUserId 
          ? usersList.find(user => user._id === paramUserId) 
          : usersList[0];
        
        if (initialUser) {
          setTargetUser(initialUser);
          setActiveUserId(initialUser._id);
          dispatch(fetchLastMessageForUser(initialUser._id));
          socket.emit("joinRoom", { targetUserId: initialUser._id });
        }
      }
    });
  }, [dispatch, paramUserId]);

  useEffect(() => {
    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("loadMessages");
    };
  }, []);

  const handleSelectUser = (user) => {
    setTargetUser(user);
    setActiveUserId(user._id);
    setMessages([]);
    dispatch(fetchLastMessageForUser(user._id));
    socket.emit("joinRoom", { targetUserId: user._id });
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && targetUser) {
      const messageData = {
        targetUserId: targetUser._id,
        messageText,
      };

      socket.emit("sendMessage", messageData);
      setMessageText("");
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessageText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <ItCareer onSelectUser={handleSelectUser} activeUserId={activeUserId} />
      <div className={styles.message}>
        {targetUser ? (
          <>
            <div className={styles.message_up}>
              <div className={styles.message_img}>
                <img src={targetUser.profile_image || Nik} alt="avatar" />
              </div>
              <div className={styles.message_content}>
                <p className="p_16Bold">{targetUser.username || "Username"}</p>
              </div>
            </div>
            <div className={styles.message_down}>
              <div className={styles.messageDownMessage}>
                <div className={styles.message_avatar}>
                  <div className={styles.message_avatar_img}>
                    <img src={targetUser.profile_image || Nik} alt="avatar" />
                  </div>
                  <div className={styles.message_avatar_name}>
                    <h3 className="h3">{targetUser.username || "Username"}</h3>
                    <p className="p_14SmallGrey">
                      {targetUser.bio || "User bio not provided"}
                    </p>
                  </div>
                  <div className={styles.message_avatar_btn}>
                    <Link to={`/profuser/${targetUser._id}`} className={styles.message_avatar_Link}>
                      <p>View profile</p>
                    </Link>
                  </div>
                  <div>
                    <p className={styles.messageDownLineTime}>
                      {lastMessageDate
                        ? new Date(lastMessageDate).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                        : "No messages yet"}
                    </p>
                  </div>
                </div>
                <div className={styles.message_mess}>
                  <MessageText
                    messages={messages}
                    authUser={authUser}
                    targetUser={targetUser}
                  />
                </div>
              </div>

              <div className={styles.message_write}>
                <button onClick={toggleEmojiPicker}>
                  <img src={smileIcon} alt="smile" />
                </button>
                <input
                  type="text"
                  className="p_14Small"
                  placeholder="Write message"
                  value={messageText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button className={styles.send} onClick={handleSendMessage}>
                  <img src={send} alt="send" />
                </button>
              </div>
              {showEmojiPicker && (
                <div className={styles.emojiPicker}>
                  {popularEmojis.map((emoji, index) => (
                    <span
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className={styles.emoji}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
