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
        if (this.dropdownOpen) {
          const firstItem = profileMenu.querySelector('[role="menuitem"]');
          if (firstItem) setTimeout(() => firstItem.focus(), 20);
        }
      });

      profileBtn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || (e.key === 'Enter' && !this.dropdownOpen) || (e.key === ' ' && !this.dropdownOpen)) {
          e.preventDefault();
          if (!this.dropdownOpen) {
            this.dropdownOpen = true;
            this.updateDropdownState(profileMenu, profileCaret);
          }
          const firstItem = profileMenu.querySelector('[role="menuitem"]');
          if (firstItem) setTimeout(() => firstItem.focus(), 20);
        }
        if (e.key === 'Escape' && this.dropdownOpen) {
          e.preventDefault();
          this.dropdownOpen = false;
          this.updateDropdownState(profileMenu, profileCaret);
          profileBtn.focus();
        }
      });

      profileMenu.addEventListener('keydown', (e) => {
        const items = Array.from(profileMenu.querySelectorAll('[role="menuitem"]'));
        const idx = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[(idx + 1) % items.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[(idx - 1 + items.length) % items.length].focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.dropdownOpen = false;
          this.updateDropdownState(profileMenu, profileCaret);
          profileBtn.focus();
        } else if (e.key === 'Tab') {
          this.dropdownOpen = false;
          this.updateDropdownState(profileMenu, profileCaret);
        }
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

    const navTabList = document.querySelector('[role="tablist"]');
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

    if (navTabList) {
      navTabList.addEventListener('keydown', (e) => {
        const tabs = Array.from(navTabList.querySelectorAll('[role="tab"]'));
        const idx = tabs.indexOf(document.activeElement);
        if (idx === -1) return;
        let next = -1;
        if (e.key === 'ArrowRight') { e.preventDefault(); next = (idx + 1) % tabs.length; }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); next = (idx - 1 + tabs.length) % tabs.length; }
        if (e.key === 'Home')       { e.preventDefault(); next = 0; }
        if (e.key === 'End')        { e.preventDefault(); next = tabs.length - 1; }
        if (next !== -1) {
          const tabName = tabs[next].dataset.tab;
          this.setActiveTab(tabName);
          tabs[next].focus();
          if (this.onTabSwitch) this.onTabSwitch(tabName);
        }
      });
    }
  }

  setActiveTab(tabName) {
    this.activeTab = tabName;
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      const isActive = tab.dataset.tab === tabName;
      if (isActive) {
        tab.classList.remove('text-[#918979]', 'hover:text-black');
        tab.classList.add('bg-white', 'text-black', 'shadow-sm');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
      } else {
        tab.classList.remove('bg-white', 'text-black', 'shadow-sm');
        tab.classList.add('text-[#918979]', 'hover:text-black');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      }
    });
  }

  updateDropdownState(menu, caret) {
    const btn = document.getElementById('profile-dropdown-btn');
    if (this.dropdownOpen) {
      menu.classList.remove('hidden');
      setTimeout(() => {
        menu.classList.remove('opacity-0', 'scale-95');
        menu.classList.add('opacity-100', 'scale-100');
      }, 10);
      if (caret) caret.classList.add('rotate-180');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
      menu.classList.add('opacity-0', 'scale-95');
      menu.classList.remove('opacity-100', 'scale-100');
      if (caret) caret.classList.remove('rotate-180');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      setTimeout(() => {
        menu.classList.add('hidden');
      }, 200);
    }
  }

  updateHamburgerIcon(isOpen) {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      hamburgerBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      const svg = hamburgerBtn.querySelector('svg');
      if (svg) {
        svg.innerHTML = isOpen
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
      }
    }
  }
}
