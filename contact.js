document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const phoneInput = document.getElementById("phone");

    // Auto-format phone number as XXX-XXX-XXXX while typing
    phoneInput.addEventListener("input", function (e) {
        let numbers = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
        if (numbers.length > 3 && numbers.length <= 6) {
            numbers = numbers.slice(0,3) + '-' + numbers.slice(3);
        } else if (numbers.length > 6) {
            numbers = numbers.slice(0,3) + '-' + numbers.slice(3,6) + '-' + numbers.slice(6,10);
        }
        e.target.value = numbers;
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting until validation

        let isValid = true;
        let confirmationMessage = '';

        // Validate Required Fields
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Check if required fields are filled
        if (!firstName || !lastName || !email || !subject || !message) {
            isValid = false;
            confirmationMessage = "Please fill out all required fields!";
        }

        // Validate Email Format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.match(emailPattern)) {
            isValid = false;
            confirmationMessage = "Please enter a valid email address!";
        }

        // Validate Phone (optional)
        const phone = document.getElementById('phone').value;
        if (phone && !phone.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)) {
            isValid = false;
            confirmationMessage = "Please enter a valid phone number format (XXX-XXX-XXXX)!";
        }

        // If all is valid, show confirmation message
        if (isValid) {
            confirmationMessage = "Thank you for reaching out! Your message has been sent.";
            form.reset(); // Reset form fields
        }

        // Show the confirmation message
        document.getElementById("confirmation").innerText = confirmationMessage;
    });
});