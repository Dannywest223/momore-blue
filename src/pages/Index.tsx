import HeroCarousel from "@/components/HeroCarousel";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import StorySection from "@/components/StorySection";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  return (
    <div>
      <HeroCarousel />
      <CategorySection />
      <FeaturedProducts />
      <StorySection />
      <Testimonials />
    </div>
  );
};

export default Index;
