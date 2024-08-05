import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import brandModel from "../db/models/brand.js";
import categoryModel from "../db/models/category.js";
import subCategoryModel from "../db/models/subcategory.js";
import productModel from "../db/models/product.js";
import slugify from "slugify";
import cloudinary from "../service/cloudinary.js";
import { nanoid } from "nanoid";
import { ApiFeatures } from "../service/ApiFeatures.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    stock,
    discount,
    price,
    brand,
    subCategory,
    category,
    description,
    name,
  } = req.body;

  const categoryExist = await categoryModel.findById(category);
  if (!categoryExist) {
    next(new appError("category doesn't exist", 404));
  }

  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist) {
    next(new appError("subCategory doesn't exist", 404));
  }

  const brandExist = await brandModel.findById(brand);
  if (!brandExist) {
    next(new appError("brand doesn't exist", 404));
  }

  const productExist = await productModel.findOne({ name: name.toLowerCase() });
  if (!productExist) {
    next(new appError("product already exist", 404));
  }

  const subPrice = price - (price * (discount || 0)) / 100;

  if (!req.files) {
    next(new appError("image is required", 404));
  }

  const customeId = nanoid(5);
  let list = [];
  for (const file of req.files.coverImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `Ecommerce/categories/${categoryExist.customeId}/subCategories/${subCategoryExist.customeId}/products/${customeId}/coverImages`,
      }
    );
    list.push({ secure_url, public_id });
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    {
      folder: `Ecommerce/categories/${categoryExist.customeId}/subCategories/${subCategoryExist.customeId}/products/${customeId}/mainImage`,
    }
  );

  const product = await productModel.create({
    name,
    slug: slugify(name, {
      lower: true,
      replacement: "_",
    }),
    description,
    price,
    discount,
    subPrice,
    stock,
    category,
    subCategory,
    brand,
    image: { secure_url, public_id },
    coverImages: list,
    customeId,
    createdBy: req.user._id,
  });

  res.status(200).json({ msg: "done", product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const {
    stock,
    discount,
    price,
    brand,
    subCategory,
    category,
    description,
    name,
  } = req.body;
  const { id } = req.params;

  const categoryExist = await categoryModel.findById(category);
  if (!categoryExist) {
    next(new appError("category doesn't exist", 404));
  }

  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist) {
    next(new appError("subCategory doesn't exist", 404));
  }

  const brandExist = await brandModel.findById(brand);
  if (!brandExist) {
    next(new appError("brand doesn't exist", 404));
  }

  const product = await productModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!product) {
    next(new appError("product doesn't exist", 404));
  }

  if (name) {
    if (name.toLowerCase() == product.name) {
      next(new appError("name must be diffrent than old name", 409));
    }
    if (await productModel.findOne({ name: name.toLowerCase() })) {
      next(new appError("name already exist", 409));
    }
    product.name = name.toLowerCase();
    product.slug = slugify(name, {
      lower: true,
      replacement: "_",
    });
  }

  if (description) {
    product.description = description;
  }

  if (stock) {
    product.stock = stock;
  }

  if (price && discount) {
    product.subPrice = price - (price * (discount || 0)) / 100;
    product.price = price;
    product.discount = discount;
  } else if (price) {
    product.subPrice = price - (price * (discount || 0)) / 100;
    product.price = price;
  } else if (discount) {
    product.subPrice = price - (price * (discount || 0)) / 100;
    product.discount = discount;
  }

  if (req.files) {
    if (req.files?.image.length) {
      await cloudinary.uploader.destroy(product.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: `Ecommerce/categories/${categoryExist.customeId}/subCategories/${subCategoryExist.customeId}/products/${product.customeId}/mainImage`,
        }
      );
      product.image = { secure_url, public_id };
    }

    if (req.files?.coverImages?.length) {
      await cloudinary.api.delete_resources_by_prefix(
        `Ecommerce/categories/${categoryExist.customeId}/subCategories/${subCategoryExist.customeId}/products/${product.customeId}/coverImages`
      );
      let list = [];
      for (const file of req.files.coverImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          {
            folder: `Ecommerce/categories/${categoryExist.customeId}/subCategories/${subCategoryExist.customeId}/products/${product.customeId}/coverImages`,
          }
        );
        list.push({ secure_url, public_id });
      }
      product.coverImages = list;
    }
  }

  res.status(201).json({ msg: "done", product });
});

export const getProducts = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .pagination()
    .filter()
    .search()
    .sort()
    .select();

  const products = await apiFeatures.query;

  res.status(200).json({ msg: "done", page: apiFeatures.page, products });
});
