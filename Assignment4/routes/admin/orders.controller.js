const Order = require("./models/order.model");

server.get("/checkout", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user._id }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/cart");
    }

    const totalBill = cart.products.reduce((total, item) => total + item.quantity * item.price, 0);

    res.render("checkout", {
      cart,
      totalBill,
      pageTitle: "Checkout"
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred during checkout.");
    res.redirect("/cart");
  }
});

server.post("/checkout", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user._id }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/cart");
    }

    const totalBill = cart.products.reduce((total, item) => total + item.quantity * item.price, 0);

    const order = new Order({
      user: req.session.user._id,
      products: cart.products,
      totalBill,
      paymentMethod: "cash",  // Fixed to cash payment only
    });

    await order.save();
    await Cart.deleteOne({ user: req.session.user._id });

    req.flash("success", "Order placed successfully. We will process your order shortly.");
    res.redirect("/orders");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while placing your order.");
    res.redirect("/checkout");
  }
});

module.exports = router;