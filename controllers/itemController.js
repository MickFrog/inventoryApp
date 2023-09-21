const asyncHandler = require("express-async-handler");

// Display list of all items
exports.items_list = asyncHandler(function (req, res, next) {
  res.send("NOT IMPLEMENTED: This is for a list of all items");
});

// Display detail of an item
exports.item_detail = asyncHandler(function (req, res, next) {
  res.send("NOT IMPLEMENTED: This is a detail page for a chosen item");
});
