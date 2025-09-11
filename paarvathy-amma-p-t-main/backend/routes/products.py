from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from database import get_database
from models import Product, ProductCreate, ProductUpdate
from auth import get_admin_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[Product])
async def get_products(
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    in_stock: Optional[bool] = Query(None),
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all products with optional filtering."""
    filter_query = {}
    
    if category and category != "All":
        filter_query["category"] = category
    if featured is not None:
        filter_query["featured"] = featured
    if in_stock is not None:
        filter_query["in_stock"] = in_stock
    
    products = await db.products.find(filter_query).skip(skip).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@router.get("/featured", response_model=List[Product])
async def get_featured_products(
    limit: int = Query(6, le=20),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get featured products."""
    products = await db.products.find({"featured": True, "in_stock": True}).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@router.get("/categories")
async def get_categories(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all product categories."""
    categories = await db.products.distinct("category")
    return {"categories": categories}

@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get single product by ID."""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return Product(**product)

@router.post("/", response_model=Product)
async def create_product(
    product_data: ProductCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    admin_user: dict = Depends(get_admin_user)
):
    """Create new product (admin only)."""
    from datetime import datetime
    import uuid
    
    product_dict = product_data.dict()
    product_dict["id"] = str(uuid.uuid4())
    product_dict["created_at"] = datetime.utcnow()
    product_dict["updated_at"] = datetime.utcnow()
    
    result = await db.products.insert_one(product_dict)
    if not result.inserted_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create product"
        )
    
    return Product(**product_dict)

@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    admin_user: dict = Depends(get_admin_user)
):
    """Update product (admin only)."""
    # Check if product exists
    existing_product = await db.products.find_one({"id": product_id})
    if not existing_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Prepare update data
    update_data = {k: v for k, v in product_update.dict().items() if v is not None}
    if not update_data:
        return Product(**existing_product)
    
    from datetime import datetime
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update product"
        )
    
    # Get updated product
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product)

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    admin_user: dict = Depends(get_admin_user)
):
    """Delete product (admin only)."""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return {"message": "Product deleted successfully"}

@router.get("/search/{query}")
async def search_products(
    query: str,
    limit: int = Query(20, le=50),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Search products by name, description, or category."""
    search_filter = {
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}},
            {"category": {"$regex": query, "$options": "i"}}
        ]
    }
    
    products = await db.products.find(search_filter).limit(limit).to_list(limit)
    return [Product(**product) for product in products]