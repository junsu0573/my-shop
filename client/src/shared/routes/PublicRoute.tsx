import type React from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("token");

  // 이미 로그인한 사용자는 홈으로 리다이렉트
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
