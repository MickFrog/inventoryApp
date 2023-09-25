const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
exports.item_create_post = [
  // Validate and sanitize fields
  body("itemName", "Item name must be filled")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("itemDesc", "Description must be filled")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("itemPrice", "Price must be a number greater or equal to 1")
    .isInt({ min: 1 })
    .trim()
    .escape(),
  body("itemStock", "Item stock must be a number greater or equal to 1")
    .isInt({ min: 1 })
    .trim()
    .escape(),
  body("itemCategory.*").escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req); // extract validation errors

    const newItem = new Item({
      name: req.body.itemName,
      description: req.body.itemDesc,
      category: req.body.itemCategory,
      price: req.body.itemPrice,
      numberInStock: req.body.itemStock,
    });

    if (!errors.isEmpty()) {
      // Render create item form with errors
      const categories = await Category.find({}).exec();

      // Re render create item form
      res.render("item_create", {
        title: "Create Item",
        item: newItem,
        categories: categories,
        errors: errors.array(),
      });
    } else {
      await newItem.save();
      res.redirect("/inventory/items");
    }
  }),
];

// GET request handler for item update
exports.item_update_get = asyncHandler(async function (req, res, next) {
  // Get item associated with ID
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find({}).exec(),
  ]);

  if (!item) {
    const error = new Error("Item not found");
    res.status = 404;
    next(error);
  }

  res.render("item_update", {
    title: `${item.name} update`,
    item: item,
    categories,
  });
});

// Post request handler for item update
exports.item_update_post = [
  // Validate and sanitize fields
  body("itemName", "Item name must be filled")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("itemDesc", "Description must be filled")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("itemPrice", "Price must be a number greater or equal to 1")
    .isInt({ min: 1 })
    .trim()
    .escape(),
  body("itemStock", "Item stock must be a number greater or equal to 1")
    .isInt({ min: 1 })
    .trim()
    .escape(),
  body("itemCategory.*").escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req); // extract validation errors

    const newItem = new Item({
      _id: req.params.id, // This is required, or a new ID will be assigned!
      name: req.body.itemName,
      description: req.body.itemDesc,
      category: req.body.itemCategory[0],
      price: req.body.itemPrice,
      numberInStock: req.body.itemStock,
    });

    if (!errors.isEmpty()) {
      // Render create item form with errors
      const categories = await Category.find({}).exec();

      // Re render create item form
      res.render("item_create", {
        title: "Create Item",
        item: newItem,
        categories: categories,
        errors: errors.array(),
      });
    } else {
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        newItem,
        {}
      );
      res.redirect(updatedItem.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async function (req, res, next) {
  // Get item to be deleted
  const item = await Item.findById(req.params.id).exec();

  if (!item) {
    const error = new Error("Item not found");
    res.status = 404;
    next(error);
  }

  res.render("item_delete", {
    title: `${item.name} delete`,
    itemLink: item.url,
  });
});

exports.item_delete_post = asyncHandler(async function (req, res, next) {
  // Get item to be deleted
  const item = await Item.findById(req.params.id).exec();

  if (!item) {
    const error = new Error("Item not found");
    res.status = 404;
    next(error);
  }

  // finally delete the item
  await Item.findByIdAndDelete(req.params.id);
  res.redirect("/inventory/items");
});
