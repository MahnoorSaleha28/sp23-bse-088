function addToCart() {
    const productId = document.getElementById('productModalLabel').dataset.productId;
    const name = document.getElementById('productModalLabel').innerText;
    const price = document.getElementById('productModalPrice').innerText;

    fetch('/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId,
            name,
            price,
            quantity: 1,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'success') {
                alert('Product added to cart!');
            } else {
                alert('Failed to add product to cart!');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while adding to cart.');
        });
}
