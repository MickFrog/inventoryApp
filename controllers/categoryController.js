const asyncHandler = require("express-async-handler");

const Category = require("../models/Category");
const Item = require("../models/Item");

// Get the count of all items and categories
exports.index = asyncHandler(async function (req, res, next) {
  const [numCategories, numItems] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Mick-Inventory",
    category_count: numCategories,
    items_count: numItems,
  });
});

// Get list of all categories
exports.category_list = asyncHandler(async function (req, res, next) {
  const categories = await Category.find({}).sort({ name: 1 }).exec();
  res.render("categories_list", {
    title: "Categories List",
    categories: categories,
  });
});

// Get detail of a category
exports.category_detail = asyncHandler(async function (req, res, next) {
  // Get category with given id
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }),
  ]);

  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: category.name,
    category: category,
    categoryItems,
  });
});

// Get create page for category
exports.category_create = asyncHandler(function (req, res, next) {
  res.render("category_create", { title: "Create Category" });
});
