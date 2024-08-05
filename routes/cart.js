import express from "express";
import * as CC from "../controllers/cart.js";
import * as CV from "../validations/cart.js";
import { validation } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.route("/create").post(validation(CV.createCart), auth(), CC.createCart);
router.route("/remove").put(validation(CV.removeCart), auth(), CC.removeCart);
router.route("/clear").put(validation(CV.clearCart), auth(), CC.clearCart);

export default router;
