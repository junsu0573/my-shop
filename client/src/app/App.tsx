import { useEffect } from "react";
import { fetchCurrentUser } from "../features/auth/authSlice.ts";
import AppRouter from "./AppRouter.tsx";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store.ts";
import { fetchCategories } from "../features/product/productSlice.ts";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser()); // 사용자 정보 요청
    dispatch(fetchCategories()); // 카테고리 정보 요청
  }, [dispatch]);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
