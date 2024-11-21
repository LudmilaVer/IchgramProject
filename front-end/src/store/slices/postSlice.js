// src/store/slices/postSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { $api } from "../../utils/api.ts";

// Получение всех постов
export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  const response = await $api.get("/post");
  return response.data;
});

// Получение всех постов текущего пользователя
export const fetchUserPosts = createAsyncThunk("post/fetchUserPosts", async () => {
  const response = await $api.get("/post/all"); // Получить посты текущего пользователя
  return response.data;
});

// Асинхронное действие для получения конкретного поста по ID
export const fetchPostById = createAsyncThunk(
  "post/fetchPostById",
  async (postId) => {
    const response = await $api.get(`/post/${postId}`);
    console.log("Response from fetchPostById:", response.data); // Логирование ответа API
    return response.data;
  }
);

// Получение комментариев к посту
export const fetchComments = createAsyncThunk(
  "post/fetchComments",
  async (postId) => {
    const response = await $api.get(`/comments/${postId}`);
    console.log("Fetch Comments Response:", response.data);
    return { postId, comments: response.data };
  }
);

// Асинхронное действие для добавления комментария
export const addComment = createAsyncThunk(
  "post/addComment",
  async ({ postId, comment_text }) => {
    const response = await $api.post(`/comments/${postId}`, { comment_text });
    return { postId, comment: response.data };
  }
);

// Действие для лайка поста
export const likePost = createAsyncThunk(
  "post/likePost",
  async ({ postId, userId }) => {
    await $api.post(`/post/${postId}/like/${userId}`);
    return postId;
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await $api.delete(`/post/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    currentPost: null,
    comments: {}, // Сохраняем комментарии для каждого поста
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPostById.pending, (state) => {
        console.log("Fetching post data...");
        state.status = "loading";
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        console.log("Fetched post data:", action.payload); // Debugging line
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        console.error("Failed to fetch post:", action.error);
        state.status = "failed";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        console.log("Fetch Comments Fulfilled:", comments);
        state.comments[postId] = comments;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
      
        if (state.comments[postId]) {
          state.comments[postId].push(comment);
        } else {
          state.comments[postId] = [comment];
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const postId = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likes_count += 1;
        }
      });
  },
});

export default postSlice.reducer;
