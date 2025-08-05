import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  getAllCategories,
  type Category,
  type ProductFormData,
} from "./productAPI";

// Slice
interface ProductState {
  status: "idle" | "loading" | "succeeded" | "failed";
  categories: Category[];
  error: string | null;
}

const initialState: ProductState = {
  status: "idle",
  categories: [],
  error: null,
};

// 카테고리 fetch Thunk
export const fetchCategories = createAsyncThunk<
  Category[], // 반환 타입
  void, // payload 타입 없음
  { rejectValue: { status: string; message: string } } // 에러 타입
>("category", async (_, { rejectWithValue }) => {
  try {
    const response = await getAllCategories();
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.message || "예기치 않은 오류 발생",
    });
  }
});

// 상품 생성 Thunk
export const createProductThunk = createAsyncThunk<
  ProductFormData, // 반환 타입
  ProductFormData, // payload 타입
  { rejectValue: { status: string; message: string } } // 에러 타입
>("product/create", async (productData, { rejectWithValue }) => {
  try {
    const response = await createProduct(productData);
    return response;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.message || "예기치 않은 오류 발생",
    });
  }
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 카테고리 fetch
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      })
      // 상품 생성
      .addCase(createProductThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        console.log(action.payload);
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      });
  },
});

export default productSlice.reducer;
