import Header from "../widgets/Header";
import HeroSection from "../widgets/HeroSection";
import PopularProductsSection from "../widgets/PopularProductsSection";
import AllProductsSection from "../widgets/AllProductsSectoin";
import Footer from "../widgets/Footer";

function HomePage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PopularProductsSection />
        <AllProductsSection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
