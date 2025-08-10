import { Link, useNavigate } from "react-router-dom";
import Button from "../shared/ui/button";
import { User, ShoppingCart, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { useEffect, useState } from "react";
import CartDrawer from "../features/cart/CartDrawer";
import { getCartThunk } from "../features/cart/cartSlice";

function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);
  const { data } = useSelector((state: RootState) => state.cart);

  // Cart 정보 fetch
  useEffect(() => {
    if (user) dispatch(getCartThunk(user._id));
  }, [user]);

  const linkToAdminPage = () => {
    navigate("/admin");
  };
  const linkToLoginPage = () => {
    navigate("/login");
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <span className="text-2xl sm:text-4xl font-bold text-primary sm:mr-10">
              한우마켓
            </span>
          </Link>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex md:flex-1 items-center space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              홈
            </Link>
            <Link
              to="/products"
              className="text-foreground hover:text-primary transition-colors"
            >
              전체상품
            </Link>
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              선물세트
            </Link>
          </nav>

          {/* 검색바 */}
          {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input />
            </div>
          </div> */}

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-0 sm:space-x-2">
            {user?.role === "admin" && (
              <Button
                variant="ghost"
                title="관리자페이지"
                onClick={linkToAdminPage}
              />
            )}
            {user ? (
              <Button variant="ghost" title={user.name} />
            ) : (
              <Button
                variant="ghost"
                title="로그인"
                icon={<User size={16} />}
                onClick={linkToLoginPage}
              />
            )}
            {user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  icon={<ShoppingCart size={16} />}
                  onClick={() => setOpenCart(true)}
                />

                <span
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
                 rounded-full bg-red-400 text-[10px] font-bold text-white"
                >
                  {data?.cart?.products?.length ?? 0}
                </span>
              </div>
            )}

            <div className="md:hidden">
              <Button variant="ghost" icon={<Menu size={16} />} />
            </div>
          </div>
        </div>
      </div>
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </header>
  );
}

export default Header;
