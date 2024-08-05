import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import categoryModel from "../db/models/category.js";
import { nanoid } from "nanoid";
import cloudinary from "../service/cloudinary.js";
import slugify from "slugify";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const categoryExist = await categoryModel.findOne({
    name: name.toLowerCase(),
  });
  categoryExist && next(new appError("category already exist", 409));
  if (!req.file) {
    next(new appError("image is required", 404));
  }
  const customeId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommerce/categories/${customeId}`,
    }
  );
  req.filePath = `Ecommerce/categories/${customeId}`
  
  const category = await categoryModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { secure_url, public_id },
    customeId,
    createdBy: req.user._id,
  });
  req.data = {
    model: categoryModel,
    id: category._id
  }
  res.status(200).json({ msg: "done", category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  let category = await categoryModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!category) {
    next(new appError("category dosen't exists", 404));
  }

  if (name) {
    if (name.toLowerCase() === category.name) {
      next(new appError("name should be diffrent", 400));
    }
    if (await categoryModel.findOne({ name: name.toLowerCase() })) {
      next(new appError("name already exists", 409));
    }
    category.name = name.toLowerCase();
    category.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommerce/categories/${category.customeId}`,
      }
    );
    category.image = { secure_url, public_id };
  }

  await category.save();
  return res.status(200).json({ msg: "done", category });
});

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find();
  if (categories.length === 0) {
    next(new appError("there is no categories yet", 404));
  }
  return res.status(200).json({ msg: "done", categories });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!category) {
    next(new appError("category dosen't exists", 404));
  }
  await cloudinary.uploader.destroy(category.image.public_id);
  return req.status(204).json({ msg: "done" });
});
