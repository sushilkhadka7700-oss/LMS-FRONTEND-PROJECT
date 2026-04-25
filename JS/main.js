
  //  Sticky Navbar on Scroll
  
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}


  //  Hamburger Menu Toggle
   
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}


  //  Active Nav Link Highlight
 
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});


  //  Course Search & Filter (courses.html)
   
const searchInput = document.getElementById('courseSearch');
const filterTags = document.querySelectorAll('.filter-tag');
const courseCards = document.querySelectorAll('.course-card[data-category]');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');

let activeCategory = 'all';
let searchQuery = '';

function filterCourses() {
  let visible = 0;

  courseCards.forEach(card => {
    const title = card.querySelector('.course-title').textContent.toLowerCase();
    const instructor = card.querySelector('.course-instructor').textContent.toLowerCase();
    const category = card.dataset.category;

    const matchSearch = title.includes(searchQuery) || instructor.includes(searchQuery);
    const matchCategory = activeCategory === 'all' || category === activeCategory;

    if (matchSearch && matchCategory) {
      card.style.display = '';
      card.style.animation = 'fadeIn 0.3s ease';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  if (resultsCount) {
    resultsCount.textContent = `Showing ${visible} course${visible !== 1 ? 's' : ''}`;
  }

  if (noResults) {
    noResults.classList.toggle('show', visible === 0);
  }
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterCourses();
  });
}

filterTags.forEach(tag => {
  tag.addEventListener('click', () => {
    filterTags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    activeCategory = tag.dataset.filter;
    filterCourses();
  });
});


  //  FAQ Accordion (contact.html)
   
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});


  //  Contact Form Validation (contact.html)
   
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const fields = {
    name: {
      el: document.getElementById('name'),
      err: document.getElementById('nameError'),
      validate: (v) => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.',
    },
    email: {
      el: document.getElementById('email'),
      err: document.getElementById('emailError'),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    },
    subject: {
      el: document.getElementById('subject'),
      err: document.getElementById('subjectError'),
      validate: (v) => v.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.',
    },
    message: {
      el: document.getElementById('message'),
      err: document.getElementById('messageError'),
      validate: (v) => v.trim().length >= 20 ? '' : 'Message must be at least 20 characters.',
    },
  };

  function showFieldState(key, errorMsg) {
    const { el, err } = fields[key];
    if (!el) return;

    el.classList.remove('error', 'success');
    err.classList.remove('show');

    if (errorMsg) {
      el.classList.add('error');
      err.textContent = errorMsg;
      err.classList.add('show');
    } else {
      el.classList.add('success');
    }
  }

  // Real-time validation on blur
  Object.keys(fields).forEach(key => {
    const { el, validate } = fields[key];
    if (!el) return;
    el.addEventListener('blur', () => {
      showFieldState(key, validate(el.value));
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        showFieldState(key, validate(el.value));
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(fields).forEach(key => {
      const { el, validate } = fields[key];
      if (!el) return;
      const err = validate(el.value);
      showFieldState(key, err);
      if (err) valid = false;
    });

    if (valid) {
      contactForm.style.display = 'none';
      const successMsg = document.getElementById('formSuccess');
      if (successMsg) successMsg.classList.add('show');
    }
  });
}


  //  Hero Progress Bar Animation
   
function animateProgressBars() {
  document.querySelectorAll('.progress-fill').forEach(bar => {
    const target = bar.dataset.width || '0';
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = target + '%';
    }, 300);
  });
}

// Observe hero section for scroll-triggered animation
const heroCard = document.querySelector('.hero-card');
if (heroCard && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProgressBars();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(heroCard);
} else {
  animateProgressBars();
}


  //  Billing Toggle (pricing.html)

const billingToggle = document.getElementById('billingToggle');
if (billingToggle) {
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  const proPrice = document.getElementById('proPrice');
  const proPeriod = document.getElementById('proPeriod');
  const enterprisePrice = document.getElementById('enterprisePrice');
  const enterprisePeriod = document.getElementById('enterprisePeriod');

  billingToggle.addEventListener('change', () => {
    if (billingToggle.checked) {
      proPrice.innerHTML = '<sup>$</sup>13';
      proPeriod.textContent = 'per month, billed annually';
      enterprisePrice.innerHTML = '<sup>$</sup>34';
      enterprisePeriod.textContent = 'per month, billed annually';
      monthlyLabel.classList.remove('active-label');
      annualLabel.classList.add('active-label');
    } else {
      proPrice.innerHTML = '<sup>$</sup>19';
      proPeriod.textContent = 'per month';
      enterprisePrice.innerHTML = '<sup>$</sup>49';
      enterprisePeriod.textContent = 'per month';
      monthlyLabel.classList.add('active-label');
      annualLabel.classList.remove('active-label');
    }
  });
}


  //  Enroll Button Modal (courses.html)

const modal = document.getElementById('enrollModal');
const modalTitle = document.getElementById('modalCourseTitle');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');

document.querySelectorAll('.enroll-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.course-card');
    const title = card ? card.querySelector('.course-title').textContent : 'this course';
    if (modal && modalTitle) {
      modalTitle.textContent = title;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeModal() {
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
