from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from database import get_database
from models import DashboardStats, UserResponse, UserUpdate
from auth import get_admin_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    admin_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get admin dashboard statistics."""
    try:
        # Get total counts
        total_orders = await db.orders.count_documents({})
        total_products = await db.products.count_documents({})
        total_users = await db.users.count_documents({"role": "customer"})
        
        # Calculate total revenue
        pipeline = [
            {"$match": {"status": {"$in": ["confirmed", "processing", "shipped", "delivered"]}}},
            {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}
        ]
        revenue_result = await db.orders.aggregate(pipeline).to_list(1)
        total_revenue = revenue_result[0]["total"] if revenue_result else 0.0
        
        # Get recent orders
        recent_orders = await db.orders.find({}).sort("created_at", -1).limit(5).to_list(5)
        
        # Get top products (most ordered)
        pipeline = [
            {"$unwind": "$items"},
            {"$group": {
                "_id": "$items.product_id",
                "name": {"$first": "$items.name"},
                "total_quantity": {"$sum": "$items.quantity"},
                "total_revenue": {"$sum": "$items.subtotal"}
            }},
            {"$sort": {"total_quantity": -1}},
            {"$limit": 5}
        ]
        top_products = await db.orders.aggregate(pipeline).to_list(5)
        
        return DashboardStats(
            total_orders=total_orders,
            total_revenue=total_revenue,
            total_products=total_products,
            total_users=total_users,
            recent_orders=[
                {
                    "id": order["id"],
                    "total_amount": order["total_amount"],
                    "status": order["status"],
                    "created_at": order["created_at"].isoformat()
                }
                for order in recent_orders
            ],
            top_products=[
                {
                    "product_id": product["_id"],
                    "name": product["name"],
                    "total_quantity": product["total_quantity"],
                    "total_revenue": product["total_revenue"]
                }
                for product in top_products
            ]
        )
    
    except Exception as e:
        logger.error(f"Failed to get dashboard stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard statistics"
        )

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    admin_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all users (admin only)."""
    users = await db.users.find({}).skip(skip).limit(limit).to_list(limit)
    return [UserResponse(**user) for user in users]

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    admin_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update user (admin only)."""
    # Check if user exists
    existing_user = await db.users.find_one({"id": user_id})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prepare update data
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    if not update_data:
        return UserResponse(**existing_user)
    
    from datetime import datetime
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )
    
    # Get updated user
    updated_user = await db.users.find_one({"id": user_id})
    return UserResponse(**updated_user)

@router.put("/users/{user_id}/toggle-status")
async def toggle_user_status(
    user_id: str,
    admin_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Toggle user active status (admin only)."""
    # Check if user exists
    existing_user = await db.users.find_one({"id": user_id})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Don't allow admin to disable themselves
    if user_id == admin_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot disable your own account"
        )
    
    new_status = not existing_user.get("is_active", True)
    from datetime import datetime
    
    result = await db.users.update_one(
        {"id": user_id},
        {
            "$set": {
                "is_active": new_status,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user status"
        )
    
    return {
        "message": f"User {'activated' if new_status else 'deactivated'} successfully",
        "is_active": new_status
    }