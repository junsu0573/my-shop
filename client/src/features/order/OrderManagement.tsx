import { useEffect, useState } from "react";
import { Eye, Search, ChevronDown } from "lucide-react";
import Button from "../../shared/ui/button";
import Input from "../../shared/ui/input";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { useSearchParams } from "react-router-dom";

import { searchOrdersThunk, updateOrderThunk } from "./orderSlice";
import {
  statusLabel,
  type DetailOrderProduct,
  type OrderResponseData,
  type OrderStatus,
} from "./orderAPI";
import OrderDetailModal from "./OrderDetailModal";
import { useToast } from "../../shared/ui/ToastContext";
import ShippingStatus from "../../shared/ui/shippingStatus";

const getFirstProductSummary = (products: DetailOrderProduct[]) => {
  if (!products?.length) return "-";
  const first = products[0];
  const name =
    typeof first.productId === "string"
      ? first.productId
      : first.productId?.name;
  const others = products.length > 1 ? ` 외 ${products.length - 1}개` : "";
  return `${name ?? "-"}${others}`;
};

function OrderManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseData | null>(
    null
  );
  const { addToast } = useToast();

  // URL 쿼리 파라미터
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const page = parseInt(searchParams.get("page") || "1");

  // 검색창 입력 상태
  const [searchInput, setSearchInput] = useState(name);

  // 주문 데이터
  const { orderList, status } = useSelector((state: RootState) => state.order);
  const orders = orderList?.data || [];

  const isLoading = status === "loading";

  // 주문 리스트 호출
  useEffect(() => {
    dispatch(searchOrdersThunk({ name, page }));
  }, [dispatch, name, page]);

  // 검색 submit 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // URL 변경 /prdoct?name=[name]&page=1
    setSearchParams({ name: searchInput, page: "1" });
  };

  // 페이지네이션
  const handlePageChange = (event: { selected: number }) => {
    setSearchParams({
      name,
      page: (event.selected + 1).toString(),
    });
  };

  // 배송상태 변경 핸들러
  const handleChangeStatus = async (
    order: OrderResponseData,
    status: OrderStatus
  ) => {
    const { orderNum, reciever, shippingAddress, orderMemo } = order;
    const formData = { reciever, shippingAddress, orderMemo, status };

    const res = await dispatch(updateOrderThunk({ orderNum, formData }));
    if (updateOrderThunk.fulfilled.match(res)) {
      dispatch(searchOrdersThunk({ name, page }));
      addToast(res.payload.message, "success");
    } else if (updateOrderThunk.rejected.match(res)) {
      addToast(res.payload?.message || "에러가 발생했습니다.", "error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>주문 관리</h1>
      </div>
      {isDetailModalOpen && selectedOrder ? (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setIsDetailModalOpen(false)}
        />
      ) : null}
      {/* 검색 필터 */}
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="flex">
          <Input
            type="text"
            placeholder="주문번호로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button type="submit" variant="ghost" icon={<Search size={16} />} />
        </form>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-background shadow rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">주문번호</th>
              <th className="px-4 py-3">고객</th>
              <th className="px-4 py-3">상품(대표)</th>
              <th className="px-4 py-3">결제금액</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">주문일</th>
              <th className="px-4 py-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  로딩중...
                </td>
              </tr>
            ) : orderList?.total > 0 ? (
              orders.map((order) => (
                <tr key={order.orderNum} className="border-y border-border">
                  <td className="px-4 py-2">{order.orderNum}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      <span>{order.reciever.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.reciever?.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {getFirstProductSummary(order.products)}
                  </td>
                  <td className="px-4 py-2">{`₩${order.totalPrice.toLocaleString()}`}</td>
                  <td className="px-4 py-2">
                    <ShippingStatus status={order.status} />
                  </td>
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 flex gap-2 items-center">
                    {/* 상세 보기 */}
                    <Button
                      variant="ghost"
                      title="상세"
                      icon={<Eye size={16} />}
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailModalOpen(true);
                      }}
                    />
                    {/* 상태 변경 드롭다운(간단버전) */}
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        title="상태변경"
                        icon={<ChevronDown size={16} />}
                      />
                      <div
                        className="hidden group-hover:block absolute z-10 top-full left-0 w-32 bg-white border border-border rounded shadow"
                        style={{ marginTop: "-1px" }} // 버튼과 메뉴 사이 간격 제거
                      >
                        {(
                          [
                            "pending",
                            "confirmed",
                            "shipped",
                            "delivered",
                            "cancelled",
                          ] as OrderStatus[]
                        ).map((st) => (
                          <button
                            key={st}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm ${
                              order.status === st ? "bg-gray-50" : ""
                            }`}
                            onClick={() => handleChangeStatus(order, st)}
                          >
                            {statusLabel[st]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {/* ▶ 페이지네이션 */}
        <div className="my-6">
          <ReactPaginate
            pageCount={orderList.totalPages}
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

      {/* 상세 모달 */}
    </div>
  );
}

export default OrderManagement;
