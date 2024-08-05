import express from "express";
import * as WC from "../controllers/wishList.js";
import * as WV from "../validations/wishList.js";
import { validation } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";

const router = express.Router({mergeParams: true});

router.route("/add").post(validation(WV.addWishList), auth(), WC.addWishList);

export default router;
