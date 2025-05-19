document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const menuContent = document.getElementById('menu-content');
    
    mobileMenuToggle.addEventListener('click', function() {
      // Toggle the hidden class on mobile
      if (menuContent.classList.contains('hidden')) {
        menuContent.classList.remove('hidden');
        menuContent.classList.add('flex', 'flex-col', 'absolute', 'top-16', 'left-0', 'right-0', 'bg-white', 'shadow-md', 'p-4', 'rounded-b-3xl', 'z-50');
      } else {
        menuContent.classList.add('hidden');
        menuContent.classList.remove('flex', 'flex-col', 'absolute', 'top-16', 'left-0', 'right-0', 'bg-white', 'shadow-md', 'p-4', 'rounded-b-3xl', 'z-50');
      }
    });

    // Handle window resize to reset menu state for desktop view
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768) { // md breakpoint in Tailwind
        menuContent.classList.remove('hidden', 'flex', 'flex-col', 'absolute', 'top-16', 'left-0', 'right-0', 'bg-white', 'shadow-md', 'p-4', 'rounded-b-3xl');
        menuContent.classList.add('md:flex');
      } else if (!menuContent.classList.contains('hidden') && !menuContent.classList.contains('flex')) {
        menuContent.classList.add('hidden');
      }
    });
  });