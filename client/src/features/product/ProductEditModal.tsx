import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../shared/ui/button";
import Input from "../../shared/ui/input";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { useToast } from "../../shared/ui/ToastContext";
import type { ProductFormData } from "./productAPI";
import { Link } from "react-router-dom";
import { uploadImageThunk } from "../image/uploadImageToS3";
import { updateProductThunk } from "./productSlice";

interface ProductEditModalProps {
  onClose: () => void;
  onSuccess: () => void;
  id: string;
  product: ProductFormData;
}

function ProductEditModal({
  onClose,
  onSuccess,
  id,
  product,
}: ProductEditModalProps) {
  const { categories, status, error } = useSelector(
    (state: RootState) => state.product
  );
  const isLoading = status === "loading";
  const { addToast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imgFile, setImgFile] = useState<null | File>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<ProductFormData>(product);
  const [isEditImg, setIsEditImg] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 유효성 검사
  const validateForm = () => {
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!formData.sku.trim()) newErrors.sku = "SKU을 입력해주세요.";
    if (!formData.name.trim()) newErrors.name = "상품명을 입력해주세요.";
    if (!formData.description.trim())
      newErrors.description = "상품 설명을 입력해주세요.";
    if (!formData.categoryId.trim())
      newErrors.categoryId = "카테고리를 선택해주세요.";
    if (!formData.part.trim()) newErrors.part = "부위를 입력해주세요.";
    if (formData.weight < 0) newErrors.weight = "무게를 입력해주세요.";
    if (formData.price < 0) newErrors.price = "가격을 입력해주세요.";
    if (formData.stock < 0) newErrors.stock = "재고를 입력해주세요.";
    if (isEditImg && !imgFile) newErrors.imgFile = "이미지를 업로드해주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // onChange 핸들러
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }, []);

  // onSubmit 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    let updatedFormData = { ...formData } as ProductFormData;

    // image 업로드
    if (isEditImg) {
      const uploadRes = await dispatch(uploadImageThunk(imgFile!));
      if (uploadImageThunk.rejected.match(uploadRes)) return;
      const imageUrl = uploadRes.payload as string;
      setFormData((prev) => ({ ...prev, imageUrl }));
      updatedFormData = { ...updatedFormData, imageUrl };
    }

    // product 수정
    const updateRes = await dispatch(
      updateProductThunk({ id: id, data: updatedFormData })
    );
    if (updateProductThunk.fulfilled.match(updateRes)) {
      addToast("상품이 성공적으로 수정되었습니다.", "success");
      onSuccess();
      onClose();
    }
  };

  // input 필드
  const renderInput = useCallback(
    (label: string, name: keyof ProductFormData, type: string) => (
      <div>
        <label className="text-sm">{label}</label>
        <Input
          name={name}
          type={type}
          placeholder=""
          value={formData[name] as string | number}
          onChange={handleChange}
        />
        {errors[name] && (
          <span className="text-alert-error text-sm">{errors[name]}</span>
        )}
      </div>
    ),
    [errors, handleChange, formData]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-background w-full max-w-2xl max-h-[90vh] p-6 rounded-lg shadow-lg relative">
        <Button
          variant="ghost"
          icon={<X size={20} />}
          className="absolute top-4 right-4"
          onClick={onClose}
          disabled={isLoading}
        />
        <h3 className="mb-4">상품 수정</h3>

        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] space-y-4 overflow-y-auto px-1"
        >
          {renderInput("상품명", "name", "text")}
          {renderInput("상품 설명", "description", "text")}
          <div className="grid grid-cols-2 gap-4">
            {renderInput("SKU", "sku", "text")}
            <div>
              <label className="text-sm">카테고리</label>
              <select
                className="w-full p-2 border border-border rounded-md focus:outline-none"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ["categoryId"]: e.target.value,
                  }))
                }
              >
                <option value={""}>선택</option>
                {categories &&
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              {errors.categoryId && (
                <span className="text-alert-error text-sm">
                  {errors.categoryId}
                </span>
              )}
            </div>
            {renderInput("부위", "part", "text")}
            {renderInput("무게", "weight", "number")}
            {renderInput("가격", "price", "number")}
            {renderInput("재고", "stock", "number")}
          </div>

          <div>
            <label className="text-sm">상품 이미지</label>
            {isEditImg ? (
              <div>
                <Input
                  type="file"
                  placeholder=""
                  onChange={(e) => {
                    // 이미지 파일 저장
                    const file = e.target.files?.[0];
                    if (file) setImgFile(file);
                    else setImgFile(null);
                  }}
                />
                <Button
                  variant="outline"
                  title="취소"
                  onClick={() => setIsEditImg(false)}
                />
              </div>
            ) : (
              <div>
                <Link
                  to={formData.imageUrl}
                  target="_blank"
                  className="text-sm"
                >
                  {formData.imageUrl}
                </Link>
                <Button
                  variant="outline"
                  title="이미지 수정"
                  onClick={() => setIsEditImg(true)}
                />
              </div>
            )}

            {errors.imgFile && (
              <span className="text-alert-error text-sm">{errors.imgFile}</span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              title="취소"
              className="px-4"
              onClick={onClose}
              disabled={isLoading}
            />
            <Button
              type="submit"
              title={isLoading ? "저장중..." : "저장"}
              className="px-4"
              disabled={isLoading}
            />
          </div>
        </form>
        {error && (
          <span className="text-alert-error text-sm mt-2">{error}</span>
        )}
      </div>
    </div>
  );
}

export default ProductEditModal;
