// pages/OrderHistoryPage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { useSearchParams } from "react-router-dom";
import { getUserOrderThunk } from "../features/order/orderSlice";
import ReactPaginate from "react-paginate";
import Header from "../widgets/Header";

export default function OrderHistoryPage() {
  const dispatch = useDispatch<AppDispatch>();

  // 주문 데이터
  const { myOrders, status } = useSelector((state: RootState) => state.order);
  const orders = myOrders?.data || [];
  type ShipStatus =
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
  const shipStatus: Record<ShipStatus, string> = {
    pending: "주문접수",
    confirmed: "결제완료",
    shipped: "배송중",
    delivered: "배송완료",
    cancelled: "취소됨",
  };

  // URL 쿼리 파라미터
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const isLoading = status === "loading";

  // 데이터 fetch
  useEffect(() => {
    dispatch(getUserOrderThunk({ page }));
  }, [dispatch]);

  // 페이지네이션
  const handlePageChange = (event: { selected: number }) => {
    setSearchParams({
      page: (event.selected + 1).toString(),
    });
  };

  if (isLoading) {
    return <div className="max-w-5xl mx-auto p-6">로딩 중...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <main>
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold">주문 내역</h1>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-border p-8 text-center text-muted">
              아직 주문이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderNum}
                  className="rounded-2xl border border-border p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted">
                        주문일: {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        배송 상태:{" "}
                        <span className="font-medium">
                          {shipStatus[
                            order.status as keyof typeof shipStatus
                          ] ?? ""}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {`총 결제금액: ${order.totalPrice.toLocaleString()}원`}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-border">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3">
                        <img
                          src={item.productId.imageUrl}
                          alt={item.productId.name}
                          className="w-16 h-16 object-cover rounded-xl border border-border"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.productId.name}</p>
                          <p className="text-sm text-muted">
                            수량: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            단가:{" "}
                            {(item.productId?.price || 0).toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="mt-4 text-sm text-muted">
                      {`배송지: ${order.shippingAddress?.address} ${order.shippingAddress?.detailAddress}`}
                    </div>
                    <span className="mt-4 text-md font-medium text-muted">{`주문번호: ${order.orderNum}`}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ▶ 페이지네이션 */}
          <div className="my-6">
            <ReactPaginate
              pageCount={myOrders.totalPages}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName="flex justify-center gap-2"
              pageClassName="px-3 py-1 border rounded cursor-pointer"
              activeClassName="bg-primary text-white"
              previousLabel="<"
              nextLabel=">"
              previousClassName="px-3 cursor-pointer"
              nextClassName="px-3 cursor-pointer"
              breakLabel="..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
