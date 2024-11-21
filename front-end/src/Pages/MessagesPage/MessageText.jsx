import React from "react";
import Nik from "../../images/png/empty.jpg";
import styles from "./MessageText.module.css";

function MessageText({ messages, authUser, targetUser }) {
  return (
    <div className={styles.chatContainer}>
      {messages.map((message, index) => (
        <div key={index} className={styles.chatContainerCont}>
          {message.sender_id === authUser?._id ? (
            <>
              <div className={`${styles.message} ${styles.messageRight}`}>
                <div className={styles.messageText}>{message.message_text}</div>
              </div>
              <img
                src={authUser?.profile_image || Nik}
                alt="Avatar"
                className={styles.avatar}
              />
            </>
          ) : (
            <>
              <img
                src={targetUser?.profile_image || Nik}
                alt="Avatar"
                className={styles.avatar}
              />
              <div className={`${styles.message} ${styles.messageLeft}`}>
                <div className={styles.messageText}>{message.message_text}</div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MessageText;
