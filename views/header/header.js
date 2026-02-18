export class Header {
  constructor(containerId, defaultTab = 'resources') {
    this.containerId = containerId;
    this.onHamburgerClick = null;
    this.onTabSwitch = null;
    this.dropdownOpen = false;
    this.activeTab = defaultTab;
    this._documentClickHandler = null;
  }

  async load() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    try {
      const response = await fetch('/views/header/header.html');
      if (!response.ok) {
        throw new Error(`Failed to load header: ${response.status}`);
      }
      const html = await response.text();
      container.innerHTML = html;
      this.attachEventListeners();
      this.setActiveTab(this.activeTab);
    } catch (err) {
      console.error('Header load error:', err);
      container.innerHTML = '<p class="p-4 text-sm text-red-600">Failed to load header.</p>';
    }
  }

  destroy() {
    if (this._documentClickHandler) {
      document.removeEventListener('click', this._documentClickHandler);
      this._documentClickHandler = null;
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

      this._documentClickHandler = () => {
        if (this.dropdownOpen) {
          this.dropdownOpen = false;
          this.updateDropdownState(profileMenu, profileCaret);
        }
      };
      document.addEventListener('click', this._documentClickHandler);

      profileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.setActiveTab(tabName);
        if (this.onTabSwitch) {
          this.onTabSwitch(tabName);
        }
      });
    });
  }

  setActiveTab(tabName) {
    this.activeTab = tabName;
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.remove('text-[#918979]', 'hover:text-black');
        tab.classList.add('bg-white', 'text-black', 'shadow-sm');
      } else {
        tab.classList.remove('bg-white', 'text-black', 'shadow-sm');
        tab.classList.add('text-[#918979]', 'hover:text-black');
      }
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
