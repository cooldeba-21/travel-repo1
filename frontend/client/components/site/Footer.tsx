export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-orange-50 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        {/* Branding / Copyright */}
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} <span className="font-semibold text-orange-600">JournoAI</span>. All rights reserved.
        </p>

        {/* Tagline */}
        <div className="text-sm text-gray-500 md:text-right">
          Built for unforgettable journeys.
        </div>
      </div>

      {/* Optional Social Links */}
      {/* <div className="mt-4 flex justify-center gap-4">
        <a href="#" className="text-orange-600 hover:text-orange-500 transition-colors duration-200">Twitter</a>
        <a href="#" className="text-orange-600 hover:text-orange-500 transition-colors duration-200">Instagram</a>
        <a href="#" className="text-orange-600 hover:text-orange-500 transition-colors duration-200">LinkedIn</a>
      </div> */}
    </footer>
  );
}
