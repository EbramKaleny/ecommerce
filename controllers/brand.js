import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import brandModel from "../db/models/brand.js";
import { nanoid } from "nanoid";
import cloudinary from "../service/cloudinary.js";
import slugify from "slugify";
import categoryModel from "../db/models/category.js";

export const createbrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body
  const brandExist = await brandModel.findOne({
    name: name.toLowerCase(),
  });
  brandExist && next(new appError("brand already exist", 409));
  if (!req.file) {
    next(new appError("image is required", 404));
  }
  const customeId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommerce/brands/${customeId}`,
    }
  );
  const brand = await brandModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { secure_url, public_id },
    customeId,
    createdBy: req.user._id,
  });
  res.status(200).json({ msg: "done", brand });
});

export const updatebrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  let brand = await brandModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!brand) {
    next(new appError("brand dosen't exists", 404));
  }

  if (name) {
    if (name.toLowerCase() === brand.name) {
      next(new appError("name should be diffrent", 400));
    }
    if (await brandModel.findOne({ name: name.toLowerCase() })) {
      next(new appError("name already exists", 409));
    }
    brand.name = name.toLowerCase();
    brand.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommerce/brands/${brand.customeId}`,
      }
    );
    brand.image = { secure_url, public_id };
  }

  await brand.save();
  return res.status(200).json({ msg: "done", brand });
});

export const getbrands = asyncHandler(async (req, res,next) => {
  const brands = await brandModel.find()
  if(brands.length === 0){
    next(new appError("there is no categories yet", 404))
  }
  return res.status(200).json({msg:"done", brands})
})

export const deletebrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!brand) {
    next(new appError("brand dosen't exists", 404));
  }
  await cloudinary.uploader.destroy(brand.image.public_id);
  return req.status(204).json({msg:"done"})
})