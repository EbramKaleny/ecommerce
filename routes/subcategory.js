import express from "express";
import * as SC from "../controllers/subcategory.js";
import * as SV from "../validations/subcategory.js";
import { multerHost, validExtension } from "../middleware/multer.js";
import { validation } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";
import { systemRoles } from "../service/systemRoles.js";

const router = express.Router({mergeParams: true});

router
  .route("/create")
  .post(
    multerHost(validExtension.image).single("image"),
    validation(SV.createSubCategory),
    auth([systemRoles.admin]),
    SC.createsubcategory
  );

router
  .route("/update/:id")
  .put(
    multerHost(validExtension.image).single("image"),
    validation(SV.updateSubCategory),
    auth([systemRoles.admin]),
    SC.updatesubcategory
  );

router
  .route("/get")
  .get(
    auth(),
    SC.getsubcategories
  );

router
  .route("/delete")
  .delete(
    auth([systemRoles.admin]),
    validation(SV.deleteSubCategory),
    SC.deletesubcategory
  );

export default router;
