function toggleMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  
  if (mobileMenu.classList.contains('active')) {
    mobileMenu.classList.remove('active');
    mobileMenu.style.right = '-100%';
    overlay.classList.remove('active');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    hamburger.classList.remove('active');
  } else {
    mobileMenu.classList.add('active');
    mobileMenu.style.right = '0';
    overlay.classList.add('active');
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    hamburger.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }
  
  // Close menu when clicking on menu items
  const menuItems = document.querySelectorAll('.mobile-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      toggleMenu();
    });
  });
});