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

// Display list of all categories
exports.category_list = asyncHandler(async function (req, res, next) {
  const categories = await Category.find({}).sort({ name: 1 }).exec();
  res.render("categories_list", {
    title: "Categories List",
    categories: categories,
  });
});

// Display detail of a category
exports.category_detail = asyncHandler(async function (req, res, next) {
  // Get category with given id
  const category = await Category.findById(req.params.id);

  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", { title: category.name, category: category });
});
