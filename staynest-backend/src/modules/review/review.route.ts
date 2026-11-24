import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  createReviewHandler,
  getAllReviewsHandler,
  getReviewsByHotelIdHandler,
  getReviewsByUserIdHandler,
  deleteReviewHandler,
} from "./review.controller";

const router = Router();

router.post("/create-review", authMiddleware, createReviewHandler);
router.get("/all-reviews", getAllReviewsHandler);
router.get("/reviews-by-hotel/:hotelId" , getReviewsByHotelIdHandler);
router.get("/reviews-by-user", authMiddleware, getReviewsByUserIdHandler);
router.delete("/delete-review/:reviewId", authMiddleware, deleteReviewHandler);

export default router;