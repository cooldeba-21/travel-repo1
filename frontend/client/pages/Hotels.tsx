import React, { useState } from "react";
import { getHotels } from "../services/api";

export default function HotelsPage() {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const destination = form.get("destination")?.toString() || "";
    const budget = form.get("budget")?.toString() || "mid-range";

    try {
      setLoading(true);
      const result = await getHotels(destination, budget);
      setHotels(result);
    } catch (err) {
      console.error(err);
      setHotels({ error: "Failed to fetch hotels" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Find Hotels</h1>
      <form onSubmit={handleSubmit} className="grid gap-3 max-w-md">
        <input
          name="destination"
          placeholder="Destination (e.g., Paris)"
          className="rounded-md border px-3 py-2"
        />
        <select name="budget" className="rounded-md border px-3 py-2">
          <option value="budget">Budget</option>
          <option value="mid-range">Mid-range</option>
          <option value="luxury">Luxury</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          {loading ? "Loading..." : "Search Hotels"}
        </button>
      </form>

      {hotels && (
        <pre className="mt-4 bg-gray-100 p-3 rounded">
          {JSON.stringify(hotels, null, 2)}
        </pre>
      )}
    </div>
  );
}
