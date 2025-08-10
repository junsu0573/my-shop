import { useEffect } from "react";
import {
  X,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Button from "../../shared/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { deleteItemThunk, updateItemThunk } from "./cartSlice";
import { useNavigate } from "react-router-dom";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function CartDrawer({ open, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { data, status, totalPrice, shippingPrice } = useSelector(
    (state: RootState) => state.cart
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = status === "loading";
  const products = data?.cart?.products ?? [];

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // 상품 삭제 버튼 핸들러
  const handleDeleteProduct = (productId: string) => {
    if (!user) return;
    dispatch(deleteItemThunk({ userId: user._id, productId }));
  };

  // 상품 수량 조절 핸들러
  const handleUpdateProduct = (productId: string, quantity: number) => {
    if (!user) return;
    dispatch(updateItemThunk({ userId: user._id, productId, quantity }));
  };

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* 백드롭 */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 사이드바 */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
        flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <h3>장바구니</h3>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            icon={<X size={20} />}
            disabled={isLoading}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <h1>로딩중...</h1>
          ) : !data?.cartQty ? (
            <EmptyState />
          ) : (
            <ul className="space-y-4">
              {products &&
                products.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 rounded-2xl border border-border p-3"
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-xl">
                      <img
                        src={item.productId.imageUrl}
                        alt={item.productId.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3>{item.productId.name}</h3>
                          <span className="text-sm text-muted">
                            {item.productId.stock}개 남음
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            handleDeleteProduct(item.productId._id)
                          }
                          icon={<Trash2 size={14} />}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-xl border border-border">
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleUpdateProduct(
                                item.productId._id,
                                item.quantity - 1
                              )
                            }
                            className="rounded-xl disabled:bg-transparent"
                            icon={<Minus size={12} />}
                            disabled={isLoading || item.quantity <= 1}
                          />

                          <span className="w-10 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleUpdateProduct(
                                item.productId._id,
                                item.quantity + 1
                              )
                            }
                            className="rounded-xl disabled:bg-transparent"
                            icon={<Plus size={12} />}
                            disabled={
                              isLoading || item.quantity >= item.productId.stock
                            }
                          />
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted">
                            개당 ₩{item.productId.price?.toLocaleString()}
                          </p>
                          <p className="font-semibold">
                            ₩
                            {(
                              item.productId.price * item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Footer  */}
        <div className="border-t border-border p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted">소계</span>
            <span className="text-lg font-semibold">
              ₩{totalPrice.toLocaleString()}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm text-muted">
            <Truck size={15} />
            {shippingPrice ? (
              <span>
                배송비: {shippingPrice}원 (50,000원 결제부터 무료배송)
              </span>
            ) : (
              <span>무료 배송</span>
            )}
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm text-muted">
            <ShieldCheck size={15} />
            <span>안전 결제 • 교환/환불 정책 안내</span>
          </div>

          <Button
            title="결제하기"
            className="w-full"
            onClick={() => navigate("/checkout")}
            disabled={products.length === 0 || isLoading}
          />
        </div>
      </aside>
    </div>
  );
}

/* 빈 상태 */
function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <ShoppingCart size={20} />
      <p className="mt-3 font-medium">장바구니가 비었습니다.</p>
      <p className="mt-1 max-w-xs text-sm text-muted">
        맛있는 한우를 담아보세요!
      </p>
    </div>
  );
}

export default CartDrawer;
