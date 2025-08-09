import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AddToCart,
  getCart,
  type CartFormdata,
  type CartResponse,
} from "./cartAPI";

// Slice
interface CartState {
  status: "idle" | "loading" | "succeeded" | "failed";
  data: CartResponse | null;
  error: string | null;
}

const initialState: CartState = {
  status: "idle",
  data: null,
  error: null,
};

// 장바구니 조회 Thunk
export const getCartThunk = createAsyncThunk<
  CartResponse, // 반환 타입
  string, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("cart/fetch", async (userId, { rejectWithValue }) => {
  try {
    const response = await getCart(userId);
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.message || "예기치 않은 오류 발생",
    });
  }
});

// 장바구니 추가 Thunk
export const AddToCartThunk = createAsyncThunk<
  CartResponse, // 반환 타입
  CartFormdata, // payload 타입 없음
  { rejectValue: { status: string; message: string } } // 에러 타입
>("cart/add", async (formData, { rejectWithValue }) => {
  try {
    const response = await AddToCart(formData);
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.message || "예기치 않은 오류 발생",
    });
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 장바구니 조회
      .addCase(getCartThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, aciton) => {
        state.status = "idle";
        state.data = aciton.payload;
        state.error = null;
      })
      // 장바구니 추가
      .addCase(AddToCartThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(AddToCartThunk.fulfilled, (state, aciton) => {
        state.status = "idle";
        state.data = aciton.payload;
        state.error = null;
      })
      .addCase(AddToCartThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      });
  },
});

export default cartSlice.reducer;
