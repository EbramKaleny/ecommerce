import express from "express";
import * as CC from "../controllers/coupon.js";
import * as CV from "../validations/coupon.js";
import { multerHost, validExtension } from "../middleware/multer.js";
import { validation } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";
import { systemRoles } from "../service/systemRoles.js";

const router = express.Router();

router
  .route("/create")
  .post(
    multerHost(validExtension.image).single("image"),
    validation(CV.createCoupon),
    auth(systemRoles.admin),
    CC.createCoupon
  );

router
  .route("/update/:id")
  .put(validation(CV.updateCoupon), auth(systemRoles.admin), CC.updateCoupon);

export default router
