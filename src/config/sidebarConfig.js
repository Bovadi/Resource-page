const SVG_ATTRS = `class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;

const ICONS = {
  // Original wand/sparkle icon
  sparkle: `<svg ${SVG_ATTRS}><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2L19 5"/><path d="M3 21l9-9"/><path d="M12.2 6.2L11 5"/></svg>`,
  // Heroicons: plus
  plus: `<svg ${SVG_ATTRS}><path d="M12 4.5V19.5M19.5 12L4.5 12"/></svg>`,
  // Heroicons: arrow-up-tray
  upload: `<svg ${SVG_ATTRS}><path d="M3 16.5V18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75V16.5M7.5 7.5L12 3L16.5 7.5M12 3L12 16.5"/></svg>`,
  // Heroicons: magnifying-glass
  search: `<svg ${SVG_ATTRS}><path d="M21 21L15.8033 15.8033M15.8033 15.8033C17.1605 14.4461 18 12.5711 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.5711 18 14.4461 17.1605 15.8033 15.8033Z"/></svg>`,
  // Heroicons: academic-cap
  graduation: `<svg ${SVG_ATTRS}><path d="M4.25933 10.1466C3.98688 12.2307 3.82139 14.3483 3.76853 16.494C6.66451 17.703 9.41893 19.1835 12 20.9036C14.5811 19.1835 17.3355 17.703 20.2315 16.494C20.1786 14.3484 20.0131 12.2307 19.7407 10.1467M4.25933 10.1466C3.38362 9.8523 2.49729 9.58107 1.60107 9.3337C4.84646 7.05887 8.32741 5.0972 12 3.49255C15.6727 5.0972 19.1536 7.05888 22.399 9.33371C21.5028 9.58109 20.6164 9.85233 19.7407 10.1467M4.25933 10.1466C6.94656 11.0499 9.5338 12.1709 12.0001 13.4886C14.4663 12.1709 17.0535 11.0499 19.7407 10.1467M6.75 15C7.16421 15 7.5 14.6642 7.5 14.25C7.5 13.8358 7.16421 13.5 6.75 13.5C6.33579 13.5 6 13.8358 6 14.25C6 14.6642 6.33579 15 6.75 15ZM6.75 15V11.3245C8.44147 10.2735 10.1936 9.31094 12 8.44329M4.99264 19.9926C6.16421 18.8211 6.75 17.2855 6.75 15.75V14.25"/></svg>`,
  // Heroicons: book-open
  book: `<svg ${SVG_ATTRS}><path d="M12 6.04168C10.4077 4.61656 8.30506 3.75 6 3.75C4.94809 3.75 3.93834 3.93046 3 4.26212V18.5121C3.93834 18.1805 4.94809 18 6 18C8.30506 18 10.4077 18.8666 12 20.2917M12 6.04168C13.5923 4.61656 15.6949 3.75 18 3.75C19.0519 3.75 20.0617 3.93046 21 4.26212V18.5121C20.0617 18.1805 19.0519 18 18 18C15.6949 18 13.5923 18.8666 12 20.2917M12 6.04168V20.2917"/></svg>`,
  // Heroicons: list-bullet
  list: `<svg ${SVG_ATTRS}><path d="M8.25 6.75H20.25M8.25 12H20.25M8.25 17.25H20.25M3.75 6.75H3.7575V6.7575H3.75V6.75ZM4.125 6.75C4.125 6.95711 3.95711 7.125 3.75 7.125C3.54289 7.125 3.375 6.95711 3.375 6.75C3.375 6.54289 3.54289 6.375 3.75 6.375C3.95711 6.375 4.125 6.54289 4.125 6.75ZM3.75 12H3.7575V12.0075H3.75V12ZM4.125 12C4.125 12.2071 3.95711 12.375 3.75 12.375C3.54289 12.375 3.375 12.2071 3.375 12C3.375 11.7929 3.54289 11.625 3.75 11.625C3.95711 11.625 4.125 11.7929 4.125 12ZM3.75 17.25H3.7575V17.2575H3.75V17.25ZM4.125 17.25C4.125 17.4571 3.95711 17.625 3.75 17.625C3.54289 17.625 3.375 17.4571 3.375 17.25C3.375 17.0429 3.54289 16.875 3.75 16.875C3.95711 16.875 4.125 17.0429 4.125 17.25Z"/></svg>`,
};

export const SIDEBAR_CONFIG = {
  bip: {
    actions: [
      {
        id: 'generate-bip',
        label: 'Generate BIP',
        variant: 'primary',
        badge: null,
        icon: ICONS.sparkle,
      },
      {
        id: 'create-bip-new',
        label: 'Create BIP',
        variant: 'outline',
        badge: { text: 'New', color: 'teal' },
        icon: ICONS.plus,
      },
      {
        id: 'create-bip-legacy',
        label: 'Create BIP',
        variant: 'outline',
        badge: { text: 'Legacy', color: 'teal' },
        icon: ICONS.plus,
      }
    ],
    filters: [
      { id: 'madeByYou', label: 'Made by You' },
      { id: 'sharedWithYou', label: 'Shared with You' }
    ],
    filtersTitle: 'Filters'
  },

  resources: {
    actions: [
      {
        id: 'upload-resource',
        label: 'Upload Resource',
        variant: 'primary',
        badge: null,
        icon: ICONS.upload,
      },
      {
        id: 'browse-resources',
        label: 'Browse All',
        variant: 'outline',
        badge: null,
        icon: ICONS.search,
      }
    ],
    filters: [
      { id: 'showAll', label: 'Show all', isShowAll: true },
      { id: 'madeByYou', label: 'Made by You', group: 'Ownership' },
      { id: 'sharedWithYou', label: 'Shared with You', group: 'Ownership' },
      { id: 'recentlyAdded', label: 'Recently Added', group: 'Recency' },
      { id: 'lastWeek', label: 'Last 7 Days', group: 'Recency' },
      { id: 'lastMonth', label: 'Last 30 Days', group: 'Recency' },
      { id: 'pdf', label: 'PDF', group: 'Type' },
      { id: 'video', label: 'Video', group: 'Type' },
      { id: 'worksheet', label: 'Worksheet', group: 'Type' }
    ],
    filtersTitle: 'Filter'
  },

  courses: {
    actions: [
      {
        id: 'enroll-course',
        label: 'Enroll in Course',
        variant: 'primary',
        badge: null,
        icon: ICONS.graduation,
      },
      {
        id: 'my-courses',
        label: 'My Courses',
        variant: 'outline',
        badge: null,
        icon: ICONS.book,
      }
    ],
    filters: [
      { id: 'showAll', label: 'Show all', isShowAll: true },
      { id: 'inProgress', label: 'In Progress', group: 'Status' },
      { id: 'completed', label: 'Completed', group: 'Status' },
      { id: 'notStarted', label: 'Not Started', group: 'Status' },
      { id: 'bcba', label: 'BCBA', group: 'Track' },
      { id: 'rbt', label: 'RBT', group: 'Track' },
      { id: 'clinician', label: 'Clinician', group: 'Track' },
      { id: 'freeOnly', label: 'Free Only', group: 'Access' },
      { id: 'ceus', label: 'Includes CEUs', group: 'Access' }
    ],
    filtersTitle: 'Filter'
  },

  rbt: {
    actions: [],
    filters: [
      { id: 'showAll', label: 'Show all', isShowAll: true },
      { id: 'inProgress', label: 'In Progress', group: 'Status' },
      { id: 'completed', label: 'Completed', group: 'Status' },
      { id: 'notStarted', label: 'Not Started', group: 'Status' },
    ],
    filtersTitle: 'Filter'
  },

  bcba: {
    actions: [],
    filters: [
      { id: 'showAll', label: 'Show all', isShowAll: true },
      { id: 'inProgress', label: 'In Progress', group: 'Status' },
      { id: 'completed', label: 'Completed', group: 'Status' },
      { id: 'notStarted', label: 'Not Started', group: 'Status' },
    ],
    filtersTitle: 'Filter'
  },

  strategies: {
    actions: [
      {
        id: 'create-strategy',
        label: 'Create Strategy',
        variant: 'primary',
        badge: null,
        icon: ICONS.plus,
      },
      {
        id: 'strategy-library',
        label: 'Strategy Library',
        variant: 'outline',
        badge: null,
        icon: ICONS.list,
      }
    ],
    filters: [
      { id: 'showAll', label: 'Show all', isShowAll: true },
      { id: 'madeByYou', label: 'Made by You', group: 'Ownership' },
      { id: 'sharedWithYou', label: 'Shared with You', group: 'Ownership' },
      { id: 'evidenceBased', label: 'Evidence-Based', group: 'Quality' },
      { id: 'peerReviewed', label: 'Peer Reviewed', group: 'Quality' },
      { id: 'antecedent', label: 'Antecedent', group: 'Category' },
      { id: 'consequence', label: 'Consequence', group: 'Category' },
      { id: 'extinction', label: 'Extinction', group: 'Category' },
      { id: 'dri', label: 'DRI', group: 'Category' }
    ],
    filtersTitle: 'Filter'
  }
};
