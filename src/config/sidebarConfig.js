export const SIDEBAR_CONFIG = {
  bip: {
    actions: [
      {
        id: 'generate-bip',
        label: 'Generate BIP',
        variant: 'primary',
        badge: null,
        icon: `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/>
          <path d="M17.8 11.8L19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2L19 5"/>
          <path d="M3 21l9-9"/><path d="M12.2 6.2L11 5"/>
        </svg>`
      },
      {
        id: 'create-bip-new',
        label: 'Create BIP',
        variant: 'outline',
        badge: { text: 'New', color: 'teal' },
        icon: `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>`
      },
      {
        id: 'create-bip-legacy',
        label: 'Create BIP',
        variant: 'outline',
        badge: { text: 'Legacy', color: 'teal' },
        icon: `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>`
      }
    ],
    filters: [
      { id: 'madeByYou', label: 'Made by You' },
      { id: 'sharedWithYou', label: 'Shared with You' }
    ],
    filtersTitle: 'Filters'
  },

  resources: {
    showAll: { id: 'showAll', label: 'Show All' },
    actions: [
      {
        id: 'upload-resource',
        label: 'Upload Resource',
        variant: 'primary',
        badge: null,
        icon: `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>`
      },
      {
        id: 'browse-resources',
        label: 'Browse All',
        variant: 'outline',
        badge: null,
        icon: `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>`
      }
    ],
    filters: [
      { id: 'madeByYou', label: 'Made by You' },
      { id: 'sharedWithYou', label: 'Shared with You' }
    ],
    filtersTitle: 'Filters'
  },

  courses: {
    showAll: { id: 'showAll', label: 'Show All' },
    actions: [
      {
        id: 'enroll-course',
        label: 'Enroll in Course',
        variant: 'primary',
        badge: null,
        icon: `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>`
      },
      {
        id: 'my-courses',
        label: 'My Courses',
        variant: 'outline',
        badge: null,
        icon: `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>`
      }
    ],
    filters: [
      { id: 'inProgress', label: 'In Progress' },
      { id: 'completed', label: 'Completed' },
      { id: 'notStarted', label: 'Not Started' }
    ],
    filtersTitle: 'Status'
  },

  strategies: {
    showAll: { id: 'showAll', label: 'Show All' },
    actions: [
      {
        id: 'create-strategy',
        label: 'Create Strategy',
        variant: 'primary',
        badge: null,
        icon: `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>`
      },
      {
        id: 'strategy-library',
        label: 'Strategy Library',
        variant: 'outline',
        badge: null,
        icon: `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>`
      }
    ],
    filters: [
      { id: 'madeByYou', label: 'Made by You' },
      { id: 'sharedWithYou', label: 'Shared with You' },
      { id: 'evidenceBased', label: 'Evidence-Based' }
    ],
    filtersTitle: 'Filters'
  }
};
