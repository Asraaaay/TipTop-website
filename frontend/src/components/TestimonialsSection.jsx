import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    text: "Excellent service! My silk sarees have never looked better. The team handles everything with such care and professionalism. Highly recommend to everyone!",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    rating: 5,
    text: "Fast pickup and delivery. My office shirts are always perfectly pressed. The express service is a lifesaver before important meetings.",
    avatar: "RM",
  },
  {
    id: 3,
    name: "Anita Desai",
    rating: 5,
    text: "The curtain cleaning service transformed my home. Professional team, great results, and very reasonable prices. Will use again!",
    avatar: "AD",
  },
  {
    id: 4,
    name: "Vikram Singh",
    rating: 5,
    text: "Best dry cleaning in town! They removed stains I thought were permanent. The quality of work is consistently excellent.",
    avatar: "VS",
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      className="section-padding bg-navy relative overflow-hidden"
      data-testid="testimonials-section"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-padding relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="heading-overline mb-4 block text-teal" data-testid="testimonials-overline">
            Testimonials
          </span>
          <h2 
            className="heading-primary text-3xl sm:text-4xl lg:text-5xl mb-4 text-white"
            data-testid="testimonials-title"
          >
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <div 
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-10 relative"
            data-testid="testimonial-card"
          >
            {/* Quote Icon */}
            <div className="absolute -top-4 left-8 w-12 h-12 bg-teal rounded-full flex items-center justify-center">
              <Quote className="w-5 h-5 text-white" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6 mt-4" data-testid="testimonial-rating">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-teal text-teal" />
              ))}
            </div>

            {/* Quote */}
            <p 
              className="font-dm-sans text-lg sm:text-xl text-white/90 leading-relaxed mb-8"
              data-testid="testimonial-text"
            >
              "{currentTestimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center">
                <span className="font-outfit font-bold text-teal">
                  {currentTestimonial.avatar}
                </span>
              </div>
              <div>
                <p className="font-outfit font-semibold text-white" data-testid="testimonial-name">
                  {currentTestimonial.name}
                </p>
                <p className="font-dm-sans text-sm text-white/60">Verified Customer</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              data-testid="testimonial-prev-btn"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "bg-teal w-6" : "bg-white/30"
                  }`}
                  data-testid={`testimonial-dot-${i}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              data-testid="testimonial-next-btn"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
