import { useEffect } from "react";
import { fetchCurrentUser } from "../features/auth/authSlice.ts";
import AppRouter from "./AppRouter.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store.ts";
import { fetchCategories } from "../features/product/productSlice.ts";
import { getCartThunk } from "../features/cart/cartSlice.ts";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser()); // 사용자 정보 요청
    if (user) dispatch(getCartThunk(user._id)); // 장바구니 정보 요청
    dispatch(fetchCategories()); // 카테고리 정보 요청
  }, [dispatch, user]);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
