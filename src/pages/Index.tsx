import HeroCarousel from "@/components/HeroCarousel";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import StorySection from "@/components/StorySection";
import Testimonials from "@/components/Testimonials";


const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroCarousel />
      <CategorySection />
      <FeaturedProducts />
      <StorySection />
      <Testimonials />
     
    </div>
  );
};

export default Index;
