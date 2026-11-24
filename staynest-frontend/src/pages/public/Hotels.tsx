import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, Star, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { getAllHotels, resetHotels } from "../../store/slices/hotelSlice";
import type { AppDispatch, RootState } from "../../store";
import Navbar from "../../components/common/Navbar";

const AMENITIES_LIST = ["wifi", "pool", "gym", "spa", "parking", "restaurant", "bar", "garden"];

const Hotels = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hotels, nextCursor, hasNextPage, isLoading } = useSelector((state: RootState) => state.hotel);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [country, setCountry] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // initial fetch
  useEffect(() => {
    dispatch(resetHotels());
    dispatch(getAllHotels({ city: city || undefined, country: country || undefined }));
  }, []);

  // infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage && !isLoading && nextCursor) {
      dispatch(getAllHotels({ cursor: nextCursor, city: city || undefined, country: country || undefined }));
    }
  }, [hasNextPage, isLoading, nextCursor, city, country, dispatch]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  const handleSearch = () => {
    dispatch(resetHotels());
    dispatch(getAllHotels({ city: city || undefined, country: country || undefined }));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setCity("");
    setCountry("");
    setSelectedAmenities([]);
    dispatch(resetHotels());
    dispatch(getAllHotels({}));
  };

  const hasActiveFilters = city || country || selectedAmenities.length > 0;

  return (
    <div className="min-h-screen bg-page font-sans">
      <Navbar />

      {/* SEARCH HEADER */}
      <div className="bg-brand-dark pt-24 pb-10 px-[5%]">
        <div className="max-w-225 mx-auto">
          <h1 className="text-white text-3xl font-extrabold tracking-tight mb-2">Find Your Perfect Stay</h1>
          <p className="text-white/50 text-sm mb-6">Discover hotels across India's most beautiful destinations</p>

          {/* SEARCH BAR */}
          <div className="bg-white rounded-2xl p-2 flex gap-2">
            <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-page">
              <MapPin size={16} className="text-brand shrink-0" />
              <input value={city} onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search by city..."
                className="border-none bg-transparent text-sm outline-none w-full text-brand-dark placeholder:text-neutral-400" />
            </div>
            <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-page">
              <MapPin size={16} className="text-brand shrink-0" />
              <input value={country} onChange={e => setCountry(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search by country..."
                className="border-none bg-transparent text-sm outline-none w-full text-brand-dark placeholder:text-neutral-400" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-none cursor-pointer transition-colors ${showFilters ? "bg-brand text-white" : "bg-neutral-100 text-brand-dark hover:bg-neutral-200"}`}>
              <SlidersHorizontal size={15} /> Filters
            </button>
            <button onClick={handleSearch}
              className="bg-brand text-white border-none px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2 hover:bg-brand/90 transition-colors">
              <Search size={15} /> Search
            </button>
          </div>

          {/* FILTERS PANEL */}
          {showFilters && (
            <div className="bg-white rounded-2xl p-5 mt-3">
              <p className="text-[13px] font-semibold text-brand-dark mb-3">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map(amenity => (
                  <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-xl text-[13px] font-medium cursor-pointer border transition-all capitalize ${selectedAmenities.includes(amenity) ? "bg-brand text-white border-brand" : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-brand"}`}>
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-[5%] py-8 max-w-300 mx-auto">

        {/* ACTIVE FILTERS */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-neutral-400">Active filters:</span>
            {city && (
              <span className="flex items-center gap-1 bg-brand/10 text-brand text-xs font-semibold px-3 py-1 rounded-full">
                {city} <X size={12} className="cursor-pointer" onClick={() => setCity("")} />
              </span>
            )}
            {country && (
              <span className="flex items-center gap-1 bg-brand/10 text-brand text-xs font-semibold px-3 py-1 rounded-full">
                {country} <X size={12} className="cursor-pointer" onClick={() => setCountry("")} />
              </span>
            )}
            {selectedAmenities.map(a => (
              <span key={a} className="flex items-center gap-1 bg-brand/10 text-brand text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {a} <X size={12} className="cursor-pointer" onClick={() => toggleAmenity(a)} />
              </span>
            ))}
            <button onClick={clearFilters} className="text-xs text-neutral-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
              Clear all
            </button>
          </div>
        )}

        {/* RESULTS COUNT */}
        {!isLoading && hotels.length > 0 && (
          <p className="text-sm text-neutral-400 mb-6">{hotels.length} properties found</p>
        )}

        {/* HOTEL GRID */}
        {hotels.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 mb-8">
            {hotels.map(hotel => (
              <div key={hotel.id}
                onClick={() => navigate(`/hotels/${hotel.id}`)}
                className="bg-white rounded-2xl border border-neutral-100 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-200">

                {/* IMAGE */}
                <div className="relative h-50 bg-neutral-100 overflow-hidden">
                  {hotel.images?.[0] ? (
                    <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-neutral-300 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">{Number(hotel.rating).toFixed(1)}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-base m-0 mb-0.5 truncate">{hotel.name}</p>
                    <p className="text-white/80 text-xs m-0 flex items-center gap-1">
                      <MapPin size={11} /> {hotel.city}, {hotel.country}
                    </p>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(hotel.amenities as string[]).slice(0, 3).map(a => (
                      <span key={a} className="text-[11px] bg-neutral-100 text-neutral-500 px-2 py-1 rounded-md font-medium capitalize">{a}</span>
                    ))}
                    {(hotel.amenities as string[]).length > 3 && (
                      <span className="text-[11px] bg-neutral-100 text-neutral-500 px-2 py-1 rounded-md font-medium">
                        +{(hotel.amenities as string[]).length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-brand">₹{Number(hotel.rating).toLocaleString()}</span>
                      <span className="text-xs text-neutral-400">/night</span>
                    </div>
                    <span className="text-xs text-neutral-400">{hotel.totalReviews} reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOADING SPINNER */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && hotels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4">
              <Search size={32} className="text-brand" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">No hotels found</h3>
            <p className="text-neutral-400 text-sm mb-6">Try changing your search filters</p>
            <button onClick={clearFilters}
              className="bg-brand text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer">
              Clear Filters
            </button>
          </div>
        )}

        {/* NO MORE */}
        {!hasNextPage && hotels.length > 0 && (
          <p className="text-center text-neutral-300 text-sm py-6">You've seen all properties</p>
        )}

        {/* INFINITE SCROLL TRIGGER */}
        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  );
};

export default Hotels;