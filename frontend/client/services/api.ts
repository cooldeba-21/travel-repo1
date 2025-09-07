/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function apiFetch<T>(endpoint: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} - ${res.statusText}`);
  }

  return res.json();
}

// 🔹 Endpoints
export function askTravelGuide(question: string) {
  return apiFetch<{ answer: string }>("/api/travel-guide", { question });
}

// ✅ Updated getItinerary to match Hero.tsx call
export function getItinerary(
  destination: string,
  duration: number,
  guests: number,
  budget: string = "mid-range",
  interests: string[] = ["sightseeing"],
  travel_style: string = "solo"
) {
  return apiFetch("/api/itinerary", {
    destination,
    duration,
    guests,
    budget,
    interests,
    travel_style,
  });
}

export function getHotels(destination: string, budget = "mid-range") {
  return apiFetch("/api/hotels", { destination, budget });
}

export function getRestaurants(destination: string, budget = "mid-range") {
  return apiFetch("/api/restaurants", { destination, budget });
}
