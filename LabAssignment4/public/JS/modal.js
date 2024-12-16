document.addEventListener("DOMContentLoaded", () => {
  const productCards = document.querySelectorAll(".product-card");
  const modal = new bootstrap.Modal(document.getElementById("productModal"));

  productCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Get product data from the data-product attribute
      const product = JSON.parse(card.getAttribute("data-product"));

      // Populate modal with product details
      document.getElementById("productModalLabel").textContent = product.name;
      document.getElementById("productModalImage").src = product.image;
      document.getElementById("productModalDescription").textContent =
        product.description;
      document.getElementById("productModalPrice").textContent = product.price;

      modal.show();
    });
  });
});