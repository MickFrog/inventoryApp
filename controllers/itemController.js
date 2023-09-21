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
exports.item_detail = asyncHandler(async function (req, res, next) {
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (!item) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_detail", { title: item.name, item: item });
});
