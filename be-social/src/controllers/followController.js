import Follow from '../models/followModel.js';
import User from '../models/userModel.js';

// Получение списка подписчиков пользователя
export const getUserFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ followed_user_id: req.params.userId }).populate('follower_user_id', 'username');
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении подписчиков' });
  }
};

// Получение списка, на кого подписан пользователь
export const getUserFollowing = async (req, res) => {
  try {
    const following = await Follow.find({ follower_user_id: req.params.userId }).populate('followed_user_id', 'username');
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении списка подписок' });
  }
};

// Подписка на пользователя
export const followUser = async (req, res) => {
  const { userId, targetUserId } = req.params;
  console.log("userId:", userId, "targetUserId:", targetUserId);

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);
    console.log("User:", user, "Target User:", targetUser);

    if (!user || !targetUser) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const existingFollow = await Follow.findOne({ follower_user_id: userId, followed_user_id: targetUserId });
    if (existingFollow) {
      return res.status(400).json({ error: 'Вы уже подписаны на этого пользователя' });
    }

    const follow = new Follow({
      follower_user_id: userId,
      followed_user_id: targetUserId,
      created_at: new Date(),
    });

    await follow.save();

    user.following_count += 1;
    targetUser.followers_count += 1;

    await user.save();
    await targetUser.save();

    res.status(201).json({
      message: 'Подписка успешно оформлена',
      followers_count: targetUser.followers_count,
      following_count: user.following_count
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при подписке на пользователя' });
  }
};

// Отписка от пользователя
export const unfollowUser = async (req, res) => {
  const { userId, targetUserId } = req.params;

  try {
    const follow = await Follow.findOne({ follower_user_id: userId, followed_user_id: targetUserId });
    if (!follow) {
      return res.status(404).json({ error: 'Вы не подписаны на этого пользователя' });
    }

    await Follow.findByIdAndDelete(follow._id);

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    user.following_count -= 1;
    targetUser.followers_count -= 1;

    await user.save();
    await targetUser.save();

    res.status(200).json({
      message: 'Вы успешно отписались от пользователя',
      followers_count: targetUser.followers_count,
      following_count: user.following_count
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при отписке от пользователя' });
  }
};