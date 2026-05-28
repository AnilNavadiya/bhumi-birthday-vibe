
// Disable right-click context menu
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Block common DevTools & view-source shortcuts
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12') e.preventDefault();
    
    // Ctrl+Shift+I/J/C (Windows/Linux) or Cmd+Option+I/J/C (Mac)
    if ((e.ctrlKey && e.shiftKey) || (e.metaKey && e.altKey)) {
      if (['I', 'J', 'C'].includes(e.key.toUpperCase())) e.preventDefault();
    }
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key.toUpperCase() === 'U') e.preventDefault();
  });

  // Disable text selection (optional)
  document.addEventListener('selectstart', e => e.preventDefault());
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';

// ==================== LOADER & BALLOONS ====================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    createBalloons();
  }, 1500);
});

function createBalloons() {
  const container = document.getElementById('balloons');
  const colors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#e91e63'];
  for (let i = 0; i < 8; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = Math.random() * 100 + '%';
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.animationDuration = (12 + Math.random() * 15) + 's';
    balloon.style.animationDelay = Math.random() * 10 + 's';
    balloon.style.height = (40 + Math.random() * 20) + 'px';
    container.appendChild(balloon);
  }
}

// ==================== HYBRID ANIMATION ENGINE ====================
let scrollObserver;
let emojiInterval;

function triggerAutoAnimations(pageId) {
  const page = document.getElementById(pageId);
  if (!page) return;
  
  const elements = page.querySelectorAll('.auto-animate');
  elements.forEach((el, index) => {
    el.classList.remove('visible');
    let delay = 200 + (index * 180);
    const delayMatch = el.className.match(/delay-(\d+)/);
    if (delayMatch) delay += parseInt(delayMatch[1]) * 100;
    setTimeout(() => el.classList.add('visible'), delay);
  });
}

function initScrollAnimations() {
  if (scrollObserver) scrollObserver.disconnect();
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-animate:not(.visible)').forEach(el => {
    scrollObserver.observe(el);
  });
}

// ==================== EMOJI PARTICLE SYSTEM ====================
function startEmojiSystem(pageId) {
  clearInterval(emojiInterval);
  document.querySelectorAll('.emoji-particle').forEach(e => e.remove());

  const emojis = ['🎉', '', '💖', '✨', '🌟', '🎂', '', '🎁', '🥳', '', '🧸', '', '🦋', ''];
  const page = document.getElementById(pageId);

  emojiInterval = setInterval(() => {
    if (!page.classList.contains('active')) {
      clearInterval(emojiInterval);
      return;
    }
    if (document.querySelectorAll('.emoji-particle').length > 20) return;

    const emoji = document.createElement('div');
    emoji.className = 'emoji-particle';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const fromTop = Math.random() > 0.5;
    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random() - 0.5) * 120;
    const rot = (Math.random() - 0.5) * 400;
    const duration = 4 + Math.random() * 5;
    const fontSize = 16 + Math.random() * 22;

    emoji.style.left = startX + 'px';
    emoji.style.fontSize = fontSize + 'px';
    emoji.style.setProperty('--drift', drift + 'px');
    emoji.style.setProperty('--rot', rot + 'deg');
    emoji.style.setProperty('--end-y', fromTop ? '110vh' : '-110px');
    emoji.style.top = fromTop ? '-60px' : '100vh';
    emoji.style.animationDuration = duration + 's';

    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), duration * 1000);
  }, 500);
}

// ==================== PAGE NAVIGATION ====================
function goToPage(pageId) {
  const activePage = document.querySelector('.page.active');
  if (activePage) activePage.classList.remove('active');
  
  setTimeout(() => {
    const newPage = document.getElementById(pageId);
    newPage.classList.add('active');
    newPage.scrollTop = 0;
    
    setTimeout(() => {
      triggerAutoAnimations(pageId);
      initScrollAnimations();
      startEmojiSystem(pageId);
    }, 250);
    
    if (pageId === 'page-flower') {
      setTimeout(() => initCarousel(), 400);
    }
  }, 400);
}

// ==================== ENVELOPE ====================
let envelopeOpened = false;
function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  document.getElementById('envelope').classList.add('opened');
  setTimeout(() => goToPage('page-greeting'), 1000);
}

// ==================== FRIEND LETTERS ====================
const lettersOpened = { 1: false, 2: false, 3: false };

function openFriendLetter(friendNum) {
  if (lettersOpened[friendNum]) return;
  lettersOpened[friendNum] = true;

  const miniEnv = document.getElementById('miniEnv' + friendNum);
  miniEnv.classList.add('opened');

  setTimeout(() => {
    document.getElementById('friend' + friendNum + '-envelope').style.display = 'none';
    const letterContent = document.getElementById('friend' + friendNum + '-letter');
    letterContent.classList.add('show');
    
    letterContent.querySelectorAll('p').forEach((p, i) => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(15px)';
      p.style.transition = `all 0.5s ease ${i * 0.2}s`;
      setTimeout(() => {
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, 100);
    });
    
    const sign = letterContent.querySelector('.friend-letter-sign');
    if (sign) {
      sign.style.opacity = '0';
      sign.style.transform = 'translateX(20px)';
      sign.style.transition = 'all 0.6s ease 0.8s';
      setTimeout(() => {
        sign.style.opacity = '1';
        sign.style.transform = 'translateX(0)';
      }, 100);
    }
  }, 700);
}

// ==================== CAROUSEL ====================
let currentSlide = 0;
const totalSlides = 4;

function initCarousel() {
  const dotsContainer = document.getElementById('carouselDots');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
}

function moveCarousel(dir) {
  currentSlide = (currentSlide + dir + totalSlides) % totalSlides;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById('memoryTrack');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

setInterval(() => {
  if (document.getElementById('page-flower').classList.contains('active')) moveCarousel(1);
}, 5000);

// ==================== AUDIO MANAGEMENT ====================
const backgroundAudio = document.getElementById('birthdaySong');
const wishAudio = document.getElementById('birthdayWish');
let backgroundPlaying = false;
let wishPlaying = false;
let progressInterval;

// Initialize background music on first click
document.addEventListener('click', function initMusic() {
  if (!backgroundPlaying) {
    backgroundAudio.volume = 0.35;
    backgroundAudio.play()
      .then(() => {
        backgroundPlaying = true;
        console.log('Background music started');
      })
      .catch(e => {
        console.error('Background audio error:', e);
      });
  }
  document.removeEventListener('click', initMusic);
}, { once: true });

// Toggle wish audio with background music management
function toggleWishPlay() {
  const playBtn = document.getElementById('playBtn');
  const vinylRecord = document.getElementById('vinylRecord');
  const playIcon = document.getElementById('playIcon');
  const progress = document.getElementById('songProgress');
  
  if (wishAudio.paused) {
    // Pause background music if playing
    if (backgroundPlaying) {
      backgroundAudio.pause();
      backgroundPlaying = false;
    }
    
    // Play wish audio
    wishAudio.volume = 0.35;
    wishAudio.play()
      .then(() => {
        wishPlaying = true;
        console.log('Birthday wish started');
        // Update UI
        playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
        vinylRecord.classList.add('playing');
        progressInterval = setInterval(() => {
          progress.style.width = ((wishAudio.currentTime / wishAudio.duration) * 100) + '%';
        }, 500);
      })
      .catch(e => {
        console.error('Wish audio error:', e);
      });
  } else {
    // Pause wish audio
    wishAudio.pause();
    wishPlaying = false;
    console.log('Birthday wish paused');
    clearInterval(progressInterval);
    
    // Restart background music if it was paused
    if (!backgroundPlaying) {
      backgroundAudio.play()
        .then(() => {
          backgroundPlaying = true;
          console.log('Background music restarted');
        })
        .catch(e => {
          console.error('Background audio restart error:', e);
        });
    }
    
    // Update UI
    playIcon.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
    vinylRecord.classList.remove('playing');
  }
}

// Handle wish end event
wishAudio.addEventListener('ended', function() {
  if (!wishPlaying) return;
  
  // Restart background music when wish ends
  if (!backgroundPlaying) {
    backgroundAudio.play()
      .then(() => {
        backgroundPlaying = true;
        console.log('Background music restarted after wish ended');
      })
      .catch(e => {
        console.error('Background audio restart error:', e);
      });
  }
  
  // Update UI
  document.getElementById('playBtn').innerHTML = 
    '<polygon points="5,3 19,12 5,21"/>';
  document.getElementById('vinylRecord').classList.remove('playing');
  wishPlaying = false;
});

// Initial setup for cake page music player
document.addEventListener('DOMContentLoaded', function() {
  // Set up play button for cake page
  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.onclick = toggleWishPlay;
    
    // Initialize UI state
    const playIcon = document.getElementById('playIcon');
    const vinylRecord = document.getElementById('vinylRecord');
    
    // Set initial play icon
    playIcon.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
    vinylRecord.classList.remove('playing');
    
    // Handle audio errors
    backgroundAudio.onerror = function(e) {
      console.error('Background audio error:', e);
    };
    
    wishAudio.onerror = function(e) {
      console.error('Wish audio error:', e);
    };
  }
});

// ==================== FLIP CARD ====================
function flipCard() {
  document.getElementById('flipCard').classList.toggle('flipped');
}

// ==================== PHOTO CLICK EFFECT ====================
document.querySelectorAll('.collage-photo, .mini-polaroid, .memory-photo-frame').forEach(photo => {
  photo.addEventListener('click', function() {
    this.style.transform = 'scale(1.15) rotate(0deg)';
    setTimeout(() => { this.style.transform = ''; }, 400);
  });
});

// ==================== INITIAL TRIGGERS ====================
setTimeout(() => {
  triggerAutoAnimations('page-greeting');
  initScrollAnimations();
}, 1600);