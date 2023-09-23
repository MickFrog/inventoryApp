const express = require("express");
const router = express.Router();

// import controllers
const categoryController = require("../controllers/categoryController");
const itemsController = require("../controllers/itemController");

/// CATEGORIES ROUTES ///

// Get inventory home page
router.get("/", categoryController.index);

// Get request for category list
router.get("/categories", categoryController.category_list);

// Get request for category create
router.get("/categories/create", categoryController.category_create);

// Get request for one category
router.get("/categories/:id", categoryController.category_detail);

/// ITEMS ROUTES ///

// Get request for items list
router.get("/items", itemsController.items_list);

// Get request for one item
router.get("/items/:id", itemsController.item_detail);

module.exports = router;
