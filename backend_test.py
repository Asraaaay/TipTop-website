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

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_fields=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

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

def main():
    print("🧪 Starting Tip Top Dry Cleaning Studio API Tests")
    print("=" * 60)
    
    tester = TipTopDryCleaningAPITester()
    
    # Test all endpoints
    tester.test_root_endpoint()
    tester.test_services_endpoint()
    tester.test_pricing_endpoint()
    tester.test_testimonials_endpoint()
    
    # Test booking flow
    booking_id = tester.test_create_booking()
    tester.test_get_bookings()
    tester.test_get_booking_by_id(booking_id)
    
    # Test contact
    tester.test_create_contact_message()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
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