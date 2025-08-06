import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  getAllCategories,
  getProduct,
  type Category,
  type Product,
  type ProductFormData,
  type ProductListResponse,
  type ProductQuery,
} from "./productAPI";
import { uploadImageThunk } from "../image/uploadImageToS3";

// Slice
interface ProductState {
  status: "idle" | "loading" | "succeeded" | "failed";
  categories: Category[];
  error: string | null;
  productsData: ProductListResponse;
}

const initialState: ProductState = {
  status: "idle",
  categories: [],
  error: null,
  productsData: {
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  },
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

// 상품 검색 Thunk
export const getProductList = createAsyncThunk<
  ProductListResponse, // 반환값
  ProductQuery, // payload (query)
  { rejectValue: { status: string; message: string } } // 에러 반환 타입
>("product/fetchAll", async (query, { rejectWithValue }) => {
  try {
    const response = await getProduct(query);
    return response; // { data[], total, page, totalPages }
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
  reducers: {
    resetProduct: (state) => {
      state.status = "idle";
      state.error = null;
    },
    setError: (state, action) => {
      // 외부 에러 컨트롤 (imageToS3)
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 카테고리 fetch
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      })
      // 이미지 업로드
      .addCase(uploadImageThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadImageThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      })
      // 프로덕트 생성
      .addCase(createProductThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      })
      // 프로덕트 검색
      .addCase(getProductList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.status = "idle";
        state.productsData = action.payload;
        state.error = null;
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "예기치 않은 오류 발생";
      });
  },
});

export const { resetProduct, setError } = productSlice.actions;
export default productSlice.reducer;
