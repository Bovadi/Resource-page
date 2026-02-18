export class Tabs {
  constructor(containerId) {
    this.containerId = containerId;
    this.activeTab = 'resources';
    this.onTabSwitch = null;
  }

  async load() {
    const response = await fetch('/views/tabs/tabs.html');
    const html = await response.text();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = html;
      this.attachEventListeners();
      this.updateActiveTab();
    }
  }

  attachEventListeners() {
    const container = document.getElementById('tabs-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action="switch-tab"]');
      if (!button) return;

      const tab = button.dataset.tab;
      this.switchTab(tab);
    });
  }

  switchTab(tabKey) {
    if (tabKey === this.activeTab) return;
    this.activeTab = tabKey;
    this.updateActiveTab();
    if (this.onTabSwitch) {
      this.onTabSwitch(tabKey);
    }
  }

  updateActiveTab() {
    const buttons = document.querySelectorAll('[data-action="switch-tab"]');
    const activeClass = "bg-[#F1EDE5] text-[#343434] shadow-sm";
    const inactiveClass = "text-[#CBC4B6] hover:text-[#343434] hover:bg-gray-50 border border-transparent";
    const baseClass = "tab-button w-32 sm:w-40 px-[1.32rem] sm:px-[2.0rem] py-[1.0rem] sm:py-[1.15rem] text-[1.32rem] sm:text-[1.48rem] rounded-lg transition-colors duration-200 min-h-[68px] sm:min-h-[74px] flex items-center justify-center box-border font-medium";

    buttons.forEach(button => {
      if (button.dataset.tab === this.activeTab) {
        button.className = `${baseClass} active ${activeClass}`;
      } else {
        button.className = `${baseClass} ${inactiveClass}`;
      }
    });
  }
}
