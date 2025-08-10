import { ShieldCheck, Truck } from "lucide-react";
import Input from "../../shared/ui/input";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import Button from "../../shared/ui/button";

function CheckoutPage() {
  const { data, totalPrice, shippingPrice } = useSelector(
    (state: RootState) => state.cart
  );
  const products = data?.cart?.products ?? [];

  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 py-10">
        <h1 className="mb-6">주문/결제</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 폼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문 상품 리스트 */}
            <section className="bg-background rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={18} />
                <h3>주문 상품</h3>
              </div>

              <ul className="divide-y border-border">
                {products.map((item: any) => (
                  <li
                    key={item.productId._id}
                    className="py-4 flex items-center gap-4"
                  >
                    <img
                      src={item.productId.imageUrl}
                      alt={item.productId.name}
                      className="w-20 h-20 object-cover rounded-lg border border-border"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.productId.name}</p>
                      <p className="text-sm text-muted">
                        {`수량 ${item.quantity} ·
                        ${item.productId.price.toLocaleString()}원`}
                      </p>
                    </div>
                    <div className="text-right font-semibold">
                      {(item.productId.price * item.quantity).toLocaleString()}
                      원
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* 주문자 정보 */}
            <section className="bg-background rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} />
                <h3>주문자 정보</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input type="text" placeholder="이름" />
                <Input type="text" placeholder="이메일" />
                <Input type="text" placeholder="전화번호" />
              </div>
            </section>

            {/* 배송지 정보 */}
            <section className="bg-background rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Truck size={20} />
                  <h3>배송지 정보</h3>
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input type="checkbox" />
                  주문자와 동일
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input type="text" placeholder="수령인" />
                <Input type="text" placeholder="우편번호" />
                <Input type="text" placeholder="주소" />
                <Input type="text" placeholder="상세 주소" />
              </div>

              <div className="mt-4">
                <label>배송 메모</label>
                <textarea
                  className="w-full rounded-xl border border-border focus:outline-none focus:ring-2 ring-ring p-3 resize-none"
                  rows={3}
                  placeholder="예) 부재 시 문 앞에 놓아주세요."
                />
              </div>
            </section>

            {/* 결제수단 */}
            <section className="bg-background rounded-2xl shadow-sm border border-border p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-semibold">결제 수단</h2>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-3">
                  {[
                    ["card", "신용/체크카드"],
                    ["bank", "무통장입금"],
                    ["kakao", "카카오페이"],
                    ["naver", "네이버페이"],
                    ["tosspay", "토스페이"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className={
                        "border border-border rounded-xl px-3 py-2 text-sm cursor-pointer text-center"
                      }
                    >
                      <div>
                        <input type="radio" name="payment" />
                      </div>

                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm">
                  주문 상품, 결제정보, 개인정보 제3자 제공에 동의합니다.
                </span>
              </div>
            </section>
          </div>

          {/* 우측: 요약 카드 */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-background rounded-2xl shadow-sm border border-border p-6">
                <h3 className="mb-4">주문 요약</h3>

                <div className="space-y-2 text-sm">
                  <Row
                    label="상품 합계"
                    value={`${(totalPrice - shippingPrice).toLocaleString()}원`}
                  />
                  <Row
                    label="배송비"
                    value={`${shippingPrice.toLocaleString()}원`}
                  />
                  <div className="h-px bg-border my-4" />
                  <Row
                    label="결제 예정 금액"
                    valueClass="text-xl font-bold"
                    value={`${totalPrice.toLocaleString()}원`}
                  />
                </div>

                <Button title="주문하기" className="w-full mt-6" />

                <p className="text-xs text-muted mt-3">
                  * 신선식품 특성상 단순 변심에 의한 반품은 어려울 수 있습니다.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

export default CheckoutPage;
