import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    location: "New York, USA",
    text: "The quality of Momore's products is exceptional. I love that each piece tells a story and supports African artisans.",
    rating: 5,
  },
  {
    id: 2,
    name: "David K.",
    location: "London, UK",
    text: "As someone from the diaspora, wearing Momore's designs makes me feel connected to my roots. Beautiful craftsmanship!",
    rating: 5,
  },
  {
    id: 3,
    name: "Marie L.",
    location: "Paris, France",
    text: "I bought several items during my visit to Rwanda. These make perfect gifts and souvenirs with authentic cultural significance.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from our community about their experience with our authentic African craftsmanship
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={`transition-all duration-500 ${
                  index === currentTestimonial
                    ? "opacity-100 transform translate-x-0"
                    : "opacity-0 transform translate-x-full absolute top-0 left-0 w-full"
                }`}
              >
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-accent fill-current"
                      />
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex flex-col items-center space-y-2">
                    <p className="font-semibold text-primary text-lg">{testimonial.name}</p>
                    <p className="text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-primary scale-125"
                    : "bg-primary/30 hover:bg-primary/60"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;