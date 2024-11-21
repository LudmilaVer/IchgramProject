import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { $api } from '../../utils/api.ts';

export const fetchPostLikes = createAsyncThunk('likes/fetchPostLikes', async (postId) => {
  const response = await $api.get(`/likes/${postId}`);
  return { postId, likes: response.data };
});

export const likePost = createAsyncThunk('likes/likePost', async ({ postId, userId }) => {
  await $api.post(`/likes/${postId}`);
  return { postId, userId };
});

export const unlikePost = createAsyncThunk('likes/unlikePost', async ({ postId, userId }) => {
  await $api.delete(`/likes/${postId}`);
  return { postId, userId };
});

const likeSlice = createSlice({
  name: 'likes',
  initialState: { likesByPost: {}, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchPostLikes.fulfilled, (state, action) => {
      const { postId, likes } = action.payload;
      state.likesByPost[postId] = likes;
    })
    .addCase(likePost.fulfilled, (state, action) => {
      const { postId, userId } = action.payload;
      if (!state.likesByPost[postId]) state.likesByPost[postId] = [];
      state.likesByPost[postId].push({ user_id: userId });
    })
    .addCase(unlikePost.fulfilled, (state, action) => {
      const { postId, userId } = action.payload;
      if (state.likesByPost[postId]) {
        state.likesByPost[postId] = state.likesByPost[postId].filter(
          like => like.user_id !== userId
        );
      }
    });
  },
});

export default likeSlice.reducer;
