/**
 * Coorg Blossom Holidays - Main Interactive Script
 * High Performance, Fast Loading, Direct WhatsApp & Call Integrations
 */

// Global Layout Component Loader (header.html and footer.html)
async function loadLayoutComponent(id, file, prefix) {
  const container = document.getElementById(id);
  if (!container) return;

  try {
    const res = await fetch(prefix + file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    container.innerHTML = html;

    // Adjust relative links if inside a subfolder
    if (prefix) {
      container.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:') && !href.startsWith('#') && !href.startsWith('javascript:')) {
          a.setAttribute('href', prefix + href);
        }
      });

      container.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
          img.setAttribute('src', prefix + src);
        }
      });
    }

    // Set active link for current page
    highlightActiveNav(container);
  } catch (err) {
    console.error(`Error loading ${file}:`, err);
  }
}

function highlightActiveNav(container) {
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
  const segments = currentPath.split('/').filter(Boolean);
  const currentFolder = segments[segments.length - 1] || '';

  // Clear existing active classes
  container.querySelectorAll('.nav-link, .mobile-nav-link, .nav-dropdown-item').forEach(link => link.classList.remove('active'));

  let matched = false;
  if (currentFolder && currentFolder !== 'coorgblossomholidays') {
    container.querySelectorAll('.nav-link, .mobile-nav-link, .nav-dropdown-item').forEach(link => {
      const href = (link.getAttribute('href') || '').replace(/\/index\.html$/, '').replace(/\/$/, '');
      const hrefSegments = href.split('/').filter(Boolean);
      const linkFolder = hrefSegments[hrefSegments.length - 1] || '';

      if (linkFolder === currentFolder) {
        link.classList.add('active');
        matched = true;
        // If dropdown item matches, also highlight parent dropdown link
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          const parentLink = parentDropdown.querySelector('.nav-link');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });
  }

  // If on home page or no match
  if (!matched || currentFolder === 'coorgblossomholidays' || currentFolder === '') {
    container.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      if (link.textContent.trim().toLowerCase() === 'home') {
        link.classList.add('active');
      }
    });
  }
}

function initMobileDrawer() {
  const navToggle = document.getElementById('nav-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');

  function openDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.add('open');
      drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.remove('open');
      drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load single header.html and footer.html if containers exist
  const scriptTag = document.querySelector('script[src*="main.js"]');
  const prefix = (scriptTag && scriptTag.getAttribute('src').startsWith('../')) ? '../' : '';

  await Promise.all([
    loadLayoutComponent('site-header', 'header.html', prefix),
    loadLayoutComponent('site-footer', 'footer.html', prefix)
  ]);

  initMobileDrawer();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const mobileDrawer = document.getElementById('mobile-drawer');
      const drawerOverlay = document.getElementById('drawer-overlay');
      if (mobileDrawer && drawerOverlay) {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // 2. Set min date for datepicker to today
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    if (!input.getAttribute('min')) {
      input.setAttribute('min', today);
    }
  });

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 4. WhatsApp Taxi Enquiry Form Handler
  const taxiForm = document.getElementById('taxi-booking-form');
  if (taxiForm) {
    taxiForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('taxi-name')?.value.trim() || 'Guest';
      const phone = document.getElementById('taxi-phone')?.value.trim() || '';
      const service = document.getElementById('taxi-service')?.value || 'Coorg Sightseeing Taxi';
      const pickup = document.getElementById('taxi-pickup')?.value.trim() || 'Madikeri';
      const date = document.getElementById('taxi-date')?.value || 'Flexible';
      const vehicle = document.getElementById('taxi-vehicle')?.value || 'Any';

      if (!name || !phone) {
        alert('Please provide your name and phone number to send WhatsApp enquiry.');
        return;
      }

      // Format WhatsApp message
      const text = `*New Taxi Enquiry - Coorg Blossom Holidays*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Contact:* ${phone}\n` +
        `🚖 *Service:* ${service}\n` +
        `📍 *Pickup:* ${pickup}\n` +
        `📅 *Travel Date:* ${date}\n` +
        `🚗 *Vehicle Preference:* ${vehicle}\n\n` +
        `Please provide availability and best quote. Thank you!`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/918792711557?text=${encodedText}`;

      // Conversion tracking placeholder if gtag is present
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'taxi_form',
          event_label: service
        });
      }

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
    });
  }

  // 4b. Railway Station Pickup Form Handler
  const railwayForm = document.getElementById('railway-booking-form');
  if (railwayForm) {
    railwayForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rail-name')?.value.trim() || 'Guest';
      const phone = document.getElementById('rail-phone')?.value.trim() || '';
      const station = document.getElementById('rail-station')?.value || 'Mysore Railway Station (MYS)';
      const train = document.getElementById('rail-train')?.value.trim() || 'Not specified';
      const date = document.getElementById('rail-date')?.value || 'Flexible';
      const time = document.getElementById('rail-time')?.value.trim() || 'Flexible';
      const drop = document.getElementById('rail-drop')?.value.trim() || 'Madikeri / Homestay';
      const vehicle = document.getElementById('rail-vehicle')?.value || 'Sedan (Dzire / Etios)';

      if (!name || !phone) {
        alert('Please provide your name and contact number.');
        return;
      }

      const text = `*New Railway Station Pickup Enquiry - Coorg Blossom Holidays*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Contact:* ${phone}\n` +
        `🚆 *Station:* ${station}\n` +
        `🚂 *Train Details:* ${train}\n` +
        `📅 *Arrival Date:* ${date}\n` +
        `⏰ *Arrival Time:* ${time}\n` +
        `📍 *Drop Destination:* ${drop}\n` +
        `🚗 *Preferred Vehicle:* ${vehicle}\n\n` +
        `Please provide availability and best quote. Thank you!`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/918792711557?text=${encodedText}`;

      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'railway_form',
          event_label: station
        });
      }

      window.open(whatsappUrl, '_blank');
    });
  }

  // 5. Homestay Booking Form Handler (if on homestay page)
  const homestayForm = document.getElementById('homestay-booking-form');
  if (homestayForm) {
    homestayForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('stay-name')?.value.trim() || 'Guest';
      const phone = document.getElementById('stay-phone')?.value.trim() || '';
      const checkin = document.getElementById('stay-checkin')?.value || 'Flexible';
      const checkout = document.getElementById('stay-checkout')?.value || 'Flexible';
      const guests = document.getElementById('stay-guests')?.value || '2 Adults';
      const type = document.getElementById('stay-type')?.value || 'Estate Bungalow / Cottage';
      const pickup = document.getElementById('stay-pickup')?.value || '';

      if (!name || !phone) {
        alert('Please provide your name and phone number.');
        return;
      }

      let text = `*New Homestay Enquiry - Coorg Blossom Holidays*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Contact:* ${phone}\n` +
        `🏡 *Stay Type:* ${type}\n` +
        `📅 *Check-in:* ${checkin}\n` +
        `📅 *Check-out:* ${checkout}\n` +
        `👥 *Guests:* ${guests}\n`;

      if (pickup && !pickup.includes('No cab needed')) {
        text += `🚆 *Transfer Requested:* ${pickup}\n`;
      }

      text += `\nPlease check availability and share photos & tariff. Thank you!`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/918792711557?text=${encodedText}`;

      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'homestay_form',
          event_label: type
        });
      }

      window.open(whatsappUrl, '_blank');
    });
  }

  // 6. Interactive Hero Banner Slider (Taxi & Homestay)
  const heroSlider = document.getElementById('hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    const tabBtns = document.querySelectorAll('.hero-tab-btn');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
      });

      tabBtns.forEach((tab, i) => {
        const isActive = i === currentSlide;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoPlay();
      });
    }

    tabBtns.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetIndex = parseInt(tab.getAttribute('data-slide'), 10);
        goToSlide(targetIndex);
        startAutoPlay();
      });
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
        goToSlide(targetIndex);
        startAutoPlay();
      });
    });

    // Pause autoPlay on hover
    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    heroSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) nextSlide();
        else prevSlide();
      }
      startAutoPlay();
    }, { passive: true });

    // Keyboard navigation
    heroSlider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoPlay();
      }
    });

    // Start auto-play on load
    startAutoPlay();
  }

  // 7. Google Ads & Analytics Conversion Tracking (Phone Calls & WhatsApp Clicks)
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'contact',
          event_label: 'phone_call'
        });
        gtag('event', 'click_to_call', {
          phone_number: '+919353594057'
        });
      }
    });
  });

  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'contact',
          event_label: 'whatsapp_enquiry'
        });
        gtag('event', 'click_to_whatsapp', {
          destination: '8792711557'
        });
      }
    });
  });
});


