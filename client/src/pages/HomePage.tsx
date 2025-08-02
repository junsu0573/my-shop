import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { useEffect } from "react";
import Button from "../shared/ui/button";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 로그아웃 핸들러
  const clickHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Welcome to the Home Page</h1>
      <Button
        title="Logout"
        className="w-auto px-4"
        onClick={clickHandler}
      ></Button>
    </div>
  );
}

export default HomePage;
