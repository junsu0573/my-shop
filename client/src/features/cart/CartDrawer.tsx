import { useEffect, useRef } from "react";
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
import { type AppDispatch, type RootState } from "../../app/store";
import { getCartThunk } from "./cartSlice";
import type { CartLine } from "./cartAPI";

type CartDrawerProps = {
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(v);

function CartDrawer({ open, onClose }: CartDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const { data, status } = useSelector((state: RootState) => state.cart);

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

  return (
    <div
      aria-hidden={!open}
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
        aria-hidden="true"
      />

      {/* 사이드바 */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="장바구니"
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
            ref={closeBtnRef}
            onClick={onClose}
            icon={<X size={20} />}
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
              {products?.map((item, idx) => (
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
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => {}}
                        icon={<Trash2 size={14} />}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-xl border border-border">
                        <Button
                          variant="ghost"
                          onClick={() => {}}
                          className="rounded-xl"
                          icon={<Minus size={12} />}
                        />

                        <span className="w-10 text-center text-sm tabular-nums">
                          1
                        </span>
                        <Button
                          variant="ghost"
                          onClick={() => {}}
                          className="rounded-xl"
                          icon={<Plus size={12} />}
                        />
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted">
                          개당 {formatCurrency(item.productId.price || 0)}
                        </p>
                        <p className="font-semibold">
                          {formatCurrency((item.productId.price || 0) * 1)}
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
            <span className="text-lg font-semibold"></span>
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm text-muted">
            <Truck size={15} />
            <span>50,000원 결제부터 무료배송</span>
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm text-muted">
            <ShieldCheck size={15} />
            <span>안전 결제 • 교환/환불 정책 안내</span>
          </div>

          <Button title="결제하기" onClick={() => {}} className="w-full" />
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
