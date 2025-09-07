import { useState } from "react";
import { Menu, X, Plane } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Destinations", href: "#destinations" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md shadow-md transition-all duration-300">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform transition-transform duration-300 group-hover:scale-110">
            <Plane className="h-5 w-5" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            JournoAI
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-orange-600 group"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle Menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 md:hidden hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white/95 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-2 hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col gap-3 px-6 mt-4">
          {navItems.map((item, idx) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 text-lg font-medium text-gray-700 hover:bg-orange-500 hover:text-white transition-all duration-300 delay-${idx * 75}`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-center text-lg font-semibold text-white shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 mt-3"
          >
            Book Now
          </a>
        </div>
      </div>
    </header>
  );
}
