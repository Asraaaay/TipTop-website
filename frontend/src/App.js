import "@/App.css";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import { HowItWorks } from "./components/HowItWorks";
import { PricingSection } from "./components/PricingSection";
import { BookingSection } from "./components/BookingSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowItWorks />
        <PricingSection />
        <BookingSection />
        <TestimonialsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
