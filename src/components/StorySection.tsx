import { Button } from "@/components/ui/button";
import storyVideo from "@/assets/story.mp4"; // place story.mp4 in src/assets

const StorySection = () => {
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Momore Limited was founded with a passion for celebrating African heritage through beautifully crafted products. We work directly with skilled artisans across Africa to create unique, high-quality items that blend traditional techniques with contemporary design.
              </p>
              <p>
                Our commitment to ethical production means that every purchase supports sustainable livelihoods and preserves cultural craftsmanship for future generations.
              </p>
            </div>
            <Button className="mt-8 btn-hero-primary">
              Learn More About Us
            </Button>
          </div>

          {/* Video Section */}
          <div className="relative animate-fade-in">
            <div className="relative overflow-hidden rounded-lg shadow-elegant">
              <video
                src={storyVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-medium">
              <p className="text-sm font-medium text-primary">Cultural Elegance</p>
              <p className="text-xs text-muted-foreground">Crafted for You</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
