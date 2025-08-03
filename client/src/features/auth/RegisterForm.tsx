import { Link, useNavigate } from "react-router-dom";
import Button from "../../shared/ui/button";
import Input from "../../shared/ui/input";
import type { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearError, logout, register } from "./authSlice";
import { useToast } from "../../shared/ui/ToastContext";

function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const isLoading = status === "loading";
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
  });

  // 회원가입 성공 시 알림 및 리다이렉트
  useEffect(() => {
    dispatch(clearError());
    if (status === "succeeded") {
      addToast("회원가입이 완료되었습니다.", "success");
      dispatch(clearError());
      navigate("/login");
    }
  }, [status, addToast]);

  // 유효성 검사
  const validateForm = () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.includes("@"))
      newErrors.email = "이메일을 입력해주세요.";
    if (formData.password.length < 6 || formData.password.length > 15)
      newErrors.password = "비밀번호는 6~15자리이어야 합니다.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요.";
    if (!formData.phone.trim()) newErrors.phone = "전화번호를 입력해주세요.";
    if (!formData.address.trim()) newErrors.address = "주소를 입력해주세요.";
    if (!formData.detailAddress.trim())
      newErrors.detailAddress = "상세주소를 입력해주세요.";

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
    formData.address += ` ${formData.detailAddress}`;
    const { confirmPassword, detailAddress, ...userData } = formData;
    dispatch(register(userData));
  };

  // input 필드
  const renderInput = (name: string, type: string, placeholder: string) => (
    <div>
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={handleChange}
        className={errors[name] ? "border-alert-error" : "border-transparent"}
      />
      {errors[name] && (
        <span className="text-alert-error text-sm">{errors[name]}</span>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-lg flex flex-col items-center justify-center p-5 border border-border rounded-lg bg-background shadow-md">
      <h2 className="mb-5">회원가입</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {renderInput("email", "text", "이메일")}
        {renderInput("password", "password", "비밀번호")}
        {renderInput("confirmPassword", "password", "비밀번호 확인")}
        {renderInput("name", "text", "이름")}
        {renderInput("phone", "text", "전화번호")}
        {renderInput("address", "text", "주소")}
        {renderInput("detailAddress", "text", "상세주소")}
        <Button
          title={isLoading ? "회원가입 중..." : "회원가입"}
          type="submit"
          disabled={isLoading}
        />
      </form>
      {error && <span className="text-alert-error text-sm mt-2">{error}</span>}
      <Link to="/login" className="mt-4 text-primary hover:underline">
        이미 계정이 있으신가요? 로그인
      </Link>
    </div>
  );
}

export default RegisterForm;
