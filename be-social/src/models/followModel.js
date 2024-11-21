import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
  follower_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followed_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
});


const Follow = mongoose.model('Follow', followSchema);
export default Follow;