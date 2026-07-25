import { Link } from "react-router-dom";

const SERVICE_CARDS = [
  { title: "Veterinarians", desc: "Find trusted vets near you. Book consultations, check-ups, and specialist visits.", image: "/images/services/vet.jpg", link: "/owner/find-vet", cta: "Find a Vet" },
  { title: "Dog Walking", desc: "Professional dog walkers for daily walks, exercise, and outdoor adventures.", image: "/images/services/dog-walking.jpg", link: "/owner/find-worker", cta: "Find Walkers" },
  { title: "Grooming", desc: "Bath, haircut, nail trim, and full grooming packages for your pet.", image: "/images/services/grooming.jpg", link: "/owner/find-worker", cta: "Find Groomers" },
  { title: "Pet Training", desc: "Obedience training, behavior modification, and puppy socialization.", image: "/images/services/training.jpg", link: "/owner/find-worker", cta: "Find Trainers" },
  { title: "Pet Sitting", desc: "Trusted pet sitters for when you're away. In-home or at the sitter's place.", image: "/images/pets/happy-dog.jpg", link: "/owner/find-worker", cta: "Find Sitters" },
  { title: "Dental Care", desc: "Professional dental cleaning, check-ups, and oral health for your pet.", image: "/images/services/dental.jpg", link: "/owner/find-vet", cta: "Book Dental" },
  { title: "Emergency Care", desc: "24/7 emergency vet services. Immediate help when your pet needs it most.", image: "/images/services/emergency.jpg", link: "/owner/find-vet", cta: "Find Emergency Vet" },
  { title: "Nutrition & Diet", desc: "Customized diet plans, nutrition advice, and food recommendations.", image: "/images/pets/cat-eating.jpg", link: "/owner/find-vet", cta: "Get Diet Plan" },
];

const PROMO_CARDS = [
  { title: "New Pet?", desc: "Free first health check + vaccination plan", gradient: "from-[#2d1b69] to-[#4c1d95]", emoji: "🐾" },
  { title: "Health Plans", desc: "Subscribe for ₹499/month — unlimited vet consults", gradient: "from-[#064e3b] to-[#065f46]", emoji: "💚" },
  { title: "Refer & Earn", desc: "Invite friends, earn ₹200 credits each", gradient: "from-[#78350f] to-[#92400e]", emoji: "🎁" },
];

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white p-8">
      <h1 className="font-display text-3xl font-bold mb-2">Services</h1>
      <p className="text-[#5a6882] mb-8">Everything your pet needs — vets, walkers, groomers, and more</p>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {SERVICE_CARDS.map((service) => (
          <Link key={service.title} to={service.link}>
            <div className="group rounded-2xl bg-[#111128] border border-[#1a1a3e] overflow-hidden transition-all hover:border-[#8b5cf6]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#8b5cf6]/5">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-base mb-1">{service.title}</h3>
                <p className="text-xs text-[#5a6882] leading-relaxed mb-3">{service.desc}</p>
                <span className="text-xs font-bold text-[#06d6a0]">{service.cta} →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Promo Cards */}
      <h2 className="font-display text-xl font-bold mb-4">Special Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {PROMO_CARDS.map((promo) => (
          <div key={promo.title} className={`bg-gradient-to-br ${promo.gradient} rounded-2xl p-6 relative overflow-hidden cursor-pointer transition-transform hover:-translate-y-1`}>
            <h3 className="font-display text-xl font-bold mb-2">{promo.title}</h3>
            <p className="text-sm text-white/70">{promo.desc}</p>
            <div className="absolute bottom-4 right-4 text-3xl opacity-20">{promo.emoji}</div>
          </div>
        ))}
      </div>

      {/* Trust */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: "🔒", title: "Verified Professionals", desc: "All service providers are background-checked and verified." },
          { icon: "⭐", title: "Rated & Reviewed", desc: "Real reviews from pet parents like you." },
          { icon: "📅", title: "Easy Booking", desc: "Book appointments in under 2 minutes." },
          { icon: "💰", title: "Transparent Pricing", desc: "No hidden fees. See prices upfront." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl bg-[#111128] border border-[#1a1a3e] p-5 flex items-start gap-3">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <h4 className="font-bold text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-[#5a6882]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
