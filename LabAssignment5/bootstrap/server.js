const express = require("express");
var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));

let adminProductsRouter = require("./routes/admin/products.control");

server.use(adminProductsRouter);

server.get("/", (req, res) => {
  res.render("bootstrap");
});

server.get("/admin/products", (req, res) => {
    res.render("admin/products", {
        layout: "adminlayout",
        pageTitle: "Admin Dashboard"
    });
});

server.get("/admin/products/new", (req, res) => {
    res.render("admin/create", {
        layout: "adminlayout",
        pageTitle: "Add Product"
    });
});

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});


