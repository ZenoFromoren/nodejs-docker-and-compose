import { createSlice } from '@reduxjs/toolkit';
import { fetchLastPosts, fetchPostById, fetchPosts } from '../thunks/postsThunks';
import { TPost } from '../../utils/types';

export interface IPostsState {
  posts: TPost[];
  lastPosts: TPost[];
  currentPost: TPost | null;
  isLoading: boolean;
}

const initialState: IPostsState = {
  posts: [],
  lastPosts: [],
  currentPost: null,
  isLoading: false
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  selectors: {
    selectPosts: (state) => state.posts,
    selectLastPosts: (state) => state.lastPosts,
    selectCurrentPost: (state) => state.currentPost,
    selectIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLastPosts.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.isLoading = false;
    })
    .addCase(fetchLastPosts.fulfilled, (state, action) => {
      state.lastPosts = action.payload;
      state.isLoading = false;
    })
    .addCase(fetchPostById.fulfilled, (state, action) => {
      state.currentPost = action.payload;
    })
  }
});

export const postsSelectors = postsSlice.selectors;
export default postsSlice.reducer;
