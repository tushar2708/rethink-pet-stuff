import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    badge: "🩺 #1 Pet Health Platform",
    badgeColor: "text-[#8b5cf6]",
    title: <>Your Pet's Health, <span className="bg-gradient-to-r from-[#8b5cf6] to-[#06d6a0] bg-clip-text text-transparent">Simplified.</span></>,
    desc: "Track vaccinations, find trusted vets, book grooming sessions, and keep your pet's complete medical history — all in one place.",
    cta: "Get Started Free",
    ctaLink: "/onboarding/create-account",
    image: "/images/hero/dog-hero.jpg",
  },
  {
    badge: "🐾 One Identity. Lifetime Care.",
    badgeColor: "text-[#06d6a0]",
    title: <>Every Pet Deserves a <span className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">Digital Identity.</span></>,
    desc: "Create a unique Pet ID and keep all their health records, vaccinations, and important information in one secure place.",
    cta: "Register Your Pet",
    ctaLink: "/onboarding/create-account",
    image: "/images/pets/persian-cat.jpg",
  },
  {
    badge: "💉 Smart Vaccination Tracker",
    badgeColor: "text-[#fbbf24]",
    title: <>Never Miss a <span className="bg-gradient-to-r from-[#fbbf24] to-[#f97316] bg-clip-text text-transparent">Vaccination.</span></>,
    desc: "Breed-specific vaccination schedules, automatic reminders, and a complete health timeline — so your pet stays protected.",
    cta: "See How It Works",
    ctaLink: "/onboarding/create-account",
    image: "/images/services/vet.jpg",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-[#0d0d2b] via-[#1a0a30] to-[#0a1628] h-[420px] px-6 relative overflow-hidden">
      {/* All slides stacked absolutely — only the active one is visible */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 px-6 py-12 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
            <div className="flex flex-col justify-center">
              <div className={`inline-block bg-[#1a1a3e] ${s.badgeColor} text-xs font-bold px-3 py-1 rounded-full mb-5 border border-[#242450] w-fit`}>
                {s.badge}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight text-[#eef2ff]">
                {s.title}
              </h1>
              <p className="text-[#5a6882] text-base mb-7 leading-relaxed max-w-md">
                {s.desc}
              </p>
              <Link
                to={s.ctaLink}
                className="inline-block bg-[#8b5cf6] text-white font-bold px-8 py-3 rounded-2xl hover:bg-[#7c3aed] transition shadow-lg shadow-[#8b5cf6]/20 w-fit"
              >
                {s.cta} →
              </Link>
            </div>
            <div className="relative h-72 hidden md:flex items-center justify-center">
              <img
                src={s.image}
                alt=""
                className="h-full w-full max-w-[400px] object-cover rounded-3xl border-2 border-[#8b5cf6]/20 shadow-2xl"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Dots + Arrows */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
        <button onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
          className="bg-[#111128]/80 backdrop-blur border border-[#1a1a3e] w-8 h-8 rounded-full text-white hover:bg-[#8b5cf6] text-sm transition">
          ‹
        </button>
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-[#8b5cf6] w-6" : "bg-[#1a1a3e] w-2"}`}
            />
          ))}
        </div>
        <button onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
          className="bg-[#111128]/80 backdrop-blur border border-[#1a1a3e] w-8 h-8 rounded-full text-white hover:bg-[#8b5cf6] text-sm transition">
          ›
        </button>
      </div>
    </section>
  );
}

export function LandingPage() {
  // Inline SVG logo component
  const PetOSLogo = () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle background */}
      <circle cx="16" cy="16" r="14" stroke="url(#gradient)" strokeWidth="2" />
      {/* Left eye */}
      <circle cx="12" cy="14" r="2.5" fill="#8b5cf6" />
      {/* Right eye */}
      <circle cx="20" cy="14" r="2.5" fill="#06d6a0" />
      {/* Smile arc */}
      <path d="M 12 18 Q 16 21 20 18" stroke="#eef2ff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06d6a0" />
        </linearGradient>
      </defs>
    </svg>
  );

  const categoryPills = [
    { label: "Vaccinations", image: "/images/services/vet.jpg" },
    { label: "Grooming", image: "/images/services/grooming.jpg" },
    { label: "Dog Walking", image: "/images/services/dog-walking.jpg" },
    { label: "Pet Sitting", image: "/images/pets/happy-dog.jpg" },
    { label: "Dental Care", image: "/images/services/dental.jpg" },
    { label: "Nutrition", image: "/images/pets/cat-eating.jpg" },
    { label: "Training", image: "/images/services/training.jpg" },
    { label: "Emergency", image: "/images/services/emergency.jpg" },
  ];

  const petMatches = [
    { label: "Golden Retriever", image: "/images/pets/golden-retriever.jpg" },
    { label: "Persian Cat", image: "/images/pets/persian-cat.jpg" },
    { label: "Indie Dogs", image: "/images/pets/indie-dog.jpg" },
    { label: "Goldfish", image: "/images/pets/goldfish.jpg" },
  ];

  const healthyPets = [
    { label: "Preventive Care", image: "/images/services/vet.jpg" },
    { label: "Dental Health", image: "/images/services/dental.jpg" },
    { label: "Nutrition Plans", image: "/images/pets/cat-eating.jpg" },
    { label: "Exercise Programs", image: "/images/services/dog-walking.jpg" },
  ];

  return (
    <div className="bg-[#06060e] min-h-screen">
      {/* Purple Top Bar */}
      <div className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] py-3 px-6 flex items-center justify-between text-white text-sm font-semibold">
        <div>🐾 Free Health Check for New Pets — Limited Time!</div>
        <div className="flex gap-6 text-sm">
          <Link to="/about" className="hover:opacity-80">About</Link>
          <Link to="/contact" className="hover:opacity-80">Contact</Link>
          <Link to="/blog" className="hover:opacity-80">Blog</Link>
        </div>
      </div>

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0c0c1a] border-b border-[#1a1a3e] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <PetOSLogo />
            <span className="text-gradient font-display font-bold text-xl">Pet OS</span>
          </Link>

          {/* Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-6">
            <input
              type="text"
              placeholder="Search services..."
              className="w-full bg-[#111128] border border-[#1a1a3e] rounded-3xl px-4 py-2 text-sm text-[#eef2ff] placeholder-[#5a6882] focus:outline-none focus:border-[#8b5cf6]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-6 text-sm font-semibold">
            <button className="text-[#eef2ff] hover:text-[#8b5cf6]">📍 Location</button>
            <button className="text-[#eef2ff] hover:text-[#8b5cf6]">❤️ Wishlist</button>
            <button className="text-[#eef2ff] hover:text-[#8b5cf6]">🔔 Alerts</button>
            <Link
              to="/login"
              className="rounded-2xl border border-[#1a1a3e] text-[#a5b4c8] text-xs font-bold px-5 py-2 hover:border-[#8b5cf6] hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/onboarding/create-account"
              className="bg-[#8b5cf6] rounded-2xl text-white text-xs font-bold px-5 py-2 hover:bg-[#7c3aed]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Category Tabs */}
      <div className="bg-[#0c0c1a] border-b border-[#1a1a3e] px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-8 py-4">
          {[
            "Dogs",
            "Cats",
            "Birds",
            "Health Hub",
            "Find a Vet",
            "Pet Buddies",
            "Vaccinations",
            "Community",
          ].map((cat, idx) => (
            <Link
              key={cat}
              to="#"
              className={`whitespace-nowrap pb-4 text-sm font-semibold ${
                idx === 0
                  ? "text-white border-b-2 border-[#8b5cf6]"
                  : "text-[#5a6882] hover:text-white"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Category Pills */}
      <section className="bg-[#06060e] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-8 gap-4 justify-items-center">
            {categoryPills.map((pill) => (
              <div key={pill.label} className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full border-2 border-[#1a1a3e] overflow-hidden">
                  <img
                    src={pill.image}
                    alt={pill.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-[#eef2ff] text-center font-semibold">
                  {pill.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Banner */}
      <section className="bg-[#06060e] py-12 px-6">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#1a1a3e] to-[#111128] rounded-3xl p-8 text-center border border-[#1a1a3e]">
          <h2 className="text-2xl font-bold text-[#eef2ff] mb-2">
            🩺 Find 500+ trusted vets near you
          </h2>
          <p className="text-[#5a6882]">Book in 2 minutes</p>
        </div>
      </section>

      {/* Keep Them Healthy */}
      <section className="bg-[#06060e] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-gradient font-display text-4xl font-bold mb-2">
              Keep Them Healthy
            </h2>
            <p className="text-[#5a6882]">
              Expert guidance to ensure your pet lives its best life
            </p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {healthyPets.map((item) => (
              <div
                key={item.label}
                className="aspect-square rounded-2xl overflow-hidden relative group"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div>
                    <p className="text-white font-bold text-lg mb-2">
                      {item.label}
                    </p>
                    <p className="text-[#06d6a0] text-sm font-semibold">
                      Learn more →
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Your Pet's Perfect Match */}
      <section className="bg-[#06060e] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-gradient font-display text-4xl font-bold mb-2">
              Find Your Pet's Perfect Match
            </h2>
            <p className="text-[#5a6882]">
              Discover the ideal companion or service for your lifestyle
            </p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {petMatches.map((item) => (
              <div
                key={item.label}
                className="aspect-square rounded-2xl overflow-hidden relative group"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div>
                    <p className="text-white font-bold text-lg mb-2">
                      {item.label}
                    </p>
                    <p className="text-[#06d6a0] text-sm font-semibold">
                      Explore →
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Cards */}
      <section className="bg-[#06060e] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {/* Purple Promo */}
            <div className="bg-gradient-to-br from-[#2d1b69] to-[#4c1d95] rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-3">Premium Membership</h3>
              <p className="text-purple-100 mb-6">
                Get 20% off all services + priority booking + free 24/7 support
              </p>
              <button className="bg-white text-purple-600 font-bold px-6 py-2 rounded-2xl hover:bg-purple-100">
                Learn More
              </button>
            </div>

            {/* Cyan Promo */}
            <div className="bg-gradient-to-br from-[#064e3b] to-[#065f46] rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-3">Pet Buddy Network</h3>
              <p className="text-green-100 mb-6">
                Join 10K+ pet lovers and earn by helping others care for pets
              </p>
              <button className="bg-white text-green-600 font-bold px-6 py-2 rounded-2xl hover:bg-green-100">
                Join Now
              </button>
            </div>

            {/* Amber Promo */}
            <div className="bg-gradient-to-br from-[#78350f] to-[#92400e] rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-3">Emergency Care</h3>
              <p className="text-amber-100 mb-6">
                24/7 vet access for emergencies + instant guidance from experts
              </p>
              <button className="bg-white text-amber-600 font-bold px-6 py-2 rounded-2xl hover:bg-amber-100">
                Get Help
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Row */}
      <section className="bg-[#0c0c1a] border-t border-[#1a1a3e] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-8">
            {[
              { icon: "✓", title: "Verified Vets", desc: "All professionals checked" },
              { icon: "⭐", title: "5-Star Reviews", desc: "Real pet owner feedback" },
              { icon: "🔒", title: "Secure Booking", desc: "Safe payments & data" },
              { icon: "🐾", title: "Pet-First Care", desc: "Your pet comes first" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 mx-auto bg-[#111128] rounded-full flex items-center justify-center text-3xl mb-4 border border-[#1a1a3e]">
                  {item.icon}
                </div>
                <h3 className="text-[#eef2ff] font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-[#5a6882] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c0c1a] border-t border-[#1a1a3e] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-5 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PetOSLogo />
                <span className="text-gradient font-display font-bold">
                  Pet OS
                </span>
              </div>
              <p className="text-[#5a6882] text-sm">
                Everything your pet needs in one place
              </p>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[#eef2ff] font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-[#5a6882] text-sm">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[#eef2ff] font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-[#5a6882] text-sm">
                <li>
                  <Link to="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[#eef2ff] font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-[#5a6882] text-sm">
                <li>
                  <Link to="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="hover:text-white">
                    Pet Guides
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="hover:text-white">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-[#eef2ff] font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-[#5a6882] text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#1a1a3e] pt-8">
            <p className="text-[#5a6882] text-sm text-center">
              © 2026 Pet OS. All rights reserved.{" "}
              <Link to="/privacy" className="hover:text-white">
                Privacy
              </Link>{" "}
              •{" "}
              <Link to="/terms" className="hover:text-white">
                Terms
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
