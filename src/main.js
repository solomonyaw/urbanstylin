/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Import styling
import './index.css';

// Global state and constants
let savedBookings = [];
let activeImageIdx = null;

const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    imageUrl: '/src/assets/images/gallery_haircut_1784135597804.jpg',
    title: 'The Taper Fade',
    description: 'Precision fades and razor edge detailing for an urban look.'
  },
  {
    id: 'gal-2',
    imageUrl: '/src/assets/images/gallery_beard_sculpt_1784135613717.jpg',
    title: 'Beard Sculpt & Shave',
    description: 'Traditional hot towel straight razor shaves and full line-ups.'
  },
  {
    id: 'gal-3',
    imageUrl: '/src/assets/images/gallery_kids_cut_1784135631487.jpg',
    title: "Gentle Kid's Cuts",
    description: 'Patient and careful styling to make sure children feel comfortable.'
  }
];

const SERVICES = [
  { id: 'modern-scissor', name: 'Modern Scissor Cut', price: 60 },
  { id: 'taper-fade', name: 'Taper Fade', price: 50 },
  { id: 'razor-edge-up', name: 'Razor Edge-Up', price: 25 },
  { id: 'beard-sculpt-shape', name: 'Beard Sculpt & Shape', price: 40 },
  { id: 'full-grooming', name: 'Full Grooming Session', price: 100 },
  { id: 'kids-cut', name: "Kid's Cut", price: 35 },
  { id: 'classic-fade', name: 'Classic Fade', price: 45 },
  { id: 'gentlemans-trim', name: "Gentleman's Trim", price: 55 },
  { id: 'straight-razor', name: 'Straight Razor Shave', price: 45 },
  { id: 'beard-sculpt', name: 'Beard Sculpt', price: 30 },
  { id: 'buzz-cut', name: 'Buzz Cut', price: 30 },
  { id: 'hair-design', name: 'Hair Design & Shape', price: 40 }
];

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Load bookings from localStorage
  loadBookings();

  // Initialize event listeners
  setupMobileMenu();
  setupCategoryFilters();
  setupBookingForms();
  setupGalleryLightbox();
  checkBookingRedirect();
});

// Mobile menu toggle logic
function setupMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isExpanded = !mobileMenu.classList.contains('hidden');
      menuBtn.innerHTML = isExpanded 
        ? '<i data-lucide="x" class="w-6 h-6"></i>' 
        : '<i data-lucide="menu" class="w-6 h-6"></i>';
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });

    // Close menu when a link is clicked
    const links = mobileMenu.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    });
  }
}

// Service Filter list category logic
function setupCategoryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states from all buttons
      filterButtons.forEach(b => {
        b.classList.remove('bg-gold-500', 'text-obsidian-950', 'border-gold-500', 'font-bold');
        b.classList.add('bg-obsidian-950', 'text-obsidian-300', 'border-gold-900/40');
      });

      // Add active state to clicked button
      btn.classList.add('bg-gold-500', 'text-obsidian-950', 'border-gold-500', 'font-bold');
      btn.classList.remove('bg-obsidian-950', 'text-obsidian-300', 'border-gold-900/40');

      const category = btn.getAttribute('data-category');

      // Filter cards
      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// Setup service choice linkage
window.bookService = function(serviceId) {
  const serviceSelect = document.getElementById('serviceId');
  if (serviceSelect) {
    serviceSelect.value = serviceId;
  }
  // Smooth scroll
  const bookingSec = document.getElementById('booking');
  if (bookingSec) {
    bookingSec.scrollIntoView({ behavior: 'smooth' });
  }
};

// Booking system toggle & submission
function setupBookingForms() {
  const emailTab = document.getElementById('tab-email');
  const whatsappTab = document.getElementById('tab-whatsapp');
  const bookingForm = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-btn');

  if (emailTab && whatsappTab && bookingForm) {
    // Tab toggling
    emailTab.addEventListener('click', () => {
      emailTab.classList.add('bg-gold-500', 'text-obsidian-950', 'font-bold');
      emailTab.classList.remove('text-obsidian-400');
      whatsappTab.classList.remove('bg-green-500', 'text-white', 'font-bold');
      whatsappTab.classList.add('text-obsidian-400');

      bookingForm.removeAttribute('action');
      bookingForm.removeAttribute('method');
      bookingForm.action = 'https://formsubmit.co/urbanstylinprince@gmail.com';
      bookingForm.method = 'POST';

      submitBtn.className = 'w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-sans text-base font-bold uppercase tracking-wider shadow-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 shadow-gold-500/10 hover:scale-[1.01] transition-all duration-300';
      submitBtn.querySelector('span').innerText = 'Send Booking to Email';
    });

    whatsappTab.addEventListener('click', () => {
      whatsappTab.classList.add('bg-green-500', 'text-white', 'font-bold');
      whatsappTab.classList.remove('text-obsidian-400');
      emailTab.classList.remove('bg-gold-500', 'text-obsidian-950', 'font-bold');
      emailTab.classList.add('text-obsidian-400');

      bookingForm.removeAttribute('action');
      bookingForm.removeAttribute('method');

      submitBtn.className = 'w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-sans text-base font-bold uppercase tracking-wider shadow-lg bg-green-500 hover:bg-green-400 text-white shadow-green-500/10 hover:scale-[1.01] transition-all duration-300';
      submitBtn.querySelector('span').innerText = 'Open WhatsApp & Book';
    });

    // Form submit listener
    bookingForm.addEventListener('submit', (e) => {
      const isWhatsapp = whatsappTab.classList.contains('bg-green-500');

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const serviceId = document.getElementById('serviceId').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const notes = document.getElementById('notes').value;

      const service = SERVICES.find(s => s.id === serviceId) || { name: 'Grooming Service', price: 0 };

      // Save locally
      const newBooking = {
        id: 'book_' + Date.now(),
        name,
        email: email || (isWhatsapp ? 'WhatsApp Booking' : 'Not Specified'),
        phone,
        serviceName: service.name,
        servicePrice: service.price,
        date,
        time,
        notes,
        submittedAt: new Date().toLocaleString()
      };

      savedBookings.unshift(newBooking);
      localStorage.setItem('uh_bookings', JSON.stringify(savedBookings));
      renderBookings();

      if (isWhatsapp) {
        e.preventDefault();
        
        // Open WhatsApp link
        const textMessage = `Hi Prince! I'd like to book a grooming session at UH Urban Hairstylin.
- Name: ${name}
- Service: ${service.name} (GH₵ ${service.price})
- Date: ${date}
- Time: ${time}
- Notes: ${notes || 'None'}`;

        const encodedText = encodeURIComponent(textMessage);
        const whatsappUrl = `https://wa.me/233256016767?text=${encodedText}`;

        submitBtn.querySelector('span').innerText = 'Formatting booking...';
        setTimeout(() => {
          submitBtn.querySelector('span').innerText = 'Open WhatsApp & Book';
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
          showSuccessState();
        }, 800);
      } else {
        // Email mode, standard FormSubmit submit will execute because we do not call preventDefault().
        // We set target to self and it will redirect back with ?booking_success=true.
      }
    });
  }
}

function showSuccessState() {
  const formContent = document.getElementById('form-fields-container');
  const successContent = document.getElementById('form-success-container');

  if (formContent && successContent) {
    formContent.classList.add('hidden');
    successContent.classList.remove('hidden');
  }
}

window.resetBookingForm = function() {
  const formContent = document.getElementById('form-fields-container');
  const successContent = document.getElementById('form-success-container');
  const bookingForm = document.getElementById('booking-form');

  if (formContent && successContent && bookingForm) {
    bookingForm.reset();
    formContent.classList.remove('hidden');
    successContent.classList.add('hidden');
  }
};

function checkBookingRedirect() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('booking_success') === 'true') {
    showSuccessState();
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// Local reservation logger
function loadBookings() {
  const local = localStorage.getItem('uh_bookings');
  if (local) {
    try {
      savedBookings = JSON.parse(local);
    } catch (e) {
      console.error('Error reading bookings', e);
    }
  }
  renderBookings();
}

function renderBookings() {
  const container = document.getElementById('reservations-log-container');
  const clearBtn = document.getElementById('clear-reservations-btn');

  if (!container) return;

  if (savedBookings.length === 0) {
    container.innerHTML = `
      <div class="py-6 text-center text-obsidian-500 text-xs font-mono space-y-1">
        <p>No local reservations tracked in this browser session.</p>
        <p class="text-[10px] text-obsidian-600">Submit a form above to track appointments.</p>
      </div>
    `;
    if (clearBtn) clearBtn.classList.add('hidden');
  } else {
    if (clearBtn) clearBtn.classList.remove('hidden');
    container.innerHTML = savedBookings.map(b => `
      <div class="p-3.5 rounded-xl bg-obsidian-950 border border-gold-900/10 flex flex-col space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-sans font-bold text-white truncate max-w-[150px]">${escapeHTML(b.name)}</span>
          <span class="font-mono text-[9px] text-gold-500 px-1.5 py-0.5 rounded border border-gold-900/30 bg-gold-950/10">
            ${escapeHTML(b.serviceName)}
          </span>
        </div>
        
        <div class="flex items-center justify-between text-obsidian-400 text-[11px] font-sans border-t border-obsidian-900 pt-2">
          <span class="flex items-center">
            <i data-lucide="calendar" class="w-3 h-3 mr-1 text-gold-500"></i>
            ${escapeHTML(b.date)}
          </span>
          <span class="flex items-center">
            <i data-lucide="clock" class="w-3 h-3 mr-1 text-gold-500"></i>
            ${escapeHTML(b.time)}
          </span>
        </div>

        ${b.notes ? `
          <p class="text-[10px] text-obsidian-500 italic font-sans truncate max-w-full">
            "${escapeHTML(b.notes)}"
          </p>
        ` : ''}
      </div>
    `).join('');

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

window.clearReservations = function() {
  localStorage.removeItem('uh_bookings');
  savedBookings = [];
  renderBookings();
};

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Lightbox controller for image gallery
function setupGalleryLightbox() {
  const cards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox) return;

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      activeImageIdx = idx;
      openLightbox();
    });
  });

  function openLightbox() {
    if (activeImageIdx === null) return;
    const item = GALLERY_ITEMS[activeImageIdx];
    lightboxImg.src = item.imageUrl;
    lightboxTitle.innerText = item.title;
    lightboxDesc.innerText = item.description;
    lightbox.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    activeImageIdx = null;
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeImageIdx = activeImageIdx === 0 ? GALLERY_ITEMS.length - 1 : activeImageIdx - 1;
      openLightbox();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeImageIdx = activeImageIdx === GALLERY_ITEMS.length - 1 ? 0 : activeImageIdx + 1;
      openLightbox();
    });
  }

  // Escape key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}
