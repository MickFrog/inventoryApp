const asyncHandler = require("express-async-handler");

// Get the count of all items and categories
exports.index = asyncHandler(function (req, res, next) {
  res.render("index", { title: "Mick-Inventory" });
});

// Display list of all categories
exports.category_list = asyncHandler(function (req, res, next) {
  res.send("NOT IMPLEMENTED: This is for a list of all categories");
});

// Display detail of a category
exports.category_detail = asyncHandler(function (req, res, next) {
  res.send("NOT IMPLEMENTED: This is a detail page for a chosen category");
});
