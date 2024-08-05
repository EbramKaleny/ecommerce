import express from "express";
import * as CC from "../controllers/category.js";
import * as CV from "../validations/category.js";
import SR from './subcategory.js';
import { multerHost, validExtension } from "../middleware/multer.js";
import { validation } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";
import { systemRoles } from "../service/systemRoles.js";

const router = express.Router();

router.use("/:categoryId/subCategory",SR)

router
  .route("/create")
  .post(
    multerHost(validExtension.image).single("image"),
    validation(CV.createCategory),
    auth([systemRoles.admin]),
    CC.createCategory
  );

router
  .route("/update/:id")
  .put(
    multerHost(validExtension.image).single("image"),
    validation(CV.updateCategory),
    auth([systemRoles.admin]),
    CC.updateCategory
  );

router
  .route("/get")
  .get(
    auth(),
    CC.getCategories
  );

router
  .route("/delete")
  .delete(
    auth([systemRoles.admin]),
    validation(CV.deleteCategory),
    CC.deleteCategory
  );

export default router;
