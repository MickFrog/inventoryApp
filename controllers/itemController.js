const asyncHandler = require("express-async-handler");

const Item = require("../models/Item");

// Display list of all items
exports.items_list = asyncHandler(async function (req, res, next) {
  const allItems = await Item.find({})
    .sort({ name: 1 })
    .populate("category")
    .exec();

  res.render("items_list", { title: "Items List", items: allItems });
});

// Display detail of an item
exports.item_detail = asyncHandler(function (req, res, next) {
  res.send("NOT IMPLEMENTED: This is a detail page for a chosen item");
});
