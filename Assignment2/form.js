const form = document.getElementById("form");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");

form.addEventListener("submit", function(event){
    if(nameInput.value === ""){
        alert("Name must not be empty!");
        event.preventDefault();
    }
    else if(emailInput.value === ""){
        alert("Email must not be empty!");
        event.preventDefault();
    }
     else if(addressInput.value === ""){
        alert("Address must not be empty!");
        event.preventDefault();
    }
    else if(cityInput.value === ""){
        alert("Select a city");
        event.preventDefault();
    }
});


