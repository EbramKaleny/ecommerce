import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import { appError } from "../error/classError.js";

export const validExtension = {
  image: ["image/png", "image/jpg"],
  pdf: ["application/pdf"],
};

export const multerHost = (customerValidation, cutsomPath = "uploads") => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (customerValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new appError("file not supported"), false);
  };

  const upload = multer({ storage, fileFilter });
  return upload;
};

// multerHost(validExtension.pdf).single("image")