import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { requireRole } from "../../middlewares/roleMiddleware";
import {
  getMeHandler,
  getAllUsersHandler,
  getAllHotelAdminsHandler,
  updateUserHandler,
  deleteUserHandler,
} from "./user.controller";

const router = Router();

router.get("/me", authMiddleware, getMeHandler);
router.get("/all-users", authMiddleware, requireRole("SUPERADMIN"), getAllUsersHandler);
router.get("/hotel-admins", authMiddleware, requireRole("SUPERADMIN"), getAllHotelAdminsHandler);
router.patch("/update-user", authMiddleware, updateUserHandler);
router.delete("/delete-user", authMiddleware, deleteUserHandler);

export default router;