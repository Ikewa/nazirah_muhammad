document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const isActive = mainNav.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', String(isActive));
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isActive);
        icon.classList.toggle('fa-times', isActive);
      }
    });
  }

  // 2. Smooth Scrolling & Auto-Preselect Inquiry Topic on CTA clicks
  const inquirySelect = document.getElementById('inquiry-type');
  const messageTextarea = document.getElementById('message-body');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Close mobile menu if open
        if (mainNav && mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          menuBtn?.setAttribute('aria-expanded', 'false');
          const icon = menuBtn?.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }

        // Pre-populate contact form subject/message if data-subject is present
        const customSubject = this.getAttribute('data-subject');
        if (customSubject && inquirySelect) {
          // Match closest option or add a dynamic note in the message box
          if (customSubject.toLowerCase().includes('donate') || customSubject.toLowerCase().includes('support') || customSubject.toLowerCase().includes('sponsor')) {
            inquirySelect.value = 'Support / Donate to a Campaign';
          } else if (customSubject.toLowerCase().includes('volunteer') || customSubject.toLowerCase().includes('mentor')) {
            inquirySelect.value = 'Volunteer or Mentor Inquiry';
          } else if (customSubject.toLowerCase().includes('school') || customSubject.toLowerCase().includes('sensitisation')) {
            inquirySelect.value = 'School / Community Sensitisation Request';
          } else {
            inquirySelect.value = 'Partnership With BCRE';
          }

          if (messageTextarea && !messageTextarea.value.trim()) {
            messageTextarea.value = `Re: ${customSubject}\n\nHello BCRE Foundation Team,\nI would like to inquire about `;
          }
        }

        window.scrollTo({
          top: targetElement.offsetTop - 82,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. Active Navigation Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]:not(.btn)');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 130;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // 4. Founder Portrait Switcher (Inside About Us / Founder Spotlight)
  const founderActiveImg = document.getElementById('founder-active-img');
  const founderThumbs = document.querySelectorAll('.founder-thumb');

  if (founderActiveImg && founderThumbs.length > 0) {
    founderThumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const newSrc = thumb.getAttribute('data-img');
        if (!newSrc) return;
        founderThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        founderActiveImg.style.opacity = '0.35';
        setTimeout(() => {
          founderActiveImg.setAttribute('src', newSrc);
          founderActiveImg.style.opacity = '1';
        }, 140);
      });
    });
  }

  // 5. Programme & Campaign Status Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programmeCards = document.querySelectorAll('.programme-card');

  if (filterBtns.length > 0 && programmeCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        programmeCards.forEach(card => {
          const categories = (card.getAttribute('data-category') || '').split(' ');
          if (filter === 'all' || categories.includes(filter)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // 6. Contact Form Validation & Mailto Routing
  const contactForm = document.getElementById('bcre-contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('full-name')?.value.trim();
      const email = document.getElementById('email-address')?.value.trim();
      const phone = document.getElementById('phone-number')?.value.trim();
      const subject = document.getElementById('inquiry-type')?.value || 'BCRE Website Inquiry';
      const message = document.getElementById('message-body')?.value.trim();
      const consent = document.getElementById('privacy-consent')?.checked;

      if (!name || !email || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please complete all required fields (Name, Email, and Message).';
        return;
      }

      if (!consent) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please check the privacy and safeguarding consent box before sending.';
        return;
      }

      const mailtoBody = encodeURIComponent(
        `Name / Organisation: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nCategory: ${subject}\n\nMessage:\n${message}`
      );
      const mailtoSubject = encodeURIComponent(`[BCRE Website] ${subject} — ${name}`);
      const mailtoLink = `mailto:Bintachildrightempowerment@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      formFeedback.className = 'form-feedback success';
      formFeedback.innerHTML = `Thank you, <strong>${name}</strong>! Your inquiry is ready. Opening your email client to send directly to <strong>Bintachildrightempowerment@gmail.com</strong>...`;

      window.location.href = mailtoLink;
    });
  }
});
