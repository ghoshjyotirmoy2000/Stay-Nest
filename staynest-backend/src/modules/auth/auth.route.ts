import { Router } from "express";
import { logoutHandler, refreshAccessTokenAndRefreshToken, signInHandler, signUpHandler } from "./auth.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router()

router.post("/signup" , signUpHandler)
router.post("/signin" , signInHandler)
router.get("/refresh-token" , refreshAccessTokenAndRefreshToken)
router.post("/logout" , authMiddleware , logoutHandler)


export default router

