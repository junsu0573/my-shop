import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  Star,
  ChevronRight,
  Check,
  Package2,
  Minus,
  Plus,
  Heart,
  Beef,
} from "lucide-react";
import Button from "../shared/ui/button";
import Input from "../shared/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { getProductThunk } from "../features/product/productSlice";
import type { AppDispatch, RootState } from "../app/store";
import type { Product } from "../features/product/productAPI";
import Header from "../widgets/Header";
import { AddToCartThunk, getCartThunk } from "../features/cart/cartSlice";
import { useToast } from "../shared/ui/ToastContext";

function ProductDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToast } = useToast();
  const { categories, status } = useSelector(
    (state: RootState) => state.product
  );
  const isLoading = status === "loading";
  const [qty, setQty] = useState(1);
  const { user } = useSelector((state: RootState) => state.auth);

  // 프로덕트 데이터 호출
  const fetchProduct = useCallback(async () => {
    if (!id) return;
    const res = await dispatch(getProductThunk({ id }));
    if (getProductThunk.fulfilled.match(res)) {
      setProduct(res.payload);
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // 장바구니 추가 핸들러
  const handleAddCart = async () => {
    if (!user) {
      addToast("로그인이 필요합니다.", "error");
      return;
    }
    if (product) {
      const res = await dispatch(
        AddToCartThunk({
          userId: user._id,
          productId: product._id,
          quantity: qty,
        })
      );
      if (AddToCartThunk.rejected.match(res)) {
        addToast(res.payload?.message || `${res.payload}`, "error");
      }
      if (AddToCartThunk.fulfilled.match(res)) {
        dispatch(getCartThunk(user._id));
        addToast("장바구니에 성공적으로 추가되었습니다.", "success");
      }
    }
  };

  return (
    <div className="bg-background h-screen ">
      <Header />

      {product ? (
        <div className="max-w-7xl mx-auto px-4 xl:px-0 py-6">
          {/* Breadcrumbs */}
          <nav className="text-sm text-muted flex items-center gap-1 mb-6">
            <Link to="/" className="hover:text-primary transition">
              홈
            </Link>
            <ChevronRight size={16} />
            <Link to="/products" className="hover:text-foreground transition">
              전체상품
            </Link>
            <ChevronRight size={16} />
            <span className="text-foreground/80 truncate max-w-[40ch]">
              {
                <span className="opacity-60">
                  {isLoading ? "로딩중… " : product?.name}
                </span>
              }
            </span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* 왼쪽 사진 */}
            <section>
              <div className="rounded-3xl border border-border overflow-hidden shadow-sm">
                <img
                  src={product?.imageUrl}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </section>

            {/* 오른쪽 정보 */}
            <section>
              {/* 상품명 */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-destructive text-white">
                    {
                      categories.find(
                        (item) => item._id === product?.categoryId
                      )?.name
                    }
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                    <Check size={10} /> HACCP 인증
                  </span>
                </div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight">
                  {product?.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((i) => {
                      const filled = i < Math.round(product?.rating ?? 0);
                      return (
                        <Star
                          key={i}
                          size={16}
                          className={
                            filled
                              ? "fill-yellow-400 stroke-yellow-400"
                              : "stroke-border"
                          }
                        />
                      );
                    })}
                  </div>
                  <span className=" text-sm text-muted">{`( ${product?.reviewCount} ) 리뷰`}</span>
                </div>
              </div>

              {/* 가격 */}
              <div className="mt-6 p-4 rounded-2xl border border-border bg-white/60 shadow-sm">
                <div className="flex items-end gap-3">
                  <h1>{product?.price.toLocaleString()}</h1>
                  <span className="text-md text-muted">원</span>
                </div>
                <p className="text-sm text-muted mt-1">
                  {`부위: ${product?.part} / 원산지: 국내산`}
                </p>
              </div>

              {/* 수량 입력 */}
              <div className="mt-6">
                <div className="text-sm font-semibold mb-2">수량</div>
                <div className="inline-flex items-center rounded-xl border border-border overflow-hidden">
                  <Button
                    variant="ghost"
                    icon={<Minus size={16} />}
                    onClick={() => setQty((prev) => prev - 1)}
                    disabled={isLoading || qty <= 1}
                  />
                  <Input
                    readOnly
                    value={qty}
                    inputMode="numeric"
                    className="w-14 text-center border-0 focus:ring-0 focus:outline-none"
                  />
                  <Button
                    variant="ghost"
                    icon={<Plus size={16} />}
                    onClick={() => setQty((prev) => prev + 1)}
                    disabled={isLoading || qty >= (product?.stock ?? 0)}
                  />
                </div>
                <div className="mt-2 text-sm text-muted">{`재고: ${product?.stock}개 남음`}</div>
              </div>

              {/* 버튼 */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  title="장바구니"
                  icon={<ShoppingCart size={20} />}
                  className="flex-1"
                  disabled={isLoading}
                  onClick={handleAddCart}
                />
                <Button
                  title="지금 구매"
                  className="flex-1"
                  disabled={isLoading}
                />

                <Button
                  variant="outline"
                  aria-label="관심상품"
                  icon={<Heart size={25} />}
                />
              </div>

              {/* 뱃지 */}
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-border">
                  <Truck size={20} />
                  <div className="text-sm">
                    <b>신선 포장/당일출고</b>
                    <div className="text-xs text-muted">
                      평일 14시 이전 주문
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-border">
                  <ShieldCheck size={20} />
                  <div className="text-sm">
                    <b>품질 보증</b>
                    <div className="text-xs text-muted">1++ 이상만 선별</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-border">
                  <Package2 size={20} />
                  <div className="text-sm">
                    <b>냉장/냉동 선택</b>
                    <div className="text-xs text-muted">옵션에서 요청 가능</div>
                  </div>
                </div>
              </div>

              {/* 정보 탭 */}
              <div className="mt-10">
                <div className="grid grid-cols-3 text-sm rounded-2xl border border-border overflow-hidden">
                  <div className="p-3 text-center bg-secondary">상품정보</div>
                  <div className="p-3 text-center">원산지/영양</div>
                  <div className="p-3 text-center">배송/교환</div>
                </div>
                <div className="mt-4 p-5 rounded-2xl border border-border space-y-3">
                  <p className="text-sm leading-7 text-foreground/90">
                    {product?.description}
                  </p>
                  <ul className="text-sm text-muted grid sm:grid-cols-2 gap-y-2">
                    <li className="flex items-center gap-2">
                      <Check size={16} />
                      보관: 0~4℃(냉장) / -18℃(냉동)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} />
                      유통기한: 제품 별도 표기
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center bg-background">
          <Beef size={36} />
          <h3 className="mt-3">상품이 없습니다.</h3>
          <p className="mt-1 mb-3 max-w-xs text-sm text-muted">
            주소를 확인하세요.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
