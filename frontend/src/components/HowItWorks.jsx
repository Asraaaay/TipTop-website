import { CalendarCheck, Truck, Sparkles, PackageCheck } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Schedule Pickup",
    description: "Book a convenient pickup time through our website or call us directly.",
    icon: CalendarCheck,
  },
  {
    id: 2,
    title: "We Collect",
    description: "Our delivery partner arrives at your doorstep to collect your garments.",
    icon: Truck,
  },
  {
    id: 3,
    title: "Expert Cleaning",
    description: "Your clothes undergo professional cleaning with quality checks.",
    icon: Sparkles,
  },
  {
    id: 4,
    title: "Delivered Fresh",
    description: "Freshly cleaned and perfectly pressed clothes delivered back to you.",
    icon: PackageCheck,
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="section-padding bg-white"
      data-testid="how-it-works-section"
    >
      <div className="container-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="heading-overline mb-4 block" data-testid="how-overline">
            Simple Process
          </span>
          <h2 
            className="heading-primary text-3xl sm:text-4xl lg:text-5xl mb-4"
            data-testid="how-title"
          >
            How It Works
          </h2>
          <p className="font-dm-sans text-slate-600 max-w-2xl mx-auto">
            Getting your clothes professionally cleaned has never been easier. 
            Just four simple steps to fresh, clean garments.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200">
            <div className="absolute inset-0 bg-gradient-to-r from-teal via-teal to-teal/30" style={{ width: '75%' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative text-center group"
                data-testid={`step-${step.id}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Step Number & Icon */}
                <div className="relative inline-flex flex-col items-center mb-6">
                  <div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:border-teal group-hover:shadow-lg group-hover:-translate-y-1 z-10">
                    <step.icon className="w-8 h-8 text-teal" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 bg-navy text-white font-outfit font-bold text-sm rounded-full flex items-center justify-center">
                    {step.id}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-outfit font-bold text-lg text-navy mb-2">
                  {step.title}
                </h3>
                <p className="font-dm-sans text-sm text-slate-600 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#booking"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center bg-teal hover:bg-teal-dark text-white font-dm-sans font-medium px-8 py-3.5 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            data-testid="how-cta-btn"
          >
            Schedule Your First Pickup
          </a>
        </div>
      </div>
    </section>
  );
};
