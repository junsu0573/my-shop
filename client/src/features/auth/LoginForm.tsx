import { Link, useNavigate } from "react-router-dom";
import Button from "../../shared/ui/button";
import Input from "../../shared/ui/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuth } from "./authSlice";
import type { AppDispatch, RootState } from "../../app/store";
import { useToast } from "../../shared/ui/ToastContext";

function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { status, error } = useSelector((state: RootState) => state.auth);
  const isLoading = status === "loading";
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  // 에러 초기화
  useEffect(() => {
    dispatch(resetAuth());
  }, []);

  // 로그인 성공 시 알림 및 리다이렉트
  useEffect(() => {
    if (status === "succeeded") {
      addToast("로그인에 성공했습니다.", "success");
      dispatch(resetAuth());
      navigate("/");
    }
  }, [status, addToast, navigate]);

  // 유효성 검사
  const validateForm = () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.includes("@"))
      newErrors.email = "이메일을 입력해주세요.";
    if (!formData.password.trim())
      newErrors.password = "비밀번호를 입력해주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // onChange 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // onSubmit 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(login(formData));
  };

  // input 필드
  const renderInput = (name: string, type: string, placeholder: string) => (
    <div>
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={handleChange}
        className={`bg-input-background ${
          errors[name] ? "border-alert-error" : "border-transparent"
        }`}
      />
      {errors[name] && (
        <span className="text-alert-error text-sm">{errors[name]}</span>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-lg flex flex-col items-center justify-center p-5 border border-border rounded-lg bg-background shadow-md">
      <h2 className="mb-5">로그인</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {renderInput("email", "text", "아이디(이메일)")}
        {renderInput("password", "password", "비밀번호")}
        <Button
          title={isLoading ? "로그인 중..." : "로그인"}
          type="submit"
          disabled={isLoading}
        />
      </form>
      {error && <span className="text-alert-error text-sm mt-2">{error}</span>}
      <Link to="/register" className="mt-4 text-primary hover:underline">
        계정이 없으신가요? 회원가입
      </Link>
    </div>
  );
}

export default LoginForm;
