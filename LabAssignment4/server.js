const express = require("express");
const mongoose = require("mongoose");
const expressEjsLayouts = require("express-ejs-layouts");
const server = express();
const Product = require("./models/products.model");
const Category = require("./models/categories.model");

server.set("view engine", "ejs");

var expressLayouts = require("express-ejs-layouts");
server.use(expressLayouts);

server.use(express.static("public"));

server.use(express.urlencoded({ extended: true }));

const port = 5000;

server.get("/", async (req, res) => {
  try {
    let products = await Product.find();
    let categories = await Category.find();

    res.render("homepage", {
      products,
      categories,
      query: "", // Default search query
      pageTitle: "Homepage",
      selectedCategory: "",
      selectedPriceRange: "", // Default
      sort: "", // Default
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving products and categories.");
  }
});

server.get("/admin", (req, res) => {
  res.render("admin/dashboard", {
    layout: "adminlayout",
    pageTitle: "Admin Dashboard",
  });
});

//adminProductsRouter to handle all the product-related routes
let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

//adminProductsRouter to handle all the category-related routes
let adminCategoriesRouter = require("./routes/admin/categories.controller");
server.use(adminCategoriesRouter);

const connectionString = "mongodb://localhost:27017/claies";
mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));

server.listen(port, () => {
  console.log("Server started at localhost:5000");
});
