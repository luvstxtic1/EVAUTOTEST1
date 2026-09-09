// EV AutoGlass — shared interactions
document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      var expanded = mobileNav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
      toggle.textContent = expanded ? '✕' : '☰';
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ZIP quote forms -> route to contact page with prefill
  document.querySelectorAll('.zip-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[name="zip"]');
      var zip = input ? input.value.trim() : '';
      var base = form.getAttribute('data-target') || 'contact.html';
      window.location.href = base + (zip ? ('?zip=' + encodeURIComponent(zip)) : '');
    });
  });

  // Contact form: submit to Formspree via fetch (no page reload), fallback to
  // normal form POST if JS fails or Formspree endpoint isn't configured yet.
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      var note = document.getElementById('contact-form-note');
      var action = contactForm.getAttribute('action') || '';

      // If the placeholder Formspree ID hasn't been replaced yet, don't
      // silently pretend it worked — tell whoever is testing the site.
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        e.preventDefault();
        if (note) {
          note.textContent = 'Form isn\'t connected yet — replace YOUR_FORM_ID in contact.html with your real Formspree form ID (or your own backend endpoint).';
          note.style.color = '#B23B3B';
        }
        return;
      }

      e.preventDefault();
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      if (note) { note.textContent = ''; }

      fetch(action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          if (note) {
            note.textContent = "Thanks — we've got your request. Someone from EV AutoGlass will call or text you shortly. For anything urgent, call (602) 980-3593 directly.";
            note.style.color = 'var(--green-700)';
          }
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      }).catch(function () {
        if (note) {
          note.textContent = "Something went wrong sending that. Please call us directly at (602) 980-3593 and we'll get you booked.";
          note.style.color = '#B23B3B';
        }
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      });
    });
  }

  // Prefill zip on contact page from query string
  if (window.location.pathname.indexOf('contact.html') !== -1) {
    var params = new URLSearchParams(window.location.search);
    var zipVal = params.get('zip');
    var zipField = document.getElementById('field-zip');
    if (zipVal && zipField) { zipField.value = zipVal; }
  }
});
