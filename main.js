document.addEventListener('DOMContentLoaded', () => {
  // Tooltip functionality for command items
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


// Function to fetch and display 7TV emotes using the new GraphQL endpoint and updated schema
function loadSevenTvEmotes() {
  const userId = '01JMSRACAHM75E9497ZW05CC8B'; // Your 7TV user ID
  const apiEndpoint = 'https://7tv.io/v3/gql';
  const container = document.getElementById('seventv-more-info');

  // Clear any existing content
  container.innerHTML = '';

  // Updated GraphQL query using the 'files' field instead of 'urls'
  const query = `
    query GetUserEmotes($id: ID!) {
      user(id: $id) {
        id
        emote_sets {
          id
          emotes {
            id
            name
          }
        }
      }
    }
  `;
  const variables = { id: userId };

  fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        container.innerHTML = '<p>Failed to load emotes.</p>';
        return;
      }
      // 'emote_sets' is an array; collect all emotes
      const emoteSets = data.data.user.emote_sets;
      const allEmotes = [];
      emoteSets.forEach(set => {
        if (set.emotes && Array.isArray(set.emotes)) {
          allEmotes.push(...set.emotes);
        }
      });
      // Loop through each emote and create an image element
      allEmotes.forEach(emote => {
        let imageUrl = '';
        if (emote.files && emote.files.length > 0) {
          // Try to use the '4x' quality file if available, else use the first file
          const file4x = emote.files.find(file => file.quality === '4x');
          imageUrl = file4x ? file4x.url : emote.files[0].url;
        }
        const img = document.createElement('img');
        img.src = `https://cdn.7tv.app/emote/${emote.id}/4x.avif`; // Use the emote ID to form the URL
        img.alt = emote.name; // Set alt text to the emote name
        img.classList.add("emote-gif"); // Apply CSS class for styling
        container.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Error fetching 7TV emotes:', error);
      container.innerHTML = '<p>Failed to load emotes.</p>';
    });
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSevenTvEmotes();
});


function loadBttvEmotes() {
  const channelId = '1242263396'; // Replace with your Twitch channel ID
  const apiEndpoint = `https://api.betterttv.net/3/cached/users/twitch/${channelId}`;
  const container = document.getElementById('bttv-more-info');

  container.innerHTML = '';

  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      // BTTV returns two arrays: channelEmotes and sharedEmotes
      console.log(data)
      const channelEmotes = data.channelEmotes || [];
      const sharedEmotes = data.sharedEmotes || [];
      const allEmotes = [...channelEmotes, ...sharedEmotes];

      allEmotes.forEach(emote => {
        const img = document.createElement('img');
        // Construct URL using BTTV CDN – size options: 1x, 2x, 3x.
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


function loadFfzEmotes() {
  const channelName = 'tnderp'; // Replace with your FFZ channel name
  const apiEndpoint = `https://api.frankerfacez.com/v1/room/${channelName}`;
  const container = document.getElementById('ffz-more-info');

  container.innerHTML = '';

  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      // Collect all emotes from every set
      let allEmotes = [];
      const sets = data.sets || {};
      for (const set in sets) {
        if (sets.hasOwnProperty(set)) {
          allEmotes = allEmotes.concat(sets[set].emoticons);
        }
      }
      allEmotes.forEach(emote => {
        const img = document.createElement('img');
        // Each emote provides URLs at different sizes in the "urls" object.
        // Use the highest quality available (typically key "4" or fallback to "1")
        const sizeKey = emote.urls["4"] ? "4" : (emote.urls["2"] ? "2" : "1");
        // Construct the URL using FFZ CDN: https://cdn.frankerfacez.com/emote/{emoteID}/{size}
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

//Randomizer for emotes
document.addEventListener('DOMContentLoaded', () => {
  main();
});

async function fetch7TVGlobalEmotes() {
  try {
    const response = await fetch('https://7tv.io/v3/emote-sets/global');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.emotes;
  } catch (error) {
    console.error('Error fetching emotes:', error);
    return [];
  }
}

function getRandomEmote(emotes) {
  const randomIndex = Math.floor(Math.random() * emotes.length);
  return emotes[randomIndex];
}

async function main() {
  const emotes = await fetch7TVGlobalEmotes();
  if (emotes.length > 0) {
    const randomEmote = getRandomEmote(emotes);
    const emoteImageUrl = randomEmote.data.host.url + '/3x.webp';
    document.getElementById('randomEmote').src = emoteImageUrl;
  } else {
    console.log('No emotes found.');
  }
}

