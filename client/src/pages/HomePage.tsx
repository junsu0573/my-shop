import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { useEffect } from "react";
import Button from "../shared/ui/button";
import { logout } from "../features/auth/authSlice";
import Header from "../widgets/Header";
import HeroSection from "../widgets/HeroSection";

function HomePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // 로그아웃 핸들러
  const clickHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="w-full h-full">
      <Header />
      <main>
        <HeroSection />
        <div className="w-full flex justify-center">
          <Button
            title="Logout"
            className="w-auto px-4"
            onClick={clickHandler}
          />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
