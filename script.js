document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent page reload
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Simple form validation
  if (name && email && message) {
    document.getElementById('formStatus').textContent = "Thank you for contacting us, we'll get back to you soon!";
    document.getElementById('contactForm').reset();
  } else {
    document.getElementById('formStatus').textContent = "Please fill out all fields.";
  }
});
