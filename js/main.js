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

        if (mainNav && mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          menuBtn?.setAttribute('aria-expanded', 'false');
          const icon = menuBtn?.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }

        const customSubject = this.getAttribute('data-subject');
        if (customSubject && inquirySelect) {
          const lower = customSubject.toLowerCase();
          if (lower.includes('donate') || lower.includes('support') || lower.includes('sponsor')) {
            inquirySelect.value = 'Support / Donate to a Campaign';
          } else if (lower.includes('volunteer') || lower.includes('mentor')) {
            inquirySelect.value = 'Volunteer or Mentor Inquiry';
          } else if (lower.includes('school') || lower.includes('sensitisation') || lower.includes('invite')) {
            inquirySelect.value = 'School / Community Sensitisation Request';
          } else {
            inquirySelect.value = 'Partnership With BCRE';
          }

          if (messageTextarea) {
            messageTextarea.value = `Re: ${customSubject}\n\nHello BCRE Foundation Team,\nI would like to connect regarding `;
          }
        }

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. Active Navigation Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav ul a[href^="#"]');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 140;
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

  // 4. Campaign & Cause Cards Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const causeCards = document.querySelectorAll('.cause-card');

  if (filterBtns.length > 0 && causeCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        causeCards.forEach(card => {
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

  // 5. Contact Form Validation & Mailto Routing
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
        formFeedback.textContent = 'Please check the privacy and child-safeguarding consent box before sending.';
        return;
      }

      const mailtoBody = encodeURIComponent(
        `Name / Organisation: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nCategory: ${subject}\n\nMessage:\n${message}`
      );
      const mailtoSubject = encodeURIComponent(`[BCRE Website] ${subject} — ${name}`);
      const mailtoLink = `mailto:Bintachildrightempowerment@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      formFeedback.className = 'form-feedback success';
      formFeedback.innerHTML = `Thank you, <strong>${name}</strong>! Opening your email client to send directly to <strong>Bintachildrightempowerment@gmail.com</strong>...`;

      window.location.href = mailtoLink;
    });
  }
});
