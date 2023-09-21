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
exports.category_detail = asyncHandler(function (req, res, next) {
  res.send("NOT IMPLEMENTED: This is a detail page for a chosen category");
});
