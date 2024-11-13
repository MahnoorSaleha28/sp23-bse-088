const express = require("express");
const { v4: uuid } = require('uuid');
let router = express.Router();


router.get("/admin/products", (req, res) => {
    let products = [
        {
          title: "Silver Stud Earrings",
          price: "Rs. 1500",
          description: "Elegant silver stud earrings for a classic look.",
          _id: uuid(),
        },
        {
          title: "Gold Chain Necklace",
          price: "Rs. 3500",
          description: "Simple and stylish gold chain necklace.",
          _id: uuid(),
        },
        {
          title: "Rose Gold Charm Bracelet",
          price: "Rs. 2000",
          description: "Delicate rose gold bracelet with assorted charms.",
          _id: uuid(),
        },
        {
          title: "Blue Crystal Pendant",
          price: "Rs. 1800",
          description: "Pendant necklace with a striking blue crystal.",
          _id: uuid(),
        },
        {
          title: "Colorful Beaded Anklet",
          price: "Rs. 1200",
          description: "Pretty anklet with colorful beads for a fun vibe.",
          _id: uuid(),
        }
      ];
  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});

module.exports = router;