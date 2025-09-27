import CategoriesSection from "@/components/home-page/categories-section";
import FeaturedProductsSection from "@/components/home-page/featured-product-section";
import FeaturesSection from "@/components/home-page/features-section";
import HeroSection from "@/components/home-page/hero-section";
import NewsletterSection from "@/components/home-page/newsletter-section";

export default function Home() {
  return (
   <>
    <HeroSection />
    <CategoriesSection />
    <FeaturedProductsSection />
    <FeaturesSection />
    <NewsletterSection />
   </>
  );
}
