const express = require("express");
const mongoose = require("mongoose");
const expressEjsLayouts = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const siteMiddleware = require("./middlewares/site-middleware");
const authMiddleware = require("./middlewares/auth-middleware");
const adminMiddleware = require("./middlewares/admin-middleware");

const Product = require("./models/products.model");
const Category = require("./models/categories.model");
const User = require("./models/user.model");
const Order = require("./models/order.model");

const server = express();

server.use(express.urlencoded({ extended: true }));

server.use(express.static("public"));

server.use(cookieParser());

const connectionString = "mongodb://localhost:27017/claies";
mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to MongoDB Server: " + connectionString))
  .catch((error) => console.error("MongoDB connection error:", error.message));

// Session Configuration with Persistent Store
server.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: connectionString, 
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

server.use(flash());

server.use((req, res, next) => {
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  res.locals.infoMessage = req.flash("info");
  next();
});

server.use(siteMiddleware);

server.set("view engine", "ejs");
server.use(expressEjsLayouts);

// Routes

// Home Route
server.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    const categories = await Category.find();
    res.render("homepage", {
      products,
      categories,
      query: "",
      pageTitle: "Homepage",
      selectedCategory: "",
      selectedPriceRange: "",
      sort: "",
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to load homepage. Please try again later.");
    res.redirect("/");
  }
});

// Admin Dashboard Route
server.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.render("admin/dashboard", {
    layout: "adminlayout",
    pageTitle: "Admin Dashboard",
  });
});

// Login Routes
server.get("/login", (req, res) => {
  res.render("auth/login", { pageTitle: "Login" });
});

server.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    req.session.user = user;
    req.flash("success", "Welcome back, " + user.name + "!");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/login");
  }
});

// Register Routes
server.get("/register", (req, res) => {
  res.render("auth/register", { pageTitle: "Register" });
});

server.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash("error", "Email already exists. Please try another.");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: ["user"],
    });

    await user.save();
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred during registration. Please try again.");
    res.redirect("/register");
  }
});

// Logout Route
server.get("/logout", (req, res) => {
  if (!req.session) {
    req.flash("error", "Session not found.");
    return res.redirect("/");
  }

  //flash message before destroying the session
  req.flash("success", "You have logged out successfully.");

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      req.flash("error", "Could not log out. Please try again.");
      return res.redirect("/");
    }

    res.clearCookie("connect.sid"); 
    res.redirect("/");
  });
});

//view orders route
server.get("/admin/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.product");
    res.render("admin/orders/orders", {
      orders,
      pageTitle: "New Orders"
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while retrieving orders.");
    res.redirect("/admin");
  }
});

//cart route
server.get("/cart", async (req, res) => {
  try {
    let cart = req.cookies.cart || []; 
    
    if (cart.length === 0) {
      return res.render("cart", { 
        products: [], 
        message: "Your cart is empty", 
        totalBill: 0, 
        pageTitle: "Shopping Cart"
      });
    }

    const products = await Product.find({ _id: { $in: cart } });
    
    const totalBill = products.reduce((total, product) => total + product.price, 0);

    return res.render("cart", {
      products,
      message: "Products in Cart",
      totalBill,
      pageTitle: "Shopping Cart"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

server.get("/add-to-cart/:id", (req, res) => {
  try {
    let cart = req.session.cart || []; 
    if (!cart.includes(req.params.id)) {
      cart.push(req.params.id);
    }
    req.session.cart = cart;
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//checkout route
server.get("/admin/orders/checkoutpage", async (req, res) => {
  try {
    let cart = req.cookies.cart || [];
    if (cart.length === 0) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/cart");
    }

    const productsInCart = await Product.find({ '_id': { $in: cart } });
    const totalBill = productsInCart.reduce((total, item) => total + item.price, 0);

    res.render("admin/orders/checkoutpage", {
      products: productsInCart,
      totalBill,
      pageTitle: "Checkout"
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred during checkout.");
    res.redirect("/cart");
  }
});

server.post('/admin/orders/checkoutpage', async (req, res) => {
  const { name, address, phone, totalPrice } = req.body;

  if (!name || !address || !phone || !totalPrice) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }

  const newOrder = new Order({
    name,
    address,
    phone,
    products: req.session.cart,
    totalPrice
  });

  try {
    await newOrder.save();
    req.session.cart = [];
    res.status(200).json({ success: true, message: 'Your order has been confirmed!' });
  } catch (err) {
    console.error('Error processing the order:', err);
    res.status(500).json({ success: false, message: 'Error processing the order. Please try again.' });
  }
});

// Admin Product and Category Routes
const adminProductsRouter = require("./routes/admin/products.controller");
const adminCategoriesRouter = require("./routes/admin/categories.controller");
server.use(adminProductsRouter);
server.use(adminCategoriesRouter);

const port = 5000;
server.listen(port, () => {
  console.log("Server started at http://localhost:" + port);
});
