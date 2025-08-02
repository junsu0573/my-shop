import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 회원가입 폼 타입
export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
}

// 회원가입 응답 타입
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
}

// 회원가입 요청
export const registerUser = async (
  formData: RegisterFormData
): Promise<UserResponse> => {
  const response = await axios.post(`${BASE_URL}/user/register`, formData);
  return response.data;
};
