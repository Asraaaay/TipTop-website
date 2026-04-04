import { useState } from "react";
import { Check, Zap } from "lucide-react";

const pricingData = {
  regular: [
    { item: "Shirt", price: 60 },
    { item: "Pants/Trousers", price: 80 },
    { item: "T-Shirt", price: 50 },
    { item: "Saree", price: 150 },
    { item: "Suit (2 pc)", price: 350 },
    { item: "Blazer/Jacket", price: 200 },
    { item: "Kurta", price: 80 },
    { item: "Dress", price: 180 },
    { item: "Coat", price: 300 },
    { item: "Blanket", price: 250 },
  ],
  express: [
    { item: "Shirt", price: 90 },
    { item: "Pants/Trousers", price: 120 },
    { item: "T-Shirt", price: 75 },
    { item: "Saree", price: 225 },
    { item: "Suit (2 pc)", price: 525 },
    { item: "Blazer/Jacket", price: 300 },
    { item: "Kurta", price: 120 },
    { item: "Dress", price: 270 },
    { item: "Coat", price: 450 },
    { item: "Blanket", price: 375 },
  ],
};

export const PricingSection = () => {
  const [isExpress, setIsExpress] = useState(false);
  const currentPricing = isExpress ? pricingData.express : pricingData.regular;

  return (
    <section
      id="pricing"
      className="section-padding bg-crisp-gray"
      data-testid="pricing-section"
    >
      <div className="container-padding">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="heading-overline mb-4 block" data-testid="pricing-overline">
            Transparent Pricing
          </span>
          <h2 
            className="heading-primary text-3xl sm:text-4xl lg:text-5xl mb-4"
            data-testid="pricing-title"
          >
            Simple & Affordable
          </h2>
          <p className="font-dm-sans text-slate-600 max-w-2xl mx-auto mb-8">
            Quality cleaning at competitive prices. No hidden charges, no surprises.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-1.5 border border-slate-200 shadow-sm">
            <button
              onClick={() => setIsExpress(false)}
              className={`px-6 py-2.5 rounded-full font-dm-sans font-medium text-sm transition-all duration-300 ${
                !isExpress
                  ? "bg-navy text-white shadow-md"
                  : "text-slate-600 hover:text-navy"
              }`}
              data-testid="pricing-regular-btn"
            >
              Regular (48hrs)
            </button>
            <button
              onClick={() => setIsExpress(true)}
              className={`px-6 py-2.5 rounded-full font-dm-sans font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                isExpress
                  ? "bg-teal text-white shadow-md"
                  : "text-slate-600 hover:text-navy"
              }`}
              data-testid="pricing-express-btn"
            >
              <Zap className="w-4 h-4" />
              Express (24hrs)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Main Pricing Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 relative overflow-hidden">
            {isExpress && (
              <div className="absolute top-4 right-4 bg-teal text-white text-xs font-dm-sans font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Express
              </div>
            )}
            
            <h3 className="font-outfit font-bold text-xl text-navy mb-6">
              {isExpress ? "Express Service Pricing" : "Regular Service Pricing"}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {currentPricing.map((item, index) => (
                <div
                  key={item.item}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  data-testid={`price-item-${index}`}
                >
                  <span className="font-dm-sans text-slate-700">{item.item}</span>
                  <span className="font-outfit font-semibold text-navy">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Value Card */}
          <div className="bg-navy text-white rounded-2xl p-8 relative overflow-hidden" data-testid="best-value-card">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <span className="inline-block bg-teal text-white text-xs font-dm-sans font-medium px-3 py-1 rounded-full mb-4">
                Best Value
              </span>
              
              <h3 className="font-outfit font-bold text-2xl mb-2">Monthly Plan</h3>
              <p className="text-white/70 font-dm-sans text-sm mb-6">
                Perfect for families and regular users
              </p>
              
              <div className="mb-6">
                <span className="font-outfit font-bold text-4xl">₹1,999</span>
                <span className="text-white/70 font-dm-sans">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  "30 garments included",
                  "Free pickup & delivery",
                  "Priority service",
                  "10% off additional items",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 font-dm-sans text-sm">
                    <Check className="w-4 h-4 text-teal flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <a
                href="#booking"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block w-full bg-teal hover:bg-teal-dark text-white font-dm-sans font-medium text-center py-3 rounded-md transition-all duration-300"
                data-testid="pricing-plan-btn"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-center mt-8 font-dm-sans text-sm text-slate-500">
          * Prices are per item. Bulk orders get additional discounts. 
          <a href="#contact" className="text-teal hover:underline ml-1">Contact us</a> for custom quotes.
        </p>
      </div>
    </section>
  );
};
