import { ArrowRight, Leaf, Recycle, Shield, HandHeart, Users, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import all images
import ourStoryImg from "@/assets/11.jpg";
import sustainabilityImg from "@/assets/12.jpg";
import artisanImg from "@/assets/13.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            About Momore Limited
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-slide-up">
            Learn about our mission, values, and the artisans behind our products
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Momore Limited was founded in 2018 with a passion for celebrating African heritage through 
                  beautifully crafted products. Our name "Momore" comes from the Yoruba word meaning 
                  "a child to be cherished," reflecting our commitment to nurturing African craftsmanship.
                </p>
                <p>
                  We work directly with skilled artisans across Rwanda, Nigeria, Ghana, and Kenya to create 
                  unique, high-quality items that blend traditional techniques with contemporary design. 
                  Each product tells a story of cultural heritage and artistic excellence.
                </p>
                <p>
                  Our commitment to ethical production means that every purchase supports sustainable 
                  livelihoods and preserves cultural craftsmanship for future generations. We ensure 
                  fair wages, safe working conditions, and environmental sustainability in all our operations.
                </p>
              </div>
            </div>
            <div className="animate-fade-in order-first lg:order-last">
              <img 
                src={ourStoryImg} 
                alt="African artisans at work" 
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability & Ethics Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img 
                src={sustainabilityImg} 
                alt="Sustainable crafting practices" 
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                Sustainability & Ethics
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At Momore, we believe in fashion that respects both people and the planet. 
                Our sustainability initiatives include:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Leaf className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">Using organic, natural, and upcycled materials whenever possible</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Recycle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">Implementing zero-waste production techniques</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">Supporting traditional crafting methods that have low environmental impact</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">Ensuring fair wages and safe working conditions for all artisans</p>
                </div>
                <div className="flex items-start space-x-3">
                  <HandHeart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">Investing in community development projects in our artisans' communities</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                We're committed to transparency in our supply chain and continuously work to reduce 
                our environmental footprint while maximizing our positive social impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Artisans Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                Meet Our Artisans
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  The heart of Momore is our community of talented artisans. We partner with over 
                  200 craftspeople across Africa, each bringing their unique skills and cultural 
                  heritage to our products.
                </p>
                <p>
                  From beadwork experts in Kenya to weaving masters in Ghana, from print designers 
                  in Nigeria to wood carvers in Rwanda, our network represents the rich diversity 
                  of African craftsmanship.
                </p>
                <p>
                  We provide our artisans with design support, business training, and access to 
                  global markets, helping to preserve traditional crafts while creating economic 
                  opportunities in their communities.
                </p>
              </div>
            </div>
            <div className="animate-fade-in order-first lg:order-last">
              <img 
                src={artisanImg} 
                alt="African artisans crafting products" 
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              "Cultural Elegance, Crafted for You." Celebrating African heritage through beautifully handmade products.
            </p>
            <div className="space-y-2 text-white/90 mb-8">
              <p>Free shipping on orders over $50</p>
              <p>Contact: info@momore.com | +250 788 123 456</p>
            </div>
            <Button className="btn-hero-secondary">
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;