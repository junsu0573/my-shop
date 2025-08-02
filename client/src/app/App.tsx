import { useEffect } from "react";
import { fetchCurrentUser } from "../features/auth/authSlice.ts";
import AppRouter from "./AppRouter.tsx";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store.ts";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  // 사용자 정보 요청
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
