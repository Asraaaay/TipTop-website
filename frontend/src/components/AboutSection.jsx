import { Leaf, Clock, Shield, Award } from "lucide-react";

const ABOUT_IMAGE = "https://images.unsplash.com/photo-1684248850355-19f3efb72f1f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwzfHxmcmVzaCUyMHdoaXRlJTIwZm9sZGVkJTIwbGF1bmRyeSUyMHRvd2Vsc3xlbnwwfHx8fDE3NzUzMjQ5MDd8MA&ixlib=rb-4.1.0&q=85";

const features = [
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "We use biodegradable detergents and green cleaning solutions.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "24-hour express service available for urgent requirements.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Every garment undergoes strict quality control checks.",
  },
  {
    icon: Award,
    title: "Expert Care",
    description: "Our trained professionals handle your clothes with utmost care.",
  },
];

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="section-padding bg-crisp-gray"
      data-testid="about-section"
    >
      <div className="container-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={ABOUT_IMAGE}
                alt="Fresh clean laundry"
                className="w-full h-full object-cover"
                data-testid="about-image"
              />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-outfit font-bold text-2xl text-navy">8+</p>
                    <p className="font-dm-sans text-xs text-slate-600">Years Experience</p>
                  </div>
                  <div>
                    <p className="font-outfit font-bold text-2xl text-navy">50K+</p>
                    <p className="font-dm-sans text-xs text-slate-600">Orders Completed</p>
                  </div>
                  <div>
                    <p className="font-outfit font-bold text-2xl text-navy">99%</p>
                    <p className="font-dm-sans text-xs text-slate-600">Satisfaction Rate</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal/10 rounded-full -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-navy/5 rounded-full -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="heading-overline mb-4 block" data-testid="about-overline">
              About Us
            </span>
            <h2 
              className="heading-primary text-3xl sm:text-4xl lg:text-5xl mb-6"
              data-testid="about-title"
            >
              Your Trusted Partner for Garment Care
            </h2>
            <p className="font-dm-sans text-slate-600 mb-6">
              Tip Top Dry Cleaning Studio has been serving the community for over 8 years, 
              delivering exceptional laundry and dry cleaning services. We combine traditional 
              expertise with modern technology to ensure your clothes receive the best care possible.
            </p>
            <p className="font-dm-sans text-slate-600 mb-8">
              Our commitment to quality, eco-friendly practices, and customer satisfaction 
              has made us the preferred choice for thousands of families and professionals.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200"
                  data-testid={`about-feature-${feature.title.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <h4 className="font-outfit font-semibold text-navy text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="font-dm-sans text-xs text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
