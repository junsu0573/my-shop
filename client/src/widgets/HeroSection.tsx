import Button from "../shared/ui/button";
import bannerImg from "../assets/very_delicous_meat.png";

function HeroSection() {
  return (
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
            <p className="text-lg text-muted-foreground">
              엄선된 한우만을 직접 농장에서 가져와 신선하고 맛있는 고기를
              합리적인 가격에 제공합니다. 특별한 날, 특별한 한우로 소중한
              사람들과 함께하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button title="지금 쇼핑하기" className="px-6">
                지금 쇼핑하기
              </Button>
              <Button
                variant="outline"
                title="한우 등급 알아보기"
                className="px-6"
              >
                한우 등급 알아보기
              </Button>
            </div>
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
          </div>
          <div className="relative">
            <div className="w-full h-96 rounded-lg shadow-2xl overflow-hidden">
              <img
                src={bannerImg}
                alt="일등급 한우"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
              1등급 한우
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
