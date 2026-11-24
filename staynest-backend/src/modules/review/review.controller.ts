import type { Request, Response } from "express";
import { asyncHanlder } from "../../utils/asyncHandler";
import {
  createReview,
  getAllReviews,
  getReviewsByHotelId,
  getReviewsByUserId,
  deleteReview,
} from "./review.service";
import { sendError, sendSuccess } from "../../utils/response";

export const createReviewHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const data = req.body;

    const review = await createReview({ ...data, userId });

    return sendSuccess(res, 201, "Review created successfully", review);
  }
);

export const getAllReviewsHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const reviews = await getAllReviews();

    return sendSuccess(res, 200, "Reviews fetched successfully", { reviews });
  }
);

export const getReviewsByHotelIdHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { hotelId } = (req as any).params;

    const reviews = await getReviewsByHotelId(hotelId);

    return sendSuccess(res, 200, "Reviews fetched successfully", { reviews });
  }
);

export const getReviewsByUserIdHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { id } = (req as any).user;

    const reviews = await getReviewsByUserId(id);

    return sendSuccess(res, 200, "Reviews fetched successfully", { reviews });
  }
);

export const deleteReviewHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { reviewId } = (req as any).params;

    await deleteReview(reviewId);

    return sendSuccess(res, 200, "Review deleted successfully");
  }
);