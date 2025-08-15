import { X } from "lucide-react";
import Button from "../../shared/ui/button";
import type { OrderResponseData } from "./orderAPI";
import { useMemo } from "react";
import ShippingStatus from "../../shared/ui/shippingStatus";

interface OrderDetailModalProps {
  order: OrderResponseData;
  onClose: () => void;
}

function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const itemsTotal = useMemo(() => {
    return order.products.reduce((sum: number, it: any) => {
      const p = typeof it.productId === "string" ? { price: 0 } : it.productId;
      const qty = Number(it.quantity ?? 0);
      const price = Number(p.price ?? 0);
      return sum + price * qty;
    }, 0);
  }, [order.products]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3>주문 상세</h3>
          <Button variant="ghost" onClick={onClose} icon={<X size={18} />} />
        </div>

        {/* 내용 */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted">주문번호</p>
                <p className="font-medium">{order.orderNum}</p>
              </div>
              <div>
                <p className="text-sm text-muted">주문상태</p>
                <ShippingStatus status={order.status} />
              </div>
              <div>
                <p className="text-sm text-muted">수령인</p>
                <p className="font-medium">
                  {order.reciever.name} / {order.reciever.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">배송지</p>
                <p className="font-medium">
                  {order.shippingAddress.address}{" "}
                  {order.shippingAddress.detailAddress}
                </p>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2">주문 상품</p>
              <div className="border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">상품명</th>
                      <th className="px-4 py-2 text-right">수량</th>
                      <th className="px-4 py-2 text-right">가격</th>
                      <th className="px-4 py-2 text-right">합계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((it: any, idx: number) => {
                      const p =
                        typeof it.productId === "string"
                          ? { name: it.productId, price: 0 }
                          : it.productId;
                      const qty = Number(it.quantity ?? 0);
                      const price = Number(p.price ?? 0);
                      return (
                        <tr className="border-t border-border" key={idx}>
                          <td className="px-4 py-2">{p.name}</td>
                          <td className="px-4 py-2 text-right">
                            {qty.toLocaleString()}개
                          </td>
                          <td className="px-4 py-2 text-right">
                            {price.toLocaleString()}원
                          </td>
                          <td className="px-4 py-2 text-right">
                            {(price * qty).toLocaleString()}원
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">배송비</td>
                      <td className="px-4 py-2 text-right" colSpan={2}>
                        {(
                          Number(order.totalPrice) - itemsTotal
                        ).toLocaleString()}
                        원
                      </td>
                      <td className="px-4 py-2 text-right">
                        {(
                          Number(order.totalPrice) - itemsTotal
                        ).toLocaleString()}
                        원
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td
                        colSpan={3}
                        className="px-4 py-2 text-right font-semibold"
                      >
                        총액
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {order.totalPrice.toLocaleString()}원
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-end">
          <Button onClick={onClose} title="닫기" className="px-4" />
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
