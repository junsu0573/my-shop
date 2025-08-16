import { Link } from "react-router-dom";
import RegisterForm from "../features/auth/RegisterForm";
import logoImg from "../assets/thumbs_up_cow.svg";
function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Link to="/" className="mb-6">
        <img src={logoImg} alt="logo" className="w-30 -mb-6" />
        <span className="text-4xl font-bold text-primary">한우마켓</span>
      </Link>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
