from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import secrets

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', secrets.token_hex(32))
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI()

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth")

# ============ PASSWORD UTILITIES ============
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# ============ JWT UTILITIES ============
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# ============ AUTH DEPENDENCY ============
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        del user["_id"]
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ============ MODELS ============
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

class BookingCreate(BaseModel):
    name: str
    phone: str
    address: str
    service: str
    pickup_date: str
    pickup_time: str

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    service: Optional[str] = None
    pickup_date: Optional[str] = None
    pickup_time: Optional[str] = None

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

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: str
    message: str

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ============ AUTH ROUTES ============
@auth_router.post("/login")
async def login(request: LoginRequest, response: Response):
    email = request.email.lower()
    user = await db.users.find_one({"email": email})
    
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=86400,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return {
        "id": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }

@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

@auth_router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user

# ============ ADMIN ROUTES ============
@api_router.get("/admin/stats")
async def get_admin_stats(user: dict = Depends(get_admin_user)):
    total_bookings = await db.bookings.count_documents({})
    pending_bookings = await db.bookings.count_documents({"status": "pending"})
    confirmed_bookings = await db.bookings.count_documents({"status": "confirmed"})
    completed_bookings = await db.bookings.count_documents({"status": "completed"})
    cancelled_bookings = await db.bookings.count_documents({"status": "cancelled"})
    
    # Get today's bookings
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_bookings = await db.bookings.count_documents({"pickup_date": today})
    
    return {
        "total": total_bookings,
        "pending": pending_bookings,
        "confirmed": confirmed_bookings,
        "completed": completed_bookings,
        "cancelled": cancelled_bookings,
        "today": today_bookings
    }

@api_router.get("/admin/bookings")
async def get_all_bookings(
    status: Optional[str] = None,
    user: dict = Depends(get_admin_user)
):
    query = {}
    if status:
        query["status"] = status
    
    bookings = await db.bookings.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return {"bookings": bookings}

@api_router.put("/admin/bookings/{booking_id}")
async def update_booking(
    booking_id: str,
    update: BookingUpdate,
    user: dict = Depends(get_admin_user)
):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    updated_booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    return updated_booking

@api_router.delete("/admin/bookings/{booking_id}")
async def delete_booking(
    booking_id: str,
    user: dict = Depends(get_admin_user)
):
    result = await db.bookings.delete_one({"id": booking_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"message": "Booking deleted successfully"}

# ============ PUBLIC API ROUTES ============
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
            {"id": "dry-cleaning", "name": "Dry Cleaning", "description": "Premium dry cleaning for delicate fabrics and formal wear", "icon": "Sparkles"},
            {"id": "steam-ironing", "name": "Steam Ironing", "description": "Professional steam pressing for wrinkle-free perfection", "icon": "Wind"},
            {"id": "wash-fold", "name": "Wash & Fold", "description": "Complete laundry service with careful folding", "icon": "Shirt"},
            {"id": "shoe-cleaning", "name": "Shoe Cleaning", "description": "Expert shoe care and restoration services", "icon": "Footprints"},
            {"id": "curtain-cleaning", "name": "Curtain Cleaning", "description": "Deep cleaning for curtains and drapes", "icon": "LayoutGrid"}
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
            {"id": 1, "name": "Priya Sharma", "rating": 5, "text": "Excellent service! My silk sarees have never looked better.", "avatar": "PS"},
            {"id": 2, "name": "Rahul Mehta", "rating": 5, "text": "Fast pickup and delivery. My office shirts are always perfectly pressed.", "avatar": "RM"},
            {"id": 3, "name": "Anita Desai", "rating": 5, "text": "The curtain cleaning service transformed my home.", "avatar": "AD"},
            {"id": 4, "name": "Vikram Singh", "rating": 5, "text": "Best dry cleaning in town! They removed stains I thought were permanent.", "avatar": "VS"}
        ]
    }

# Include routers
app.include_router(auth_router)
app.include_router(api_router)

# CORS Configuration
frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    origins = ["*"]
else:
    origins = cors_origins.split(',')

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ STARTUP EVENTS ============
@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)
    
    # Seed admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@tiptop.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    else:
        # Update password if changed
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}}
            )
            logger.info(f"Admin password updated: {admin_email}")
    
    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"# Test Credentials\n\n")
        f.write(f"## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write(f"- Role: admin\n\n")
        f.write(f"## Auth Endpoints\n")
        f.write(f"- POST /api/auth/login\n")
        f.write(f"- POST /api/auth/logout\n")
        f.write(f"- GET /api/auth/me\n")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
