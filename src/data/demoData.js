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
    image: '/images/courses/bip-course.png',
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
    image: '/images/resources/calm-poster.png',
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
    image: '/images/resources/self-advocacy.png',
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
    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    image: 'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    image: 'https://images.pexels.com/photos/7092614/pexels-photo-7092614.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    image: 'https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    image: 'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    image: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Communication Board Templates',
    type: 'resource',
    description: 'AAC communication boards for non-verbal students',
    download_url: 'https://example.com/download/communication-board.pdf',
    perfect_for: ['Non-verbal communication', 'AAC implementation', 'Language development'],
    madeByYou: true,
    sharedWithYou: false
  },
  {
    id: '10',
    image: 'https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Transition Timer Visual Tool',
    type: 'resource',
    description: 'Visual timer for smooth transitions',
    download_url: 'https://example.com/download/transition-timer.pdf',
    perfect_for: ['Activity transitions', 'Time management', 'Reducing anxiety'],
    madeByYou: false,
    sharedWithYou: true
  },
  {
    id: '11',
    image: 'https://images.pexels.com/photos/6224442/pexels-photo-6224442.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Emotion Recognition Cards',
    type: 'resource',
    description: 'Visual cards for identifying emotions',
    download_url: 'https://example.com/download/emotion-cards.pdf',
    perfect_for: ['Emotional literacy', 'Social skills training', 'Self-awareness building']
  },
  {
    id: '12',
    image: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Token Economy Reward Chart',
    type: 'resource',
    description: 'Customizable reward system charts',
    download_url: 'https://example.com/download/reward-chart.pdf',
    perfect_for: ['Motivation systems', 'Positive reinforcement', 'Goal achievement']
  },
  {
    id: '13',
    image: 'https://images.pexels.com/photos/6147276/pexels-photo-6147276.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Choice Making Visual Board',
    type: 'resource',
    description: 'Visual choice boards for decision making',
    download_url: 'https://example.com/download/choice-board.pdf',
    perfect_for: ['Decision making skills', 'Independence building', 'Reducing frustration']
  },
  {
    id: '14',
    image: 'https://images.pexels.com/photos/6936461/pexels-photo-6936461.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'First-Then Visual Schedule Cards',
    type: 'resource',
    description: 'Simple first-then sequence cards',
    download_url: 'https://example.com/download/first-then.pdf',
    perfect_for: ['Task sequencing', 'Motivation building', 'Clear expectations']
  },
  {
    id: '15',
    image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Deep Breathing Exercise Guide',
    type: 'resource',
    description: 'Visual guide for calming breathing exercises',
    download_url: 'https://example.com/download/breathing-guide.pdf',
    perfect_for: ['Anxiety management', 'Self-regulation', 'Mindfulness practice']
  },
  {
    id: '16',
    image: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Coping Strategies Visual Menu',
    type: 'resource',
    description: 'Menu of coping strategies for difficult moments',
    download_url: 'https://example.com/download/coping-strategies.pdf',
    perfect_for: ['Crisis prevention', 'Self-regulation tools', 'Emotional support']
  },
  {
    id: '17',
    image: 'https://images.pexels.com/photos/6929018/pexels-photo-6929018.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Goal Setting Worksheet',
    type: 'resource',
    description: 'Visual worksheet for setting and tracking goals',
    download_url: 'https://example.com/download/goal-setting.pdf',
    perfect_for: ['IEP goal tracking', 'Personal development', 'Progress monitoring']
  },
  {
    id: '18',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Friendship Skills Social Guide',
    type: 'resource',
    description: 'Guide for developing friendship and social skills',
    download_url: 'https://example.com/download/friendship-skills.pdf',
    perfect_for: ['Social skill development', 'Peer interaction', 'Relationship building']
  },
  {
    id: '19',
    image: 'https://images.pexels.com/photos/8500301/pexels-photo-8500301.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Classroom Rules Visual Poster',
    type: 'resource',
    description: 'Visual poster displaying classroom expectations',
    download_url: 'https://example.com/download/classroom-rules.pdf',
    perfect_for: ['Classroom management', 'Clear expectations', 'Behavior support']
  },
  {
    id: '20',
    image: 'https://images.pexels.com/photos/7176325/pexels-photo-7176325.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Anger Management Toolkit',
    type: 'resource',
    description: 'Comprehensive toolkit for managing anger and frustration',
    download_url: 'https://example.com/download/anger-management.pdf',
    perfect_for: ['Emotional regulation', 'Crisis prevention', 'Self-control skills']
  },
  {
    id: '21',
    image: 'https://images.pexels.com/photos/6932293/pexels-photo-6932293.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Visual Daily Schedule Template',
    type: 'resource',
    description: 'Customizable daily schedule with visual supports',
    download_url: 'https://example.com/download/daily-schedule.pdf',
    perfect_for: ['Routine establishment', 'Predictability', 'Independence building']
  },
  {
    id: '22',
    image: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Motivation & Encouragement Cards',
    type: 'resource',
    description: 'Positive affirmation cards for daily motivation',
    download_url: 'https://example.com/download/motivation-cards.pdf',
    perfect_for: ['Positive reinforcement', 'Building confidence', 'Daily encouragement']
  }
];
