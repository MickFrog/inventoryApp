const asyncHandler = require("express-async-handler");

const Item = require("../models/Item");
const Category = require("../models/Category");

// Display list of all items
exports.items_list = asyncHandler(async function (req, res, next) {
  const allItems = await Item.find({})
    .sort({ name: 1 })
    .populate("category")
    .exec();

  res.render("items_list", { title: "Items List", items: allItems });
});

// Display detail of an item
exports.item_detail = asyncHandler(async function (req, res, next) {
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (!item) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_detail", { title: item.name, item: item });
});

// Get request handler for item create request
exports.item_create_get = asyncHandler(async function (req, res, next) {
  const categories = await Category.find({}).exec();

  res.render("item_create", { title: "Create Item", categories: categories });
});

// Post request handler for item create request
exports.item_create_post = asyncHandler(function (req, res, next) {
  res.redirect("/inventory/items");
});
