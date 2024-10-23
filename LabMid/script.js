function loadDescription(event, fileName) {
    fetch(fileName)
        .then(response => response.text())
        .then(data => {
            const descriptionDiv = event.target.nextElementSibling;
            descriptionDiv.innerHTML = data;
            descriptionDiv.style.display = 'block'; // Show the description
        })
        .catch(error => console.error('Error loading description:', error));
}
