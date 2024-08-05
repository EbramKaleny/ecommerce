import express from "express";
import * as RC from "../controllers/review.js";
import * as RV from "../validations/review.js";
import { validation } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";
import { systemRoles } from "../service/systemRoles.js";

const router = express.Router({ mergeParams: true });

router
  .route("/create")
  .post(validation(RV.createReview), auth(systemRoles.admin), RC.createReview);
router
  .route("/delete")
  .delete(
    validation(RV.deleteReview),
    auth(systemRoles.admin),
    RC.deleteReview
  );

export default router;
