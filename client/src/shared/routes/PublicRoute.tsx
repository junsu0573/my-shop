import type React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  // 이미 로그인한 사용자는 홈으로 리다이렉트
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
