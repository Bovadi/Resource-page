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
    title: 'Bouv Problem Behavior Plan',
    description: 'Learn to create effective visual behavior intervention plans',
    perfect_for: ['Staff training', 'Parent coaching', 'BCBA supervision'],
    madeByYou: true,
    sharedWithYou: false
  },
  {
    id: '2',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Downloadable poster for calming strategies',
    perfect_for: ['Classroom display', 'Home use', 'Therapy sessions'],
    madeByYou: true,
    sharedWithYou: false
  },
  {
    id: '3',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Visual communication tool for self-advocacy',
    perfect_for: ['Students with communication needs', 'Inclusive classrooms', 'Building independence'],
    madeByYou: false,
    sharedWithYou: true
  },
  {
    id: '4',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Comprehensive guide for supporting picky eaters',
    perfect_for: ['Parents of picky eaters', 'Feeding therapy support', 'Mealtime strategies'],
    madeByYou: false,
    sharedWithYou: true
  },
  {
    id: '5',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'A guide for parents and teachers',
    perfect_for: ['Parent education', 'Teacher training', 'Building empathy'],
    madeByYou: true,
    sharedWithYou: true
  },
  {
    id: '6',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Track daily behaviors with visual charts',
    perfect_for: ['Daily progress monitoring', 'Parent-teacher communication', 'Data collection'],
    madeByYou: true,
    sharedWithYou: false
  },
  {
    id: '7',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Customizable social stories for various situations',
    perfect_for: ['Social skill development', 'Transition preparation', 'Anxiety reduction'],
    madeByYou: false,
    sharedWithYou: true
  },
  {
    id: '8',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Visual cards for sensory regulation activities',
    perfect_for: ['Sensory regulation', 'Classroom breaks', 'Self-regulation skills'],
    madeByYou: false,
    sharedWithYou: false
  },
  {
    id: '9',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'AAC communication boards for non-verbal students',
    perfect_for: ['Non-verbal communication', 'AAC implementation', 'Language development'],
    madeByYou: true,
    sharedWithYou: false
  },
  {
    id: '10',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Visual timer for smooth transitions',
    perfect_for: ['Activity transitions', 'Time management', 'Reducing anxiety'],
    madeByYou: false,
    sharedWithYou: true
  },
  {
    id: '11',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Visual cards for identifying emotions',
    perfect_for: ['Emotional literacy', 'Social skills training', 'Self-awareness building']
  },
  {
    id: '12',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Customizable reward system charts',
    perfect_for: ['Motivation systems', 'Positive reinforcement', 'Goal achievement']
  },
  {
    id: '13',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Visual choice boards for decision making',
    perfect_for: ['Decision making skills', 'Independence building', 'Reducing frustration']
  },
  {
    id: '14',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Simple first-then sequence cards',
    perfect_for: ['Task sequencing', 'Motivation building', 'Clear expectations']
  },
  {
    id: '15',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Visual guide for calming breathing exercises',
    perfect_for: ['Anxiety management', 'Self-regulation', 'Mindfulness practice']
  },
  {
    id: '16',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Menu of coping strategies for difficult moments',
    perfect_for: ['Crisis prevention', 'Self-regulation tools', 'Emotional support']
  },
  {
    id: '17',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Visual worksheet for setting and tracking goals',
    perfect_for: ['IEP goal tracking', 'Personal development', 'Progress monitoring']
  },
  {
    id: '18',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Guide for developing friendship and social skills',
    perfect_for: ['Social skill development', 'Peer interaction', 'Relationship building']
  },
  {
    id: '19',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Visual poster displaying classroom expectations',
    perfect_for: ['Classroom management', 'Clear expectations', 'Behavior support']
  },
  {
    id: '20',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Comprehensive toolkit for managing anger and frustration',
    perfect_for: ['Emotional regulation', 'Crisis prevention', 'Self-control skills']
  },
  {
    id: '21',
    image: '/images/BIPs/thumbnail-1.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Customizable daily schedule with visual supports',
    perfect_for: ['Routine establishment', 'Predictability', 'Independence building']
  },
  {
    id: '22',
    image: '/images/BIPs/thumbnail-2.png',
    title: 'Bouv Problem Behavior Plan',
    description: 'Positive affirmation cards for daily motivation',
    perfect_for: ['Positive reinforcement', 'Building confidence', 'Daily encouragement']
  }
];