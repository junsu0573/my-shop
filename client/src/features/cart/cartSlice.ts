import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AddToCart,
  deleteItem,
  getCart,
  updateItem,
  type CartFormdata,
  type CartResponse,
} from "./cartAPI";

// Slice
interface CartState {
  status: "idle" | "loading" | "succeeded" | "failed";
  data: CartResponse | null;
  totalPrice: number;
  shippingPrice: number;
  error: string | null;
}

const initialState: CartState = {
  status: "idle",
  data: null,
  totalPrice: 0,
  shippingPrice: 5000,
  error: null,
};

// 총액 계산
const getTotalPrice = (state: CartState) => {
  const products = state.data?.cart?.products ?? [];
  const subtotal = products.reduce((sum, item) => {
    const price = Number(item?.productId?.price ?? 0);
    const qty = Number(item?.quantity ?? 0);
    return sum + price * qty;
  }, 0);

  const FREE_SHIP_THRESHOLD = 50000; // 무료 배송비 기준
  state.shippingPrice = subtotal >= FREE_SHIP_THRESHOLD ? 0 : 5000;
  state.totalPrice = subtotal + state.shippingPrice;
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
  CartFormdata, // payload 타입
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

// 장바구니 상품 삭제 Thunk
export const deleteItemThunk = createAsyncThunk<
  CartResponse, // 반환 타입
  { userId: string; productId: string }, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("cart/delete", async (formData, { rejectWithValue }) => {
  try {
    const response = await deleteItem(formData.userId, formData.productId);
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.message || "예기치 않은 오류 발생",
    });
  }
});

// 장바구니 상품 수량 수정 Thunk
export const updateItemThunk = createAsyncThunk<
  CartResponse, // 반환 타입
  { userId: string; productId: string; quantity: number }, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("cart/update", async (formData, { rejectWithValue }) => {
  try {
    const response = await updateItem(
      formData.userId,
      formData.productId,
      formData.quantity
    );
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
  reducers: {
    caculateTotal(state) {
      getTotalPrice(state);
    },
  },
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
        getTotalPrice(state);
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
      })
      // 장바구니 상품 삭제
      .addCase(deleteItemThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteItemThunk.fulfilled, (state, aciton) => {
        state.status = "idle";
        state.data = aciton.payload;
        state.error = null;
        getTotalPrice(state);
      })
      .addCase(deleteItemThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      })
      // 장바구니 상품 수량 수정
      .addCase(updateItemThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateItemThunk.fulfilled, (state, aciton) => {
        state.status = "idle";
        state.data = aciton.payload;
        state.error = null;
        getTotalPrice(state);
      })
      .addCase(updateItemThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      });
  },
});

export const { caculateTotal } = cartSlice.actions;
export default cartSlice.reducer;
