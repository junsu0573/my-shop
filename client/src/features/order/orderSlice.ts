import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CreateOrder,
  getUserOrder,
  searchOrders,
  type OrderFormData,
  type OrderResponse,
  type UserOderResponse,
} from "./orderAPI";

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
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.error || "예기치 않은 오류 발생",
      detail: error.response?.data?.detail || [],
    });
  }
});

// 유저 주문 가져오기
export const getUserOrderThunk = createAsyncThunk<
  UserOderResponse, // 반환 타입
  { page: number }, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("order/userGet", async (page, { rejectWithValue }) => {
  try {
    const response = await getUserOrder(page);
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.error || "예기치 않은 오류 발생",
    });
  }
});

// 전체 주문 검색
export const searchOrdersThunk = createAsyncThunk<
  UserOderResponse, // 반환 타입
  { name: string; page: number }, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("order/get", async ({ name, page }, { rejectWithValue }) => {
  try {
    const response = await searchOrders({ name, page });
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.error || "예기치 않은 오류 발생",
    });
  }
});

// Slice
interface OrderState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  myOrders: UserOderResponse;
  orderList: UserOderResponse;
}

const initialState: OrderState = {
  status: "idle",
  error: null,
  myOrders: {
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  },
  orderList: {
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  },
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
      })
      // 유저 주문 가져오기
      .addCase(getUserOrderThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUserOrderThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myOrders = action.payload;
        state.error = null;
      })
      .addCase(getUserOrderThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      })
      // 전체 주문 검색
      .addCase(searchOrdersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchOrdersThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderList = action.payload;
        state.error = null;
      })
      .addCase(searchOrdersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      });
  },
});

export default orderSlice.reducer;
