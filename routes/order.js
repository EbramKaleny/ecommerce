import express from "express";
import * as OC from "../controllers/order.js";
import * as OV from "../validations/order.js";
import { validation } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.route("/create").post(validation(OV.createOrder), auth(), OC.createOrder);
router.route("/cancel").post(validation(OV.cancleOrder), auth(), OC.cancleOrder);

router.route('/webhook').post(express.raw({type: 'application/json'}),OC.webhook);

export default router;
