import LoginForm from "../features/auth/LoginForm";
import logoImg from "../assets/thumbs_up_cow.svg";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-background min-h-screen px-4">
      <Link to="/" className="mb-6">
        <img src={logoImg} alt="logo" className="w-30 -mb-6" />
        <span className="text-4xl font-bold text-primary">한우마켓</span>
      </Link>

      <LoginForm />
    </div>
  );
}

export default LoginPage;
