import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Coffee,
  Shield,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BedDouble,
} from "lucide-react";
import heroImage from "../../assets/michelangelo-azzariti-JTOnKgXhQ0g-unsplash.jpg";
import Navbar from "../../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import { getAllHotels, resetHotels } from "../../store/slices/hotelSlice";
import type { AppDispatch, RootState } from "../../store";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    text: "StayNest made our anniversary trip absolutely magical. The booking process was seamless and the hotel exceeded every expectation!",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Rahul Mehta",
    location: "Delhi, India",
    text: "Found the perfect mountain retreat for our family. The price preview feature helped us plan our budget perfectly. Highly recommend!",
    rating: 5,
    avatar: "RM",
  },
  {
    name: "Ananya Gupta",
    location: "Bangalore, India",
    text: "The dynamic pricing showed us a great last-minute deal. Saved 15% on a luxury resort stay. Will definitely use again!",
    rating: 5,
    avatar: "AG",
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Verified Properties",
    desc: "Every hotel is personally vetted for quality and comfort",
  },
  {
    icon: Star,
    title: "Best Price Guarantee",
    desc: "Dynamic pricing ensures you always get the fairest deal",
  },
  {
    icon: Calendar,
    title: "Flexible Booking",
    desc: "Free cancellation on most properties up to 24 hours",
  },
  {
    icon: Coffee,
    title: "24/7 Support",
    desc: "Our team is always available to assist your journey",
  },
];

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  pool: Waves,
  gym: Dumbbell,
  spa: Star,
  parking: Car,
};

export default function LandingPage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [searchCity, setSearchCity] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, isLoading } = useSelector((state: RootState) => state.hotel);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(resetHotels());
    dispatch(getAllHotels({}));
  }, [dispatch]);

  const featuredHotels = hotels.slice(0, 6);

  return (
    <div className="font-sans bg-page text-brand-dark overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar transparent />

      {/* HERO */}
      <section className="relative h-screen min-h-170 overflow-hidden">
        <img
          src={heroImage}
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/20 to-black/60" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-[5%] text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <div className="flex">
              {["#FF6B6B", "#4ECDC4", "#45B7D1"].map((c, i) => (
                <div
                  key={i}
                  className="w-5.5 h-5.5 rounded-full border-2 border-white"
                  style={{ background: c, marginLeft: i > 0 ? "-6px" : 0 }}
                />
              ))}
            </div>
            <span className="text-white text-[13px] font-medium">
              124.8K+ Happy Guests
            </span>
          </div>

          <h1 className="text-white text-[clamp(36px,6vw,72px)] font-extrabold leading-[1.1] mb-4 tracking-tight max-w-200">
            Unwind in Stunning Resorts,
            <br />
            Stay in Elegant Hotels.
          </h1>
          <p className="text-white/80 text-lg mb-12 max-w-125">
            Discover handpicked stays across India's most breathtaking
            destinations.
          </p>

          {/* SEARCH BAR */}
          <div className="bg-white rounded-2xl p-2 flex gap-1 w-full max-w-180 shadow-2xl">
            <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-page">
              <MapPin size={18} className="text-brand shrink-0" />
              <div className="w-full">
                <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide m-0">
                  Where to
                </p>
                <input
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate(
                      `/hotels${searchCity ? `?city=${searchCity}` : ""}`,
                    )
                  }
                  placeholder="City, hotel or destination"
                  className="border-none bg-transparent text-sm font-medium outline-none w-full text-brand-dark placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div className="w-px bg-neutral-100 my-2" />

            <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-page">
              <Calendar size={18} className="text-brand shrink-0" />
              <div>
                <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide m-0">
                  Date
                </p>
                <p className="text-sm font-medium text-brand-dark m-0">
                  Add dates
                </p>
              </div>
            </div>

            <div className="w-px bg-neutral-100 my-2" />

            <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-page">
              <Users size={18} className="text-brand shrink-0" />
              <div>
                <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide m-0">
                  Guests
                </p>
                <p className="text-sm font-medium text-brand-dark m-0">
                  Add guests
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                navigate(`/hotels${searchCity ? `?city=${searchCity}` : ""}`)
              }
              className="bg-brand text-white border-none rounded-xl px-7 text-sm font-bold cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <Search size={16} /> Search
            </button>
          </div>
        </div>
      </section>

      {/* HOTELS SECTION */}
      <section className="py-20 px-[5%]">
        <div className="text-center mb-12">
          <p className="text-brand font-bold text-[13px] uppercase tracking-[2px] mb-3">
            Handpicked For You
          </p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold mb-3 tracking-tight">
            Where Comfort Meets Convenience
          </h2>
          <p className="text-neutral-500 text-base">
            Discover our most loved properties across India
          </p>
        </div>

        <div className="flex justify-end items-center mb-8">
          <a
            href="/hotels"
            className="text-brand font-semibold text-sm no-underline flex items-center gap-1"
          >
            See All <ArrowRight size={14} />
          </a>
        </div>

        {isLoading && featuredHotels.length === 0 && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && featuredHotels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4">
              <BedDouble size={32} className="text-brand" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">No hotels listed yet</h3>
            <p className="text-neutral-400 text-sm">Check back soon for new properties</p>
          </div>
        )}

        {featuredHotels.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
            {featuredHotels.map((hotel) => {
              const AmenityIcon = (amenity: string) => {
                const Icon = amenityIcons[amenity] || Coffee;
                return <Icon size={12} />;
              };
              return (
                <div
                  key={hotel.id}
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                  className="rounded-2xl overflow-hidden bg-white border border-neutral-100 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-55 overflow-hidden bg-neutral-100">
                    {hotel.images?.[0] ? (
                      <img
                        src={hotel.images[0]}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-neutral-300 text-sm">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-base m-0 mb-0.5">
                        {hotel.name}
                      </p>
                      <p className="text-white/80 text-[13px] m-0 flex items-center gap-1">
                        <MapPin size={11} /> {hotel.city}, {hotel.country}
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1.5">
                        {(hotel.amenities as string[]).slice(0, 3).map((a) => (
                          <div
                            key={a}
                            className="flex items-center gap-1 bg-neutral-100 rounded-md px-2 py-1 text-[11px] text-neutral-600 font-medium capitalize"
                          >
                            {AmenityIcon(a)} {a}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star
                          size={13}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="text-[13px] font-bold">
                          {Number(hotel.rating).toFixed(1)}
                        </span>
                        <span className="text-xs text-neutral-400">
                          ({hotel.totalReviews})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-[5%] bg-brand-dark">
        <div className="max-w-300 mx-auto grid grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand font-bold text-[13px] uppercase tracking-[2px] mb-4">
              Why Choose Us
            </p>
            <h2 className="text-[clamp(28px,3vw,44px)] font-extrabold text-white mb-4 tracking-tight leading-[1.2]">
              Globally Acclaimed for Exceptional Hotel Services.
            </h2>
            <p className="text-white/60 text-base mb-10 leading-relaxed">
              We believe every stay is the foundation of memorable journeys —
              offering comfort, connection, and a place to truly belong.
            </p>
            <button className="bg-brand text-white border-none rounded-full px-8 py-3.5 text-sm font-bold cursor-pointer flex items-center gap-2">
              Explore Properties <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-white" />
                </div>
                <p className="text-white font-bold text-[15px] mb-2">
                  {f.title}
                </p>
                <p className="text-white/50 text-[13px] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-[5%] bg-brand-lime">
        <div className="max-w-175 mx-auto text-center">
          <p className="text-[#4a5c00] font-bold text-[13px] uppercase tracking-[2px] mb-3">
            Guest Reviews
          </p>
          <h2 className="text-[clamp(24px,3vw,40px)] font-extrabold text-brand-dark mb-12 tracking-tight">
            What Our Customers Say
          </h2>

          <div className="mb-8">
            <div className="flex justify-center gap-2 mb-8">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 font-bold text-white text-[13px] ${i === testimonialIdx ? "w-13 h-13 border-[3px] border-brand-dark" : "w-11 h-11 border-[3px] border-transparent"}`}
                  style={{ background: ["#FF6B6B", "#4ECDC4", "#45B7D1"][i] }}
                >
                  {t.avatar}
                </div>
              ))}
            </div>

            <p className="text-[clamp(16px,2vw,22px)] font-semibold text-brand-dark leading-relaxed mb-6">
              "{TESTIMONIALS[testimonialIdx].text}"
            </p>
            <p className="font-bold text-base text-brand-dark mb-1">
              {TESTIMONIALS[testimonialIdx].name}
            </p>
            <p className="text-[13px] text-[#4a5c00] mb-4">
              {TESTIMONIALS[testimonialIdx].location}
            </p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="fill-brand-dark text-brand-dark"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() =>
                setTestimonialIdx(
                  (i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                )
              }
              className="w-10 h-10 rounded-full bg-transparent border-[1.5px] border-brand-dark cursor-pointer flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() =>
                setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)
              }
              className="w-10 h-10 rounded-full bg-brand-dark border-none cursor-pointer flex items-center justify-center"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111] py-16 px-[5%]">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="font-bold text-lg text-white">StayNest</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-65">
              Your trusted platform for discovering and booking the finest
              hotels across India.
            </p>
            <p className="text-white/30 text-[40px] font-extrabold tracking-tight">
              hello@staynest.in
            </p>
          </div>

          {[
            {
              title: "Quick Links",
              links: ["Home", "Hotels", "About Us", "Blog"],
            },
            {
              title: "Support",
              links: ["Help Center", "Cancellation", "Safety", "Privacy"],
            },
            {
              title: "Follow Us",
              links: ["Instagram", "Twitter", "LinkedIn", "YouTube"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-white font-bold text-sm mb-5">{col.title}</p>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-white/50 text-sm no-underline mb-3 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex justify-between items-center">
          <p className="text-white/30 text-[13px]">
            © 2026 StayNest. All rights reserved.
          </p>
          <p className="text-white/30 text-[13px]">Made with ♥ in India</p>
        </div>
      </footer>
    </div>
  );
}
