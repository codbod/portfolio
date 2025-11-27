// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY = '7QxODAogmn_zuLXKG';
const EMAILJS_SERVICE_ID = 'service_9nf749f';
const EMAILJS_TEMPLATE_ID = 'template_ocpt1ib';

// Initialize EmailJS
try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
} catch (error) {
    console.error('Failed to initialize EmailJS:', error);
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const phoneInput = document.getElementById("phone");
    const confirmationDiv = document.getElementById("confirmation");

    // Auto-format phone number as XXX-XXX-XXXX while typing
    phoneInput.addEventListener("input", function (e) {
        let numbers = e.target.value.replace(/\D/g, '');
        if (numbers.length > 3 && numbers.length <= 6) {
            numbers = numbers.slice(0,3) + '-' + numbers.slice(3);
        } else if (numbers.length > 6) {
            numbers = numbers.slice(0,3) + '-' + numbers.slice(3,6) + '-' + numbers.slice(6,10);
        }
        e.target.value = numbers;
    });

    // Show message in the confirmation div
    function showMessage(message, isError = false) {
        confirmationDiv.innerHTML = `
            <div class="${isError ? 'error' : 'success'}-message">
                ${message}
            </div>
        `;
        confirmationDiv.style.display = 'block';
        
        // Scroll to the message
        confirmationDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide the message after 5 seconds
        setTimeout(() => {
            confirmationDiv.style.display = 'none';
        }, 5000);
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Get form values
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
            location: document.getElementById('location').value.trim(),
            socialMedia: document.getElementById('socialMedia').value.trim()
        };

        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
            showMessage('Please fill out all required fields!', true);
            return;
        }

        // Validate email format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(formData.email)) {
            showMessage('Please enter a valid email address!', true);
            return;
        }

        // Validate phone (if provided)
        if (formData.phone && !/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
            showMessage('Please enter a valid phone number (XXX-XXX-XXXX) or leave it empty!', true);
            return;
        }

        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';

            // Prepare email parameters for EmailJS
            const templateParams = {
                from_name: `${formData.firstName} ${formData.lastName}`,
                from_email: formData.email,
                phone: formData.phone || 'Not provided',
                subject: formData.subject,
                message: formData.message,
                location: formData.location || 'Not provided',
                social_media: formData.socialMedia || 'Not provided',
                date: new Date().toLocaleString()
            };

            // Send email using EmailJS
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            
            // Show success message and reset form
            showMessage('Message sent successfully! I\'ll get back to you soon.');
            form.reset();
            
        } catch (error) {
            console.error('Failed to send email:', error);
            showMessage('Failed to send message. Please try again later or contact me directly at cody.g.yeung@gmail.com', true);
        } finally {
            // Reset button state
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    });
});