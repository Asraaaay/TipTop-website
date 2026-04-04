import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_c461b78e-65c5-4db1-8a61-81ada40ad421/artifacts/wgklteuq_image.png";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      data-testid="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-padding">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, "#home")}
            className="flex items-center gap-2"
            data-testid="logo-link"
          >
            <img
              src={LOGO_URL}
              alt="Tip Top Dry Cleaning Studio"
              className="h-10 md:h-12 w-auto"
            />
            <span className="hidden sm:block font-outfit font-bold text-navy text-lg">
              Tip Top
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="relative text-navy font-dm-sans font-medium text-sm hover:text-teal transition-colors group"
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+911234567890"
              className="flex items-center gap-2 text-navy font-dm-sans text-sm"
              data-testid="header-phone"
            >
              <Phone className="w-4 h-4" />
              <span>+91 1234567890</span>
            </a>
            <a
              href="#booking"
              onClick={(e) => scrollToSection(e, "#booking")}
              className="bg-teal hover:bg-teal-dark text-white font-dm-sans font-medium text-sm px-5 py-2.5 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              data-testid="header-book-btn"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-navy"
            data-testid="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            className="md:hidden py-4 border-t border-slate-200 bg-white"
            data-testid="mobile-nav"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="block py-3 text-navy font-dm-sans font-medium hover:text-teal transition-colors"
                data-testid={`mobile-nav-${item.name.toLowerCase()}`}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#booking"
              onClick={(e) => scrollToSection(e, "#booking")}
              className="block mt-4 bg-teal hover:bg-teal-dark text-white font-dm-sans font-medium text-center py-3 rounded-md transition-colors"
              data-testid="mobile-book-btn"
            >
              Book Now
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};
