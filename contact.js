// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY = 'H4771gcevWu5kIqdu';
const EMAILJS_SERVICE_ID = 'service_9nf749f';
const EMAILJS_TEMPLATE_ID = 'template_ocpt1ib'; // Main contact form template
const EMAILJS_AUTOREPLY_TEMPLATE_ID = 'template_autoreply'; // Auto-reply template

// Spam prevention settings
const MIN_WORD_COUNT = 10;
const SUBMISSION_COOLDOWN = 30000; // 30 seconds in milliseconds
let lastSubmissionTime = 0;

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
    const submitButton = form.querySelector('button[type="submit"]');

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

    // Handle form submission
    submitButton.addEventListener("click", async function (event) {
        event.preventDefault();
        
        // If the form is already being submitted, don't do anything
        if (submitButton.disabled) return;
        
        // Check cooldown period
        const currentTime = Date.now();
        if (currentTime - lastSubmissionTime < SUBMISSION_COOLDOWN) {
            const remainingTime = Math.ceil((SUBMISSION_COOLDOWN - (currentTime - lastSubmissionTime)) / 1000);
            showMessage(`Please wait ${remainingTime} seconds before submitting again.`, true);
            return;
        }

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
        
        // Validate minimum word count in message
        const wordCount = formData.message.trim().split(/\s+/).filter(word => word.length > 0).length;
        if (wordCount < MIN_WORD_COUNT) {
            showMessage(`Please write at least ${MIN_WORD_COUNT} words in your message. Current: ${wordCount} words.`, true);
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

            // Send main email to you
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            
            // Prepare auto-reply parameters
            const autoReplyParams = {
                to_email: formData.email,
                to_name: `${formData.firstName} ${formData.lastName}`.trim(),
                from_name: "Cody Yeung",
                subject: formData.subject,
                message: formData.message,
                date: new Date().toLocaleString()
            };

            // Send auto-reply to the sender
            try {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_AUTOREPLY_TEMPLATE_ID,
                    autoReplyParams
                );
                showMessage('Message sent successfully! A confirmation has been sent to your email.');
            } catch (autoReplyError) {
                console.error('Auto-reply failed to send:', autoReplyError);
                // Still show success for the main message even if auto-reply fails
                showMessage('Message sent successfully! (Note: Could not send confirmation email)');
            }
            
            // Update last submission time
            lastSubmissionTime = Date.now();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Failed to send email:', error);
            showMessage('Failed to send message. Please try again later or contact me directly at cody.g.yeung@gmail.com', true);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    });
});