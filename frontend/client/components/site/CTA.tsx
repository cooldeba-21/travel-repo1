export default function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-16 md:py-24 bg-orange-50">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 via-transparent to-orange-200/20"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center text-white shadow-2xl md:p-12">
          <h3 className="text-2xl font-extrabold md:text-3xl">
            Ready to Start Your Adventure?
          </h3>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Chat with our travel experts today and get a free custom itinerary.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:bookings@aerovoyage.com"
              className="rounded-xl bg-white text-orange-600 px-6 py-3 text-sm font-semibold shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            >
              Email Us
            </a>
            <a
              href="#destinations"
              className="rounded-xl bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-white/30 hover:scale-105"
            >
              Browse Packages
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
