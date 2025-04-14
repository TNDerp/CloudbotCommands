document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.command-item').forEach(item => {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = item.dataset.instructions || 'No instructions provided yet';
    item.appendChild(tooltip);
    item.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    });
    item.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
    });
  });

  // Carousel functionality
  const carouselContainer = document.querySelector('.carousel-container');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-controls .prev');
  const nextBtn = document.querySelector('.carousel-controls .next');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateCarousel() {
    carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

  // Auto-slide every 20 seconds
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }, 20000);

  // Toggle "More Info" sections
  const toggleButtons = document.querySelectorAll('.toggle-more');
  toggleButtons.forEach(button => {
    const targetSelector = button.getAttribute('data-target');
    const target = document.querySelector(targetSelector);

    button.addEventListener('click', () => {
      if (!target) return;
      // Toggle display
      if (target.style.display === 'block') {
        target.style.display = 'none';
        button.textContent = button.textContent.includes('Hide')
          ? button.textContent.replace('Hide', 'Show')
          : 'More Info';
      } else {
        target.style.display = 'block';
        // Switch button text if you want a "Hide" toggle
        if (button.textContent.includes('More') || button.textContent.includes('Show')) {
          button.textContent = button.textContent.replace('More', 'Hide').replace('Show', 'Hide');
        }
      }
    });
  });
});




