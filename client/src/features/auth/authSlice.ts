import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, fetchUser, googleLogin } from "./authAPI";
import type {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  UserResponse,
} from "./authAPI";

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

// 회원가입 Thunk
export const register = createAsyncThunk<
  UserResponse, // 반환 타입
  RegisterFormData, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("user/register", async (formData, { rejectWithValue }) => {
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

// 로그인 Thunk
export const login = createAsyncThunk<
  LoginResponse, // 반환 타입
  LoginFormData, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await loginUser(formData);
    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem("token", `Bearer ${response.token}`);
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.message || "예기치 않은 오류 발생",
    });
  }
});

// 사용자 정보 요청 Thunk
export const fetchCurrentUser = createAsyncThunk<
  UserResponse, // 반환 타입
  void, // payload 타입 없음
  { rejectValue: { status: string; message: string } } // 에러 타입
>("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchUser();
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.message || "예기치 않은 오류 발생",
    });
  }
});

// 구글 로그인 Thunk
export const googleLoginThunk = createAsyncThunk<
  LoginResponse, // 반환 타입
  string, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("auth/google", async (googleToken, { rejectWithValue }) => {
  try {
    const response = await googleLogin(googleToken);
    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem("token", `Bearer ${response.token}`);
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "예기치 않은 오류 발생",
    });
  }
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      state.status = "idle";
      state.error = null;
    },
    resetAuth: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 회원가입
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      })
      // 로그인
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      })
      // 구글 로그인
      .addCase(googleLoginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(googleLoginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      })
      // 사용자 정보 요청
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        localStorage.removeItem("token");
      });
  },
});

export const { logout, resetAuth } = authSlice.actions;
export default authSlice.reducer;
