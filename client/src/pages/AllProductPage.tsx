import { useDispatch, useSelector } from "react-redux";
import Header from "../widgets/Header";
import HeroSection from "../widgets/HeroSection";
import type { AppDispatch, RootState } from "../app/store";
import ProductCard from "../widgets/ProductCard";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProductList } from "../features/product/productSlice";

function AllProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  // 프로덕트 데이터
  const { productsData } = useSelector((state: RootState) => state.product);
  const totalPages = productsData?.totalPages || 1;

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = useCallback(async () => {
    const res = await dispatch(getProductList({ name: "", page }));
    if (getProductList.fulfilled.match(res)) {
      const loadedProducts = res.payload?.data || [];
      setProducts((prev) => [...prev, ...loadedProducts]);
    } else console.log("불러오기 실패");
  }, [dispatch, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastRef = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [page, totalPages]
  );

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">전체 상품</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item, idx) => {
              const isLast = idx === products.length - 1;

              return (
                <div key={idx} ref={isLast ? lastRef : null}>
                  <ProductCard data={item} />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllProductPage;
