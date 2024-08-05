import express from "express";
import * as PC from "../controllers/product.js";
import * as PV from "../validations/product.js";
import RR from "./review.js";
import WR from "./wishList.js";
import { multerHost, validExtension } from "../middleware/multer.js";
import { validation } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";
import { systemRoles } from "../service/systemRoles.js";

const router = express.Router();

router.use("/:productId/review",RR)
router.use("/:productId/wishList",WR)

router
  .route("/create")
  .post(
    multerHost(validExtension.image).fields([
      {name: "image", maxCount: 1},
      {name: "coverImages", maxCount: 3}
    ]),
    validation(PV.createProduct),
    auth([systemRoles.admin]),
    PC.createProduct
  );

router
  .route("/update/:id")
  .put(
    multerHost(validExtension.image).fields([
      {name: "image", maxCount: 1},
      {name: "coverImages", maxCount: 3}
    ]),
    validation(PV.updateProduct),
    auth([systemRoles.admin]),
    PC.updateProduct
  );

router.route("/get").get(auth(), PC.getProducts)


export default router;
