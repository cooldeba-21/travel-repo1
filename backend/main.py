import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import httpx
from datetime import datetime
import json
import re

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# ✅ THIS LINE IS CRITICAL - Creates the "app" that uvicorn looks for
app = FastAPI(
    title="Travel Guide API",
    description="AI-powered travel planning and recommendations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = "deepseek/deepseek-chat-v3.1:free"

# Print status
if API_KEY:
    print(f"✅ API Key loaded: {API_KEY[:10]}...{API_KEY[-4:]}")
else:
    print("❌ No API Key found! Please set OPENROUTER_API_KEY in .env file")

print(f"🤖 Using model: {MODEL}")

# ============= NEW STRUCTURED RESPONSE MODELS =============

class Restaurant(BaseModel):
    name: str
    location: str
    signature_dishes: List[str]
    price_range: str
    atmosphere: str
    category: str  # fine-dining, casual, traditional, buffet, luxury
    rating: Optional[float] = None
    cuisine_type: Optional[str] = None

class Hotel(BaseModel):
    name: str
    location: str
    price_range: str
    amenities: List[str]
    category: str  # luxury, mid-range, budget, boutique
    rating: Optional[float] = None
    booking_tips: Optional[str] = None

class Activity(BaseModel):
    name: str
    location: str
    description: str
    duration: str
    cost: Optional[str] = None
    time_of_day: Optional[str] = None  # morning, afternoon, evening
    category: str  # sightseeing, adventure, cultural, food, shopping

class DayItinerary(BaseModel):
    day: int
    theme: str
    activities: List[Activity]
    meals: List[Restaurant]
    transportation_tips: str
    estimated_cost: str

class LocalSpecialty(BaseModel):
    name: str
    description: str
    where_to_find: Optional[str] = None

# Updated Response Models
class RestaurantResponse(BaseModel):
    destination: str
    restaurants: List[Restaurant]
    local_specialties: List[LocalSpecialty]
    tips: List[str]
    budget_category: str

class HotelResponse(BaseModel):
    destination: str
    hotels: List[Hotel]
    booking_tips: List[str]
    best_areas: List[str]
    budget_category: str

class ItineraryResponse(BaseModel):
    destination: str
    duration: int
    itinerary: List[DayItinerary]
    budget_breakdown: dict
    travel_tips: List[str]
    packing_suggestions: List[str]

class TravelResponse(BaseModel):
    answer: str
    error: Optional[str] = None

# Request models (keeping your existing ones)
class TravelQuery(BaseModel):
    question: str = Field(..., min_length=1, description="Your travel question")

class ItineraryRequest(BaseModel):
    destination: str = Field(..., min_length=2)
    duration: int = Field(..., ge=1, le=30, description="Duration in days")
    budget: Optional[str] = Field("mid-range", description="budget, mid-range, or luxury")
    interests: Optional[List[str]] = Field(None, description="Your interests")
    travel_style: Optional[str] = Field(None, description="solo, couple, family, group")

class HotelRequest(BaseModel):
    destination: str = Field(..., min_length=2)
    budget: Optional[str] = Field("mid-range")
    preferences: Optional[List[str]] = Field(None)

class RestaurantRequest(BaseModel):
    destination: str = Field(..., min_length=2)
    cuisine_type: Optional[str] = Field(None)
    budget: Optional[str] = Field("mid-range")

# ============= AI PARSING FUNCTIONS =============

def parse_restaurants_from_ai(ai_response: str, destination: str, budget: str) -> RestaurantResponse:
    """Parse AI response and structure it into restaurant data"""
    restaurants = []
    local_specialties = []
    tips = []
    
    # Simple regex-based parsing (you can make this more sophisticated)
    restaurant_pattern = r"###\s*\d*\.?\s*(.+?)\n\\s\\*Location:\\\s(.+?)\n.?\\s*\\*Signature Dishes:\\\s(.+?)\n.?\\s*\\*Price Range:\\\s(.+?)\n.?\\s*\\*Atmosphere:\\\s(.+?)\n"
    
    matches = re.findall(restaurant_pattern, ai_response, re.DOTALL)
    
    for match in matches:
        name = match[0].strip()
        location = match[1].strip()
        dishes_text = match[2].strip()
        price_range = match[3].strip()
        atmosphere = match[4].strip()
        
        # Extract dishes (simple splitting by common patterns)
        signature_dishes = [dish.strip(' "') for dish in re.findall(r'\\(.+?)\\*', dishes_text)]
        if not signature_dishes:
            signature_dishes = [dish.strip() for dish in dishes_text.replace('', '').split(',')]
        
        # Determine category based on price range
        category = "casual"
        if "₹1,200" in price_range or "luxury" in atmosphere.lower():
            category = "luxury"
        elif "₹800" in price_range or "fine" in atmosphere.lower():
            category = "fine-dining"
        elif "buffet" in name.lower() or "buffet" in atmosphere.lower():
            category = "buffet"
        elif "₹400" in price_range or "dhaba" in name.lower():
            category = "traditional"
        
        restaurants.append(Restaurant(
            name=name,
            location=location,
            signature_dishes=signature_dishes[:3],  # Limit to 3 dishes
            price_range=price_range,
            atmosphere=atmosphere,
            category=category,
            rating=round(4.0 + (len(signature_dishes) * 0.1), 1)  # Fake rating based on dishes
        ))
    
    # Extract local specialties
    specialty_section = re.search(r'local.?specialties?.?:(.*?)(?=###|$)', ai_response, re.IGNORECASE | re.DOTALL)
    if specialty_section:
        specialty_text = specialty_section.group(1)
        specialty_matches = re.findall(r'\\s\\(.+?):\\\s*(.+?)(?=\\s\\|\n\n|$)', specialty_text)
        for spec_match in specialty_matches:
            local_specialties.append(LocalSpecialty(
                name=spec_match[0].strip(),
                description=spec_match[1].strip()
            ))
    
    # Extract tips
    if "tip" in ai_response.lower():
        tips = [
            "Ask restaurants if they serve local specialties",
            "Book in advance for popular places",
            "Try local fish curries for fresh flavors",
            "Don't miss traditional breakfast options"
        ]
    
    return RestaurantResponse(
        destination=destination,
        restaurants=restaurants,
        local_specialties=local_specialties,
        tips=tips,
        budget_category=budget
    )

# ============= ENHANCED API ENDPOINTS =============

async def call_ai_api(system_prompt: str, user_prompt: str) -> str:
    if not API_KEY:
        return "❌ API key not configured. Please add OPENROUTER_API_KEY to your .env file"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(OPENROUTER_URL, headers=headers, json=payload)
            
            if response.status_code == 402:
                return "⚠ Payment required: You need credits on OpenRouter"
            
            response.raise_for_status()
            data = response.json()
            
            if not data.get("choices") or not data["choices"][0].get("message"):
                return "❌ Invalid API response format"
            
            return data["choices"][0]["message"]["content"]
            
    except httpx.TimeoutException:
        return "⏱ Request timeout - free models can be slow, please try again"
    except Exception as e:
        return f"❌ Error: {str(e)}"

@app.get("/")
async def root():
    return {
        "message": "🌍 Travel Guide API is running!",
        "version": "1.0.0",
        "model": MODEL,
        "status": "✅ Ready" if API_KEY else "❌ No API Key",
        "endpoints": [
            "/api/restaurants - Get structured restaurant recommendations",
            "/api/hotels - Get structured hotel recommendations", 
            "/api/itinerary - Get structured day-by-day itinerary",
            "/api/travel-guide - Get general travel advice"
        ]
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "api_configured": bool(API_KEY)
    }

@app.post("/api/travel-guide", response_model=TravelResponse)
async def travel_guide(query: TravelQuery):
    """General travel questions and advice"""
    system_prompt = """You are an expert travel guide with extensive worldwide knowledge. 
    Provide helpful, practical travel advice with specific recommendations, costs, and insider tips."""
    
    try:
        answer = await call_ai_api(system_prompt, query.question)
        return TravelResponse(answer=answer)
    except Exception as e:
        return TravelResponse(
            answer="Sorry, I had trouble processing your question. Please try again.",
            error=str(e)
        )

@app.post("/api/restaurants", response_model=RestaurantResponse)
async def recommend_restaurants(request: RestaurantRequest):
    """Get structured restaurant recommendations"""
    system_prompt = """You are a food expert. Provide restaurant recommendations in this EXACT format:

### 1. Restaurant Name
* *Location:* Exact address or area
* *Signature Dishes:* *Dish 1, **Dish 2, **Dish 3*
* *Price Range:* ₹XXX - ₹XXX for two people
* *Atmosphere:* Brief description of ambiance

### 2. Restaurant Name
[Same format]

Then add a section:

### Local Specialties You Must Try:
* *Specialty Name:* Description of the dish
* *Another Specialty:* Description

Provide 6-8 restaurants with complete details."""
    
    cuisine_focus = request.cuisine_type or "local specialties and popular dishes"
    
    user_prompt = f"""Recommend restaurants in {request.destination}.
    Budget: {request.budget}
    Cuisine: {cuisine_focus}
    
    Focus on specific names, locations, signature dishes, and exact pricing."""
    
    try:
        ai_response = await call_ai_api(system_prompt, user_prompt)
        structured_response = parse_restaurants_from_ai(ai_response, request.destination, request.budget)
        return structured_response
    except Exception as e:
        # Fallback response
        return RestaurantResponse(
            destination=request.destination,
            restaurants=[],
            local_specialties=[],
            tips=["Error getting recommendations"],
            budget_category=request.budget,
        )

@app.post("/api/hotels", response_model=HotelResponse)
async def recommend_hotels(request: HotelRequest):
    """Get structured hotel recommendations"""
    system_prompt = """You are a hotel expert. Provide hotel recommendations in this EXACT format:

### 1. Hotel Name
* *Location:* Exact address or area
* *Price Range:* ₹XXX - ₹XXX per night
* *Amenities:* Amenity 1, Amenity 2, Amenity 3
* *Category:* luxury/mid-range/budget/boutique
* *Booking Tips:* Best booking advice

Provide 6-8 hotels with complete details."""
    
    preferences = ", ".join(request.preferences) if request.preferences else "good location and reviews"
    
    user_prompt = f"""Recommend hotels in {request.destination}.
    Budget: {request.budget}
    Preferences: {preferences}
    
    Focus on specific names, exact locations, and detailed amenities."""
    
    try:
        ai_response = await call_ai_api(system_prompt, user_prompt)
        # You would implement parse_hotels_from_ai similar to restaurants
        return HotelResponse(
            destination=request.destination,
            hotels=[],  # Parse from AI response
            booking_tips=["Book in advance", "Check cancellation policy"],
            best_areas=["City Center", "Business District"],
            budget_category=request.budget
        )
    except Exception as e:
        return HotelResponse(
            destination=request.destination,
            hotels=[],
            booking_tips=["Error getting recommendations"],
            best_areas=[],
            budget_category=request.budget
        )

@app.post("/api/itinerary", response_model=ItineraryResponse)
async def create_itinerary(request: ItineraryRequest):
    """Generate structured day-by-day itinerary"""
    system_prompt = """You are a professional travel planner. Create detailed itineraries with:
    - Daily activities with specific times
    - Transportation recommendations  
    - Restaurant suggestions
    - Cost estimates
    - Insider tips and alternatives"""
    
    interests = ", ".join(request.interests) if request.interests else "general sightseeing"
    
    user_prompt = f"""Create a {request.duration}-day itinerary for {request.destination}.
    
    Details:
    - Budget: {request.budget}
    - Interests: {interests}
    - Travel style: {request.travel_style or 'flexible'}
    
    Include specific places, timing, and practical advice."""
    
    try:
        ai_response = await call_ai_api(system_prompt, user_prompt)
        # You would implement parse_itinerary_from_ai 
        return ItineraryResponse(
            destination=request.destination,
            duration=request.duration,
            itinerary=[],  # Parse from AI response
            budget_breakdown={"accommodation": "40%", "food": "30%", "activities": "30%"},
            travel_tips=["Pack light", "Keep copies of documents"],
            packing_suggestions=["Comfortable shoes", "Weather appropriate clothes"]
        )
    except Exception as e:
        return ItineraryResponse(
            destination=request.destination,
            duration=request.duration,
            itinerary=[],
            budget_breakdown={},
            travel_tips=["Error creating itinerary"],
            packing_suggestions=[]
        )

@app.get("/api/destinations")
async def popular_destinations():
    """Get popular destinations"""
    return {
        "international": [
            "Paris, France", "Tokyo, Japan", "Rome, Italy", "London, UK",
            "Barcelona, Spain", "Amsterdam, Netherlands", "Singapore",
            "Bangkok, Thailand", "New York, USA", "Dubai, UAE"
        ],
        "india": [
            "Goa", "Kerala", "Rajasthan", "Himachal Pradesh", 
            "Karnataka", "Tamil Nadu", "Uttarakhand", "Maharashtra"
        ],
        "trending": [
            "Iceland", "Portugal", "Vietnam", "Georgia", 
            "Sri Lanka", "Morocco", "Peru", "Jordan"
        ]
    }

# ✅ IMPORTANT: This allows running with python main.py
if _name_ == "_main_":
    import uvicorn
    print("🚀 Starting Travel Guide API...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)




guys api is working now finally so as debashish has forntend code and this is bakend one modify forntend as per this 


OPENROUTER_API_KEY=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
PORT=8000
HOST=0.0.0.0

# 🤖 Model Configuration (Optional - already set in code)
MODEL_NAME=deepseek/deepseek-chat-v3.1:free

# 🛠 Development Settings (Optional)
DEBUG=true
LOG_LEVEL=info

# 📊 API Settings (Optional)
MAX_TOKENS=2000
TEMPERATURE=0.7
TIMEOUT_SECONDS=60

could you all now connect the frontend and backend i have given the api key and other stuff i am totally frustated with this from last two days