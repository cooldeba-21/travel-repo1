import { Plane, Hotel, MapPin, Headphones } from "lucide-react";

const services = [
  {
    title: "Tailored Packages",
    desc: "Custom itineraries built around your preferences.",
    icon: Plane,
  },
  {
    title: "Best Price Guarantee",
    desc: "Competitive deals and transparent pricing.",
    icon: Hotel,
  },
  {
    title: "Expert Guidance",
    desc: "Local insights and curated recommendations.",
    icon: MapPin,
  },
  {
    title: "24/7 Support",
    desc: "We’re here any time you need us.",
    icon: Headphones,
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-orange-50 py-16 md:py-24">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <h2 className="text-3xl font-extrabold text-gray-800 md:text-4xl">
            Our Services
          </h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            From planning to booking to support on the go—AeroVoyage handles it all.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ title, desc, icon: Icon }, idx) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{ transitionDelay: `${idx * 100}ms` }} // staggered animation effect
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-orange-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
