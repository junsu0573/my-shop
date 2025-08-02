import { Link } from "react-router-dom";
import Button from "../../shared/ui/button";
import Input from "../../shared/ui/input";

function LoginForm() {
  return (
    <div className="w-full max-w-lg flex flex-col items-center justify-center p-5 border border-border rounded-lg bg-background shadow-md">
      <h2 className="mb-5">로그인</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("로그인 폼 제출");
        }}
        className="w-full flex flex-col gap-4"
      >
        <Input type="text" placeholder="아이디(이메일)" />
        <Input type="password" placeholder="비밀번호" />
        <Button title="로그인" type="submit" />
      </form>
      <Link to="/register" className="mt-4 text-primary hover:underline">
        계정이 없으신가요? 회원가입
      </Link>
    </div>
  );
}

export default LoginForm;
