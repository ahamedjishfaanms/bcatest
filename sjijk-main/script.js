// Toggle Menu Functionality
const menuToggle = document.getElementById('mobile-menu');
const menuClose = document.getElementById('mobile-close');
const navList = document.getElementById('nav-list');

menuToggle.addEventListener('click', () => {
    navList.classList.toggle('show');
    menuToggle.classList.add('hidden');
    menuClose.classList.add('show');
});

menuClose.addEventListener('click', () => {
    navList.classList.remove('show');
    menuToggle.classList.remove('hidden');
    menuClose.classList.remove('show');
});

// Slideshow Functionality
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlides() {
    for (let i = 0; i < totalSlides; i++) {
        slides[i].style.display = 'none';
    }
    slideIndex++;
    if (slideIndex > totalSlides) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = 'block';
    setTimeout(showSlides, 3000); // Change slide every 3 seconds
}

function changeSlide(n) {
    slideIndex += n;
    if (slideIndex > totalSlides) {
        slideIndex = 1;
    } else if (slideIndex < 1) {
        slideIndex = totalSlides;
    }
    for (let i = 0; i < totalSlides; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'block';
}
if (slides && slides.length > 0) {
    showSlides();
}

const announcementMarquee = document.getElementById('announcementMarquee');

if (announcementMarquee) {
    announcementMarquee.addEventListener('mouseenter', () => {
        announcementMarquee.stop();  // Stop marquee on hover
    });

    announcementMarquee.addEventListener('mouseleave', () => {
        announcementMarquee.start();  // Resume marquee when hover ends
    });
}


// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');

function showNextTestimonial() {
    // Remove 'active' class from current testimonial
    testimonials[currentTestimonial].classList.remove('active');
    
    // Update currentTestimonial index to the next one
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    
    // Add 'active' class to the next testimonial
    testimonials[currentTestimonial].classList.add('active');
}

// Automatically change testimonials every 3 seconds
if (testimonials && testimonials.length > 0) {
    setInterval(showNextTestimonial, 3000);
}

let form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(event) {
        alert('Form submission through mail, We will get back to you soon.');
    });
}

// Preloader script
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});
