import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 회원가입 폼 타입
export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
}

// 회원가입 응답 타입
export interface UserResponse {
  _id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
  role: string;
}

// 로그인 폼 타입
export interface LoginFormData {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  user: UserResponse;
  token: string;
}

// 회원가입 요청
export const registerUser = async (
  formData: RegisterFormData
): Promise<UserResponse> => {
  const response = await axios.post(`${BASE_URL}/user/register`, formData);
  return response.data;
};

// 로그인 요청
export const loginUser = async (
  formData: LoginFormData
): Promise<LoginResponse> => {
  const response = await axios.post(`${BASE_URL}/auth/login`, formData);
  return response.data;
};

// 사용자 정보 요청
export const fetchUser = async (): Promise<UserResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("토큰이 없습니다.");
  const response = await axios.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data.user;
};

// 구글 로그인
export const googleLogin = async (
  googleToken: string
): Promise<LoginResponse> => {
  const response = await axios.post(`${BASE_URL}/auth/google`, {
    gToken: googleToken,
  });
  return response.data;
};
