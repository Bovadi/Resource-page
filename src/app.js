import { authManager } from './lib/auth.js';
import { ContentService } from './services/contentService.js';
import './styles/responsive-grid.css';

const PLACEHOLDER_LABELS = [
  { id: '1', name: 'Welcome Start here', slug: 'welcome-start-here', display_order: 1, is_active: true, description: 'Getting started content' },
  { id: '2', name: 'Developing FBA & BIPs', slug: 'developing-fba-bips', display_order: 2, is_active: true, description: 'Functional Behavior Assessment resources' },
  { id: '3', name: 'Stakeholder Support Guides', slug: 'stakeholder-support-guides', display_order: 3, is_active: true, description: 'Support guides for stakeholders' },
  { id: '4', name: 'Visual Supports', slug: 'visual-supports', display_order: 4, is_active: true, description: 'Visual aids and tools' },
  { id: '5', name: 'Resources for Stakeholders', slug: 'resources-for-stakeholders', display_order: 5, is_active: true, description: 'Additional stakeholder resources' }
];

const PLACEHOLDER_DATA = [
  {
    id: '1',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSBJbWFnZTwvdGV4dD4KPHN2Zz4=',
    title: 'Creating Visual BIPs for Confident Parent & Staff Support',
    type: 'course',
    description: 'Learn to create effective visual behavior intervention plans',
    video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    perfect_for: ['Staff training', 'Parent coaching', 'BCBA supervision']
  },
  {
    id: '2',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhbG0gUG9zdGVyPC90ZXh0Pgo8c3ZnPg==',
    title: '5-4-3-2-1 Calm Visual Poster',
    type: 'resource',
    description: 'Downloadable poster for calming strategies',
    download_url: 'https://example.com/download/calm-poster.pdf',
    perfect_for: ['Classroom display', 'Home use', 'Therapy sessions']
  },
  {
    id: '3',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNlbGYtQWR2b2NhY3k8L3RleHQ+Cjwvc3ZnPg==',
    title: 'Self-Advocacy Visual: I need help',
    type: 'resource',
    description: 'Visual communication tool for self-advocacy',
    download_url: 'https://example.com/download/self-advocacy.pdf',
    perfect_for: ['Students with communication needs', 'Inclusive classrooms', 'Building independence']
  },
  {
    id: '4',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZlZWRpbmcgR3VpZGU8L3RleHQ+Cjwvc3ZnPg==',
    title: 'Feeding with Care: A Practical Guide',
    type: 'resource',
    description: 'Comprehensive guide for supporting picky eaters',
    download_url: 'https://example.com/download/feeding-guide.pdf',
    perfect_for: ['Parents of picky eaters', 'Feeding therapy support', 'Mealtime strategies']
  },
  {
    id: '5',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbXBhc3Npb24gR3VpZGU8L3RleHQ+Cjwvc3ZnPg==',
    title: 'Supporting with Compassion & Understanding',
    type: 'resource',
    description: 'A guide for parents and teachers',
    download_url: 'https://example.com/download/compassion-guide.pdf',
    perfect_for: ['Parent education', 'Teacher training', 'Building empathy']
  },
  {
    id: '6',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGNUY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJlaGF2aW9yIENoYXJ0PC90ZXh0Pgo8c3ZnPg==',
    title: 'Daily Behavior Tracking Chart',
    type: 'resource',
    description: 'Track daily behaviors with visual charts',
    download_url: 'https://example.com/download/behavior-chart.pdf',
    perfect_for: ['Daily progress monitoring', 'Parent-teacher communication', 'Data collection']
  },
  {
    id: '7',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGRkY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNvY2lhbCBTdG9yaWVzPC90ZXh0Pgo8c3ZnPg==',
    title: 'Social Stories Template Collection',
    type: 'resource',
    description: 'Customizable social stories for various situations',
    download_url: 'https://example.com/download/social-stories.pdf',
    perfect_for: ['Social skill development', 'Transition preparation', 'Anxiety reduction']
  },
  {
    id: '8',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGNUZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNlbnNvcnkgQnJlYWs8L3RleHQ+Cjwvc3ZnPg==',
    title: 'Sensory Break Visual Cards',
    type: 'resource',
    description: 'Visual cards for sensory regulation activities',
    download_url: 'https://example.com/download/sensory-break.pdf',
    perfect_for: ['Sensory regulation', 'Classroom breaks', 'Self-regulation skills']
  },
  {
    id: '9',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGNUY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbW11bmljYXRpb248L3RleHQ+Cjwvc3ZnPg==',
    title: 'Communication Board Templates',
    type: 'resource',
    description: 'AAC communication boards for non-verbal students',
    download_url: 'https://example.com/download/communication-board.pdf',
    perfect_for: ['Non-verbal communication', 'AAC implementation', 'Language development']
  },
  {
    id: '10',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRyYW5zaXRpb24gVG9vbDwvdGV4dD4KPHN2Zz4=',
    title: 'Transition Timer Visual Tool',
    type: 'resource',
    description: 'Visual timer for smooth transitions',
    download_url: 'https://example.com/download/transition-timer.pdf',
    perfect_for: ['Activity transitions', 'Time management', 'Reducing anxiety']
  },
  {
    id: '11',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVtb3Rpb24gQ2FyZHM8L3RleHQ+Cjwvc3ZnPg==',
    title: 'Emotion Recognition Cards',
    type: 'resource',
    description: 'Visual cards for identifying emotions',
    download_url: 'https://example.com/download/emotion-cards.pdf',
    perfect_for: ['Emotional literacy', 'Social skills training', 'Self-awareness building']
  },
  {
    id: '12',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGRkYwIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJld2FyZCBDaGFydDwvdGV4dD4KPHN2Zz4=',
    title: 'Token Economy Reward Chart',
    type: 'resource',
    description: 'Customizable reward system charts',
    download_url: 'https://example.com/download/reward-chart.pdf',
    perfect_for: ['Motivation systems', 'Positive reinforcement', 'Goal achievement']
  },
  {
    id: '13',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGNUZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNob2ljZSBCb2FyZDwvdGV4dD4KPHN2Zz4=',
    title: 'Choice Making Visual Board',
    type: 'resource',
    description: 'Visual choice boards for decision making',
    download_url: 'https://example.com/download/choice-board.pdf',
    perfect_for: ['Decision making skills', 'Independence building', 'Reducing frustration']
  },
  {
    id: '14',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZpcnN0LVRoZW4gQ2FyZDwvdGV4dD4KPHN2Zz4=',
    title: 'First-Then Visual Schedule Cards',
    type: 'resource',
    description: 'Simple first-then sequence cards',
    download_url: 'https://example.com/download/first-then.pdf',
    perfect_for: ['Task sequencing', 'Motivation building', 'Clear expectations']
  },
  {
    id: '15',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGMEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJyZWF0aGluZyBHdWlkZTwvdGV4dD4KPHN2Zz4=',
    title: 'Deep Breathing Exercise Guide',
    type: 'resource',
    description: 'Visual guide for calming breathing exercises',
    download_url: 'https://example.com/download/breathing-guide.pdf',
    perfect_for: ['Anxiety management', 'Self-regulation', 'Mindfulness practice']
  },
  {
    id: '16',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvcGluZyBTdHJhdGVnaWVzPC90ZXh0Pgo8c3ZnPg==',
    title: 'Coping Strategies Visual Menu',
    type: 'resource',
    description: 'Menu of coping strategies for difficult moments',
    download_url: 'https://example.com/download/coping-strategies.pdf',
    perfect_for: ['Crisis prevention', 'Self-regulation tools', 'Emotional support']
  },
  {
    id: '17',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGNUYwIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdvYWwgU2V0dGluZzwvdGV4dD4KPHN2Zz4=',
    title: 'Goal Setting Worksheet',
    type: 'resource',
    description: 'Visual worksheet for setting and tracking goals',
    download_url: 'https://example.com/download/goal-setting.pdf',
    perfect_for: ['IEP goal tracking', 'Personal development', 'Progress monitoring']
  },
  {
    id: '18',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGRkY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZyaWVuZHNoaXAgU2tpbGxzPC90ZXh0Pgo8c3ZnPg==',
    title: 'Friendship Skills Social Guide',
    type: 'resource',
    description: 'Guide for developing friendship and social skills',
    download_url: 'https://example.com/download/friendship-skills.pdf',
    perfect_for: ['Social skill development', 'Peer interaction', 'Relationship building']
  },
  {
    id: '19',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNsYXNzcm9vbSBSdWxlczwvdGV4dD4KPHN2Zz4=',
    title: 'Classroom Rules Visual Poster',
    type: 'resource',
    description: 'Visual poster displaying classroom expectations',
    download_url: 'https://example.com/download/classroom-rules.pdf',
    perfect_for: ['Classroom management', 'Clear expectations', 'Behavior support']
  },
  {
    id: '20',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFuZ2VyIE1hbmFnZW1lbnQ8L3RleHQ+Cjwvc3ZnPg==',
    title: 'Anger Management Toolkit',
    type: 'resource',
    description: 'Comprehensive toolkit for managing anger and frustration',
    download_url: 'https://example.com/download/anger-management.pdf',
    perfect_for: ['Emotional regulation', 'Crisis prevention', 'Self-control skills']
  },
  {
    id: '21',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGOEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRhaWx5IFNjaGVkdWxlPC90ZXh0Pgo8c3ZnPg==',
    title: 'Visual Daily Schedule Template',
    type: 'resource',
    description: 'Customizable daily schedule with visual supports',
    download_url: 'https://example.com/download/daily-schedule.pdf',
    perfect_for: ['Routine establishment', 'Predictability', 'Independence building']
  },
  {
    id: '22',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEVFIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1vdGl2YXRpb24gQ2FyZHM8L3RleHQ+Cjwvc3ZnPg==',
    title: 'Motivation & Encouragement Cards',
    type: 'resource',
    description: 'Positive affirmation cards for daily motivation',
    download_url: 'https://example.com/download/motivation-cards.pdf',
    perfect_for: ['Positive reinforcement', 'Building confidence', 'Daily encouragement']
  }
];

export class App {
  constructor() {
    this.state = {
      activeTab: 'resources',
      cards: [],
      loading: false,
      error: null,
      isSidebarOpen: false,
      labels: PLACEHOLDER_LABELS,
      selectedLabel: null,
      isModalOpen: false,
      selectedCourse: null,
      isAuthModalOpen: false,
      isFullscreen: false,
      user: null,
      isAuthenticated: false
    };

    this.authUnsubscribe = authManager.subscribe(this.handleAuthChange.bind(this));
    this.init();
  }

  handleAuthChange(authState) {
    this.state.user = authState.user;
    this.state.isAuthenticated = authState.isAuthenticated;
  }

  async init() {
    await this.loadData('resource');
    this.render();
  }

  async loadData(type, labelSlug) {
    const isInitialLoad = this.state.cards.length === 0;

    if (isInitialLoad) {
      this.state.loading = true;
      this.render();
    }

    this.state.error = null;

    try {
      let content = PLACEHOLDER_DATA.filter(item => item.type === type);

      if (labelSlug) {
        if (labelSlug === 'visual-supports') {
          content = content.filter(item => item.title.toLowerCase().includes('visual') || item.title.toLowerCase().includes('poster'));
        }
      }

      this.state.cards = content;
    } catch (err) {
      console.error('Load data error:', err);
      this.state.error = 'Failed to load content';
      this.state.cards = [];
    } finally {
      if (isInitialLoad) {
        this.state.loading = false;
      }
      this.render();
    }
  }

  handleTabClick(tabKey) {
    if (tabKey === this.state.activeTab || this.state.loading) return;

    this.state.activeTab = tabKey;
    const cardType = tabKey === 'courses' ? 'course' : 'resource';
    this.loadData(cardType, this.state.selectedLabel);
  }

  handleLabelClick(labelSlug) {
    this.state.selectedLabel = labelSlug;
    this.state.isSidebarOpen = false;
    const cardType = this.state.activeTab === 'courses' ? 'course' : 'resource';
    this.loadData(cardType, labelSlug);
  }

  handleShowAll() {
    this.state.selectedLabel = null;
    this.state.isSidebarOpen = false;
    const cardType = this.state.activeTab === 'courses' ? 'course' : 'resource';
    this.loadData(cardType);
  }

  handleCardClick(card) {
    this.state.selectedCourse = card;
    this.state.isModalOpen = true;
    this.render();
  }

  closeModal() {
    this.state.isModalOpen = false;
    this.state.isFullscreen = false;
    this.render();
  }

  renderHeader() {
    return `
      <header class="fixed top-0 left-0 right-0 w-full h-[61px] bg-[#f8f5ef] z-20">
        <div class="flex items-center justify-between px-4 sm:px-5 h-full">
          <div class="flex items-center gap-2 sm:gap-4">
            <button id="hamburger-btn" class="lg:hidden p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200 -ml-2">
              <svg class="w-6 h-6 text-[#343434]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${this.state.isSidebarOpen ?
                  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />' :
                  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />'
                }
              </svg>
            </button>
            <img class="h-4 sm:h-6 w-auto object-contain" alt="Logo" src="/large-3.png" />
          </div>

          <div class="hidden md:flex items-center gap-4 lg:gap-6 h-full">
            <div class="flex flex-col w-16 lg:w-[88px] h-full items-center justify-end gap-2">
              <span class="font-normal text-[#343434] text-sm lg:text-base">BIPs</span>
              <div class="w-full h-[3px]"></div>
            </div>
            <div class="flex flex-col w-16 lg:w-[88px] h-full items-center justify-end gap-2">
              <span class="font-normal text-[#343434] text-sm lg:text-base">Resources</span>
              <div class="w-full h-[3px] bg-[#343434]"></div>
            </div>
            <div class="flex flex-col w-16 lg:w-[88px] h-full items-center justify-end gap-2">
              <span class="font-normal text-[#343434] text-sm lg:text-base">Strategies</span>
              <div class="w-full h-[3px]"></div>
            </div>
          </div>

          <button class="bg-white border-[#343434] border rounded h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-base hover:bg-gray-50 transition-colors">
            <span class="font-semibold text-[#343434]">${this.state.isAuthenticated ? 'Admin' : 'Admin Login'}</span>
            <img class="w-2 sm:w-3 h-3 sm:h-4 ml-1 sm:ml-2 inline" alt="Vector" src="/vector.svg" />
          </button>
        </div>
        <div class="w-full h-px bg-[#d9d9d9]"></div>
      </header>
    `;
  }

  renderSidebar() {
    return `
      <aside class="fixed top-[61px] left-0 w-[280px] sm:w-[320px] lg:w-72 h-[calc(100vh-61px)] bg-white z-40 lg:z-10 lg:relative lg:top-0 transition-transform duration-300 ease-in-out ${
        this.state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }">
        <nav class="p-4 sm:p-5 lg:p-6 lg:pt-[72px] h-full overflow-y-auto">
          <ul class="space-y-2 lg:space-y-3">
            <li>
              <button id="show-all-btn" class="w-full text-left py-3 px-4 text-sm sm:text-base rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border ${
                this.state.selectedLabel === null
                  ? "bg-[#f8f8f9] text-[#343434] shadow-sm border border-gray-100 font-medium"
                  : "text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent"
              }">
                <span>Show All</span>
              </button>
            </li>
            ${this.state.labels.map(label => `
              <li>
                <button data-label="${label.slug}" class="label-btn w-full text-left py-3 px-4 text-sm sm:text-base rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border ${
                  this.state.selectedLabel === label.slug
                    ? "bg-[#f8f8f9] shadow-sm border border-gray-100 font-medium"
                    : "border border-transparent hover:bg-opacity-80"
                }">
                  <span>${label.name}</span>
                </button>
              </li>
            `).join('')}
          </ul>
        </nav>
      </aside>
    `;
  }

  renderCardGrid() {
    if (this.state.error) {
      return `
        <div class="col-span-full flex flex-col items-center justify-center py-12 px-4">
          <div class="text-center max-w-md">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p class="text-gray-600 mb-4">${this.state.error}</p>
            <button id="retry-btn" class="px-4 py-2 bg-[#108C89] text-white rounded-lg hover:bg-[#0e7a77] transition-colors duration-200">
              Try Again
            </button>
          </div>
        </div>
      `;
    }

    if (this.state.loading) {
      return `
        ${Array(8).fill(null).map((_, index) => `
          <div class="w-full max-w-[560px] cursor-pointer group animate-pulse">
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm mb-2 sm:mb-3 p-2 sm:p-3 md:p-4">
              <div class="relative w-full aspect-[246/252] bg-gray-200 rounded-sm"></div>
            </div>
            <div class="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-1"></div>
          </div>
        `).join('')}
      `;
    }

    return this.state.cards.map(card => `
      <div class="w-full max-w-[560px] flex flex-col">
        <div class="group cursor-pointer" data-card-id="${card.id}">
          <div class="bg-white border border-gray-200 rounded-lg hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-2 sm:mb-3">
            <div class="p-2 sm:p-3 md:p-4">
              <div class="relative w-full aspect-[246/252]">
                <img class="w-full h-full object-cover rounded-sm" alt="${card.title}" src="${card.image}" loading="lazy" />
                ${this.state.activeTab === 'resources' && card.type === 'resource' ? `
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
        <div class="px-1">
          <p class="font-normal text-[#343434] text-xs sm:text-sm leading-tight sm:leading-[16.8px] text-left transition-colors duration-200 line-clamp-2 overflow-hidden">
            ${card.title}
          </p>
        </div>
      </div>
    `).join('');
  }

  renderModal() {
    if (!this.state.isModalOpen || !this.state.selectedCourse) return '';

    const course = this.state.selectedCourse;
    const isResource = course.type === 'resource';

    return `
      <div id="course-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" id="modal-overlay"></div>

        <div class="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">
              ${isResource ? 'Download Resource' : 'Start new course'}
            </h2>
            <button id="close-modal-btn" class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto max-h-[calc(90vh-180px)]">
            <div class="p-4 sm:p-6">
              <div class="mb-4 sm:mb-6">
                <div class="w-full h-64 rounded-lg flex items-center justify-center" style="background-color: #F7F7F7">
                  <img src="${course.image}" alt="${course.title}" class="max-w-full max-h-full object-contain rounded-lg" />
                </div>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-4">${course.title}</h3>

              <div class="space-y-4 text-gray-700 mb-4">
                <p class="leading-relaxed">${course.description || 'Description not available.'}</p>

                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-3">Perfect for:</h4>
                  ${course.perfect_for && course.perfect_for.length > 0 ? `
                    <ul class="space-y-2 text-sm">
                      ${course.perfect_for.map(item => `
                        <li class="flex items-start">
                          <span class="w-2 h-2 bg-custom-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          ${item}
                        </li>
                      `).join('')}
                    </ul>
                  ` : `
                    <p class="text-sm text-gray-500 italic">No specific use cases defined.</p>
                  `}
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 p-4 sm:p-6 flex-shrink-0">
            <button id="start-course-btn" class="w-full bg-[#108C89] text-white py-3 px-4 rounded-lg hover:bg-[#0e7a77] transition-colors duration-200 font-medium min-h-[48px]">
              ${isResource ? 'Download Resource' : 'Start Course'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    appContainer.innerHTML = `
      <div class="fixed inset-0 w-full h-screen bg-white border border-solid border-black overflow-hidden">
        ${this.renderHeader()}

        ${this.state.isSidebarOpen ? `
          <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"></div>
        ` : ''}

        <div class="fixed top-[61px] left-0 right-0 bottom-0 flex flex-col lg:flex-row">
          ${this.renderSidebar()}

          <div class="flex-1 flex flex-col w-full lg:ml-0">
            <div class="w-full flex items-center px-4 py-3 sm:py-4 bg-white lg:bg-transparent z-10 border-b lg:border-b-0 border-gray-200 gap-3 sm:gap-4">
              <button id="courses-tab" class="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors duration-200 min-h-[44px] sm:min-h-[48px] flex items-center box-border ${
                this.state.activeTab === 'courses'
                  ? "bg-[#f8f8f9] text-[#343434] shadow-sm"
                  : "text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent"
              }">
                Courses
              </button>
              <button id="resources-tab" class="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors duration-200 min-h-[44px] sm:min-h-[48px] flex items-center box-border ${
                this.state.activeTab === 'resources'
                  ? "bg-[#f8f8f9] text-[#343434] shadow-sm"
                  : "text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent"
              }">
                Resources
              </button>
            </div>

            <main class="flex-1 w-full overflow-y-auto p-4 sm:p-5 lg:px-6 lg:pt-6 lg:pb-6 bg-[#F8F5EF] lg:rounded-tl-[16px]">
              <div class="min-h-full">
                <div class="grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 justify-items-start">
                  ${this.renderCardGrid()}
                </div>
              </div>
            </main>
          </div>
        </div>

        ${this.renderModal()}
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    document.getElementById('hamburger-btn')?.addEventListener('click', () => {
      this.state.isSidebarOpen = !this.state.isSidebarOpen;
      this.render();
    });

    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
      this.state.isSidebarOpen = false;
      this.render();
    });

    document.getElementById('show-all-btn')?.addEventListener('click', () => {
      this.handleShowAll();
    });

    document.querySelectorAll('.label-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const labelSlug = e.currentTarget.dataset.label;
        this.handleLabelClick(labelSlug);
      });
    });

    document.getElementById('courses-tab')?.addEventListener('click', () => {
      this.handleTabClick('courses');
    });

    document.getElementById('resources-tab')?.addEventListener('click', () => {
      this.handleTabClick('resources');
    });

    document.querySelectorAll('[data-card-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        const cardId = e.currentTarget.dataset.cardId;
        const selectedCard = this.state.cards.find(c => c.id === cardId);
        if (selectedCard) {
          this.handleCardClick(selectedCard);
        }
      });
    });

    document.getElementById('close-modal-btn')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('modal-overlay')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('start-course-btn')?.addEventListener('click', () => {
      if (this.state.selectedCourse?.download_url) {
        window.open(this.state.selectedCourse.download_url, '_blank');
      }
      this.closeModal();
    });
  }

  destroy() {
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
  }
}
