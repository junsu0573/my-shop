import Button from "../shared/ui/button";
import type { Product } from "../features/product/productAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface ProductCardProps {
  data: Product;
}

function ProductCard({ data }: ProductCardProps) {
  const { categories } = useSelector((state: RootState) => state.product);

  const cateogry = categories.find(
    (item) => item._id === data.categoryId
  )?.name;

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
        <h3 className="font-bold group-hover:text-destructive">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.weight}g</p>
        <div className="flex items-center text-sm">
          <span className="mr-1">⭐</span>
          <span>{data.rating}</span>
          <span className="text-muted ml-1">({data.reviewCount}개 리뷰)</span>
        </div>
        <div className="flex gap-2 items-end">
          <span className="text-lg font-bold">
            {data.price.toLocaleString()}원
          </span>
        </div>
        <Button title="장바구니 담기" className="w-full" />
      </div>
    </div>
  );
}

export default ProductCard;
