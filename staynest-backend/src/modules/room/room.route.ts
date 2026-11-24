import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { requireRole } from "../../middlewares/roleMiddleware";
import {
  createRoomHandler,
  getAllRoomsHandler,
  getRoomByIdHandler,
  getRoomsByHotelIdHandler,
  deleteRoomHandler,
} from "./room.controller";

const router = Router();

router.post("/create-room/:hotelId", authMiddleware, requireRole("OWNER"), createRoomHandler);
router.get("/all-rooms", getAllRoomsHandler);
router.get("/room-by-id/:roomId", getRoomByIdHandler);
router.get("/rooms-by-hotel/:hotelId", getRoomsByHotelIdHandler);
router.delete("/delete-room/:roomId", authMiddleware, requireRole("OWNER"), deleteRoomHandler);

export default router;