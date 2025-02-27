document.addEventListener('DOMContentLoaded', () => {
    const commandItems = document.querySelectorAll('.command-item');

    commandItems.forEach(item => {
      // Create tooltip element
      const tooltip = document.createElement('span');
      tooltip.classList.add('tooltip');
      tooltip.textContent = item.getAttribute('data-instructions') || 'No instructions provided yet';

      // Append tooltip to the item
      item.appendChild(tooltip);

      // Show tooltip on hover
      item.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
      });

      // Hide tooltip when not hovering
      item.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
      });
    });
  });
