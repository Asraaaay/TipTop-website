import { ArrowRight, Play } from "lucide-react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1585412459212-8def26f7e84c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZHJ5JTIwY2xlYW5pbmclMjBzdWl0fGVufDB8fHx8MTc3NTMyNDkwN3ww&ixlib=rb-4.1.0&q=85";

export const HeroSection = () => {
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white"
      data-testid="hero-section"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230A192F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-padding relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-left order-2 lg:order-1">
            <span 
              className="heading-overline inline-block mb-4 opacity-0 animate-fade-up"
              data-testid="hero-overline"
            >
              Premium Laundry & Dry Cleaning
            </span>
            
            <h1 
              className="heading-primary text-4xl sm:text-5xl lg:text-6xl mb-6 opacity-0 animate-fade-up animation-delay-200"
              data-testid="hero-title"
            >
              Premium Care for{" "}
              <span className="text-teal">Your Clothes</span>
            </h1>
            
            <p 
              className="font-dm-sans text-slate-600 text-base sm:text-lg mb-8 max-w-lg opacity-0 animate-fade-up animation-delay-400"
              data-testid="hero-subtitle"
            >
              Fast, reliable & affordable dry cleaning at your doorstep. 
              Experience the difference of professional garment care with our 
              eco-friendly cleaning solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up animation-delay-600">
              <a
                href="#booking"
                onClick={(e) => scrollToSection(e, "#booking")}
                className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark text-white font-dm-sans font-medium px-6 py-3.5 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group"
                data-testid="hero-book-btn"
              >
                Book Pickup
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, "#pricing")}
                className="inline-flex items-center justify-center gap-2 border-2 border-navy text-navy font-dm-sans font-medium px-6 py-3.5 rounded-md transition-all duration-300 hover:bg-navy hover:text-white"
                data-testid="hero-pricing-btn"
              >
                View Pricing
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200 opacity-0 animate-fade-up animation-delay-800">
              <div>
                <p className="font-outfit font-bold text-2xl sm:text-3xl text-navy">5000+</p>
                <p className="font-dm-sans text-sm text-slate-500">Happy Customers</p>
              </div>
              <div>
                <p className="font-outfit font-bold text-2xl sm:text-3xl text-navy">24hr</p>
                <p className="font-dm-sans text-sm text-slate-500">Express Service</p>
              </div>
              <div>
                <p className="font-outfit font-bold text-2xl sm:text-3xl text-navy">100%</p>
                <p className="font-dm-sans text-sm text-slate-500">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2 opacity-0 animate-fade-up animation-delay-400">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal/10 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-navy/5 rounded-full" />
              
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={HERO_IMAGE}
                  alt="Premium dry cleaning service"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  data-testid="hero-image"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-teal fill-current" />
                </div>
                <div>
                  <p className="font-outfit font-semibold text-navy text-sm">Free Pickup</p>
                  <p className="font-dm-sans text-xs text-slate-500">& Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
