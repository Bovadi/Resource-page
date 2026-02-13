export class Header {
  constructor(containerId) {
    this.containerId = containerId;
    this.onHamburgerClick = null;
    this.dropdownOpen = false;
  }

  async load() {
    const response = await fetch('/views/header/header.html');
    const html = await response.text();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = html;
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => {
        if (this.onHamburgerClick) {
          this.onHamburgerClick();
        }
      });
    }

    const profileBtn = document.getElementById('profile-dropdown-btn');
    const profileMenu = document.getElementById('profile-dropdown-menu');
    const profileCaret = document.getElementById('profile-caret');

    if (profileBtn && profileMenu) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dropdownOpen = !this.dropdownOpen;
        this.updateDropdownState(profileMenu, profileCaret);
      });

      document.addEventListener('click', () => {
        if (this.dropdownOpen) {
          this.dropdownOpen = false;
          this.updateDropdownState(profileMenu, profileCaret);
        }
      });

      profileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        navTabs.forEach(t => {
          t.classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
          t.style.color = '#CBC4B6';
        });
        tab.style.color = '';
        tab.classList.add('bg-white', 'text-gray-900', 'shadow-sm');
      });
    });
  }

  updateDropdownState(menu, caret) {
    if (this.dropdownOpen) {
      menu.classList.remove('hidden');
      setTimeout(() => {
        menu.classList.remove('opacity-0', 'scale-95');
        menu.classList.add('opacity-100', 'scale-100');
      }, 10);
      if (caret) caret.classList.add('rotate-180');
    } else {
      menu.classList.add('opacity-0', 'scale-95');
      menu.classList.remove('opacity-100', 'scale-100');
      if (caret) caret.classList.remove('rotate-180');
      setTimeout(() => {
        menu.classList.add('hidden');
      }, 200);
    }
  }

  updateHamburgerIcon(isOpen) {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) {
      const svg = hamburgerBtn.querySelector('svg');
      if (svg) {
        svg.innerHTML = isOpen
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
      }
    }
  }
}
