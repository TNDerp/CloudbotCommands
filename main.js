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




// 7TV Emotes
function loadSevenTvEmotes() {
  const emoteSetId = '01JMSSMTVR5HHDB0A526HVDTST';
  const apiEndpoint = `https://7tv.io/v3/emote-sets/${emoteSetId}`;
  const container = document.getElementById('seventv-more-info');
  container.innerHTML = '';

  fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(emoteData => {
      const emotes = emoteData.emotes || [];
      emotes.forEach(emote => {
        const img = document.createElement('img');
        img.src = `https://cdn.7tv.app/emote/${emote.id}/3x.webp`;
        img.alt = emote.name;
        img.classList.add("emote-gif");
        container.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Error fetching 7TV emote set:', error);
      container.innerHTML = '<p>Failed to load 7TV emotes.</p>';
    });
}

document.addEventListener('DOMContentLoaded', loadSevenTvEmotes);


// BTTV Emotes
function loadBttvEmotes() {
  const channelId = '1242263396';
  const apiEndpoint = `https://api.betterttv.net/3/cached/users/twitch/${channelId}`;
  const container = document.getElementById('bttv-more-info');
  container.innerHTML = '';

  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      const channelEmotes = data.channelEmotes || [];
      const sharedEmotes = data.sharedEmotes || [];
      const allEmotes = [...channelEmotes, ...sharedEmotes];
      allEmotes.forEach(emote => {
        const img = document.createElement('img');
        img.src = `https://cdn.betterttv.net/emote/${emote.id}/3x`;
        img.alt = emote.code;
        img.classList.add("emote-gif");
        container.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Error fetching BTTV emotes:', error);
      container.innerHTML = '<p>Failed to load BTTV emotes.</p>';
    });
}

document.addEventListener('DOMContentLoaded', loadBttvEmotes);

// FFZ Emotes
function loadFfzEmotes() {
  const channelName = 'tnderp';
  const apiEndpoint = `https://api.frankerfacez.com/v1/room/${channelName}`;
  const container = document.getElementById('ffz-more-info');
  container.innerHTML = '';

  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      let allEmotes = [];
      const sets = data.sets || {};
      for (const set in sets) {
        if (sets.hasOwnProperty(set)) {
          allEmotes = allEmotes.concat(sets[set].emoticons);
        }
      }
      allEmotes.forEach(emote => {
        const img = document.createElement('img');
        const sizeKey = (emote.urls && emote.urls["4"]) ? "4" : ((emote.urls && emote.urls["2"]) ? "2" : "1");
        img.src = `https://cdn.frankerfacez.com/emote/${emote.id}/${sizeKey}`;
        img.alt = emote.name;
        img.classList.add("emote-gif");
        container.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Error fetching FFZ emotes:', error);
      container.innerHTML = '<p>Failed to load FFZ emotes.</p>';
    });
}

document.addEventListener('DOMContentLoaded', loadFfzEmotes);



function getAllEmoteImages() {
  const containers = [
    document.getElementById('seventv-more-info'),
    document.getElementById('bttv-more-info'),
    document.getElementById('ffz-more-info')
  ];
  let images = [];
  containers.forEach(container => {
    if (container) {
      images.push(...container.querySelectorAll('img'));
    }
  });
  return images;
}

// Function: Randomly pick an emote image and update the carousel element.
function loadCarouselEmote() {
  const allEmoteImgs = getAllEmoteImages();
  if (allEmoteImgs.length > 0) {
    const randomIndex = Math.floor(Math.random() * allEmoteImgs.length);
    const randomEmoteImg = allEmoteImgs[randomIndex];
    
    const carouselElement = document.getElementById('randomEmote');
    if (carouselElement) {
      carouselElement.src = randomEmoteImg.src;
      carouselElement.alt = randomEmoteImg.alt;
    }
  } else {
    console.log('No emote images found for the carousel.');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const carouselElement = document.getElementById('randomEmote');
  if (carouselElement) {
    
    carouselElement.src = 'https://media1.tenor.com/m/jfmI0j5FcpAAAAAd/loading-wtf.gif';
    carouselElement.alt = 'Loading funny emote...';
  }
  
  setTimeout(loadCarouselEmote, 2000);
});

