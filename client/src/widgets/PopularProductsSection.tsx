import Button from "../shared/ui/button";

function PopularProductsSection() {
  // const products = [
  //   {
  //     id: "1",
  //     name: "한우 등심 1등급",
  //     price: 89000,
  //     originalPrice: 99000,
  //     rating: 4.9,
  //     reviews: 124,
  //     image:
  //       "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  //     badge: "베스트",
  //     weight: "500g",
  //   },
  //   {
  //     id: "2",
  //     name: "한우 안심 특등급",
  //     price: 125000,
  //     originalPrice: 135000,
  //     rating: 5.0,
  //     reviews: 89,
  //     image:
  //       "https://images.unsplash.com/photo-1603048588665-791ca8aea617?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  //     badge: "프리미엄",
  //     weight: "400g",
  //   },
  //   {
  //     id: "3",
  //     name: "한우 갈비 1등급",
  //     price: 75000,
  //     originalPrice: null,
  //     rating: 4.8,
  //     reviews: 156,
  //     image:
  //       "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  //     badge: "인기",
  //     weight: "600g",
  //   },
  //   {
  //     id: "4",
  //     name: "한우 불고기용 1등급",
  //     price: 65000,
  //     originalPrice: 72000,
  //     rating: 4.7,
  //     reviews: 203,
  //     image:
  //       "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  //     badge: "할인",
  //     weight: "500g",
  //   },
  // ];

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
          <Button variant="outline" title="더 많은 상품 보기" />
        </div>
      </div>
    </section>
  );
}

export default PopularProductsSection;
