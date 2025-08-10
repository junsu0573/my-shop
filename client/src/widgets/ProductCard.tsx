import Button from "../shared/ui/button";
import type { Product } from "../features/product/productAPI";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import type { FormEvent } from "react";
import { useToast } from "../shared/ui/ToastContext";
import { AddToCartThunk, getCartThunk } from "../features/cart/cartSlice";
import { Star } from "lucide-react";

interface ProductCardProps {
  data: Product;
}

function ProductCard({ data }: ProductCardProps) {
  const { categories } = useSelector((state: RootState) => state.product);
  const { user } = useSelector((state: RootState) => state.auth);
  const { status } = useSelector((state: RootState) => state.cart);
  const isLoading = status === "loading";
  const { addToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const cateogry = categories.find(
    (item) => item._id === data.categoryId
  )?.name;

  // 장바구니 추가 핸들러
  const handleAddCart = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("로그인이 필요합니다.", "error");
      return;
    }
    if (data) {
      const res = await dispatch(
        AddToCartThunk({
          userId: user._id,
          productId: data._id,
          quantity: 1,
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
    <div className="group rounded-xl border border-border overflow-hidden hover:shadow-lg hover:cursor-pointer transition duration-300">
      <div className="relative">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {cateogry && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            {cateogry}
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold group-hover:text-destructive">
            {data.name}
          </h3>

          {!data.stock ? (
            <span className="text-sm font-bold text-destructive">품절</span>
          ) : (
            <span className="text-sm text-muted">{data.stock}개 남음</span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{data.weight}g</p>
        <div className="flex items-center text-sm">
          <Star size={12} className="mr-1 fill-yellow-400 stroke-yellow-400" />
          <span>{data.rating}</span>
          <span className="text-muted ml-1">({data.reviewCount}개 리뷰)</span>
        </div>
        <div className="flex gap-2 items-end">
          <span className="text-lg font-bold">
            {data.price.toLocaleString()}원
          </span>
        </div>
        <Button
          title="장바구니 담기"
          className="w-full"
          onClick={handleAddCart}
          disabled={isLoading || !data.stock}
        />
      </div>
    </div>
  );
}

export default ProductCard;
