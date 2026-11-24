import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./modules/auth/auth.route";
import hotelRouter from "./modules/hotel/hotel.route";
import roomRouter from "./modules/room/room.route";
import bookingRouter from "./modules/booking/booking.route";
import reviewRouter from "./modules/review/review.route";
import userRouter from "./modules/user/user.route";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";


const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false, // disable CSP in dev
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => process.env.NODE_ENV === "development",
  })
);

app.get("/", (req, res) => {
  res.send("Hello from stay nest");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/hotel", hotelRouter);
app.use("/api/v1/room", roomRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});