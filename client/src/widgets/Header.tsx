import { Link, useNavigate } from "react-router-dom";
import Input from "../shared/ui/input";
import Button from "../shared/ui/button";
import { User, ShoppingCart, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  console.log("Here", user);
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-primary mr-5">한우마켓</h1>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="#"
              className="text-foreground hover:text-primary transition-colors"
            >
              홈
            </Link>
            <Link
              to="#"
              className="text-foreground hover:text-primary transition-colors"
            >
              등심
            </Link>
            <Link
              to="#"
              className="text-foreground hover:text-primary transition-colors"
            >
              안심
            </Link>
            <Link
              to="#"
              className="text-foreground hover:text-primary transition-colors"
            >
              갈비
            </Link>
            <Link
              to="#"
              className="text-foreground hover:text-primary transition-colors"
            >
              선물세트
            </Link>
          </nav>

          {/* 검색바 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input />
            </div>
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-2">
            {user ? (
              <Button variant="ghost" title={user.email} />
            ) : (
              <Button
                variant="ghost"
                title="로그인"
                icon={<User className="w-4 h-4" />}
                onClick={handleLogin}
              />
            )}

            <Button
              variant="ghost"
              icon={<ShoppingCart className="w-4 h-4" />}
            />
            <div className="md:hidden">
              <Button variant="ghost" icon={<Menu className="w-4 h-4" />} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
