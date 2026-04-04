import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "911234567890";

export const WhatsAppButton = () => {
  const handleClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in your dry cleaning services.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
      data-testid="whatsapp-fab"
    >
      {/* Pulse Ring */}
      <span className="absolute inset-0 bg-green-500 rounded-full animate-pulse-ring" />
      
      {/* Button */}
      <span className="relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl transition-all duration-300 hover:scale-110">
        <MessageCircle className="w-6 h-6 text-white fill-white" />
      </span>

      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-navy font-dm-sans text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us!
      </span>
    </button>
  );
};
