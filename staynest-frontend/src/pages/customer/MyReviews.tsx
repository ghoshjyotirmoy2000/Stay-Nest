import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, MapPin, Plus, Trash2, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../api/axiosInstance";
import type { RootState } from "../../store";

const schema = z.object({
  hotelId: z.string().min(1, "Hotel is required"),
  bookingId: z.string().min(1, "Booking is required"),
  rating: z.string().min(1, "Rating is required"),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Review = {
  id: string;
  hotelId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

const StarRating = ({ rating, onSelect }: { rating: number; onSelect?: (r: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star}
          size={onSelect ? 24 : 14}
          onClick={() => onSelect?.(star)}
          onMouseEnter={() => onSelect && setHovered(star)}
          onMouseLeave={() => onSelect && setHovered(0)}
          className={`transition-colors ${onSelect ? "cursor-pointer" : ""} ${star <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200 fill-neutral-200"}`} />
      ))}
    </div>
  );
};

const MyReviews = () => {
  const navigate = useNavigate();
  const { bookings } = useSelector((state: RootState) => state.booking);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/review/reviews-by-user");
      setReviews(res.data.data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", String(rating));
  };

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);
    try {
      await api.post("/review/create-review", {
        hotelId: data.hotelId,
        bookingId: data.bookingId,
        rating: Number(data.rating),
        comment: data.comment,
      });
      await fetchReviews();
      setSuccess(true);
      setShowForm(false);
      reset();
      setSelectedRating(0);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/review/delete-review/${reviewId}`);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight m-0">My Reviews</h1>
            <p className="text-neutral-400 text-sm mt-1 m-0">Share your experience with other travellers</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-brand text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-brand/90 transition-colors">
            <Plus size={16} /> Write Review
          </button>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-green-600 text-sm m-0 font-semibold">✓ Review submitted successfully!</p>
          </div>
        )}

        {/* WRITE REVIEW FORM */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-8">
            <h2 className="text-base font-bold text-brand-dark mb-5 flex items-center gap-2">
              <MessageSquare size={18} className="text-brand" /> Write a Review
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <p className="text-red-600 text-sm m-0">{error}</p>
              </div>
            )}

            {confirmedBookings.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-neutral-400 text-sm mb-4">You need a confirmed booking to write a review</p>
                <button onClick={() => navigate("/hotels")}
                  className="bg-brand text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer">
                  Explore Hotels
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                {/* booking select */}
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">Select Booking *</label>
                  <select {...register("bookingId")}
                    onChange={e => {
                      const booking = confirmedBookings.find(b => b.id === e.target.value);
                      if (booking) setValue("hotelId", booking.hotelId);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark transition-colors ${errors.bookingId ? "border-red-300" : "border-neutral-200 focus:border-brand"}`}>
                    <option value="">Select a booking...</option>
                    {confirmedBookings.map(b => (
                      <option key={b.id} value={b.id}>
                        Booking #{b.id.slice(0, 8).toUpperCase()} — Hotel {b.hotelId.slice(0, 8)}
                      </option>
                    ))}
                  </select>
                  {errors.bookingId && <p className="text-red-500 text-xs mt-1.5">{errors.bookingId.message}</p>}
                </div>

                {/* hidden hotelId */}
                <input type="hidden" {...register("hotelId")} />

                {/* rating */}
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-3">Rating *</label>
                  <StarRating rating={selectedRating} onSelect={handleRatingSelect} />
                  <input type="hidden" {...register("rating")} />
                  {errors.rating && <p className="text-red-500 text-xs mt-1.5">{errors.rating.message}</p>}
                </div>

                {/* comment */}
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">Comment</label>
                  <textarea {...register("comment")} placeholder="Share your experience..." rows={4}
                    className="w-full px-4 py-3 rounded-xl border-[1.5px] border-neutral-200 bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 focus:border-brand transition-colors resize-none" />
                </div>

                {/* submit */}
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setShowForm(false); reset(); setSelectedRating(0); }}
                    className="flex-1 py-3 rounded-xl bg-neutral-100 text-brand-dark text-sm font-bold border-none cursor-pointer hover:bg-neutral-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading || selectedRating === 0}
                    className={`flex-1 py-3 rounded-xl text-white text-sm font-bold border-none cursor-pointer transition-colors ${isLoading || selectedRating === 0 ? "bg-neutral-400 cursor-not-allowed" : "bg-brand-dark hover:bg-brand"}`}>
                    {isLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* LOADING */}
        {isLoading && reviews.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && reviews.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4">
              <Star size={32} className="text-brand" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">No reviews yet</h3>
            <p className="text-neutral-400 text-sm mb-6">Share your hotel experience with other travellers</p>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-brand text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer">
              <Plus size={16} /> Write Your First Review
            </button>
          </div>
        )}

        {/* REVIEWS LIST */}
        {reviews.length > 0 && (
          <div className="flex flex-col gap-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={review.rating} />
                      <span className="text-sm font-bold text-brand-dark">{review.rating}/5</span>
                    </div>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                      <MapPin size={11} /> Hotel ID: {review.hotelId.slice(0, 12)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <button onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-1 bg-red-50 text-red-500 border-none px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>

                {review.comment && (
                  <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 rounded-xl p-4">
                    "{review.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyReviews;