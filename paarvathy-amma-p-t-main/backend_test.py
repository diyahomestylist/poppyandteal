#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Poppy & Teal Macramé Store
Tests all backend functionality including database initialization, authentication, products, orders, and admin features.
"""

import asyncio
import aiohttp
import json
import os
import time
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BACKEND_URL = "https://macrame-studio.preview.emergentagent.com/api"
TEST_USER_EMAIL = f"sarah.johnson.{int(time.time())}@example.com"
TEST_USER_PASSWORD = "SecurePass123!"
TEST_USER_FIRST_NAME = "Sarah"
TEST_USER_LAST_NAME = "Johnson"
ADMIN_EMAIL = "admin@poppyandteal.com"
ADMIN_PASSWORD = "admin123"

class MacrameStoreAPITester:
    def __init__(self):
        self.session = None
        self.user_token = None
        self.admin_token = None
        self.test_results = []
        self.created_user_id = None
        self.created_order_id = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name: str, success: bool, message: str, details: Optional[Dict] = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    async def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                          headers: Optional[Dict] = None, token: Optional[str] = None) -> Dict[str, Any]:
        """Make HTTP request to API"""
        url = f"{BACKEND_URL}{endpoint}"
        request_headers = {"Content-Type": "application/json"}
        
        if headers:
            request_headers.update(headers)
            
        if token:
            request_headers["Authorization"] = f"Bearer {token}"
        
        try:
            async with self.session.request(
                method, url, 
                json=data if data else None,
                headers=request_headers
            ) as response:
                response_text = await response.text()
                try:
                    response_data = json.loads(response_text) if response_text else {}
                except json.JSONDecodeError:
                    response_data = {"raw_response": response_text}
                
                return {
                    "status": response.status,
                    "data": response_data,
                    "headers": dict(response.headers)
                }
        except Exception as e:
            return {
                "status": 0,
                "data": {"error": str(e)},
                "headers": {}
            }
    
    async def test_api_health(self):
        """Test if API is accessible"""
        response = await self.make_request("GET", "/")
        
        if response["status"] == 200:
            self.log_test(
                "API Health Check", 
                True, 
                "API is accessible and responding",
                {"response": response["data"]}
            )
        else:
            self.log_test(
                "API Health Check", 
                False, 
                f"API not accessible - Status: {response['status']}",
                {"response": response["data"]}
            )
    
    async def test_database_initialization(self):
        """Test if database was initialized with sample data"""
        # Test products endpoint to see if sample products exist
        response = await self.make_request("GET", "/products")
        
        if response["status"] == 200:
            products = response["data"]
            if len(products) >= 5:  # Should have at least 5 sample products
                featured_products = [p for p in products if p.get("featured", False)]
                categories = set(p.get("category") for p in products)
                
                self.log_test(
                    "Database Initialization - Products", 
                    True, 
                    f"Found {len(products)} products, {len(featured_products)} featured, {len(categories)} categories",
                    {
                        "total_products": len(products),
                        "featured_count": len(featured_products),
                        "categories": list(categories)
                    }
                )
            else:
                self.log_test(
                    "Database Initialization - Products", 
                    False, 
                    f"Expected at least 5 products, found {len(products)}",
                    {"products_found": len(products)}
                )
        else:
            self.log_test(
                "Database Initialization - Products", 
                False, 
                f"Failed to fetch products - Status: {response['status']}",
                {"response": response["data"]}
            )
    
    async def test_admin_user_creation(self):
        """Test if admin user was created during initialization"""
        # Try to login with admin credentials
        login_data = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response = await self.make_request("POST", "/auth/login", login_data)
        
        if response["status"] == 200:
            token_data = response["data"]
            if "access_token" in token_data and "user" in token_data:
                user = token_data["user"]
                if user.get("role") == "admin":
                    self.admin_token = token_data["access_token"]
                    self.log_test(
                        "Admin User Creation", 
                        True, 
                        "Admin user exists and can login successfully",
                        {"admin_email": user.get("email"), "role": user.get("role")}
                    )
                else:
                    self.log_test(
                        "Admin User Creation", 
                        False, 
                        f"User exists but role is '{user.get('role')}', expected 'admin'",
                        {"user_data": user}
                    )
            else:
                self.log_test(
                    "Admin User Creation", 
                    False, 
                    "Login successful but response missing required fields",
                    {"response": token_data}
                )
        else:
            self.log_test(
                "Admin User Creation", 
                False, 
                f"Admin login failed - Status: {response['status']}",
                {"response": response["data"]}
            )
    
    async def test_products_api(self):
        """Test products API endpoints"""
        # Test GET /products
        response = await self.make_request("GET", "/products")
        if response["status"] == 200:
            self.log_test("Products API - GET /products", True, f"Retrieved {len(response['data'])} products")
        else:
            self.log_test("Products API - GET /products", False, f"Status: {response['status']}", response["data"])
        
        # Test GET /products/featured
        response = await self.make_request("GET", "/products/featured")
        if response["status"] == 200:
            featured = response["data"]
            self.log_test("Products API - GET /products/featured", True, f"Retrieved {len(featured)} featured products")
        else:
            self.log_test("Products API - GET /products/featured", False, f"Status: {response['status']}", response["data"])
        
        # Test GET /products/categories
        response = await self.make_request("GET", "/products/categories")
        if response["status"] == 200:
            categories = response["data"]
            self.log_test("Products API - GET /products/categories", True, f"Retrieved categories: {categories}")
        else:
            self.log_test("Products API - GET /products/categories", False, f"Status: {response['status']}", response["data"])
        
        # Test individual product retrieval
        products_response = await self.make_request("GET", "/products")
        if products_response["status"] == 200 and products_response["data"]:
            product_id = products_response["data"][0]["id"]
            response = await self.make_request("GET", f"/products/{product_id}")
            if response["status"] == 200:
                self.log_test("Products API - GET /products/{id}", True, f"Retrieved product: {response['data']['name']}")
            else:
                self.log_test("Products API - GET /products/{id}", False, f"Status: {response['status']}", response["data"])
    
    async def test_user_registration(self):
        """Test user registration"""
        user_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "first_name": TEST_USER_FIRST_NAME,
            "last_name": TEST_USER_LAST_NAME
        }
        
        response = await self.make_request("POST", "/auth/register", user_data)
        
        if response["status"] == 200:
            token_data = response["data"]
            if "access_token" in token_data and "user" in token_data:
                self.user_token = token_data["access_token"]
                self.created_user_id = token_data["user"]["id"]
                self.log_test(
                    "User Registration", 
                    True, 
                    f"User registered successfully: {token_data['user']['email']}",
                    {"user_id": self.created_user_id}
                )
            else:
                self.log_test("User Registration", False, "Registration response missing required fields", token_data)
        else:
            self.log_test("User Registration", False, f"Status: {response['status']}", response["data"])
    
    async def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        response = await self.make_request("POST", "/auth/login", login_data)
        
        if response["status"] == 200:
            token_data = response["data"]
            if "access_token" in token_data:
                self.user_token = token_data["access_token"]
                self.log_test("User Login", True, f"User logged in successfully: {token_data['user']['email']}")
            else:
                self.log_test("User Login", False, "Login response missing access token", token_data)
        else:
            self.log_test("User Login", False, f"Status: {response['status']}", response["data"])
    
    async def test_user_profile(self):
        """Test user profile endpoints"""
        if not self.user_token:
            self.log_test("User Profile", False, "No user token available for testing")
            return
        
        # Test GET /auth/me
        response = await self.make_request("GET", "/auth/me", token=self.user_token)
        
        if response["status"] == 200:
            user_data = response["data"]
            self.log_test("User Profile - GET /auth/me", True, f"Retrieved profile for: {user_data.get('email')}")
        else:
            self.log_test("User Profile - GET /auth/me", False, f"Status: {response['status']}", response["data"])
    
    async def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Emma Wilson",
            "email": "emma.wilson@example.com",
            "subject": "Question about custom macramé pieces",
            "message": "Hi! I'm interested in commissioning a custom wall hanging for my living room. Could you please provide information about your custom work process and pricing? I'm looking for something in earth tones that would complement my bohemian decor style."
        }
        
        response = await self.make_request("POST", "/contact/", contact_data)
        
        if response["status"] == 200:
            contact_response = response["data"]
            self.log_test(
                "Contact Form Submission", 
                True, 
                f"Contact form submitted successfully - ID: {contact_response.get('id')}",
                {"contact_id": contact_response.get("id"), "status": contact_response.get("status")}
            )
        else:
            self.log_test("Contact Form Submission", False, f"Status: {response['status']}", response["data"])
    
    async def test_admin_dashboard(self):
        """Test admin dashboard access"""
        if not self.admin_token:
            self.log_test("Admin Dashboard", False, "No admin token available for testing")
            return
        
        response = await self.make_request("GET", "/admin/dashboard", token=self.admin_token)
        
        if response["status"] == 200:
            dashboard_data = response["data"]
            self.log_test(
                "Admin Dashboard Access", 
                True, 
                "Dashboard data retrieved successfully",
                {
                    "total_orders": dashboard_data.get("total_orders"),
                    "total_products": dashboard_data.get("total_products"),
                    "total_users": dashboard_data.get("total_users"),
                    "total_revenue": dashboard_data.get("total_revenue")
                }
            )
        else:
            self.log_test("Admin Dashboard Access", False, f"Status: {response['status']}", response["data"])
    
    async def test_order_creation(self):
        """Test order creation"""
        if not self.user_token:
            # Try to login first if no token
            await self.test_user_login()
        
        if not self.user_token:
            self.log_test("Order Creation", False, "No user token available for testing")
            return
        
        # First get available products
        products_response = await self.make_request("GET", "/products")
        if products_response["status"] != 200 or not products_response["data"]:
            self.log_test("Order Creation", False, "Cannot retrieve products for order test")
            return
        
        # Find an in-stock product
        available_product = None
        for product in products_response["data"]:
            if product.get("in_stock", False) and product.get("stock_quantity", 0) > 0:
                available_product = product
                break
        
        if not available_product:
            self.log_test("Order Creation", False, "No in-stock products available for order test")
            return
        
        order_data = {
            "items": [
                {
                    "product_id": available_product["id"],
                    "name": available_product["name"],
                    "price": available_product["price"],
                    "quantity": 1,
                    "subtotal": available_product["price"]
                }
            ],
            "shipping_address": {
                "street": "123 Bohemian Lane",
                "city": "Austin",
                "state": "TX",
                "postal_code": "78701",
                "country": "USA"
            },
            "notes": "Please handle with care - this is a gift!"
        }
        
        response = await self.make_request("POST", "/orders/", order_data, token=self.user_token)
        
        if response["status"] == 200:
            order_response = response["data"]
            self.created_order_id = order_response.get("id")
            self.log_test(
                "Order Creation", 
                True, 
                f"Order created successfully - ID: {self.created_order_id}",
                {
                    "order_id": self.created_order_id,
                    "total_amount": order_response.get("total_amount"),
                    "status": order_response.get("status")
                }
            )
        else:
            self.log_test("Order Creation", False, f"Status: {response['status']}", response["data"])
    
    async def test_user_orders(self):
        """Test retrieving user orders"""
        if not self.user_token:
            # Try to login first if no token
            await self.test_user_login()
        
        if not self.user_token:
            self.log_test("User Orders", False, "No user token available for testing")
            return
        
        response = await self.make_request("GET", "/orders/", token=self.user_token)
        
        if response["status"] == 200:
            orders = response["data"]
            self.log_test("User Orders", True, f"Retrieved {len(orders)} orders for user")
        else:
            self.log_test("User Orders", False, f"Status: {response['status']}", response["data"])
    
    async def test_admin_features(self):
        """Test admin-only features"""
        if not self.admin_token:
            self.log_test("Admin Features", False, "No admin token available for testing")
            return
        
        # Test admin users list
        response = await self.make_request("GET", "/admin/users", token=self.admin_token)
        if response["status"] == 200:
            users = response["data"]
            self.log_test("Admin Features - Users List", True, f"Retrieved {len(users)} users")
        else:
            self.log_test("Admin Features - Users List", False, f"Status: {response['status']}", response["data"])
        
        # Test admin orders list
        response = await self.make_request("GET", "/orders/admin/all", token=self.admin_token)
        if response["status"] == 200:
            orders = response["data"]
            self.log_test("Admin Features - Orders List", True, f"Retrieved {len(orders)} orders")
        else:
            self.log_test("Admin Features - Orders List", False, f"Status: {response['status']}", response["data"])
        
        # Test admin contacts list
        response = await self.make_request("GET", "/contact/admin/all", token=self.admin_token)
        if response["status"] == 200:
            contacts = response["data"]
            self.log_test("Admin Features - Contacts List", True, f"Retrieved {len(contacts)} contact messages")
        else:
            self.log_test("Admin Features - Contacts List", False, f"Status: {response['status']}", response["data"])
    
    async def run_all_tests(self):
        """Run all tests in sequence"""
        print("🧪 Starting Poppy & Teal Macramé Store Backend API Tests")
        print("=" * 60)
        
        # Core API tests
        await self.test_api_health()
        await self.test_database_initialization()
        await self.test_admin_user_creation()
        
        # Products API tests
        await self.test_products_api()
        
        # Authentication tests
        await self.test_user_registration()
        await self.test_user_login()
        await self.test_user_profile()
        
        # Contact form test
        await self.test_contact_form()
        
        # Admin features tests
        await self.test_admin_dashboard()
        await self.test_admin_features()
        
        # Order tests
        await self.test_order_creation()
        await self.test_user_orders()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("🧪 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        failed = len(self.test_results) - passed
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)

async def main():
    """Main test runner"""
    async with MacrameStoreAPITester() as tester:
        await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())