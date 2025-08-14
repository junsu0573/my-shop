import { ShieldCheck, Truck } from "lucide-react";
import Input from "../../shared/ui/input";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import Button from "../../shared/ui/button";
import { useEffect, useState } from "react";
import DaumPost from "../../widgets/DaumPost";
import { useNavigate } from "react-router-dom";
import { createOrderThunk } from "./orderSlice";
import type { OrderFormData, OrderProduct } from "./orderAPI";
import { useToast } from "../../shared/ui/ToastContext";
import type { CartLine } from "../cart/cartAPI";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { data, totalPrice, shippingPrice } = useSelector(
    (state: RootState) => state.cart
  );
  const { addToast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const { status } = useSelector((state: RootState) => state.order);
  const isLoading = status === "loading";
  const [isSameUser, setIsSameUser] = useState(true);
  const [isAgreeTerm, setIsAgreeTerm] = useState(false);
  const products: CartLine[] = data?.cart?.products ?? [];
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [creditForm, setCreditForm] = useState({
    cardNum: "",
    name: "",
    mmdd: "",
    cvc: "",
  });

  const [formData, setFormData] = useState<OrderFormData>({
    products: [],
    reciever: {
      name: "",
      phone: "",
    },
    totalPrice: 0,
    shippingAddress: {
      address: "",
      detailAddress: "",
    },
    orderMemo: "",
    clearCart: true,
  });

  // formData 초기화
  useEffect(() => {
    if (!user) navigate("/"); // 리다이렉트
    if (user && isSameUser) {
      setFormData((prev) => ({
        ...prev,
        products: products.map(({ productId, quantity }) => ({
          productId: productId._id,
          quantity,
        })),
        reciever: {
          name: user.name,
          phone: user.phone,
        },
        totalPrice: totalPrice,
        shippingAddress: {
          address: user.address,
          detailAddress: user.detailAddress,
        },
      }));
    }
    if (!isSameUser) {
      setFormData((prev) => ({
        ...prev,
        reciever: {
          name: "",
          phone: "",
        },
        shippingAddress: {
          address: "",
          detailAddress: "",
        },
      }));
    }
  }, [user, isSameUser, products, totalPrice]);

  // 유효성 검사
  const validateForm = () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};
    if (!formData.reciever.name.trim())
      newErrors.recieverName = "수령인을 입력해주세요.";
    if (!formData.reciever.phone.trim())
      newErrors.recieverPhone = "전화번호를 입력해주세요.";
    if (!formData.shippingAddress.address.trim())
      newErrors.address = "주소을 입력해주세요.";
    if (!formData.shippingAddress.detailAddress.trim())
      newErrors.detailAddress = "상세 주소를 입력해주세요.";
    setErrors(newErrors);
    if (!creditForm.cardNum.trim())
      newErrors.creditCardNum = "카드 번호를 입력해주세요.";
    if (!creditForm.name.trim()) newErrors.creditName = "이름을 입력해주세요.";
    if (!creditForm.mmdd.trim())
      newErrors.creditMmdd = "유효일자를 입력해주세요.";
    if (!creditForm.cvc.trim()) newErrors.creditCvc = "CVC를 입력해주세요.";
    if (!isAgreeTerm) newErrors.term = "약관동의가 필요합니다.";

    return Object.keys(newErrors).length === 0;
  };

  // 주문하기 로직
  const handleCheckout = async () => {
    if (!validateForm()) return;

    const res = await dispatch(createOrderThunk(formData));
    if (createOrderThunk.fulfilled.match(res)) {
      const orderNum = res.payload?.order?.orderNum;
      addToast("주문이 완료되었습니다.", "success");
      navigate("/checkout-success", {
        state: { orderNum, fromCheckout: true }, // 접근 인증용
        replace: true, // 뒤로 가기 방지
      });
    } else if (createOrderThunk.rejected.match(res)) {
      const detail: OrderProduct[] = res.payload?.detail || [];

      const shortage = products
        .filter((p) =>
          detail.some((item) => item.productId === p.productId._id)
        )
        .map((item) => `${item.productId.name}: ${item.productId.stock}개 남음`)
        .join("\n");

      addToast(
        `${res.payload?.message} \n${shortage}` || `${res.payload}`,
        "error"
      );
    }
  };

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
                <Input
                  type="text"
                  readOnly
                  disabled={true}
                  placeholder="이름"
                  value={user?.name}
                />
                <Input
                  type="text"
                  readOnly
                  disabled={true}
                  placeholder="이메일"
                  value={user?.email}
                />
                <Input
                  type="text"
                  readOnly
                  disabled={true}
                  placeholder="전화번호"
                  value={user?.phone}
                />
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
                  <input
                    type="checkbox"
                    checked={isSameUser}
                    onChange={() => {
                      setIsSameUser((prev) => !prev);
                      setErrors({});
                    }}
                  />
                  주문자와 동일
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="수령인"
                    value={formData.reciever.name}
                    disabled={isSameUser}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reciever: {
                          name: e.target.value,
                          phone: prev.reciever.phone,
                        },
                      }))
                    }
                    className={errors.recieverName ? "border-alert-error" : ""}
                  />
                  {errors.recieverName && (
                    <span className="text-alert-error text-sm">
                      {errors.recieverName}
                    </span>
                  )}
                </div>
                <div>
                  {" "}
                  <Input
                    type="text"
                    placeholder="전화번호"
                    value={formData.reciever.phone}
                    disabled={isSameUser}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reciever: {
                          name: prev.reciever.name,
                          phone: e.target.value,
                        },
                      }))
                    }
                    className={errors.recieverPhone ? "border-alert-error" : ""}
                  />
                  {errors.recieverPhone && (
                    <span className="text-alert-error text-sm">
                      {errors.recieverPhone}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    type="text"
                    readOnly
                    placeholder="주소"
                    value={formData.shippingAddress.address}
                    disabled={isSameUser}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shippingAddress: {
                          address: e.target.value,
                          detailAddress: prev.shippingAddress.detailAddress,
                        },
                      }))
                    }
                    className={errors.address ? "border-alert-error" : ""}
                  />
                  {errors.address && (
                    <span className="text-alert-error text-sm">
                      {errors.address}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="상세 주소"
                      value={formData.shippingAddress.detailAddress}
                      disabled={isSameUser}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          shippingAddress: {
                            address: prev.shippingAddress.address,
                            detailAddress: e.target.value,
                          },
                        }))
                      }
                      className={
                        errors.detailAddress
                          ? "flex-1 border-alert-error"
                          : "flex-1"
                      }
                    />
                    <DaumPost disabled={isSameUser} setAddress={setFormData} />
                  </div>
                  {errors.detailAddress && (
                    <span className="text-alert-error text-sm">
                      {errors.detailAddress}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label>배송 메모</label>
                <textarea
                  className="w-full rounded-xl border border-border focus:outline-none focus:ring-2 ring-ring p-3 resize-none"
                  rows={3}
                  placeholder="예) 부재 시 문 앞에 놓아주세요."
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orderMemo: e.target.value,
                    }))
                  }
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
                    // ["bank", "무통장입금"],
                    // ["kakao", "카카오페이"],
                    // ["naver", "네이버페이"],
                    // ["tosspay", "토스페이"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className={
                        "border border-border rounded-xl px-3 py-2 text-sm cursor-pointer text-center"
                      }
                    >
                      <div>
                        <input type="radio" name="payment" checked={true} />
                      </div>

                      {label}
                    </label>
                  ))}
                </div>
                <div className="mt-4 grid md:grid-cols-2 gap-2">
                  <div>
                    {" "}
                    <Input
                      type="text"
                      placeholder="카드 번호"
                      value={creditForm.cardNum}
                      maxLength={16}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "");
                        setCreditForm((prev) => ({ ...prev, cardNum: val }));
                      }}
                      className={
                        errors.creditCardNum ? "border-alert-error" : ""
                      }
                    />
                    {errors.creditCardNum && (
                      <span className="text-alert-error text-sm">
                        {errors.creditCardNum}
                      </span>
                    )}
                  </div>
                  <div>
                    {" "}
                    <Input
                      type="text"
                      placeholder="이름"
                      onChange={(e) =>
                        setCreditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={errors.creditName ? "border-alert-error" : ""}
                    />
                    {errors.creditName && (
                      <span className="text-alert-error text-sm">
                        {errors.creditName}
                      </span>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="MM/DD"
                      value={creditForm.mmdd}
                      maxLength={5}
                      onChange={(e) => {
                        let val = e.target.value;
                        val = val.replace(/\D/g, "");
                        if (val.length >= 3) {
                          val = val.slice(0, 2) + "/" + val.slice(2);
                        }
                        setCreditForm((prev) => ({ ...prev, mmdd: val }));
                      }}
                      className={errors.creditMmdd ? "border-alert-error" : ""}
                    />
                    {errors.creditMmdd && (
                      <span className="text-alert-error text-sm">
                        {errors.creditMmdd}
                      </span>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="CVC"
                      value={creditForm.cvc}
                      maxLength={3}
                      onChange={(e) => {
                        let val = e.target.value;
                        val = val.replace(/\D/g, "");
                        setCreditForm((prev) => ({
                          ...prev,
                          cvc: val,
                        }));
                      }}
                      className={errors.creditCvc ? "border-alert-error" : ""}
                    />
                    {errors.creditCvc && (
                      <span className="text-alert-error text-sm">
                        {errors.creditCvc}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAgreeTerm}
                  onChange={() => setIsAgreeTerm((prev) => !prev)}
                />
                <span className="text-sm">
                  주문 상품, 결제정보, 개인정보 제3자 제공에 동의합니다.
                </span>
                {errors.term && (
                  <span className="text-alert-error text-sm">
                    {errors.term}
                  </span>
                )}
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

                <Button
                  title="주문하기"
                  className="w-full mt-6"
                  onClick={handleCheckout}
                  disabled={isLoading}
                />

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
