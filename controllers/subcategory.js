import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import subcategoryModel from "../db/models/subcategory.js";
import { nanoid } from "nanoid";
import cloudinary from "../service/cloudinary.js";
import slugify from "slugify";
import categoryModel from "../db/models/category.js";

export const createsubcategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const categoryExist = await categoryModel.findById(category);
  if(!categoryExist){
    next(new appError("category dosen't exists",404))
  }
  const subcategoryExist = await subcategoryModel.findOne({
    name: name.toLowerCase(),
  });
  subcategoryExist && next(new appError("subcategory already exist", 409));
  if (!req.file) {
    next(new appError("image is required", 404));
  }
  const customeId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommerce/categories/${categoryExist.customeId}/${customeId}`,
    }
  );
  const subcategory = await subcategoryModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { secure_url, public_id },
    customeId,
    category,
    createdBy: req.user._id,
  });
  res.status(200).json({ msg: "done", subcategory });
});

export const updatesubcategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  let subcategory = await subcategoryModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!subcategory) {
    next(new appError("subcategory dosen't exists", 404));
  }

  if (name) {
    if (name.toLowerCase() === subcategory.name) {
      next(new appError("name should be diffrent", 400));
    }
    if (await subcategoryModel.findOne({ name: name.toLowerCase() })) {
      next(new appError("name already exists", 409));
    }
    subcategory.name = name.toLowerCase();
    subcategory.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    const category = await categoryModel.findById(subcategory.category)
    await cloudinary.uploader.destroy(subcategory.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommerce/categories/${category.customeId}/${subcategory.customeId}`,
      }
    );
    subcategory.image = { secure_url, public_id };
  }

  await subcategory.save();
  return res.status(200).json({ msg: "done", subcategory });
});

export const getsubcategories = asyncHandler(async (req, res,next) => {
  const subcategories = await subcategoryModel.find()
  if(subcategories.length === 0){
    next(new appError("there is no categories yet", 404))
  }
  return res.status(200).json({msg:"done", subcategories})
})

export const deletesubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subcategory = await subcategoryModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!subcategory) {
    next(new appError("subcategory dosen't exists", 404));
  }
  await cloudinary.uploader.destroy(subcategory.image.public_id);

  return req.status(204).json({msg:"done"})
})