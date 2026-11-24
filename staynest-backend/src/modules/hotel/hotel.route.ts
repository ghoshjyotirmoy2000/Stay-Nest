import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { requireRole } from "../../middlewares/roleMiddleware";
import { createHotelHandler, deleteHotelHandler, getAllHotelByIdHandler, getAllHotelByOwnerIdHandler, getAllHotelHandler, getHotelsByOwnerIdForAdminHandler, getPresignedUrlForHotelImage, updateHotelHandler } from "./hotel.controller";

const router = Router();

router.post("/create-hotel" , authMiddleware , requireRole("OWNER") , createHotelHandler);
router.get("/all-hotels"  , getAllHotelHandler);
router.get("/hotel-by-id/:hotelId" ,  getAllHotelByIdHandler);
router.get("/hotels-by-owner-id" , authMiddleware , requireRole("OWNER") ,  getAllHotelByOwnerIdHandler);
router.get("/admin/hotels-by-owner/:ownerId" , authMiddleware , requireRole("SUPERADMIN") , getHotelsByOwnerIdForAdminHandler);
router.patch("/update-hotel/:hotelId", authMiddleware, requireRole("OWNER"), updateHotelHandler);
router.delete("/delete-hotel/:hotelId", authMiddleware, requireRole("OWNER"), deleteHotelHandler);
router.get("/get-presigned-url" , authMiddleware , requireRole("OWNER") , getPresignedUrlForHotelImage)

export default router;

