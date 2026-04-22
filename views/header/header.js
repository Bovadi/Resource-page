export class Header {
  constructor(containerId) {
    this.containerId = containerId;
    this.onHamburgerClick = null;
    this.dropdownOpen = false;
    this._documentClickHandler = null;
    this._loaded = false;
    this._mql = null;
    this._mqlHandler = null;
  }

  async load() {
    // The header only renders on mobile (parent container is lg:hidden).
    // On desktop, skip the fetch entirely and defer until the viewport drops below lg.
    this._mql = window.matchMedia('(min-width: 1024px)');
    if (this._mql.matches) {
      this._mqlHandler = (e) => {
        if (!e.matches && !this._loaded) this._doLoad();
      };
      this._mql.addEventListener('change', this._mqlHandler);
      return;
    }
    return this._doLoad();
  }

  async _doLoad() {
    if (this._loaded) return;
    this._loaded = true;

    const container = document.getElementById(this.containerId);
    if (!container) return;

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}views/header/header.html`);
      if (!response.ok) {
        throw new Error(`Failed to load header: ${response.status}`);
      }
      const html = await response.text();
      container.innerHTML = html;
      this.attachEventListeners();
    } catch (err) {
      console.error('Header load error:', err);
      this._loaded = false;
      container.innerHTML = '<p class="p-4 text-sm text-red-600">Failed to load header.</p>';
    }
  }

  destroy() {
    if (this._documentClickHandler) {
      document.removeEventListener('click', this._documentClickHandler);
      this._documentClickHandler = null;
    }
    if (this._mql && this._mqlHandler) {
      this._mql.removeEventListener('change', this._mqlHandler);
      this._mqlHandler = null;
      this._mql = null;
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
