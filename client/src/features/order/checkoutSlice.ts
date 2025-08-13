import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CreateOrder,
  type OrderFormData,
  type OrderResponse,
} from "./checkoutAPI";

// 주문 생성 Thunk
export const createOrderThunk = createAsyncThunk<
  OrderResponse, // 반환 타입
  OrderFormData, // payload 타입
  { rejectValue: { status: string; message: string; detail: [] } } // 에러 타입
>("order/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await CreateOrder(formData);
    return response;
  } catch (error: any) {
    console.log("error:", error.response?.data);
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.error || "예기치 않은 오류 발생",
      detail: error.response?.data?.detail || [],
    });
  }
});

// Slice
interface OrderState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  status: "idle",
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 주문 생성
      .addCase(createOrderThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      });
  },
});

export default orderSlice.reducer;
