import { Sparkles, Wind, Shirt, Footprints, LayoutGrid } from "lucide-react";

const IMAGES = {
  dryClean: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHw0fHxwcmVtaXVtJTIwZHJ5JTIwY2xlYW5pbmclMjBzdWl0fGVufDB8fHx8MTc3NTMyNDkwN3ww&ixlib=rb-4.1.0&q=85",
  steamIron: "https://images.unsplash.com/photo-1740684589228-54b6fba08985?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwzfHxzdGVhbSUyMGlyb25pbmclMjBjbG90aGVzJTIwcHJvZmVzc2lvbmFsfGVufDB8fHx8MTc3NTMyNDkxOHww&ixlib=rb-4.1.0&q=85",
  washFold: "https://images.unsplash.com/photo-1760722974657-f64bce2f9cc5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHw0fHxmcmVzaCUyMHdoaXRlJTIwZm9sZGVkJTIwbGF1bmRyeSUyMHRvd2Vsc3xlbnwwfHx8fDE3NzUzMjQ5MDd8MA&ixlib=rb-4.1.0&q=85",
};

const services = [
  {
    id: "dry-cleaning",
    name: "Dry Cleaning",
    description: "Premium dry cleaning for delicate fabrics, suits, and formal wear with expert stain removal.",
    icon: Sparkles,
    image: IMAGES.dryClean,
    featured: true,
  },
  {
    id: "steam-ironing",
    name: "Steam Ironing",
    description: "Professional steam pressing for wrinkle-free, crisp results every time.",
    icon: Wind,
    image: IMAGES.steamIron,
    featured: true,
  },
  {
    id: "wash-fold",
    name: "Wash & Fold",
    description: "Complete laundry service with careful washing and precise folding.",
    icon: Shirt,
    image: IMAGES.washFold,
    featured: false,
  },
  {
    id: "shoe-cleaning",
    name: "Shoe Cleaning",
    description: "Expert shoe care, cleaning, and restoration for all types of footwear.",
    icon: Footprints,
    featured: false,
  },
  {
    id: "curtain-cleaning",
    name: "Curtain Cleaning",
    description: "Deep cleaning for curtains, drapes, and home textiles.",
    icon: LayoutGrid,
    featured: false,
  },
];

export const ServicesSection = () => {
  return (
    <section
      id="services"
      className="section-padding bg-crisp-gray"
      data-testid="services-section"
    >
      <div className="container-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="heading-overline mb-4 block" data-testid="services-overline">
            What We Offer
          </span>
          <h2 
            className="heading-primary text-3xl sm:text-4xl lg:text-5xl mb-4"
            data-testid="services-title"
          >
            Our Premium Services
          </h2>
          <p className="font-dm-sans text-slate-600 max-w-2xl mx-auto">
            From everyday laundry to specialized garment care, we provide 
            comprehensive cleaning solutions with attention to every detail.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Services with Images */}
          {services.slice(0, 2).map((service, index) => (
            <div
              key={service.id}
              className={`group relative overflow-hidden rounded-xl bg-white border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                index === 0 ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""
              }`}
              data-testid={`service-card-${service.id}`}
            >
              <div className={`relative ${index === 0 ? "h-64 lg:h-full" : "h-48"} overflow-hidden`}>
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-teal/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-teal" />
                  </div>
                  <h3 className="font-outfit font-bold text-xl">{service.name}</h3>
                </div>
                <p className="font-dm-sans text-sm text-white/80">{service.description}</p>
              </div>
            </div>
          ))}

          {/* Wash & Fold Card with Image */}
          {(() => {
            const washFold = services[2];
            const WashFoldIcon = washFold.icon;
            return (
              <div
                className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:col-span-2 lg:col-span-1"
                data-testid={`service-card-${washFold.id}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={washFold.image}
                    alt={washFold.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-teal/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <WashFoldIcon className="w-5 h-5 text-teal" />
                    </div>
                    <h3 className="font-outfit font-bold text-xl">{washFold.name}</h3>
                  </div>
                  <p className="font-dm-sans text-sm text-white/80">{washFold.description}</p>
                </div>
              </div>
            );
          })()}

          {/* Smaller Service Cards */}
          {services.slice(3).map((service) => (
            <div
              key={service.id}
              className="group p-6 rounded-xl bg-white border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-teal/30"
              data-testid={`service-card-${service.id}`}
            >
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-teal/20">
                <service.icon className="w-6 h-6 text-teal" />
              </div>
              <h3 className="font-outfit font-bold text-lg text-navy mb-2">
                {service.name}
              </h3>
              <p className="font-dm-sans text-sm text-slate-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
