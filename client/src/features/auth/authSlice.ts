import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser } from "./authAPI";
import type { RegisterFormData, UserResponse } from "./authAPI";

// Thunk
export const register = createAsyncThunk<
  UserResponse, // 반환 타입
  RegisterFormData, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("user/register", async (formData: RegisterFormData, { rejectWithValue }) => {
  try {
    const response = await registerUser(formData);
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.message || "예기치 않은 오류 발생",
    });
  }
});

// Slice
interface AuthState {
  user: UserResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
