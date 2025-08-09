import { useDispatch, useSelector } from "react-redux";
import Header from "../widgets/Header";
import type { AppDispatch, RootState } from "../app/store";
import ProductCard from "../widgets/ProductCard";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProductList } from "../features/product/productSlice";
import { useSearchParams } from "react-router-dom";
import Input from "../shared/ui/input";
import Button from "../shared/ui/button";

function AllProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  // 프로덕트 데이터
  const { productsData, status } = useSelector(
    (state: RootState) => state.product
  );
  const totalPages = productsData?.totalPages || 1;

  const isLoading = status === "loading";

  // URl 쿼리 파라미터
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const [searchInput, setSearchInput] = useState(name);

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);

  // 프로덕트 데이터 fetch
  const fetchProducts = useCallback(async () => {
    if (page === 1) setProducts([]);
    const res = await dispatch(getProductList({ name: name, page }));
    if (getProductList.fulfilled.match(res)) {
      const loadedProducts = res.payload?.data || [];
      setProducts((prev) => [...prev, ...loadedProducts]);
    } else console.log("불러오기 실패");
  }, [dispatch, name, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 무한 스크롤
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

  // 검색 submit 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name === searchInput) return;
    setProducts([]);
    setPage(1);
    setSearchParams({ name: searchInput });
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative bg-gradient-to-r from-slate-50 to-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 xl:px-0">
            <div className="grid xl:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">
                  최고 품질의
                  <br />
                  <span className="text-destructive">한우</span>를<br />
                  집에서 만나보세요
                </h1>

                <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>신선 보장</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>당일 배송</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>1등급 한우</span>
                  </div>
                </div>
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="상품이름으로 검색"
                    className="flex-1"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <Button
                    type="submit"
                    title={isLoading ? "검색중..." : "검색"}
                    className="px-5"
                    disabled={isLoading}
                  />
                </form>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">전체 상품</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((item, idx) => {
                const isLast = idx === products.length - 1;

                return (
                  <div key={idx} ref={isLast ? lastRef : null}>
                    <ProductCard data={item} />
                  </div>
                );
              })
            ) : (
              <h3>검색 결과가 없습니다.</h3>
            )}
          </div>
          {isLoading && <div className="text-center">로딩중...</div>}
        </div>
      </main>
    </div>
  );
}

export default AllProductPage;
