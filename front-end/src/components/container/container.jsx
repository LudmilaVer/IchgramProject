import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import LogoName from "../../images/svg/ICHGRA 5.svg";
import Home from "../../images/svg/Vector.svg";
import HomeBlack from "../../images/svg/VectorBlack.svg";
import Search from "../../images/svg/search.svg";
import SearchBlack from "../../images/svg/searchBlack.svg";
import Explore from "../../images/svg/explore-svgrepo-com.svg";
import ExploreBlack from "../../images/svg/explore-solid-svgrepo-com.svg";
import Messanger from "../../images/svg/Messanger.svg";
import MessangerBlack from "../../images/svg/MessangerBlack.svg";
import Notification from "../../images/svg/Notification.svg";
import NotificationBlack from "../../images/svg/heart-svgrepo-com.svg";
import Create from "../../images/svg/Create.svg";
import CreateBlack from "../../images/svg/create-svgrepo-black.svg";
import Profile from "../../images/svg/Profile.svg";

import ListItem from "./ListItem";
import { fetchCurrentUser } from "../../store/slices/userSlice";
import styles from "./container.module.css";

function Container() {
  // const { i18n } = useTranslation();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user.currentUser);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((action) => {
      if (action.payload?.profile_image) {
        setUserAvatar(action.payload.profile_image);
      }
    });
  }, [dispatch]);

  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  // };

  return (
    <div className={styles.containerCont}>
      <div className={styles.container}>
        <div className={styles.container_img}>
          <img src={LogoName} alt="logo" />
        </div>
        <div className={styles.container_list}>
          <ListItem
            icon={Home}
            activeIcon={HomeBlack}
            textKey="home"
            path="/home"
          />
          <ListItem
            icon={Search}
            activeIcon={SearchBlack}
            textKey="search"
            path="/search"
          />
          <ListItem
            icon={Explore}
            activeIcon={ExploreBlack}
            textKey="explore"
            path="/explore"
          />
          <ListItem
            icon={Messanger}
            activeIcon={MessangerBlack}
            textKey="messages"
            path="/messages"
            className={styles.hideOnSmallScreen}
          />
          <ListItem
            icon={Notification}
            activeIcon={NotificationBlack}
            textKey="notification"
            path="/notifications"
            className={styles.hideOnSmallScreen}
          />
          <ListItem
            icon={Create}
            activeIcon={CreateBlack}
            textKey="create"
            path="/create"
          />
          {/* <div className={styles.container_profile}> */}
            <ListItem
              icon={userAvatar || Profile}
              textKey="profile"
              path="/profile"
              className={styles.ImgSmallScreen}
            />
          {/* </div> */}
        </div>
      </div>

    </div>
  );
}

export default Container;
