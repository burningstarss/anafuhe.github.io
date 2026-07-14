// ***********PROPUESTA ANTERIOR, PERO NO FUNCIONA BIEN EL MENÚ BURGUER DESPLEGABLE**************
//*********************************************************************************************** */

// document.addEventListener('DOMContentLoaded', function () {
//   const burger = document.getElementById('burger');
//   const navLinks = document.getElementById('navLinks');

//   if (burger && navLinks) {
//     burger.addEventListener('click', function () {
//       navLinks.classList.toggle('open');
//     });
//   }

//   // On mobile, tapping "Servicios" opens/closes the submenu instead of navigating
//   document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
//     link.addEventListener('click', function (e) {
//       if (window.innerWidth <= 860) {
//         e.preventDefault();
//         this.parentElement.classList.toggle('open');
//       }
//     });
//   });
// });




//*******************PROPUESTA 2*********************** */
//****************************************************** */
document.addEventListener('DOMContentLoaded', function () {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  const dropdownParents = document.querySelectorAll('.has-dropdown');

  function closeEverything() {
    if (navLinks) navLinks.classList.remove('open');
    if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    dropdownParents.forEach(function (li) { li.classList.remove('open'); });
  }

  // Hamburger button (mobile menu)
  if (burger && navLinks) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      if (!isOpen) {
        dropdownParents.forEach(function (li) { li.classList.remove('open'); });
      }
    });
  }

  // "Servicios" toggle: on mobile/tablet it opens/closes the submenu instead of navigating
  dropdownParents.forEach(function (li) {
    const link = li.querySelector(':scope > a');
    if (!link) return;

    // Mobile/tablet: tapping "Servicios" opens/closes the submenu instead of navigating
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        e.stopPropagation();
        const willOpen = !li.classList.contains('open');
        dropdownParents.forEach(function (other) { other.classList.remove('open'); });
        li.classList.toggle('open', willOpen);
      }
    });

    //********************NEW PART************************************************** */
    // Desktop: use real mouse-movement events (not CSS :hover) so a fresh page
    // that happens to load under the cursor doesn't pop the menu back open.
    li.addEventListener('mouseenter', function () {
      if (window.innerWidth <= 860) return;
      clearTimeout(closeTimer);
      dropdownParents.forEach(function (other) { other.classList.remove('open'); });
      li.classList.add('open');
    });
    li.addEventListener('mouseleave', function () {
      if (window.innerWidth <= 860) return;
      closeTimer = setTimeout(function () { li.classList.remove('open'); }, 120);
    });
    //********************end NEW PART************************************************** */
  });

  // Selecting an option inside the dropdown (e.g. "Terapias") closes everything
  document.querySelectorAll('.dropdown a').forEach(function (link) {
    link.addEventListener('click', closeEverything);
  });

  // Any other nav link (Inicio, El Curso, Contacto...) also closes the mobile menu
  document.querySelectorAll('.nav-links > li:not(.has-dropdown) > a').forEach(function (link) {
    link.addEventListener('click', closeEverything);
  });

  // Clicking anywhere outside the nav closes the mobile menu and the dropdown
  document.addEventListener('click', function (e) {
    const nav = document.querySelector('.nav');
    if (nav && !nav.contains(e.target)) {
      closeEverything();
    }
  });

  // Back to desktop size: make sure nothing stays stuck open
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeEverything();
  });

  // Logo: hidden at the top of the page, appears in the header once the
  // colored hero section scrolls out of view. Reverses when scrolling back up.
  const siteHeader = document.querySelector('header');
  const heroSection = document.querySelector('.home-hero, .page-hero');
  if (siteHeader && heroSection && 'IntersectionObserver' in window) {
    const headerHeight = siteHeader.offsetHeight || 72;
    const heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        siteHeader.classList.toggle('scrolled', !entry.isIntersecting);
      });
    }, { threshold: 0, rootMargin: '-' + headerHeight + 'px 0px 0px 0px' });
    heroObserver.observe(heroSection);
  }
});