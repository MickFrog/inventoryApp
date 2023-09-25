const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
exports.category_create_get = asyncHandler(function (req, res, next) {
  res.render("category_create", { title: "Create Category" });
});

// Post request handler for category create
exports.category_create_post = [
  // Validate and sanitize user fields
  // Validation is done synchronously to prevent later validation that may come with asynchronous behavior
  body("categoryName", "Category name must be filled")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("categoryDesc", "Category description must be filled")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    // Render create form if any validation errors occurred,
    if (!errors.isEmpty()) {
      res.render("category_create", {
        title: "Create Category",
        errors: errors.array(),
      });
      return;
    }

    // Add new category
    const newCategory = new Category({
      name: req.body.categoryName,
      description: req.body.categoryDesc,
    });

    await newCategory.save();
    res.redirect("/inventory/categories");
  }),
];

// GET request handler for category update
exports.category_update_get = asyncHandler(async function (req, res, next) {
  // Get category associated with ID
  const category = await Category.findById(req.params.id).exec();

  if (!category) {
    const error = new Error("Category not found");
    res.status = 404;
    next(error);
  }

  res.render("category_update", {
    title: `${category.name} update`,
    category: category,
  });
});

// Post request handler for category update
exports.category_update_post = [
  // Validate and sanitize user fields
  // Validation is done synchronously to prevent later validation that may come with asynchronous behavior
  body("categoryName", "Category name must be filled")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("categoryDesc", "Category description must be filled")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    // Render create form if any validation errors occurred,
    if (!errors.isEmpty()) {
      res.render("category_create", {
        title: "Create Category",
        errors: errors.array(),
      });
      return;
    }

    // Add new category
    const newCategory = new Category({
      name: req.body.categoryName,
      description: req.body.categoryDesc,
      _id: req.params.id, // Required or else id will be reassigned
    });

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      newCategory,
      {}
    );
    res.redirect(updatedCategory.url);
  }),
];
