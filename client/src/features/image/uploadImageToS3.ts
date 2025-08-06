import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_URL;

export const uploadImageThunk = createAsyncThunk<
  string,
  File,
  { rejectValue: { status: string; message: string } }
>("upload/image", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${BASE_URL}/upload/image`, formData);
    return res.data.imageUrl;
  } catch (error: any) {
    return rejectWithValue({
      status: "failed",
      message: error.response?.data?.message || "예기치 않은 오류 발생",
    });
  }
});
