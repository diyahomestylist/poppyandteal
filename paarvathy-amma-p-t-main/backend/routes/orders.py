from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from database import get_database
from models import Order, OrderCreate, OrderStatusUpdate, OrderStatus
from auth import get_current_active_user, get_admin_user
from email_service import email_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=Order)
async def create_order(
    order_data: OrderCreate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create new order."""
    from datetime import datetime
    import uuid
    
    # Calculate total amount
    total_amount = sum(item.subtotal for item in order_data.items)
    
    # Create order
    order_dict = order_data.dict()
    order_dict["id"] = str(uuid.uuid4())
    order_dict["user_id"] = current_user["id"]
    order_dict["total_amount"] = total_amount
    order_dict["status"] = OrderStatus.PENDING
    order_dict["payment_status"] = "pending"
    order_dict["created_at"] = datetime.utcnow()
    order_dict["updated_at"] = datetime.utcnow()
    
    # Check product availability and update stock
    for item in order_data.items:
        product = await db.products.find_one({"id": item.product_id})
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item.product_id} not found"
            )
        
        if not product.get("in_stock", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product {product['name']} is out of stock"
            )
        
        current_stock = product.get("stock_quantity", 0)
        if current_stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product['name']}. Available: {current_stock}"
            )
        
        # Update stock quantity
        new_stock = current_stock - item.quantity
        update_data = {"stock_quantity": new_stock}
        if new_stock <= 0:
            update_data["in_stock"] = False
        
        await db.products.update_one(
            {"id": item.product_id},
            {"$set": update_data}
        )
    
    # Insert order
    result = await db.orders.insert_one(order_dict)
    if not result.inserted_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create order"
        )
    
    # Send order confirmation email
    try:
        await email_service.send_order_confirmation(
            to_email=current_user["email"],
            order_data={
                "order_id": order_dict["id"],
                "items": order_data.items,
                "total_amount": total_amount,
                "shipping_address": order_data.shipping_address
            }
        )
    except Exception as e:
        logger.warning(f"Failed to send order confirmation email: {str(e)}")
    
    return Order(**order_dict)

@router.get("/", response_model=List[Order])
async def get_user_orders(
    current_user: dict = Depends(get_current_active_user),
    limit: int = Query(20, le=50),
    skip: int = Query(0, ge=0),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current user's orders."""
    orders = await db.orders.find(
        {"user_id": current_user["id"]}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    return [Order(**order) for order in orders]

@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get single order by ID."""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if user owns this order or is admin
    if order["user_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order"
        )
    
    return Order(**order)

@router.put("/{order_id}/status", response_model=Order)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    admin_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update order status (admin only)."""
    # Check if order exists
    existing_order = await db.orders.find_one({"id": order_id})
    if not existing_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    from datetime import datetime
    
    result = await db.orders.update_one(
        {"id": order_id},
        {
            "$set": {
                "status": status_update.status,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update order status"
        )
    
    # Get updated order
    updated_order = await db.orders.find_one({"id": order_id})
    
    # Send status update email to customer
    try:
        user = await db.users.find_one({"id": existing_order["user_id"]})
        if user:
            # Here you could send status update email
            logger.info(f"Order {order_id} status updated to {status_update.status}")
    except Exception as e:
        logger.warning(f"Failed to send status update email: {str(e)}")
    
    return Order(**updated_order)

# Admin routes
@router.get("/admin/all", response_model=List[Order])
async def get_all_orders(
    status: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    admin_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all orders (admin only)."""
    filter_query = {}
    if status:
        filter_query["status"] = status
    
    orders = await db.orders.find(filter_query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return [Order(**order) for order in orders]