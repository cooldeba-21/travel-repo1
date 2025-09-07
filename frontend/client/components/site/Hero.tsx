import React, { useState } from "react";
import { getItinerary } from "../../services/api";

export default function Hero() {
  const bg =
    "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.25)), url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop)";

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const destination = form.get("destination")?.toString() || "";
    const checkin = form.get("checkin")?.toString() || "";
    const checkout = form.get("checkout")?.toString() || "";
    const guests = parseInt(form.get("guests")?.toString() || "1", 10);
    const budget = form.get("budget")?.toString() || "mid-range";
    const interests = Array.from(form.getAll("interests")).map((i) =>
      i.toString()
    );
    const travel_style = form.get("travel_style")?.toString() || "solo";

    // Calculate trip duration
    let duration = 1;
    if (checkin && checkout) {
      const diff =
        (new Date(checkout).getTime() - new Date(checkin).getTime()) /
        (1000 * 3600 * 24);
      duration = Math.max(1, Math.round(diff));
    }

    try {
      setLoading(true);
      const result = await getItinerary(destination, duration, guests, budget, interests, travel_style);
      setResponse(result);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Failed to fetch itinerary" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: bg }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
      <div className="container relative z-10 mx-auto grid gap-12 py-20 md:grid-cols-2 md:items-center">
        {/* Left content */}
        <div className="mx-auto max-w-2xl text-white md:mx-0">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Your adventure starts here
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Plan personalized itineraries, explore curated experiences, and
            make your trip unforgettable.
          </p>
        </div>

        {/* Right: Form */}
        <div className="mx-auto w-full max-w-md rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-md border border-white/20 transition-transform hover:scale-105 duration-300">
          <h3 className="text-lg font-semibold text-white">Plan Your Trip</h3>
          <p className="mt-1 text-sm text-white/70">
            Fill in your details below to generate a tailored itinerary.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
            {/* Destination */}
            <input
              name="destination"
              placeholder="Destination (e.g., Bali)"
              required
              className="rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />

            {/* Check-in & Check-out */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="checkin"
                required
                className="w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              />
              <input
                type="date"
                name="checkout"
                required
                className="w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              />
            </div>

            {/* Guests */}
            <select
              name="guests"
              className="rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            >
              <option value="1">1 guest (Solo)</option>
              <option value="2">2 guests (Couple)</option>
              <option value="3">3 guests (Family)</option>
              <option value="4">4+ guests (Group)</option>
            </select>

            {/* Budget */}
            <select
              name="budget"
              defaultValue="mid-range"
              className="rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            >
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-range</option>
              <option value="luxury">Luxury</option>
            </select>

            {/* Travel Style (Buttons) */}
            <div className="flex flex-wrap gap-2">
              {["solo", "couple", "family", "group"].map((style) => (
                <label
                  key={style}
                  className="cursor-pointer rounded-lg border border-white/30 px-3 py-1 text-sm text-white transition hover:bg-orange-500 hover:text-white"
                >
                  <input
                    type="radio"
                    name="travel_style"
                    value={style}
                    className="hidden"
                    defaultChecked={style === "solo"}
                  />
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </label>
              ))}
            </div>

            {/* Interests (Chips) */}
            <div className="flex flex-wrap gap-2">
              {["sightseeing", "adventure", "cultural", "food", "shopping"].map(
                (interest) => (
                  <label
                    key={interest}
                    className="cursor-pointer rounded-full border border-white/30 px-3 py-1 text-sm text-white transition hover:bg-orange-500 hover:text-white"
                  >
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest}
                      className="hidden"
                      defaultChecked={interest === "sightseeing"}
                    />
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </label>
                )
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-200"
            >
              {loading ? "Fetching Itinerary..." : "Get Itinerary"}
            </button>
          </form>

          {/* Response */}
          {response && (
            <div className="mt-5 text-sm text-white space-y-3">
              {response.error ? (
                <p className="text-red-400">⚠️ {response.error}</p>
              ) : (
                <>
                  <h4 className="font-semibold">📍 {response.destination}</h4>
                  <p className="text-white/80">Duration: {response.duration} days</p>

                  {response.itinerary?.length > 0 ? (
                    response.itinerary.map((day: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-black/40 border border-white/20"
                      >
                        <h5 className="font-bold text-orange-400">
                          Day {day.day}: {day.theme}
                        </h5>
                        <ul className="list-disc ml-5 mt-1 text-white/90">
                          {day.activities?.map((act: any, j: number) => (
                            <li key={j}>
                              <span className="font-medium">{act.name}</span> –{" "}
                              {act.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <pre className="bg-black/40 p-3 rounded max-h-64 overflow-y-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
