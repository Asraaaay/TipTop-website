# Tip Top Dry Cleaning Studio - PRD

## Original Problem Statement
Create a modern, professional, and highly interactive website for a premium laundry and dry cleaning service brand named "Tip Top Dry Cleaning Studio".

## User Personas
1. **Customers** - Book laundry pickup services
2. **Admins** - Manage bookings, update status, communicate with customers

## Core Requirements (Static)
- [x] Premium landing page with hero section
- [x] Services, Pricing, How It Works sections
- [x] Interactive booking form with validation
- [x] Testimonials, About, Contact sections
- [x] WhatsApp floating button
- [x] Mobile responsive design

## What's Been Implemented

### Phase 1 (2026-04-04) - MVP
- Full landing page with all sections
- Booking form with MongoDB persistence
- WhatsApp floating button

### Phase 2 (2026-04-04) - Admin & Alerts
- **Admin Authentication**: JWT-based login with email/password
- **Admin Dashboard**: 
  - Stats overview (Total, Pending, Confirmed, Completed, Cancelled, Today)
  - Bookings table with filtering by status
  - Update booking status (pending/confirmed/completed/cancelled)
  - Delete bookings
  - WhatsApp link to message customers
  - Call customers directly
- **WhatsApp Alerts**: 
  - Admin receives alert when new booking is created
  - Customer can send confirmation via WhatsApp
  - Both use wa.me links (free, no API required)

### Admin Credentials
- Email: admin@tiptop.com
- Password: admin123
- Dashboard: /admin

## Technical Stack
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Auth**: JWT tokens with httpOnly cookies
- **Database**: MongoDB (bookings, users, contact_messages)

## API Endpoints
### Public
- POST /api/bookings - Create booking
- GET /api/bookings - Get all bookings
- GET /api/services - Get services list
- GET /api/pricing - Get pricing
- POST /api/contact - Submit contact message

### Auth
- POST /api/auth/login - Admin login
- POST /api/auth/logout - Admin logout
- GET /api/auth/me - Get current user

### Admin (Protected)
- GET /api/admin/stats - Get booking statistics
- GET /api/admin/bookings - Get all bookings (with filter)
- PUT /api/admin/bookings/{id} - Update booking status
- DELETE /api/admin/bookings/{id} - Delete booking

## Prioritized Backlog

### P0 (Critical) - COMPLETED
- [x] Landing page with booking
- [x] Admin dashboard
- [x] WhatsApp alerts

### P1 (High Priority)
- [ ] Email notifications (SendGrid/Resend)
- [ ] SMS notifications (Twilio)
- [ ] Order tracking for customers

### P2 (Medium Priority)
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Customer accounts
- [ ] Loyalty program

## Next Tasks
1. Add email notifications for booking confirmations
2. Implement SMS alerts via Twilio
3. Create customer login for order tracking
