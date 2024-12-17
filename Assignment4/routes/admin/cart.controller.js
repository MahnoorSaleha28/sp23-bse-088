// const Cart = require("./models/cart.model");
// const router = require("./products.controller");

// router.post("/cart/add", async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const product = await Product.findById(productId);

//     if (!product) {
//       req.flash("error", "Product not found.");
//       return res.redirect("/");
//     }

//     let cart = await Cart.findOne({ user: req.session.user._id });

//     if (!cart) {
//       cart = new Cart({
//         user: req.session.user._id,
//         products: [{ product: productId, quantity, price: product.price }]
//       });
//     } else {
//       const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
//       if (productIndex !== -1) {
//         cart.products[productIndex].quantity += quantity;
//       } else {
//         cart.products.push({ product: productId, quantity, price: product.price });
//       }
//     }

//     await cart.save();
//     req.flash("success", "Product added to cart!");
//     res.redirect("/cart");
//   } catch (err) {
//     console.error(err);
//     req.flash("error", "An error occurred while adding the product to your cart.");
//     res.redirect("/");
//   }
// });
  
// module.exports = router;
