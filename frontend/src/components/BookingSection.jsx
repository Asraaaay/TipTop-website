import { useState } from "react";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CalendarIcon, CheckCircle, Loader2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ADMIN_WHATSAPP = "911234567890";

const services = [
  { value: "dry-cleaning", label: "Dry Cleaning" },
  { value: "steam-ironing", label: "Steam Ironing" },
  { value: "wash-fold", label: "Wash & Fold" },
  { value: "shoe-cleaning", label: "Shoe Cleaning" },
  { value: "curtain-cleaning", label: "Curtain Cleaning" },
];

const timeSlots = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

// Function to open WhatsApp with pre-filled message for admin
const sendAdminWhatsAppAlert = (bookingData) => {
  const serviceName = services.find(s => s.value === bookingData.service)?.label || bookingData.service;
  const message = encodeURIComponent(
    `🔔 New Booking Alert!\n\n` +
    `👤 Customer: ${bookingData.name}\n` +
    `📱 Phone: ${bookingData.phone}\n` +
    `📍 Address: ${bookingData.address}\n` +
    `🧺 Service: ${serviceName}\n` +
    `📅 Pickup: ${bookingData.pickup_date} (${bookingData.pickup_time})\n\n` +
    `Please confirm the booking.`
  );
  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, "_blank");
};

export const BookingSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    service: "",
    pickup_date: null,
    pickup_time: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.pickup_date) newErrors.pickup_date = "Please select a date";
    if (!formData.pickup_time) newErrors.pickup_time = "Please select a time slot";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        pickup_date: format(formData.pickup_date, "yyyy-MM-dd"),
      };
      
      await axios.post(`${BACKEND_URL}/api/bookings`, payload);
      
      // Store success data for WhatsApp message
      setSuccessData({
        ...formData,
        pickup_date: format(formData.pickup_date, "dd MMM yyyy"),
      });
      
      setIsSuccess(true);
      
      // Send WhatsApp alert to admin (opens in new tab)
      sendAdminWhatsAppAlert({
        ...formData,
        pickup_date: format(formData.pickup_date, "dd MMM yyyy"),
      });
      
      setFormData({
        name: "",
        phone: "",
        address: "",
        service: "",
        pickup_date: null,
        pickup_time: "",
      });
    } catch (error) {
      console.error("Booking failed:", error);
      setErrors({ submit: "Failed to submit booking. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Function for customer to send WhatsApp message
  const sendCustomerWhatsApp = () => {
    if (!successData) return;
    const serviceName = services.find(s => s.value === successData.service)?.label || successData.service;
    const message = encodeURIComponent(
      `Hi Tip Top Dry Cleaning Studio,\n\n` +
      `I just booked a pickup:\n` +
      `🧺 Service: ${serviceName}\n` +
      `📅 Pickup: ${successData.pickup_date} (${successData.pickup_time})\n` +
      `📍 Address: ${successData.address}\n\n` +
      `Please confirm my booking. Thank you!`
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, "_blank");
  };

  if (isSuccess) {
    return (
      <section id="booking" className="section-padding bg-white" data-testid="booking-section">
        <div className="container-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-teal" />
            </div>
            <h2 className="heading-primary text-3xl sm:text-4xl mb-4" data-testid="booking-success-title">
              Booking Confirmed!
            </h2>
            <p className="font-dm-sans text-slate-600 mb-6">
              Thank you for choosing Tip Top Dry Cleaning Studio. We'll contact you shortly to confirm your pickup.
            </p>
            
            {/* WhatsApp Confirmation Button */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <p className="font-dm-sans text-green-800 mb-4">
                Want instant confirmation? Send us a WhatsApp message!
              </p>
              <button
                onClick={sendCustomerWhatsApp}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-dm-sans font-medium px-6 py-3 rounded-md transition-colors"
                data-testid="whatsapp-confirm-btn"
              >
                <MessageCircle className="w-5 h-5" />
                Confirm via WhatsApp
              </button>
            </div>
            
            <button
              onClick={() => {
                setIsSuccess(false);
                setSuccessData(null);
              }}
              className="bg-teal hover:bg-teal-dark text-white font-dm-sans font-medium px-6 py-3 rounded-md transition-colors"
              data-testid="book-another-btn"
            >
              Book Another Pickup
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="section-padding bg-white" data-testid="booking-section">
      <div className="container-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <div>
            <span className="heading-overline mb-4 block" data-testid="booking-overline">
              Book Your Service
            </span>
            <h2 
              className="heading-primary text-3xl sm:text-4xl lg:text-5xl mb-4"
              data-testid="booking-title"
            >
              Schedule a Pickup
            </h2>
            <p className="font-dm-sans text-slate-600 mb-8">
              Fill in your details and we'll arrive at your doorstep. 
              Free pickup and delivery on all orders above ₹499.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                "Same-day pickup available for bookings before 2 PM",
                "Real-time order tracking via SMS updates",
                "Satisfaction guaranteed or we re-clean for free",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-teal" />
                  </div>
                  <p className="font-dm-sans text-slate-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-crisp-gray rounded-2xl p-6 sm:p-8 border border-slate-200"
            data-testid="booking-form"
          >
            <div className="space-y-5">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="font-dm-sans text-navy mb-2 block">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`font-dm-sans ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-teal"}`}
                  data-testid="booking-name-input"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 font-dm-sans">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="font-dm-sans text-navy mb-2 block">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`font-dm-sans ${errors.phone ? "border-red-500 focus:ring-red-500" : "focus:ring-teal"}`}
                  data-testid="booking-phone-input"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 font-dm-sans">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address" className="font-dm-sans text-navy mb-2 block">
                  Pickup Address *
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={`font-dm-sans ${errors.address ? "border-red-500 focus:ring-red-500" : "focus:ring-teal"}`}
                  data-testid="booking-address-input"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 font-dm-sans">{errors.address}</p>
                )}
              </div>

              {/* Service */}
              <div>
                <Label className="font-dm-sans text-navy mb-2 block">
                  Service Type *
                </Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => handleInputChange("service", value)}
                >
                  <SelectTrigger 
                    className={`font-dm-sans ${errors.service ? "border-red-500" : ""}`}
                    data-testid="booking-service-select"
                  >
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem 
                        key={service.value} 
                        value={service.value}
                        className="font-dm-sans"
                      >
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1 font-dm-sans">{errors.service}</p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <Label className="font-dm-sans text-navy mb-2 block">
                    Pickup Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`w-full flex items-center justify-between px-3 py-2 border rounded-md text-left font-dm-sans text-sm ${
                          errors.pickup_date ? "border-red-500" : "border-input"
                        } bg-background hover:bg-accent hover:text-accent-foreground`}
                        data-testid="booking-date-picker"
                      >
                        {formData.pickup_date ? (
                          format(formData.pickup_date, "PPP")
                        ) : (
                          <span className="text-muted-foreground">Pick a date</span>
                        )}
                        <CalendarIcon className="w-4 h-4 text-slate-500" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.pickup_date}
                        onSelect={(date) => handleInputChange("pickup_date", date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.pickup_date && (
                    <p className="text-red-500 text-sm mt-1 font-dm-sans">{errors.pickup_date}</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <Label className="font-dm-sans text-navy mb-2 block">
                    Time Slot *
                  </Label>
                  <Select
                    value={formData.pickup_time}
                    onValueChange={(value) => handleInputChange("pickup_time", value)}
                  >
                    <SelectTrigger 
                      className={`font-dm-sans ${errors.pickup_time ? "border-red-500" : ""}`}
                      data-testid="booking-time-select"
                    >
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem 
                          key={slot} 
                          value={slot}
                          className="font-dm-sans"
                        >
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pickup_time && (
                    <p className="text-red-500 text-sm mt-1 font-dm-sans">{errors.pickup_time}</p>
                  )}
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <p className="text-red-500 text-sm font-dm-sans bg-red-50 p-3 rounded-md">
                  {errors.submit}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal hover:bg-teal-dark disabled:bg-teal/50 text-white font-dm-sans font-medium py-3.5 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
                data-testid="booking-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
