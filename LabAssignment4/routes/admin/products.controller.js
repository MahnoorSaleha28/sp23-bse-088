const express = require("express");
const multer = require("multer");
const path = require("path");
let router = express.Router();
let Product = require("../../models/products.model");
let Category = require("../../models/categories.model");

//product details from db
router.get("/admin/products/create", async (req, res) => {
  const categories = await Category.find();
  res.render("admin/products/create", {
    layout: "adminlayout",
    categories,
  });
});

router.get("/admin/products/:page?", async (req, res) => {
  try {
    const query = req.query.query || ""; // Search query
    const category = req.query.category || ""; // Category filter
    const sort = req.query.sort || ""; // Sorting option
    const regex = new RegExp(query, "i"); // Case-insensitive
    const page = req.params.page ? Number(req.params.page) : 1; // Current page
    const pageSize = 4;

    //filter object
    let filter = {
      $or: [
        { name: regex },
        { description: regex },
      ],
    };

    //category filter
    if (category) {
      filter.category = category;
    }

    //Sorting options
    let sortOptions = {};
    if (sort === "price-asc") sortOptions.price = 1;
    else if (sort === "price-desc") sortOptions.price = -1;
    else if (sort === "name-asc") sortOptions.name = 1;
    else if (sort === "name-desc") sortOptions.name = -1;

    //total records and pages
    const totalRecords = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    // filters, sorting, pagination
    const products = await Product.find(filter)
      .populate("category")
      .sort(sortOptions)
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const categories = await Category.find();

    res.render("admin/products/index", {
      layout: "adminlayout",
      pageTitle: "Manage Products",
      products,
      categories,
      query,
      selectedCategory: category,
      sort,
      page,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving products.");
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Path to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
  },
});
const upload = multer({ storage: storage });

// Handle new product form data
router.post(
  "/admin/products/create",
  upload.single("productImage"),
  async (req, res) => {
    try {
      let data = req.body;
      if (req.file) {
        data.image = `/images/${req.file.filename}`;
      }
      const newProduct = new Product(data);
      await newProduct.save();

      // Finding the associated category and adding the new product to it
      let category = await Category.findById(data.categoryId);
      category.products.push(newProduct._id);
      await category.save();

      // return res.send(newProduct);                                           --displaying the newly created product's details.
      // return res.render("admin/product-form", { layout: "adminlayout" });    --allowing user to see the form again

      res.redirect("/admin/products");
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error saving product.");
    }
  },
);

router.get("/admin/products/edit/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).populate("category");
    const categories = await Category.find();

    res.render("admin/products/edit", {
      layout: "adminlayout",
      product,
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading product edit page.");
  }
});

router.post(
  "/admin/products/edit/:id",
  upload.single("productImage"),
  async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);
      let data = req.body;
      if (req.file) {
        data.image = `/images/${req.file.filename}`;
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true },
      );
      res.redirect("/admin/products");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating product.");
    }
  },
);

router.post("/admin/products/delete/:id", async (req, res) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found.");
    }

    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product.");
  }
});

// Route to handle search
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query || ""; // Search term
    const category = req.query.category || ""; // Category filter
    const priceRange = req.query.priceRange || ""; // Price range filter
    const sort = req.query.sort || ""; // Sorting option
    const regex = new RegExp(query, "i"); // Case-insensitive regex for search query

    // Build the filter object for products
    let filter = {
      $or: [
        { name: regex }, // Match product name
        { description: regex }, // Match product description
      ],
    };

    // Add category filter if provided
    if (category) {
      filter["category"] = category; // Filter by selected category
    }

    // Add price range filter if provided
    if (priceRange) {
      const [min, max] = priceRange.split("-"); // Split the range (e.g., "50-100")
      if (max) {
        filter["price"] = { $gte: parseInt(min), $lte: parseInt(max) }; // Between min and max
      } else {
        filter["price"] = { $gte: parseInt(min) }; // Greater than min
      }
    }

    // Fetch products based on the filter
    let queryBuilder = Product.find(filter).populate("category");

    // Apply sorting if specified
    if (sort) {
      const sortOptions = {
        "price-asc": { price: 1 }, // Price: Low to High
        "price-desc": { price: -1 }, // Price: High to Low
        "name-asc": { name: 1 }, // Name: A to Z
        "name-desc": { name: -1 }, // Name: Z to A
      };
      queryBuilder = queryBuilder.sort(sortOptions[sort]);
    }

    // Execute the query
    const products = await queryBuilder;

    // Fetch all categories for the category dropdown
    const categories = await Category.find();

    // Render the search results page
    res.render("search-results", {
      products, // Pass products to the view
      query, // Pass search query
      selectedCategory: category, // Pass selected category filter
      selectedPriceRange: priceRange, // Pass selected price range
      sort, // Pass selected sort option
      categories, // Pass all categories for dropdown
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing search.");
  }
});


module.exports = router;
