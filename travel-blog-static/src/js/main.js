document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.header__toggle');
  const nav = document.querySelector('.header__nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }

  const navLinks = document.querySelectorAll('.header__link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('active');
    });
  });
});
