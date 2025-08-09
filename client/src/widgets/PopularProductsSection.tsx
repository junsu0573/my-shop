import { useNavigate } from "react-router-dom";
import Button from "../shared/ui/button";

function PopularProductsSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">인기 상품</h2>
          <p className="text-lg text-muted">
            고객들이 가장 많이 선택한 한우입니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"></div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            title="더 많은 상품 보기"
            onClick={() => navigate("/products")}
          />
        </div>
      </div>
    </section>
  );
}

export default PopularProductsSection;
