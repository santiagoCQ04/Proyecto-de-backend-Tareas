import { Router } from "express";
import { requestReset, resetPassword } from "../controllers/passwordReset.js";

const router = Router();

router.post('/request', requestReset);
router.post('/confirm', resetPassword);

export default router;