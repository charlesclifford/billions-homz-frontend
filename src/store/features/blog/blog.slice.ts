import { IPost } from "@/interfaces/blog.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostFilterState {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isPublished?: boolean;
  featured?: boolean;
}

interface BlogState {
  loading: boolean;
  posts: IPost[];
  selectedPost: IPost | null;
  error: string | null;
  filter: PostFilterState;
}

export const SLICE_NAME = "blog";

export const initialFilterState: PostFilterState = {
  page: 1,
  limit: 10,
};

const initialState: BlogState = {
  loading: false,
  posts: [],
  selectedPost: null,
  error: null,
  filter: initialFilterState,
};

const blogSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setPosts(state, action: PayloadAction<IPost[]>) {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedPost(state, action: PayloadAction<IPost | null>) {
      state.selectedPost = action.payload;
    },
    setFilter(state, action: PayloadAction<Partial<PostFilterState>>) {
      state.filter = { ...state.filter, ...action.payload };
      // Reset to first page when filters change (except page/limit)
      if (action.payload.search !== undefined) {
        state.filter.page = 1;
      }
    },
    resetFilter(state) {
      state.filter = initialFilterState;
    },
  },
});

export const { setLoading, setPosts, setSelectedPost, setFilter, resetFilter } =
  blogSlice.actions;

export default blogSlice.reducer;
