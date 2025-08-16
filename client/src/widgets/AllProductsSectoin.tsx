import { Link } from "react-router-dom";
import Button from "../shared/ui/button";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

import type { AppDispatch, RootState } from "../app/store";
import type { Product } from "../features/product/productAPI";
import { getProductList } from "../features/product/productSlice";

function AllProductsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>([]);
  const { status } = useSelector((state: RootState) => state.product);
  const isLoading = status === "loading";
  // 프로덕트 데이터 fetch
  const fetchProducts = useCallback(async () => {
    const res = await dispatch(
      getProductList({ name: "", page: 1, rating: false })
    );
    if (getProductList.fulfilled.match(res)) {
      const loadedProducts = res.payload?.data || [];
      setProducts((prev) => [...prev, ...loadedProducts]);
    } else console.log("불러오기 실패");
  }, [dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className="py-16 bg-gradient-to-r from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">최신 상품</h2>
          <p className="text-lg text-muted">최고 품질의 한우만을 취급합니다.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {products.length > 0 &&
            products.slice(0, 3).map((item, idx) => {
              if (!item.stock)
                return (
                  <div key={idx}>
                    <ProductCard data={item} />
                  </div>
                );
              else
                return (
                  <Link to={`/products/${item._id}`} key={idx}>
                    <ProductCard data={item} />
                  </Link>
                );
            })}
        </div>
        {isLoading && <div className="text-center">로딩중...</div>}

        <div className="text-center mt-12">
          <Link to={"/products"} className="inline-block">
            <Button variant="outline" title="더 많은 상품 보기" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AllProductsSection;
