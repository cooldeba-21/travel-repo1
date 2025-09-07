
// DestinationsGrid Component
import DestinationCard from "./DestinationCard";

const destinations = [
  {
    name: "Bali, Indonesia",
    duration: "7 days",
    price: "$1,299",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Paris, France",
    duration: "5 days",
    price: "$1,599",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Kyoto, Japan",
    duration: "6 days",
    price: "$1,799",
    image:
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=2069&auto=format&fit=crop",
  },
  {
    name: "Santorini, Greece",
    duration: "4 days",
    price: "$1,499",
    image:
      "https://images.unsplash.com/photo-1505066836043-7dda5ce6c42a?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "New York, USA",
    duration: "3 days",
    price: "$999",
    image:
      "https://images.unsplash.com/photo-1468436385273-8abca6dfd8d1?q=80&w=2069&auto=format&fit=crop",
  },
  {
    name: "Cape Town, South Africa",
    duration: "7 days",
    price: "$1,399",
    image:
      "https://images.unsplash.com/photo-1489450584921-1befb5039923?q=80&w=1953&auto=format&fit=crop",
  },
  {
    name: "Maldives",
    duration: "6 days",
    price: "$2,199",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Reykjavik, Iceland",
    duration: "5 days",
    price: "$1,899",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop",
  },
  {
    name: "Rome, Italy",
    duration: "4 days",
    price: "$1,099",
    image:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=2000&auto=format&fit=crop",
  },
];

export default function DestinationsGrid() {
  return (
    <section id="destinations" className="bg-orange-50 py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <h2 className="text-3xl font-extrabold text-gray-800 md:text-4xl">
            Featured Destinations
          </h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Handpicked getaways loved by our travelers.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <DestinationCard
              key={d.name}
              image={d.image}
              title={d.name}
              duration={d.duration}
              price={d.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
