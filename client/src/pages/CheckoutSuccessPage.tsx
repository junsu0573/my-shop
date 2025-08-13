import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../shared/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { getCartThunk } from "../features/cart/cartSlice";

function CheckoutSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // 주문번호는 state로 전달
  const orderNum = location.state?.orderNum;
  const isFromCheckout = location.state?.fromCheckout; // 진입 체크

  useEffect(() => {
    // state 없이 접근하면 홈으로
    if (!isFromCheckout || !orderNum) {
      navigate("/", { replace: true });
    }
  }, [isFromCheckout, orderNum, navigate]);

  if (!orderNum) return null; // 잘못된 접근일 때 깜빡임 방지

  const handleClick = () => {
    if (user) dispatch(getCartThunk(user._id));
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">
          주문이 완료되었습니다 🎉
        </h1>
        <p className="text-lg mb-6">
          주문번호: <span className="font-mono">{orderNum}</span>
        </p>

        <p className="text-gray-600 mb-8">
          {'주문 내역은 "프로필 → 주문 내역"에서 \n확인하실 수 있습니다.'}
        </p>

        <Button title="홈으로 가기" className="w-full" onClick={handleClick} />
      </div>
    </div>
  );
}

export default CheckoutSuccessPage;
