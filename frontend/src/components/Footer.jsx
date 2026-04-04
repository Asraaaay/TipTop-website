import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_c461b78e-65c5-4db1-8a61-81ada40ad421/artifacts/wgklteuq_image.png";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Pricing", href: "#pricing" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const services = [
  "Dry Cleaning",
  "Steam Ironing",
  "Wash & Fold",
  "Shoe Cleaning",
  "Curtain Cleaning",
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export const Footer = () => {
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-navy text-white" data-testid="footer">
      <div className="container-padding py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={LOGO_URL}
                alt="Tip Top Dry Cleaning Studio"
                className="h-12 w-auto brightness-0 invert"
              />
              <span className="font-outfit font-bold text-xl">Tip Top</span>
            </div>
            <p className="font-dm-sans text-white/70 text-sm mb-6">
              Premium laundry and dry cleaning services at your doorstep. 
              Quality care for your garments since 2016.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-teal transition-colors"
                  aria-label={social.label}
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-outfit font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="font-dm-sans text-white/70 text-sm hover:text-teal transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-outfit font-bold text-lg mb-4">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="font-dm-sans text-white/70 text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-outfit font-bold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                <a 
                  href="tel:+911234567890" 
                  className="font-dm-sans text-white/70 text-sm hover:text-teal transition-colors"
                >
                  +91 1234567890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                <a 
                  href="mailto:info@tiptopdrycleaning.com" 
                  className="font-dm-sans text-white/70 text-sm hover:text-teal transition-colors"
                >
                  info@tiptopdrycleaning.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                <span className="font-dm-sans text-white/70 text-sm">
                  123 Main Street, Sector 15<br />
                  New Delhi, India - 110001
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-padding py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-dm-sans text-white/50 text-sm">
            © {new Date().getFullYear()} Tip Top Dry Cleaning Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-dm-sans text-white/50 text-sm hover:text-teal transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-dm-sans text-white/50 text-sm hover:text-teal transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
