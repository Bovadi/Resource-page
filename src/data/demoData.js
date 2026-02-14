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
 * @property {boolean} madeByYou - (Optional) Whether the user created this item
 * @property {boolean} sharedWithYou - (Optional) Whether this item was shared with the user
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
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Creating Visual BIPs for Confident Parent & Staff Support',
    type: 'course',
    description: 'Learn to create effective visual behavior intervention plans',
    video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    perfect_for: ['Staff training', 'Parent coaching', 'BCBA supervision'],
    madeByYou: true,
    sharedWithYou: false
  },
  {
    id: '2',
    image: '/images/BIPs/thumbnail-1.png',
    title: '5-4-3-2-1 Calm Visual Poster',
    type: 'resource',
    description: 'Downloadable poster for calming strategies',
    download_url: 'https://example.com/download/calm-poster.pdf',
    perfect_for: ['Classroom display', 'Home use', 'Therapy sessions'],
    madeByYou: true,
    sharedWithYou: false
  },
  {
    id: '3',
    image: 'public/images/BIPs/thumbnail-2.png',
    title: 'Self-Advocacy Visual: I need help',
    type: 'resource',
    description: 'Visual communication tool for self-advocacy',
    download_url: 'https://example.com/download/self-advocacy.pdf',
    perfect_for: ['Students with communication needs', 'Inclusive classrooms', 'Building independence'],
    madeByYou: false,
    sharedWithYou: true
  },
  {
    id: '4',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Feeding with Care: A Practical Guide',
    type: 'resource',
    description: 'Comprehensive guide for supporting picky eaters',
    download_url: 'https://example.com/download/feeding-guide.pdf',
    perfect_for: ['Parents of picky eaters', 'Feeding therapy support', 'Mealtime strategies'],
    madeByYou: false,
    sharedWithYou: true
  },
  {
    id: '5',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Supporting with Compassion & Understanding',
    type: 'resource',
    description: 'A guide for parents and teachers',
    download_url: 'https://example.com/download/compassion-guide.pdf',
    perfect_for: ['Parent education', 'Teacher training', 'Building empathy'],
    madeByYou: true,
    sharedWithYou: true
  },
  {
    id: '6',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Daily Behavior Tracking Chart',
    type: 'resource',
    description: 'Track daily behaviors with visual charts',
    download_url: 'https://example.com/download/behavior-chart.pdf',
    perfect_for: ['Daily progress monitoring', 'Parent-teacher communication', 'Data collection'],
    madeByYou: true,
    sharedWithYou: false
  },
  {
    id: '7',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Social Stories Template Collection',
    type: 'resource',
    description: 'Customizable social stories for various situations',
    download_url: 'https://example.com/download/social-stories.pdf',
    perfect_for: ['Social skill development', 'Transition preparation', 'Anxiety reduction'],
    madeByYou: false,
    sharedWithYou: true
  },
  {
    id: '8',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Sensory Break Visual Cards',
    type: 'resource',
    description: 'Visual cards for sensory regulation activities',
    download_url: 'https://example.com/download/sensory-break.pdf',
    perfect_for: ['Sensory regulation', 'Classroom breaks', 'Self-regulation skills'],
    madeByYou: false,
    sharedWithYou: false
  },
  {
    id: '9',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Communication Board Templates',
    type: 'resource',
    description: 'AAC communication boards for non-verbal students',
    download_url: 'https://example.com/download/communication-board.pdf',
    perfect_for: ['Non-verbal communication', 'AAC implementation', 'Language development'],
    madeByYou: true,
    sharedWithYou: false
  }
]; 