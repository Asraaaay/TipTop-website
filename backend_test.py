import requests
import sys
import json
from datetime import datetime, timedelta

class TipTopDryCleaningAPITester:
    def __init__(self, base_url="https://premium-press-6.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.session = requests.Session()  # Use session for cookie management
        self.admin_logged_in = False

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_fields=None, use_session=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            # Use session for admin endpoints to maintain cookies
            client = self.session if use_session else requests
            
            if method == 'GET':
                response = client.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = client.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = client.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = client.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Check expected fields if provided
                if expected_fields and isinstance(response_data, dict):
                    for field in expected_fields:
                        if field not in response_data:
                            print(f"⚠️  Warning: Expected field '{field}' not found in response")
                        else:
                            print(f"   ✓ Field '{field}' present")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": response_data
            })

            return success, response_data

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "api/",
            200,
            expected_fields=["message"]
        )

    def test_services_endpoint(self):
        """Test services endpoint"""
        return self.run_test(
            "Get Services",
            "GET",
            "api/services",
            200,
            expected_fields=["services"]
        )

    def test_pricing_endpoint(self):
        """Test pricing endpoint"""
        return self.run_test(
            "Get Pricing",
            "GET",
            "api/pricing",
            200,
            expected_fields=["regular", "express"]
        )

    def test_testimonials_endpoint(self):
        """Test testimonials endpoint"""
        return self.run_test(
            "Get Testimonials",
            "GET",
            "api/testimonials",
            200,
            expected_fields=["testimonials"]
        )

    def test_create_booking(self):
        """Test booking creation"""
        # Create a test booking
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        test_booking = {
            "name": "Test Customer",
            "phone": "9876543210",
            "address": "123 Test Street, Test City",
            "service": "dry-cleaning",
            "pickup_date": tomorrow,
            "pickup_time": "9:00 AM - 11:00 AM"
        }
        
        success, response = self.run_test(
            "Create Booking",
            "POST",
            "api/bookings",
            200,
            data=test_booking,
            expected_fields=["id", "name", "phone", "status", "created_at"]
        )
        
        if success and "id" in response:
            return response["id"]
        return None

    def test_get_bookings(self):
        """Test getting all bookings"""
        return self.run_test(
            "Get All Bookings",
            "GET",
            "api/bookings",
            200
        )

    def test_get_booking_by_id(self, booking_id):
        """Test getting a specific booking"""
        if not booking_id:
            print("⚠️  Skipping get booking by ID test - no booking ID available")
            return False, {}
            
        return self.run_test(
            "Get Booking by ID",
            "GET",
            f"api/bookings/{booking_id}",
            200,
            expected_fields=["id", "name", "phone", "status"]
        )

    def test_create_contact_message(self):
        """Test contact message creation"""
        test_message = {
            "name": "Test Contact",
            "email": "test@example.com",
            "phone": "9876543210",
            "message": "This is a test contact message"
        }
        
        return self.run_test(
            "Create Contact Message",
            "POST",
            "api/contact",
            200,
            data=test_message,
            expected_fields=["id", "name", "email", "created_at"]
        )

    # ============ ADMIN AUTHENTICATION TESTS ============
    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        login_data = {
            "email": "admin@tiptop.com",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login (Success)",
            "POST",
            "api/auth/login",
            200,
            data=login_data,
            expected_fields=["id", "email", "name", "role"],
            use_session=True
        )
        
        if success and response.get("role") == "admin":
            self.admin_logged_in = True
            print(f"   ✓ Admin logged in successfully: {response.get('email')}")
        
        return success, response

    def test_admin_login_failure(self):
        """Test admin login with incorrect credentials"""
        login_data = {
            "email": "admin@tiptop.com",
            "password": "wrongpassword"
        }
        
        return self.run_test(
            "Admin Login (Wrong Password)",
            "POST",
            "api/auth/login",
            401,
            data=login_data,
            use_session=False  # Don't use session for failed login
        )

    def test_admin_login_invalid_email(self):
        """Test admin login with invalid email"""
        login_data = {
            "email": "invalid@email.com",
            "password": "admin123"
        }
        
        return self.run_test(
            "Admin Login (Invalid Email)",
            "POST",
            "api/auth/login",
            401,
            data=login_data,
            use_session=False
        )

    def test_admin_me_endpoint(self):
        """Test getting current admin user info"""
        if not self.admin_logged_in:
            print("⚠️  Skipping admin/me test - admin not logged in")
            return False, {}
            
        return self.run_test(
            "Get Current Admin User",
            "GET",
            "api/auth/me",
            200,
            expected_fields=["id", "email", "name", "role"],
            use_session=True
        )

    # ============ ADMIN DASHBOARD TESTS ============
    def test_admin_stats(self):
        """Test admin dashboard stats"""
        if not self.admin_logged_in:
            print("⚠️  Skipping admin stats test - admin not logged in")
            return False, {}
            
        return self.run_test(
            "Admin Dashboard Stats",
            "GET",
            "api/admin/stats",
            200,
            expected_fields=["total", "pending", "confirmed", "completed", "cancelled", "today"],
            use_session=True
        )

    def test_admin_get_all_bookings(self):
        """Test admin getting all bookings"""
        if not self.admin_logged_in:
            print("⚠️  Skipping admin bookings test - admin not logged in")
            return False, {}
            
        return self.run_test(
            "Admin Get All Bookings",
            "GET",
            "api/admin/bookings",
            200,
            expected_fields=["bookings"],
            use_session=True
        )

    def test_admin_filter_bookings(self):
        """Test admin filtering bookings by status"""
        if not self.admin_logged_in:
            print("⚠️  Skipping admin filter bookings test - admin not logged in")
            return False, {}
            
        return self.run_test(
            "Admin Filter Bookings (Pending)",
            "GET",
            "api/admin/bookings?status=pending",
            200,
            expected_fields=["bookings"],
            use_session=True
        )

    def test_admin_update_booking_status(self, booking_id):
        """Test admin updating booking status"""
        if not self.admin_logged_in:
            print("⚠️  Skipping admin update booking test - admin not logged in")
            return False, {}
            
        if not booking_id:
            print("⚠️  Skipping admin update booking test - no booking ID available")
            return False, {}
            
        update_data = {"status": "confirmed"}
        
        return self.run_test(
            "Admin Update Booking Status",
            "PUT",
            f"api/admin/bookings/{booking_id}",
            200,
            data=update_data,
            expected_fields=["id", "status"],
            use_session=True
        )

    def test_admin_delete_booking(self, booking_id):
        """Test admin deleting a booking"""
        if not self.admin_logged_in:
            print("⚠️  Skipping admin delete booking test - admin not logged in")
            return False, {}
            
        if not booking_id:
            print("⚠️  Skipping admin delete booking test - no booking ID available")
            return False, {}
            
        return self.run_test(
            "Admin Delete Booking",
            "DELETE",
            f"api/admin/bookings/{booking_id}",
            200,
            expected_fields=["message"],
            use_session=True
        )

    def test_admin_logout(self):
        """Test admin logout"""
        if not self.admin_logged_in:
            print("⚠️  Skipping admin logout test - admin not logged in")
            return False, {}
            
        success, response = self.run_test(
            "Admin Logout",
            "POST",
            "api/auth/logout",
            200,
            expected_fields=["message"],
            use_session=True
        )
        
        if success:
            self.admin_logged_in = False
            print("   ✓ Admin logged out successfully")
        
        return success, response

    # ============ UNAUTHORIZED ACCESS TESTS ============
    def test_unauthorized_admin_access(self):
        """Test accessing admin endpoints without authentication"""
        return self.run_test(
            "Unauthorized Admin Stats Access",
            "GET",
            "api/admin/stats",
            401,
            use_session=False  # Don't use session to ensure no cookies
        )

def main():
    print("🧪 Starting Tip Top Dry Cleaning Studio API Tests")
    print("=" * 60)
    
    tester = TipTopDryCleaningAPITester()
    
    # ============ PUBLIC API TESTS ============
    print("\n📋 Testing Public API Endpoints...")
    tester.test_root_endpoint()
    tester.test_services_endpoint()
    tester.test_pricing_endpoint()
    tester.test_testimonials_endpoint()
    
    # Test booking flow
    print("\n📝 Testing Booking Flow...")
    booking_id = tester.test_create_booking()
    tester.test_get_bookings()
    tester.test_get_booking_by_id(booking_id)
    
    # Test contact
    tester.test_create_contact_message()
    
    # ============ ADMIN AUTHENTICATION TESTS ============
    print("\n🔐 Testing Admin Authentication...")
    
    # Test unauthorized access first
    tester.test_unauthorized_admin_access()
    
    # Test login failures
    tester.test_admin_login_failure()
    tester.test_admin_login_invalid_email()
    
    # Test successful login
    tester.test_admin_login_success()
    tester.test_admin_me_endpoint()
    
    # ============ ADMIN DASHBOARD TESTS ============
    print("\n📊 Testing Admin Dashboard Features...")
    tester.test_admin_stats()
    tester.test_admin_get_all_bookings()
    tester.test_admin_filter_bookings()
    
    # ============ ADMIN BOOKING MANAGEMENT TESTS ============
    print("\n🛠️  Testing Admin Booking Management...")
    
    # Create a test booking for admin operations
    print("\n   Creating test booking for admin operations...")
    test_booking_id = tester.test_create_booking()
    
    if test_booking_id:
        tester.test_admin_update_booking_status(test_booking_id)
        # Note: We'll delete the booking at the end to clean up
        tester.test_admin_delete_booking(test_booking_id)
    
    # ============ ADMIN LOGOUT TEST ============
    print("\n🚪 Testing Admin Logout...")
    tester.test_admin_logout()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    # Categorize results
    public_tests = [t for t in tester.test_results if not any(keyword in t['name'].lower() for keyword in ['admin', 'unauthorized'])]
    admin_tests = [t for t in tester.test_results if any(keyword in t['name'].lower() for keyword in ['admin', 'unauthorized'])]
    
    public_passed = len([t for t in public_tests if t['success']])
    admin_passed = len([t for t in admin_tests if t['success']])
    
    print(f"   📋 Public API: {public_passed}/{len(public_tests)} tests passed")
    print(f"   🔐 Admin Features: {admin_passed}/{len(admin_tests)} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        failed_tests = [test for test in tester.test_results if not test["success"]]
        print(f"\nFailed tests:")
        for test in failed_tests:
            error_msg = test.get('error', f'Status {test["actual_status"]}')
            print(f"  - {test['name']}: {error_msg}")
        return 1

if __name__ == "__main__":
    sys.exit(main())