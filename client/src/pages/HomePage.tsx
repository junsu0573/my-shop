import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import Button from "../shared/ui/button";
import { logout } from "../features/auth/authSlice";
import Header from "../widgets/Header";
import HeroSection from "../widgets/HeroSection";
import PopularProductsSection from "../widgets/PopularProductsSection";

function HomePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // 로그아웃 핸들러
  const clickHandler = () => {
    dispatch(logout());
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PopularProductsSection />
      </main>
      <div className="w-full flex justify-center">
        {user && (
          <Button
            title="Logout"
            className="w-auto px-4"
            onClick={clickHandler}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
