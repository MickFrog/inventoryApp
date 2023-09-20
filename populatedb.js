#! /usr/bin/env node

console.log(
  'This script populates some test categories and items to the database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/<your_db>?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/Item");
const Category = require("./models/Category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.

async function categoryCreate(index, name, desc) {
  const category = new Category({ name: name, description: desc });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, desc, category, price, inStock) {
  const item = new Item({
    name: name,
    description: desc,
    category: category,
    price: price,
    numberInStock: inStock,
  });
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Electronics",
      "Explore the latest and greatest in electronic gadgets and devices."
    ),
    categoryCreate(
      1,
      "Clothing",
      "Stay stylish with our fashionable clothing collection."
    ),
    categoryCreate(
      2,
      "Home Appliances",
      "Upgrade your home with our range of reliable home appliances."
    ),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "Smartphone",
      "Stay connected with the latest smartphone technology",
      categories[0],
      699,
      50
    ),
    itemCreate(
      1,
      "Laptop",
      "Powerful laptops for work and play.",
      categories[0],
      999,
      30
    ),
    itemCreate(
      2,
      "Smart TV",
      "Enjoy immersive entertainment with our smart TV collection.",
      categories[0],
      799,
      20
    ),
    itemCreate(
      3,
      "Headphones",
      "Premium headphones for music enthusiasts.",
      categories[0],
      199,
      40
    ),
    itemCreate(
      4,
      "T-Shirt",
      "Comfortable and versatile t-shirts for everyday wear.",
      categories[1],
      19,
      100
    ),
    itemCreate(
      5,
      "Jeans",
      "Classic jeans for a timeless look.",
      categories[1],
      49,
      25
    ),
    itemCreate(
      6,
      "Dress",
      "Elegant dresses for special occasions.",
      categories[1],
      79,
      40
    ),
    itemCreate(
      7,
      "Sneakers",
      "Stylish sneakers for a casual and sporty look.",
      categories[1],
      59,
      80
    ),
    itemCreate(
      8,
      "Refrigerator",
      "Keep your food fresh with our energy-efficient refrigerators.",
      categories[2],
      799,
      20
    ),
    itemCreate(
      9,
      "Washing Machine",
      "Make laundry a breeze with our advanced washing machines.",
      categories[2],
      599,
      15
    ),
    itemCreate(
      10,
      "Microwave Oven",
      "Heat and cook with precision using our microwave ovens.",
      categories[2],
      149,
      25
    ),
    itemCreate(
      11,
      "Vacuum Cleaner",
      "Keep your home spotless with our powerful vacuum cleaners.",
      categories[2],
      199,
      30
    ),
  ]);
}
