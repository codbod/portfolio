// Form Validation and Confirmation Message
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");

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

    // Smooth Scrolling (for page navigation if needed)
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });
});
