import React, { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { CardGrid } from "../../components/CardGrid";
import { CourseModal } from "../../components/CourseModal";
import { ContentManager } from "../../components/ContentManager";
import { AuthModal } from "../../components/AuthModal";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../hooks/useAuth";
// import { ContentService } from "../../services/contentService";
// import { LabelService, ContentLabel } from "../../services/labelService";
// import { checkSupabaseConnection } from "../../lib/supabase";
// import type { Content } from "../../lib/supabase";

interface Card {
  id: string;
  image: string;
  title: string;
  type: 'course' | 'resource';
  description?: string;
  description_long?: string;
  video_url?: string;
  test_url?: string;
  download_url?: string;
  perfect_for?: string[];
}

// Placeholder data for demonstration
const PLACEHOLDER_LABELS = [
  { id: '1', name: 'Welcome Start here', slug: 'welcome-start-here', display_order: 1, is_active: true, description: 'Getting started content', created_at: '', updated_at: '' },
  { id: '2', name: 'Developing FBA & BIPs', slug: 'developing-fba-bips', display_order: 2, is_active: true, description: 'Functional Behavior Assessment resources', created_at: '', updated_at: '' },
  { id: '3', name: 'Stakeholder Support Guides', slug: 'stakeholder-support-guides', display_order: 3, is_active: true, description: 'Support guides for stakeholders', created_at: '', updated_at: '' },
  { id: '4', name: 'Visual Supports', slug: 'visual-supports', display_order: 4, is_active: true, description: 'Visual aids and tools', created_at: '', updated_at: '' },
  { id: '5', name: 'Resources for Stakeholders', slug: 'resources-for-stakeholders', display_order: 5, is_active: true, description: 'Additional stakeholder resources', created_at: '', updated_at: '' }
];

const PLACEHOLDER_COURSES = [
  {
    id: '1',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSBJbWFnZTwvdGV4dD4KPHN2Zz4=',
    title: 'Creating Visual BIPs for Confident Parent & Staff Support',
    type: 'course' as const,
    description: 'Learn to create effective visual behavior intervention plans',
    description_long: 'This comprehensive course teaches you how to develop visual behavior intervention plans that support both parents and staff members in implementing consistent behavioral strategies.',
    video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    test_url: 'https://example.com/test',
    perfect_for: [
      'Staff training for escalation response',
      'Parent coaching at home',
      'BCBA supervision support'
    ]
  },
  {
    id: '2',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFkdmFuY2VkIENvdXJzZTwvdGV4dD4KPHN2Zz4=',
    title: 'Advanced Behavior Analysis Techniques',
    type: 'course' as const,
    description: 'Master advanced techniques in behavior analysis',
    description_long: 'Dive deep into advanced behavior analysis methodologies and learn cutting-edge techniques for complex behavioral interventions.',
    video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    test_url: 'https://example.com/test',
    perfect_for: [
      'Experienced practitioners',
      'Advanced certification requirements',
      'Complex case management'
    ]
  }
];

const PLACEHOLDER_RESOURCES = [
  {
    id: '3',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhbG0gUG9zdGVyPC90ZXh0Pgo8c3ZnPg==',
    title: '5-4-3-2-1 Calm Visual Poster',
    type: 'resource' as const,
    description: 'Downloadable poster for calming strategies',
    description_long: 'A beautifully designed visual poster that guides users through the 5-4-3-2-1 grounding technique for managing anxiety and stress.',
    download_url: 'https://example.com/download/calm-poster.pdf',
    perfect_for: [
      'Classroom display',
      'Home use for families',
      'Therapy session tool'
    ]
  },
  {
    id: '4',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNlbGYtQWR2b2NhY3k8L3RleHQ+CjxzdmcNCg==',
    title: 'Self-Advocacy Visual: I need help',
    type: 'resource' as const,
    description: 'Visual communication tool for self-advocacy',
    description_long: 'A comprehensive visual communication tool designed to help individuals express their need for assistance in various situations.',
    download_url: 'https://example.com/download/self-advocacy.pdf',
    perfect_for: [
      'Students with communication needs',
      'Inclusive classroom settings',
      'Building independence skills'
    ]
  },
  {
    id: '5',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZlZWRpbmcgR3VpZGU8L3RleHQ+CjxzdmcNCg==',
    title: 'Feeding with Care: A Practical Guide',
    type: 'resource' as const,
    description: 'Comprehensive guide for supporting picky eaters',
    description_long: 'A detailed practical guide that provides evidence-based strategies for supporting individuals with feeding challenges and picky eating behaviors.',
    download_url: 'https://example.com/download/feeding-guide.pdf',
    perfect_for: [
      'Parents of picky eaters',
      'Feeding therapy support',
      'Mealtime strategies'
    ]
  },
  {
    id: '6',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbXBhc3Npb24gR3VpZGU8L3RleHQ+CjxzdmcNCg==',
    title: 'Supporting with Compassion & Understanding',
    type: 'resource' as const,
    description: 'A guide for parents and teachers',
    description_long: 'An essential guide that helps parents and teachers develop compassionate approaches to supporting individuals with behavioral and developmental needs.',
    download_url: 'https://example.com/download/compassion-guide.pdf',
    perfect_for: [
      'Parent education',
      'Teacher training',
      'Building empathy skills'
    ]
  }
  },
  {
    id: '7',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGNUY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJlaGF2aW9yIENoYXJ0PC90ZXh0Pgo8c3ZnPg==',
    title: 'Daily Behavior Tracking Chart',
    type: 'resource' as const,
    description: 'Track daily behaviors with visual charts',
    download_url: 'https://example.com/download/behavior-chart.pdf',
    perfect_for: [
      'Daily progress monitoring',
      'Parent-teacher communication',
      'Data collection'
    ]
  },
  {
    id: '8',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGRkY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNvY2lhbCBTdG9yaWVzPC90ZXh0Pgo8c3ZnPg==',
    title: 'Social Stories Template Collection',
    type: 'resource' as const,
    description: 'Customizable social stories for various situations',
    download_url: 'https://example.com/download/social-stories.pdf',
    perfect_for: [
      'Social skill development',
      'Transition preparation',
      'Anxiety reduction'
    ]
  },
  {
    id: '9',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGNUZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNlbnNvcnkgQnJlYWs8L3RleHQ+CjxzdmcNCg==',
    title: 'Sensory Break Visual Cards',
    type: 'resource' as const,
    description: 'Visual cards for sensory regulation activities',
    download_url: 'https://example.com/download/sensory-break.pdf',
    perfect_for: [
      'Sensory regulation',
      'Classroom breaks',
      'Self-regulation skills'
    ]
  },
  {
    id: '10',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGNUY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbW11bmljYXRpb248L3RleHQ+CjxzdmcNCg==',
    title: 'Communication Board Templates',
    type: 'resource' as const,
    description: 'AAC communication boards for non-verbal students',
    download_url: 'https://example.com/download/communication-board.pdf',
    perfect_for: [
      'Non-verbal communication',
      'AAC implementation',
      'Language development'
    ]
  },
  {
    id: '11',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRyYW5zaXRpb24gVG9vbDwvdGV4dD4KPHN2Zz4=',
    title: 'Transition Timer Visual Tool',
    type: 'resource' as const,
    description: 'Visual timer for smooth transitions',
    download_url: 'https://example.com/download/transition-timer.pdf',
    perfect_for: [
      'Activity transitions',
      'Time management',
      'Reducing anxiety'
    ]
  },
  {
    id: '12',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVtb3Rpb24gQ2FyZHM8L3RleHQ+CjxzdmcNCg==',
    title: 'Emotion Recognition Cards',
    type: 'resource' as const,
    description: 'Visual cards for identifying emotions',
    download_url: 'https://example.com/download/emotion-cards.pdf',
    perfect_for: [
      'Emotional literacy',
      'Social skills training',
      'Self-awareness building'
    ]
  },
  {
    id: '13',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGRkYwIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJld2FyZCBDaGFydDwvdGV4dD4KPHN2Zz4=',
    title: 'Token Economy Reward Chart',
    type: 'resource' as const,
    description: 'Customizable reward system charts',
    download_url: 'https://example.com/download/reward-chart.pdf',
    perfect_for: [
      'Motivation systems',
      'Positive reinforcement',
      'Goal achievement'
    ]
  },
  {
    id: '14',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGNUZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNob2ljZSBCb2FyZDwvdGV4dD4KPHN2Zz4=',
    title: 'Choice Making Visual Board',
    type: 'resource' as const,
    description: 'Visual choice boards for decision making',
    download_url: 'https://example.com/download/choice-board.pdf',
    perfect_for: [
      'Decision making skills',
      'Independence building',
      'Reducing frustration'
    ]
  },
  {
    id: '15',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZpcnN0LVRoZW4gQ2FyZDwvdGV4dD4KPHN2Zz4=',
    title: 'First-Then Visual Schedule Cards',
    type: 'resource' as const,
    description: 'Simple first-then sequence cards',
    download_url: 'https://example.com/download/first-then.pdf',
    perfect_for: [
      'Task sequencing',
      'Motivation building',
      'Clear expectations'
    ]
  },
  {
    id: '16',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGMEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJyZWF0aGluZyBHdWlkZTwvdGV4dD4KPHN2Zz4=',
    title: 'Deep Breathing Exercise Guide',
    type: 'resource' as const,
    description: 'Visual guide for calming breathing exercises',
    download_url: 'https://example.com/download/breathing-guide.pdf',
    perfect_for: [
      'Anxiety management',
      'Self-regulation',
      'Mindfulness practice'
    ]
  },
  {
    id: '17',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvcGluZyBTdHJhdGVnaWVzPC90ZXh0Pgo8c3ZnPg==',
    title: 'Coping Strategies Visual Menu',
    type: 'resource' as const,
    description: 'Menu of coping strategies for difficult moments',
    download_url: 'https://example.com/download/coping-strategies.pdf',
    perfect_for: [
      'Crisis prevention',
      'Self-regulation tools',
      'Emotional support'
    ]
  },
  {
    id: '18',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGNUYwIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdvYWwgU2V0dGluZzwvdGV4dD4KPHN2Zz4=',
    title: 'Goal Setting Worksheet',
    type: 'resource' as const,
    description: 'Visual worksheet for setting and tracking goals',
    download_url: 'https://example.com/download/goal-setting.pdf',
    perfect_for: [
      'IEP goal tracking',
      'Personal development',
      'Progress monitoring'
    ]
  },
  {
    id: '19',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjVGRkY1Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleXQtYW5jaG9yPSJtaWRkbGUiPkZyaWVuZHNoaXAgU2tpbGxzPC90ZXh0Pgo8c3ZnPg==',
    title: 'Friendship Skills Social Guide',
    type: 'resource' as const,
    description: 'Guide for developing friendship and social skills',
    download_url: 'https://example.com/download/friendship-skills.pdf',
    perfect_for: [
      'Social skill development',
      'Peer interaction',
      'Relationship building'
    ]
  },
  {
    id: '20',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNsYXNzcm9vbSBSdWxlczwvdGV4dD4KPHN2Zz4=',
    title: 'Classroom Rules Visual Poster',
    type: 'resource' as const,
    description: 'Visual poster displaying classroom expectations',
    download_url: 'https://example.com/download/classroom-rules.pdf',
    perfect_for: [
      'Classroom management',
      'Clear expectations',
      'Behavior support'
    ]
  },
  {
    id: '21',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFuZ2VyIE1hbmFnZW1lbnQ8L3RleHQ+CjxzdmcNCg==',
    title: 'Anger Management Toolkit',
    type: 'resource' as const,
    description: 'Comprehensive toolkit for managing anger and frustration',
    download_url: 'https://example.com/download/anger-management.pdf',
    perfect_for: [
      'Emotional regulation',
      'Crisis prevention',
      'Self-control skills'
    ]
  },
  {
    id: '22',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGOEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRhaWx5IFNjaGVkdWxlPC90ZXh0Pgo8c3ZnPg==',
    title: 'Visual Daily Schedule Template',
    type: 'resource' as const,
    description: 'Customizable daily schedule with visual supports',
    download_url: 'https://example.com/download/daily-schedule.pdf',
    perfect_for: [
      'Routine establishment',
      'Predictability',
      'Independence building'
    ]
];

export const Resources = (): JSX.Element => {
  // Simple state management - no refs, no complex logic
  const [activeTab, setActiveTab] = useState<'courses' | 'resources'>('resources');
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContentManager, setShowContentManager] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [labels, setLabels] = useState(PLACEHOLDER_LABELS);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [contentCounts, setContentCounts] = useState<Record<string, number>>({
    'welcome-start-here': 3,
    'developing-fba-bips': 2,
    'stakeholder-support-guides': 4,
    'visual-supports': 3,
    'resources-for-stakeholders': 2
  });
  const [contentCountsByType, setContentCountsByType] = useState<Record<string, { courses: number; resources: number }>>({
    'welcome-start-here': { courses: 1, resources: 2 },
    'developing-fba-bips': { courses: 2, resources: 0 },
    'stakeholder-support-guides': { courses: 0, resources: 4 },
    'visual-supports': { courses: 0, resources: 3 },
    'resources-for-stakeholders': { courses: 0, resources: 2 }
  });
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('connected');
  
  // Modal and auth hooks
  const { isOpen, selectedCourse, openModal, closeModal } = useModal();
  const [modalContentType, setModalContentType] = useState<'course' | 'resource'>('course');
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();

  // Load data function - completely isolated
  const loadData = async (type: 'course' | 'resource', labelSlug?: string) => {
    // Only show loading skeleton on initial load, not during navigation
    const isInitialLoad = cards.length === 0;
    
    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Use placeholder data instead of backend
      let allContent = [...PLACEHOLDER_COURSES, ...PLACEHOLDER_RESOURCES];
      let content;
      
      // Filter by type
      content = allContent.filter(item => item.type === type);
      
      // Filter by label if specified
      if (labelSlug) {
        // For demo purposes, show different content based on label
        if (labelSlug === 'developing-fba-bips') {
          content = content.filter(item => item.title.toLowerCase().includes('bip') || item.title.toLowerCase().includes('behavior'));
        } else if (labelSlug === 'visual-supports') {
          content = content.filter(item => item.title.toLowerCase().includes('visual') || item.title.toLowerCase().includes('poster'));
        } else if (labelSlug === 'stakeholder-support-guides') {
          content = content.filter(item => item.title.toLowerCase().includes('guide') || item.title.toLowerCase().includes('support'));
        }
      }
      
      setCards(content);
    } catch (err) {
      console.error('Load data error:', err);
      setError('Failed to load content');
      setCards([]);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  // Load navigation labels
  const loadLabels = async () => {
    // Labels are now loaded from placeholder data - no async operation needed
    console.log('Labels loaded from placeholder data');
  };
  
  // Tab click handler - completely isolated
  const handleTabClick = (tabKey: 'courses' | 'resources') => {
    if (tabKey === activeTab || loading) return;
    
    setActiveTab(tabKey);
    const cardType = tabKey === 'courses' ? 'course' : 'resource';
    
    // Only show loading skeleton on initial load, not during tab navigation
    const isInitialLoad = cards.length === 0;
    
    if (isInitialLoad) {
      setLoading(true);
      setError(null);
      loadData(cardType, selectedLabel || undefined);
    } else {
      // Don't show loading skeleton for navigation - keep existing cards visible
      setError(null);
      loadData(cardType, selectedLabel || undefined);
    }
  };

  // Handle navigation label click
  const handleLabelClick = (labelSlug: string) => {
    setSelectedLabel(labelSlug);
    // Don't show loading skeleton for navigation - keep existing cards visible
    
    // Only show loading skeleton on initial load, not during navigation
    const isInitialLoad = cards.length === 0;
    if (isInitialLoad) {
      setLoading(true);
    }
    
    const cardType = activeTab === 'courses' ? 'course' : 'resource';
    
    // Load data with conditional loading state
    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);
    
    loadData(cardType, labelSlug);
  };

  // Handle "Show All" button click
  const handleShowAll = () => {
    setSelectedLabel(null);
    
    // Only show loading skeleton on initial load, not during navigation
    const isInitialLoad = cards.length === 0;
    if (isInitialLoad) {
      setLoading(true);
    }
    
    const cardType = activeTab === 'courses' ? 'course' : 'resource';
    
    // Load data with conditional loading state
    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);
    
    loadData(cardType); // No labelSlug parameter = show all
  };

  // Check if a tab should be disabled based on current filter
  const isTabDisabled = (tabType: 'courses' | 'resources') => {
    if (!selectedLabel) {
      // No filter applied - check overall counts
      return false; // Always allow switching when no filter is applied
    }
    
    const counts = contentCountsByType[selectedLabel];
    if (!counts) return true; // No data available, disable
    
    return tabType === 'courses' ? counts.courses === 0 : counts.resources === 0;
  };

  // Load initial resources data only once when component mounts
  React.useEffect(() => {
    // loadLabels(); // No longer needed since we use placeholder data
    loadData('resource');
  }, []); // Empty dependency array - runs only once

  const handleRetry = () => {
    const cardType = activeTab === 'courses' ? 'course' : 'resource';
    loadData(cardType, selectedLabel || undefined);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setShowContentManager(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowContentManager(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowContentManager(false);
  };

  // Handle card click with content type
  const handleCardClick = (card: Card, contentType: 'course' | 'resource' = 'course') => {
    setModalContentType(contentType);
    openModal(card);
  };
  // Navigation links data
  const navLinks = [
    "Welcome Start here",
    "Developing FBA & BIPs",
    "Print your Behavior Guide!",
    "Stakeholder Support Guides",
    "Visual Supports",
    "Resources for Stakeholders",
    "Video Collection",
  ];

  // Main navigation tabs
  const mainTabs = [
    { name: "BIPs", active: false },
    { name: "Resources", active: true },
    { name: "Strategies", active: false },
  ];

  // Sub navigation tabs
  const subTabs = [
    { name: "Courses", active: activeTab === 'courses', key: 'courses' as const },
    { name: "Resources", active: activeTab === 'resources', key: 'resources' as const },
  ];

  // Show content manager for admin purposes
  if (showContentManager) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowContentManager(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              ← Back to Resources
            </button>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600">
                  Logged in as: {user.email}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <ContentManager />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-screen bg-white border border-solid border-black overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full h-[61px] bg-[#f8f5ef] z-20">
        <div className="flex items-center justify-between px-4 sm:px-5 h-full">
          {/* Logo */}
          <img
            className="h-4 sm:h-6 w-auto object-contain"
            alt="Logo"
            src="/large-3.png"
          />

          {/* Main Navigation - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 h-full">
            {mainTabs.map((tab, index) => (
              <div
                key={index}
                className="flex flex-col w-16 lg:w-[88px] h-full items-center justify-end gap-2"
              >
                <span className="font-normal text-[#343434] text-sm lg:text-base">
                  {tab.name}
                </span>
                <div
                  className={`w-full h-[3px] ${tab.active ? "bg-[#343434]" : ""}`}
                />
              </div>
            ))}
          </div>

          {/* Upgrade Button */}
          <Button
            variant="outline"
            className="bg-white border-[#343434] rounded h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-base"
            onClick={handleAdminClick}
            disabled={authLoading}
          >
            <span className="font-semibold text-[#343434]">
              {isAuthenticated ? 'Admin' : 'Admin Login'}
            </span>
            <img className="w-2 sm:w-3 h-3 sm:h-4 ml-1 sm:ml-2" alt="Vector" src="/vector.svg" />
          </Button>
        </div>
        <Separator className="bg-[#d9d9d9]" />
      </header>

      <div className="fixed top-[61px] left-0 right-0 bottom-0 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="fixed top-[61px] left-0 w-full lg:w-72 h-[calc(100vh-61px)] bg-white lg:bg-transparent border-b lg:border-b-0 border-gray-200 z-10 lg:relative lg:top-0">
          <nav className="p-4 lg:p-6 lg:pt-[72px] h-full overflow-y-auto">
            
            <ul className="space-y-2 lg:space-y-4">
              <li>
                <button
                  onClick={() => handleShowAll()}
                  className={`w-full text-left py-3 px-4 text-sm rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border ${
                    selectedLabel === null
                      ? "bg-[#f8f8f9] text-[#343434] shadow-sm border border-gray-100 font-medium" 
                      : "text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <span>Show All</span>
                </button>
              </li>
              {labels.map((label) => (
                <li key={label.id}>
                  <button
                    onClick={() => handleLabelClick(label.slug)}
                    className={`w-full text-left py-3 px-4 text-sm rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border ${
                      selectedLabel === label.slug
                        ? "bg-[#f8f8f9] shadow-sm border border-gray-100 font-medium" 
                        : "border border-transparent hover:bg-opacity-80"
                    }`}
                  >
                    <span>{label.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-0 mt-[calc(100vh-61px)] lg:mt-0">
          {/* Sub Navigation */}
          <div className="fixed top-[61px] lg:top-[61px] left-0 lg:left-72 right-0 flex items-center py-4 bg-white lg:bg-transparent z-10 border-b lg:border-b-0 border-gray-200 flex gap-4">
            {subTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(tab.key)}
                disabled={loading || isTabDisabled(tab.key)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center box-border ${
                  tab.active
                    ? "bg-[#f8f8f9] text-[#343434] shadow-sm" 
                    : isTabDisabled(tab.key)
                    ? "text-gray-400 bg-gray-50 cursor-not-allowed border border-transparent"
                    : "text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent"
                } ${(loading || isTabDisabled(tab.key)) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tab.name}
                {selectedLabel && contentCountsByType[selectedLabel] && (
                  <span className="ml-2 text-xs opacity-60">
                    ({tab.key === 'courses' ? contentCountsByType[selectedLabel].courses : contentCountsByType[selectedLabel].resources})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Card Grid Container */}
          <main className="fixed top-[113px] lg:top-[113px] left-0 lg:left-72 right-0 bottom-0 overflow-y-auto p-4 lg:px-6 lg:pt-6 lg:pb-6 bg-[#F8F5EF] rounded-tl-[16px] mt-4">
            <div className="min-h-full">
              <CardGrid 
                cards={cards}
                loading={loading}
                error={error}
                onRetry={handleRetry}
                onCardClick={handleCardClick}
                activeTab={activeTab}
              />
            </div>
          </main>
        </div>
      </div>
      
      {/* Course Modal */}
      <CourseModal 
        isOpen={isOpen}
        onClose={closeModal}
        course={selectedCourse}
        contentType={modalContentType}
      />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};