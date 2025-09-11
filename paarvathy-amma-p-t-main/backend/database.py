from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'macrame_store')

client = AsyncIOMotorClient(MONGO_URL)
database = client[DB_NAME]

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance."""
    return database

async def create_indexes():
    """Create database indexes for better performance."""
    db = await get_database()
    
    # User indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    
    # Product indexes
    await db.products.create_index("id", unique=True)
    await db.products.create_index("category")
    await db.products.create_index("featured")
    await db.products.create_index("in_stock")
    
    # Order indexes
    await db.orders.create_index("id", unique=True)
    await db.orders.create_index("user_id")
    await db.orders.create_index("status")
    await db.orders.create_index("created_at")
    
    # Contact indexes
    await db.contacts.create_index("id", unique=True)
    await db.contacts.create_index("status")
    await db.contacts.create_index("created_at")

async def init_database():
    """Initialize database with sample data if empty."""
    db = await get_database()
    
    # Check if products collection is empty
    product_count = await db.products.count_documents({})
    if product_count == 0:
        # Insert sample products from mock data
        sample_products = [
            {
                "id": "1",
                "name": "Bohemian Wall Hanging",
                "price": 89.99,
                "category": "Wall Art",
                "image": "/images/IMG_3122.JPG",
                "description": "Beautiful handcrafted macramé wall hanging featuring intricate patterns and natural cotton cord.",
                "in_stock": True,
                "stock_quantity": 5,
                "featured": True,
                "images": [],
                "metadata": {
                    "materials": ["Cotton Cord", "Natural Fibers"],
                    "dimensions": "24\" x 36\"",
                    "care_instructions": "Gentle hand wash, air dry"
                }
            },
            {
                "id": "2",
                "name": "Spiral Plant Hanger",
                "price": 45.50,
                "category": "Plant Hangers",
                "image": "/images/IMG_3131.JPG",
                "description": "Elegant spiral design plant hanger perfect for your favorite hanging plants.",
                "in_stock": True,
                "stock_quantity": 8,
                "featured": True,
                "images": [],
                "metadata": {
                    "materials": ["Jute Cord"],
                    "dimensions": "36\" length",
                    "care_instructions": "Spot clean only"
                }
            },
            {
                "id": "3",
                "name": "Macramé Table Runner",
                "price": 65.00,
                "category": "Home Decor",
                "image": "/images/IMG_3136.JPG",
                "description": "Sophisticated table runner that adds a touch of boho elegance to any dining space.",
                "in_stock": True,
                "stock_quantity": 3,
                "featured": False,
                "images": [],
                "metadata": {
                    "materials": ["Cotton Cord"],
                    "dimensions": "72\" x 12\"",
                    "care_instructions": "Machine washable, cold water"
                }
            },
            {
                "id": "4",
                "name": "Feather Wall Art",
                "price": 72.99,
                "category": "Wall Art",
                "image": "/images/IMG_3139.JPG",
                "description": "Stunning feather-inspired macramé piece that creates beautiful shadows and textures.",
                "in_stock": True,
                "stock_quantity": 4,
                "featured": True,
                "images": [],
                "metadata": {
                    "materials": ["Cotton Cord", "Natural Dyes"],
                    "dimensions": "18\" x 42\"",
                    "care_instructions": "Dust gently with soft brush"
                }
            },
            {
                "id": "5",
                "name": "Hanging Planters Set",
                "price": 120.00,
                "category": "Plant Hangers",
                "image": "/images/IMG_3144.JPG",
                "description": "Set of three matching plant hangers in different sizes for a cohesive look.",
                "in_stock": False,
                "stock_quantity": 0,
                "featured": False,
                "images": [],
                "metadata": {
                    "materials": ["Jute Cord", "Wooden Rings"],
                    "dimensions": "Small: 24\", Medium: 30\", Large: 36\"",
                    "care_instructions": "Spot clean only"
                }
            }
        ]
        
        # Add timestamps to all products
        from datetime import datetime
        for product in sample_products:
            product["created_at"] = datetime.utcnow()
            product["updated_at"] = datetime.utcnow()
        
        await db.products.insert_many(sample_products)
        print("✅ Sample products inserted into database")
    
    # Create admin user if none exists
    admin_count = await db.users.count_documents({"role": "admin"})
    if admin_count == 0:
        from auth import get_password_hash
        from datetime import datetime
        
        admin_user = {
            "id": "admin-001",
            "email": "admin@poppyandteal.com",
            "password": get_password_hash("admin123"),  # Change this in production
            "first_name": "Admin",
            "last_name": "User",
            "role": "admin",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.users.insert_one(admin_user)
        print("✅ Admin user created: admin@poppyandteal.com / admin123")