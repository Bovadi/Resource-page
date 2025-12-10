// Fixed 256px Card System - Pure Vanilla JavaScript
// No React dependencies - only DOM manipulation and Tailwind CSS

// Sample data for demonstration
const SAMPLE_CARDS = [
    {
        id: '1',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSAxPC90ZXh0Pgo8L3N2Zz4=',
        title: 'Creating Visual BIPs for Confident Parent & Staff Support',
        type: 'course'
    },
    {
        id: '2',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDE8L3RleHQ+Cjwvc3ZnPg==',
        title: '5-4-3-2-1 Calm Visual Poster',
        type: 'resource'
    },
    {
        id: '3',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSAyPC90ZXh0Pgo8L3N2Zz4=',
        title: 'Advanced Behavior Analysis Techniques',
        type: 'course'
    },
    {
        id: '4',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDI8L3RleHQ+Cjwvc3ZnPg==',
        title: 'Self-Advocacy Visual: I need help',
        type: 'resource'
    },
    {
        id: '5',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSAzPC90ZXh0Pgo8L3N2Zz4=',
        title: 'Functional Behavior Assessment Fundamentals',
        type: 'course'
    },
    {
        id: '6',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDM8L3RleHQ+Cjwvc3ZnPg==',
        title: 'Feeding with Care: A Practical Guide',
        type: 'resource'
    },
    {
        id: '7',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSA0PC90ZXh0Pgo8L3N2Zz4=',
        title: 'Data Collection and Analysis Methods',
        type: 'course'
    },
    {
        id: '8',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDQ8L3RleHQ+Cjwvc3ZnPg==',
        title: 'Supporting with Compassion & Understanding',
        type: 'resource'
    },
    {
        id: '9',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSA1PC90ZXh0Pgo8L3N2Zz4=',
        title: 'Crisis Prevention and Management',
        type: 'course'
    },
    {
        id: '10',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDU8L3RleHQ+Cjwvc3ZnPg==',
        title: 'Behavior Tracking Chart Template',
        type: 'resource'
    },
    {
        id: '11',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSA2PC90ZXh0Pgo8L3N2Zz4=',
        title: 'Autism Spectrum Support Strategies',
        type: 'course'
    },
    {
        id: '12',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDY8L3RleHQ+Cjwvc3ZnPg==',
        title: 'Social Stories Template Collection',
        type: 'resource'
    },
    {
        id: '13',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSA3PC90ZXh0Pgo8L3N2Zz4=',
        title: 'Communication and Social Skills Training',
        type: 'course'
    },
    {
        id: '14',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDc8L3RleHQ+Cjwvc3ZnPg==',
        title: 'Visual Communication Board',
        type: 'resource'
    },
    {
        id: '15',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSA4PC90ZXh0Pgo8L3N2Zz4=',
        title: 'Transition Planning and Life Skills',
        type: 'course'
    },
    {
        id: '16',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDg8L3RleHQ+Cjwvc3ZnPg==',
        title: 'Sensory Break Activity Cards',
        type: 'resource'
    },
    {
        id: '17',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSA5PC90ZXh0Pgo8L3N2Zz4=',
        title: 'Professional Ethics and Standards',
        type: 'course'
    },
    {
        id: '18',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDk8L3RleHQ+Cjwvc3ZnPg==',
        title: 'Emotion Regulation Toolkit',
        type: 'resource'
    },
    {
        id: '19',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSAxMDwvdGV4dD4KPHN2Zz4=',
        title: 'Family-Centered Support Approaches',
        type: 'course'
    },
    {
        id: '20',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI2MiIgdmlld0JveD0iMCAwIDI1NiAyNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjYyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTMxIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc291cmNlIDEwPC90ZXh0Pgo8L3N2Zz4=',
        title: 'Visual Daily Schedule Template',
        type: 'resource'
    }
];

// Application state
let currentState = {
    cards: [],
    loading: false,
    error: null
};

// DOM elements
const elements = {
    loadingState: document.getElementById('loadingState'),
    cardGrid: document.getElementById('cardGrid')
};

// Create a single card element
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-256';
    
    cardDiv.innerHTML = `
        <div class="bg-white border border-gray-200 card-hover shadow-sm mb-3 rounded-lg">
            <div class="p-4">
                <div class="relative w-full" style="aspect-ratio: 256/262;">
                    <img
                        class="w-full h-full object-cover rounded-sm"
                        alt="${card.title}"
                        src="${card.image}"
                        loading="lazy"
                    />
                    
                    ${card.type === 'resource' ? `
                        <div class="download-overlay">
                            <div class="download-icon">
                                <svg class="w-6 h-6 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
        
        <div class="w-full">
            <p class="font-normal text-gray-700 text-sm leading-relaxed line-clamp-2">
                ${card.title}
            </p>
        </div>
    `;
    
    // Add click event listener
    cardDiv.addEventListener('click', () => {
        handleCardClick(card);
    });
    
    return cardDiv;
}

// Create loading skeleton
function createLoadingSkeleton() {
    const skeletonDiv = document.createElement('div');
    skeletonDiv.className = 'card-256 animate-pulse';
    
    skeletonDiv.innerHTML = `
        <div class="bg-white border border-gray-200 shadow-sm mb-3 rounded-lg">
            <div class="p-4">
                <div class="relative w-full bg-gray-200 rounded-sm" style="aspect-ratio: 256/262;"></div>
            </div>
        </div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
    `;
    
    return skeletonDiv;
}

// Show loading state
function showLoading() {
    currentState.loading = true;
    elements.cardGrid.style.display = 'none';
    elements.loadingState.style.display = 'flex';
    
    // Clear existing skeletons
    elements.loadingState.innerHTML = '';
    
    // Add 8 loading skeletons
    for (let i = 0; i < 8; i++) {
        elements.loadingState.appendChild(createLoadingSkeleton());
    }
}

// Hide loading state
function hideLoading() {
    currentState.loading = false;
    elements.loadingState.style.display = 'none';
    elements.cardGrid.style.display = 'flex';
}

// Render cards
function renderCards(cards) {
    // Clear existing cards
    elements.cardGrid.innerHTML = '';
    
    if (cards.length === 0) {
        elements.cardGrid.innerHTML = `
            <div class="col-span-full text-center py-12 w-full">
                <p class="text-gray-500">No cards found.</p>
            </div>
        `;
        return;
    }
    
    // Create and append card elements
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        elements.cardGrid.appendChild(cardElement);
    });
}

// Handle card click
function handleCardClick(card) {
    console.log('Card clicked:', card);
    alert(`Clicked on: ${card.title}\nType: ${card.type}`);
}

// Load data (simulated async operation)
function loadData() {
    showLoading();
    
    // Simulate network delay
    setTimeout(() => {
        currentState.cards = SAMPLE_CARDS;
        renderCards(currentState.cards);
        hideLoading();
    }, 1000);
}

// Initialize the application
function init() {
    console.log('🚀 Fixed 256px Card System initialized');
    loadData();
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}