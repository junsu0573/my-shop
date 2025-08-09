import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import Button from "../../shared/ui/button";
import ProductCreateModal from "./ProductCreateModal";
import { getProductList, resetProduct } from "./productSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
import Input from "../../shared/ui/input";
import ProductEditModal from "./ProductEditModal";
import { toProductFormData, type ProductFormData } from "./productAPI";

const ProductManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    product: ProductFormData;
  } | null>(null);
  // URL 쿼리 파라미터
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const page = parseInt(searchParams.get("page") || "1");

  // 검색창 입력 상태
  const [searchInput, setSearchInput] = useState(name);

  // 프로덕트 데이터
  const { productsData, status } = useSelector(
    (state: RootState) => state.product
  );
  const products = productsData?.data || [];

  const isLoading = status === "loading";

  // 프로덕트 데이터 호출
  useEffect(() => {
    dispatch(getProductList({ name, page }));
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

  // 상품 재로딩
  const handleProductReload = () => {
    // 상태 초기화
    dispatch(resetProduct());
    // 재로딩
    dispatch(getProductList({ name, page }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>상품 관리</h1>
        <Button
          title="상품 추가"
          icon={<Plus size={16} />}
          onClick={() => setIsCreateModalOpen(true)}
        />
      </div>
      {isCreateModalOpen && (
        <ProductCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleProductReload}
        />
      )}
      {isEditModalOpen && (
        <ProductEditModal
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleProductReload}
          id={selectedProduct!.id}
          product={selectedProduct!.product}
        />
      )}

      {/* 검색 필터 */}
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="flex">
          <Input
            type="text"
            placeholder="상품명으로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button type="submit" variant="ghost" icon={<Search size={16} />} />
        </form>
      </div>

      {/* 상품 목록 테이블 */}
      <div className="overflow-x-auto bg-background shadow rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">사진</th>
              <th className="px-4 py-3">상품명</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">무게</th>
              <th className="px-4 py-3">가격</th>
              <th className="px-4 py-3">재고</th>
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
            ) : productsData.total > 0 ? (
              products.map((item) => (
                <tr key={item._id} className="border-y border-border">
                  <td>
                    <img
                      src={item.imageUrl}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.sku}</td>
                  <td className="px-4 py-2">{`${item.weight}g`}</td>
                  <td className="px-4 py-2">{item.price.toLocaleString()}원</td>
                  <td className="px-4 py-2">{item.stock}개</td>

                  <td className="px-4 py-2 flex gap-2 items-center">
                    <Button
                      variant="ghost"
                      title="수정"
                      icon={<Pencil size={16} />}
                      className="text-blue-500"
                      onClick={() => {
                        setSelectedProduct({
                          id: item._id,
                          product: toProductFormData(item),
                        });

                        setIsEditModalOpen(true);
                      }}
                    />
                    <Button
                      variant="ghost"
                      title="삭제"
                      icon={<Trash2 size={16} />}
                      className="text-red-500"
                      onClick={() => {
                        console.log("삭제");
                      }}
                    />
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
        {/* ▶ 페이지네이션 */}
        <div className="my-6">
          <ReactPaginate
            pageCount={productsData.totalPages}
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
    </div>
  );
};

export default ProductManagement;
