import type React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../app/store";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);

  // 이미 로그인한 사용자는 홈으로 리다이렉트
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
