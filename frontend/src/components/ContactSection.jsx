import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const ContactSection = () => {
  return (
    <section
      id="contact"
      className="section-padding bg-white"
      data-testid="contact-section"
    >
      <div className="container-padding">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="heading-overline mb-4 block" data-testid="contact-overline">
            Get In Touch
          </span>
          <h2 
            className="heading-primary text-3xl sm:text-4xl lg:text-5xl mb-4"
            data-testid="contact-title"
          >
            Contact Us
          </h2>
          <p className="font-dm-sans text-slate-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. 
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Phone */}
            <div 
              className="flex items-start gap-4 p-6 bg-crisp-gray rounded-xl border border-slate-200"
              data-testid="contact-phone"
            >
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-teal" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold text-navy mb-1">Phone</h4>
                <a 
                  href="tel:+911234567890" 
                  className="font-dm-sans text-slate-600 hover:text-teal transition-colors"
                >
                  +91 1234567890
                </a>
                <p className="font-dm-sans text-sm text-slate-500 mt-1">
                  Call us for immediate assistance
                </p>
              </div>
            </div>

            {/* Email */}
            <div 
              className="flex items-start gap-4 p-6 bg-crisp-gray rounded-xl border border-slate-200"
              data-testid="contact-email"
            >
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-teal" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold text-navy mb-1">Email</h4>
                <a 
                  href="mailto:info@tiptopdrycleaning.com" 
                  className="font-dm-sans text-slate-600 hover:text-teal transition-colors"
                >
                  info@tiptopdrycleaning.com
                </a>
                <p className="font-dm-sans text-sm text-slate-500 mt-1">
                  We'll respond within 24 hours
                </p>
              </div>
            </div>

            {/* Address */}
            <div 
              className="flex items-start gap-4 p-6 bg-crisp-gray rounded-xl border border-slate-200"
              data-testid="contact-address"
            >
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-teal" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold text-navy mb-1">Address</h4>
                <p className="font-dm-sans text-slate-600">
                  123 Main Street, Sector 15<br />
                  New Delhi, India - 110001
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div 
              className="flex items-start gap-4 p-6 bg-crisp-gray rounded-xl border border-slate-200"
              data-testid="contact-hours"
            >
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-teal" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold text-navy mb-1">Working Hours</h4>
                <div className="font-dm-sans text-slate-600 space-y-1">
                  <p>Monday - Saturday: 8:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div 
            className="rounded-2xl overflow-hidden border border-slate-200 h-[400px] lg:h-full min-h-[400px]"
            data-testid="contact-map"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0661467788344!2d77.20918547549735!3d28.629089175667654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tip Top Dry Cleaning Studio Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
