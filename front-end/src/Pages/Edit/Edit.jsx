import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, updateUserProfile } from "../../store/slices/userSlice";
import styles from "./Edit.module.css";
import placeholderImage from "../../images/png/empty.jpg";

function Edit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, status, error } = useSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    } else {
      setUsername(currentUser.username || "");
      setFullName(currentUser.full_name || "");
      setBio(currentUser.bio || "");
    }
  }, [dispatch, currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
  
    const formData = new FormData();
    console.log("FormData перед отправкой:", formData.get("profile_image"));
    formData.append("username", username);
    formData.append("full_name", fullName);
    formData.append("bio", bio);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }
  
    const result = await dispatch(updateUserProfile(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/profile");
    }
  };
  

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Ошибка загрузки профиля: {error}</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Edit profile</h3>
      <div className={styles.profileHeader}>
        <img
          src={profileImage ? URL.createObjectURL(profileImage) : currentUser?.profile_image || placeholderImage}
          alt="Profile"
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <p className={styles.username}>{username}</p>
          <p className={styles.description}>{bio || "Bio not provided."}</p>
        </div>
        <button className={styles.newPhotoButton}>
          <label htmlFor="profileImage">New photo</label>
          <input
            type="file"
            id="profileImage"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </button>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formInp}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.formInp}>
          <label className={styles.label}>Full Name</label>
          <input
            type="text"
            className={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className={styles.formInp}>
          <label className={styles.label}>About</label>
          <textarea
            className={styles.textarea}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength="150"
          />
        </div>
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
      </form>
    </div>
  );
}

export default Edit;
