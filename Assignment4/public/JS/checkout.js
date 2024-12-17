document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const fullName = document.getElementById('full-name').value;
    const deliveryAddress = document.getElementById('delivery-address').value;
    const phoneNumber = document.getElementById('contact-phone').value;
    const totalAmount = document.getElementById('order-total').value;

    if (!fullName || !deliveryAddress || !phoneNumber || !totalAmount) {
        alert("Please make sure all fields are filled in.");
        return;
    }

    const orderDetails = {
        name: fullName,
        address: deliveryAddress,
        phone: phoneNumber,
        totalPrice: totalAmount
    };

    fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails)
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.success) {
            alert(responseData.message);
            window.location.href = '/';
        } else {
            alert(responseData.message); 
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
        alert('There was an issue processing your order. Please try again.');
    });
});