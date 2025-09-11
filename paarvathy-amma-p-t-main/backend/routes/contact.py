from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from database import get_database
from models import Contact, ContactCreate, ContactStatusUpdate
from auth import get_admin_user
from email_service import email_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/contact", tags=["contact"])

@router.post("/", response_model=Contact)
async def submit_contact_form(
    contact_data: ContactCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Submit contact form."""
    from datetime import datetime
    import uuid
    
    # Create contact record
    contact_dict = contact_data.dict()
    contact_dict["id"] = str(uuid.uuid4())
    contact_dict["status"] = "new"
    contact_dict["created_at"] = datetime.utcnow()
    
    # Insert into database
    result = await db.contacts.insert_one(contact_dict)
    if not result.inserted_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact form"
        )
    
    # Send notification email to admin
    try:
        await email_service.send_contact_notification({
            "name": contact_data.name,
            "email": contact_data.email,
            "subject": contact_data.subject,
            "message": contact_data.message,
            "created_at": contact_dict["created_at"]
        })
    except Exception as e:
        logger.warning(f"Failed to send contact notification email: {str(e)}")
    
    return Contact(**contact_dict)

# Admin routes
@router.get("/admin/all", response_model=List[Contact])
async def get_all_contacts(
    status: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    admin_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all contact messages (admin only)."""
    filter_query = {}
    if status:
        filter_query["status"] = status
    
    contacts = await db.contacts.find(filter_query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return [Contact(**contact) for contact in contacts]

@router.put("/admin/{contact_id}/status", response_model=Contact)
async def update_contact_status(
    contact_id: str,
    status_update: ContactStatusUpdate,
    admin_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update contact message status (admin only)."""
    # Check if contact exists
    existing_contact = await db.contacts.find_one({"id": contact_id})
    if not existing_contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    result = await db.contacts.update_one(
        {"id": contact_id},
        {"$set": {"status": status_update.status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update contact status"
        )
    
    # Get updated contact
    updated_contact = await db.contacts.find_one({"id": contact_id})
    return Contact(**updated_contact)

@router.get("/admin/{contact_id}", response_model=Contact)
async def get_contact(
    contact_id: str,
    admin_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get single contact message (admin only)."""
    contact = await db.contacts.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    return Contact(**contact)