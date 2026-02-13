/**
 * SAMPLE DATA FOR RESOURCES PORTAL
 *
 * This file contains static sample data for the application.
 * No database connection required - all data is defined here.
 *
 * Data Structure:
 * ---------------
 * Each card object has the following properties:
 *
 * @property {string} id - Unique identifier for the card
 * @property {string} image - Image URL (can be base64 data URI or external URL)
 * @property {string} title - Display title of the resource/course
 * @property {string} type - Either 'resource' or 'course'
 * @property {string} description - Brief description of the content
 * @property {string} video_url - (Optional) URL for video content (for courses)
 * @property {string} download_url - (Optional) URL for downloadable content (for resources)
 * @property {Array<string>} perfect_for - Array of use case tags
 *
 * Usage:
 * ------
 * Import and use this data in your components:
 *
 *   import { SAMPLE_CARDS } from './src/data/demoData.js';
 *
 *   const resources = SAMPLE_CARDS.filter(card => card.type === 'resource');
 *   const courses = SAMPLE_CARDS.filter(card => card.type === 'course');
 */

export const SAMPLE_CARDS = [
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
