from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class BookingCreate(BaseModel):
    name: str
    phone: str
    address: str
    service: str
    pickup_date: str
    pickup_time: str

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    address: str
    service: str
    pickup_date: str
    pickup_time: str
    status: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: str
    message: str

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Tip Top Dry Cleaning Studio API"}

@api_router.post("/bookings", response_model=Booking)
async def create_booking(input: BookingCreate):
    booking_obj = Booking(**input.model_dump())
    doc = booking_obj.model_dump()
    await db.bookings.insert_one(doc)
    return booking_obj

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    message_obj = ContactMessage(**input.model_dump())
    doc = message_obj.model_dump()
    await db.contact_messages.insert_one(doc)
    return message_obj

@api_router.get("/services")
async def get_services():
    return {
        "services": [
            {
                "id": "dry-cleaning",
                "name": "Dry Cleaning",
                "description": "Premium dry cleaning for delicate fabrics and formal wear",
                "icon": "Sparkles"
            },
            {
                "id": "steam-ironing",
                "name": "Steam Ironing",
                "description": "Professional steam pressing for wrinkle-free perfection",
                "icon": "Wind"
            },
            {
                "id": "wash-fold",
                "name": "Wash & Fold",
                "description": "Complete laundry service with careful folding",
                "icon": "Shirt"
            },
            {
                "id": "shoe-cleaning",
                "name": "Shoe Cleaning",
                "description": "Expert shoe care and restoration services",
                "icon": "Footprints"
            },
            {
                "id": "curtain-cleaning",
                "name": "Curtain Cleaning",
                "description": "Deep cleaning for curtains and drapes",
                "icon": "LayoutGrid"
            }
        ]
    }

@api_router.get("/pricing")
async def get_pricing():
    return {
        "regular": [
            {"item": "Shirt", "price": 60},
            {"item": "Pants/Trousers", "price": 80},
            {"item": "T-Shirt", "price": 50},
            {"item": "Saree", "price": 150},
            {"item": "Suit (2 pc)", "price": 350},
            {"item": "Blazer/Jacket", "price": 200},
            {"item": "Kurta", "price": 80},
            {"item": "Dress", "price": 180},
            {"item": "Coat", "price": 300},
            {"item": "Blanket", "price": 250}
        ],
        "express": [
            {"item": "Shirt", "price": 90},
            {"item": "Pants/Trousers", "price": 120},
            {"item": "T-Shirt", "price": 75},
            {"item": "Saree", "price": 225},
            {"item": "Suit (2 pc)", "price": 525},
            {"item": "Blazer/Jacket", "price": 300},
            {"item": "Kurta", "price": 120},
            {"item": "Dress", "price": 270},
            {"item": "Coat", "price": 450},
            {"item": "Blanket", "price": 375}
        ]
    }

@api_router.get("/testimonials")
async def get_testimonials():
    return {
        "testimonials": [
            {
                "id": 1,
                "name": "Priya Sharma",
                "rating": 5,
                "text": "Excellent service! My silk sarees have never looked better. The team handles everything with such care.",
                "avatar": "PS"
            },
            {
                "id": 2,
                "name": "Rahul Mehta",
                "rating": 5,
                "text": "Fast pickup and delivery. My office shirts are always perfectly pressed. Highly recommend!",
                "avatar": "RM"
            },
            {
                "id": 3,
                "name": "Anita Desai",
                "rating": 5,
                "text": "The curtain cleaning service transformed my home. Professional team and great results.",
                "avatar": "AD"
            },
            {
                "id": 4,
                "name": "Vikram Singh",
                "rating": 5,
                "text": "Best dry cleaning in town! They removed stains I thought were permanent. Amazing quality.",
                "avatar": "VS"
            }
        ]
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
