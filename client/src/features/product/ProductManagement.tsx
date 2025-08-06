import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Button from "../../shared/ui/button";
import ProductCreateModal from "./ProductCreateModal";

const dummyProducts = [
  {
    _id: "1",
    name: "한우 등심",
    imageUrl:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    sku: "HW-001",
    weight: 500,
    price: 25000,
    stock: 12,
  },
  {
    _id: "2",
    name: "한우 안심",
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    sku: "HW-002",
    weight: 300,
    price: 28000,
    stock: 7,
  },
];

const ProductManagement = () => {
  const [products, setProducts] = useState(dummyProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>상품 관리</h1>
        <Button
          title="상품 추가"
          icon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      {isModalOpen && (
        <ProductCreateModal onClose={() => setIsModalOpen(false)} />
      )}

      {/* 검색 필터 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="상품명 또는 SKU로 검색"
          className="border border-gray-300 rounded px-3 py-2 w-72"
        />
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
            {products.map((item) => (
              <tr key={item._id} className="border-t">
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
                  />
                  <Button
                    variant="ghost"
                    title="삭제"
                    icon={<Trash2 size={16} />}
                    className="text-red-500"
                    onClick={() => {
                      setProducts([]);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
