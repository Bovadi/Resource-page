// Static data - In a real implementation, this would come from an API
const SAMPLE_DATA = {
    labels: [
        { id: '1', name: 'Welcome Start here', slug: 'welcome-start-here', display_order: 1, is_active: true },
        { id: '2', name: 'Developing FBA & BIPs', slug: 'developing-fba-bips', display_order: 2, is_active: true },
        { id: '3', name: 'Stakeholder Support Guides', slug: 'stakeholder-support-guides', display_order: 3, is_active: true },
        { id: '4', name: 'Visual Supports', slug: 'visual-supports', display_order: 4, is_active: true },
        { id: '5', name: 'Resources for Stakeholders', slug: 'resources-for-stakeholders', display_order: 5, is_active: true }
    ],
    
    content: [
        {
            id: '1',
            title: 'Creating Visual BIPs for Confident Parent & Staff Support',
            description: 'Learn to create effective visual behavior intervention plans',
            description_long: 'This comprehensive course teaches you how to develop visual behavior intervention plans that support both parents and staff members in implementing consistent behavioral strategies.',
            type: 'course',
            status: 'published',
            video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            test_url: 'https://example.com/test',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSBJbWFnZTwvdGV4dD4KPHN2Zz4=',
            perfect_for: [
                'Staff training for escalation response',
                'Parent coaching at home',
                'BCBA supervision support'
            ],
            labels: ['developing-fba-bips']
        },
        {
            id: '2',
            title: '5-4-3-2-1 Calm Visual Poster',
            description: 'Downloadable poster for calming strategies',
            description_long: 'A beautifully designed visual poster that guides users through the 5-4-3-2-1 grounding technique for managing anxiety and stress.',
            type: 'resource',
            status: 'published',
            download_url: 'https://example.com/download/calm-poster.pdf',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhbG0gUG9zdGVyPC90ZXh0Pgo8c3ZnPg==',
            perfect_for: [
                'Classroom display',
                'Home use for families',
                'Therapy session tool'
            ],
            labels: ['visual-supports']
        },
        {
            id: '3',
            title: 'Self-Advocacy Visual: I need help',
            description: 'Visual communication tool for self-advocacy',
            type: 'resource',
            status: 'published',
            download_url: 'https://example.com/download/self-advocacy.pdf',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNlbGYtQWR2b2NhY3k8L3RleHQ+CjxzdmcNCg==',
            perfect_for: [
                'Students with communication needs',
                'Inclusive classroom settings',
                'Building independence skills'
            ],
            labels: ['visual-supports', 'resources-for-stakeholders']
        },
        {
            id: '4',
            title: 'Feeding with Care: A Practical Guide',
            description: 'Comprehensive guide for supporting picky eaters',
            type: 'resource',
            status: 'published',
            download_url: 'https://example.com/download/feeding-guide.pdf',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjhGMEZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZlZWRpbmcgR3VpZGU8L3RleHQ+CjxzdmcNCg==',
            perfect_for: [
                'Parents of picky eaters',
                'Feeding therapy support',
                'Mealtime strategies'
            ],
            labels: ['stakeholder-support-guides']
        },
        {
            id: '5',
            title: 'Supporting with Compassion & Understanding',
            description: 'A guide for parents and teachers',
            type: 'resource',
            status: 'published',
            download_url: 'https://example.com/download/compassion-guide.pdf',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbXBhc3Npb24gR3VpZGU8L3RleHQ+CjxzdmcNCg==',
            perfect_for: [
                'Parent education',
                'Teacher training',
                'Building empathy skills'
            ],
            labels: ['stakeholder-support-guides', 'resources-for-stakeholders']
        }
    ],
    
    // Sample supporting materials for courses
    supportingMaterials: {
        '1': [ // Course ID 1 supporting materials
            {
                id: '2',
                title: '5-4-3-2-1 Calm Visual Poster',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhbG0gUG9zdGVyPC90ZXh0Pgo8c3ZnPg==',
                downloadUrl: 'https://example.com/download/calm-poster.pdf'
            },
            {
                id: '3',
                title: 'Self-Advocacy Visual: I need help',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNlbGYtQWR2b2NhY3k8L3RleHQ+CjxzdmcNCg==',
                downloadUrl: 'https://example.com/download/self-advocacy.pdf'
            }
        ]
    }
};

// Application State
let currentState = {
    activeTab: 'resources', // 'courses' or 'resources'
    selectedLabel: null, // null for "Show All", or label slug
    loading: false,
    error: null,
    cards: [],
    isModalOpen: false,
    selectedCourse: null,
    modalContentType: 'course', // 'course' or 'resource'
    isFullscreen: false
};

// DOM Elements
const elements = {
    // Navigation
    navigationList: document.getElementById('navigationList'),
    coursesTab: document.getElementById('coursesTab'),
    resourcesTab: document.getElementById('resourcesTab'),
    
    // Content areas
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    retryBtn: document.getElementById('retryBtn'),
    cardGrid: document.getElementById('cardGrid'),
    
    // Modal
    courseModal: document.getElementById('courseModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalImage: document.getElementById('modalImage'),
    modalCourseTitle: document.getElementById('modalCourseTitle'),
    modalDescription: document.getElementById('modalDescription'),
    modalPerfectFor: document.getElementById('modalPerfectFor'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    startCourseBtn: document.getElementById('startCourseBtn'),
    
    // Fullscreen course
    fullscreenCourse: document.getElementById('fullscreenCourse'),
    fullscreenTitle: document.getElementById('fullscreenTitle'),
    exitCourseBtn: document.getElementById('exitCourseBtn'),
    takeTestBtn: document.getElementById('takeTestBtn'),
    courseVideo: document.getElementById('courseVideo'),
    supportingMaterials: document.getElementById('supportingMaterials'),
    noMaterials: document.getElementById('noMaterials'),
    
    // Admin
    adminBtn: document.getElementById('adminBtn')
};

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function setLoading(isLoading) {
    currentState.loading = isLoading;
    
    if (isLoading) {
        showElement(elements.loadingState);
        hideElement(elements.errorState);
        hideElement(elements.cardGrid);
        generateLoadingSkeletons();
    } else {
        hideElement(elements.loadingState);
    }
}

function setError(errorMessage) {
    currentState.error = errorMessage;
    elements.errorMessage.textContent = errorMessage;
    
    hideElement(elements.loadingState);
    showElement(elements.errorState);
    hideElement(elements.cardGrid);
}

function clearError() {
    currentState.error = null;
    hideElement(elements.errorState);
}

// Data Loading Functions
function filterContentByType(type) {
    return SAMPLE_DATA.content.filter(item => 
        item.type === type && item.status === 'published'
    );
}

function filterContentByLabel(labelSlug, type) {
    return SAMPLE_DATA.content.filter(item => 
        item.type === type && 
        item.status === 'published' &&
        item.labels && 
        item.labels.includes(labelSlug)
    );
}

function loadData(type, labelSlug = null) {
    // Simulate loading delay
    setLoading(true);
    clearError();
    
    setTimeout(() => {
        try {
            let content;
            if (labelSlug) {
                content = filterContentByLabel(labelSlug, type);
            } else {
                content = filterContentByType(type);
            }
            
            currentState.cards = content;
            renderCards();
            setLoading(false);
            showElement(elements.cardGrid);
        } catch (error) {
            setError('Failed to load content. Please try again.');
            setLoading(false);
        }
    }, 500); // Simulate network delay
}

// Rendering Functions
function generateLoadingSkeletons() {
    const skeletonHTML = Array(8).fill(null).map((_, index) => `
        <div class="w-full max-w-[280px] cursor-pointer group animate-pulse">
            <div class="bg-white border border-gray-200 shadow-sm mb-3 rounded-lg p-4">
                <div class="relative w-full aspect-[246/252] bg-gray-200 rounded-sm"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
    `).join('');
    
    elements.loadingState.innerHTML = skeletonHTML;
}

function renderCards() {
    if (currentState.cards.length === 0) {
        elements.cardGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500">No ${currentState.activeTab} found.</p>
            </div>
        `;
        return;
    }
    
    const cardsHTML = currentState.cards.map(card => `
        <div class="w-full max-w-[560px] flex flex-col">
            <div class="group scale-200 cursor-pointer" data-card-id="${card.id}">
                <div class="bg-white border border-gray-200 hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-3 rounded-lg">
                    <div class="p-4">
                        <div class="relative w-full aspect-[246/252]">
                            <img
                                class="w-full h-full object-cover rounded-sm"
                                alt="${card.title}"
                                src="${card.image}"
                                loading="lazy"
                            />
                            
                            ${card.type === 'resource' ? `
                                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                                        <svg class="w-6 h-6 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            ${card.download_url ? `
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            ` : `
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            `}
                                        </svg>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="h-[34px] flex items-start">
                <div>
                    <p class="font-normal text-[#343434] text-sm leading-[16.8px] text-left transition-colors duration-200 line-clamp-2 overflow-hidden">
                        ${card.title}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
    
    elements.cardGrid.innerHTML = cardsHTML;
    
    // Add click event listeners to cards
    elements.cardGrid.querySelectorAll('[data-card-id]').forEach(cardElement => {
        cardElement.addEventListener('click', () => {
            const cardId = cardElement.getAttribute('data-card-id');
            const card = currentState.cards.find(c => c.id === cardId);
            if (card) {
                handleCardClick(card);
            }
        });
    });
}

function renderNavigation() {
    // Clear existing navigation items (except "Show All")
    const existingItems = elements.navigationList.querySelectorAll('li:not(:first-child)');
    existingItems.forEach(item => item.remove());
    
    // Add label navigation items
    SAMPLE_DATA.labels.forEach(label => {
        if (label.is_active) {
            const li = document.createElement('li');
            li.innerHTML = `
                <button class="nav-link w-full text-left py-3 px-4 text-sm rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border border border-transparent" data-label="${label.slug}">
                    <span>${label.name}</span>
                </button>
            `;
            elements.navigationList.appendChild(li);
        }
    });
    
    // Add click event listeners
    elements.navigationList.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const labelSlug = link.getAttribute('data-label');
            handleLabelClick(labelSlug);
        });
    });
}

// Event Handlers
function handleTabClick(tabType) {
    if (tabType === currentState.activeTab || currentState.loading) return;
    
    currentState.activeTab = tabType;
    updateTabStyles();
    
    const cardType = tabType === 'courses' ? 'course' : 'resource';
    loadData(cardType, currentState.selectedLabel);
}

function handleLabelClick(labelSlug) {
    currentState.selectedLabel = labelSlug || null;
    updateNavigationStyles();
    
    const cardType = currentState.activeTab === 'courses' ? 'course' : 'resource';
    loadData(cardType, currentState.selectedLabel);
}

function handleCardClick(card) {
    currentState.selectedCourse = card;
    currentState.modalContentType = card.type;
    openModal();
}

function handleRetry() {
    const cardType = currentState.activeTab === 'courses' ? 'course' : 'resource';
    loadData(cardType, currentState.selectedLabel);
}

// Modal Functions
function openModal() {
    if (!currentState.selectedCourse) return;
    
    const course = currentState.selectedCourse;
    
    // Update modal content
    elements.modalTitle.textContent = course.type === 'resource' ? 'Download Resource' : 'Start new course';
    elements.modalImage.src = course.image;
    elements.modalImage.alt = course.title;
    elements.modalCourseTitle.textContent = course.title;
    elements.modalDescription.textContent = course.description || 'Course description not available.';
    elements.startCourseBtn.textContent = course.type === 'resource' ? 'Download Resource' : 'Start Course';
    
    // Update perfect for list
    elements.modalPerfectFor.innerHTML = '';
    if (course.perfect_for && course.perfect_for.length > 0) {
        course.perfect_for.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex items-start';
            li.innerHTML = `
                <span class="w-2 h-2 bg-custom-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                ${item}
            `;
            elements.modalPerfectFor.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.className = 'text-sm text-gray-500 italic';
        li.textContent = 'No specific use cases defined for this course.';
        elements.modalPerfectFor.appendChild(li);
    }
    
    // Show modal with animation
    currentState.isModalOpen = true;
    elements.courseModal.classList.remove('opacity-0', 'invisible');
    elements.courseModal.classList.add('opacity-100', 'visible');
    
    const modalContent = elements.courseModal.querySelector('.relative');
    modalContent.classList.remove('scale-95', 'translate-y-4');
    modalContent.classList.add('scale-100', 'translate-y-0');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!currentState.isModalOpen) return;
    
    // Hide modal with animation
    elements.courseModal.classList.remove('opacity-100', 'visible');
    elements.courseModal.classList.add('opacity-0', 'invisible');
    
    const modalContent = elements.courseModal.querySelector('.relative');
    modalContent.classList.remove('scale-100', 'translate-y-0');
    modalContent.classList.add('scale-95', 'translate-y-4');
    
    // Reset state
    currentState.isModalOpen = false;
    currentState.selectedCourse = null;
    
    // Restore body scroll
    document.body.style.overflow = 'unset';
}

function handleStartCourse() {
    if (!currentState.selectedCourse) return;
    
    const course = currentState.selectedCourse;
    
    if (course.type === 'resource' && course.download_url) {
        // Handle resource download
        handleResourceDownload(course);
    } else if (course.type === 'course') {
        // Open fullscreen course view
        openFullscreenCourse(course);
    }
}

function handleResourceDownload(resource) {
    try {
        // Create download link
        const link = document.createElement('a');
        link.href = resource.download_url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Set download attribute to force download
        const fileName = resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileExtension = resource.download_url.split('.').pop() || 'file';
        link.download = `${fileName}.${fileExtension}`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Close modal after download starts
        closeModal();
        
    } catch (error) {
        console.error('Download failed:', error);
        // Fallback: open URL in new tab
        window.open(resource.download_url, '_blank', 'noopener,noreferrer');
    }
}

// Fullscreen Course Functions
function openFullscreenCourse(course) {
    currentState.isFullscreen = true;
    
    // Update fullscreen content
    elements.fullscreenTitle.textContent = course.title;
    
    // Set video source if available
    if (course.video_url) {
        elements.courseVideo.src = course.video_url;
        elements.courseVideo.poster = course.image;
    }
    
    // Load supporting materials
    loadSupportingMaterials(course.id);
    
    // Show fullscreen view
    elements.fullscreenCourse.classList.remove('hidden');
    elements.fullscreenCourse.classList.add('flex');
    
    // Close modal
    closeModal();
}

function closeFullscreenCourse() {
    currentState.isFullscreen = false;
    
    // Hide fullscreen view
    elements.fullscreenCourse.classList.remove('flex');
    elements.fullscreenCourse.classList.add('hidden');
    
    // Pause video
    elements.courseVideo.pause();
    elements.courseVideo.src = '';
}

function loadSupportingMaterials(courseId) {
    const materials = SAMPLE_DATA.supportingMaterials[courseId] || [];
    
    if (materials.length === 0) {
        hideElement(elements.supportingMaterials);
        showElement(elements.noMaterials);
        return;
    }
    
    showElement(elements.supportingMaterials);
    hideElement(elements.noMaterials);
    
    const materialsHTML = materials.map(material => `
        <div class="cursor-pointer group" data-material-id="${material.id}">
            <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200 mb-3 rounded-lg">
                <div class="p-4">
                    <div class="relative w-full aspect-[246/252]">
                        <img
                            class="w-full h-full object-cover rounded-sm"
                            alt="${material.title}"
                            src="${material.image}"
                            loading="lazy"
                        />
                        
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                                <svg class="w-6 h-6 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p class="font-normal text-[#343434] text-sm leading-[16.8px] text-left group-hover:text-custom-teal transition-colors duration-200">
                    ${material.title}
                </p>
            </div>
        </div>
    `).join('');
    
    elements.supportingMaterials.innerHTML = materialsHTML;
    
    // Add click event listeners
    elements.supportingMaterials.querySelectorAll('[data-material-id]').forEach(materialElement => {
        materialElement.addEventListener('click', () => {
            const materialId = materialElement.getAttribute('data-material-id');
            const material = materials.find(m => m.id === materialId);
            if (material && material.downloadUrl) {
                // Convert material to card format and handle download
                const materialCard = {
                    id: material.id,
                    title: material.title,
                    type: 'resource',
                    download_url: material.downloadUrl
                };
                handleResourceDownload(materialCard);
            }
        });
    });
}

function handleTakeTest() {
    const course = currentState.selectedCourse;
    if (course && course.test_url) {
        window.open(course.test_url, '_blank', 'noopener,noreferrer');
    } else {
        window.open('https://example.com/test', '_blank', 'noopener,noreferrer');
    }
}

// Style Update Functions
function updateTabStyles() {
    // Reset all tab styles
    elements.coursesTab.className = 'tab-button px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center box-border text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent';
    elements.resourcesTab.className = 'tab-button px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center box-border text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent';
    
    // Apply active style to current tab
    if (currentState.activeTab === 'courses') {
        elements.coursesTab.className = 'tab-button px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center box-border bg-[#f8f8f9] text-[#343434] shadow-sm';
    } else {
        elements.resourcesTab.className = 'tab-button px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center box-border bg-[#f8f8f9] text-[#343434] shadow-sm';
    }
}

function updateNavigationStyles() {
    // Reset all navigation link styles
    elements.navigationList.querySelectorAll('.nav-link').forEach(link => {
        link.className = 'nav-link w-full text-left py-3 px-4 text-sm rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border border border-transparent';
    });
    
    // Apply active style to selected navigation item
    const activeLink = elements.navigationList.querySelector(`[data-label="${currentState.selectedLabel || ''}"]`);
    if (activeLink) {
        activeLink.className = 'nav-link w-full text-left py-3 px-4 text-sm rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border bg-[#f8f8f9] text-[#343434] shadow-sm border border-gray-100 font-medium';
    }
}

// Event Listeners
function setupEventListeners() {
    // Tab navigation
    elements.coursesTab.addEventListener('click', () => handleTabClick('courses'));
    elements.resourcesTab.addEventListener('click', () => handleTabClick('resources'));
    
    // Modal events
    elements.closeModalBtn.addEventListener('click', closeModal);
    elements.startCourseBtn.addEventListener('click', handleStartCourse);
    
    // Fullscreen course events
    elements.exitCourseBtn.addEventListener('click', closeFullscreenCourse);
    elements.takeTestBtn.addEventListener('click', handleTakeTest);
    
    // Error retry
    elements.retryBtn.addEventListener('click', handleRetry);
    
    // Admin button (placeholder)
    elements.adminBtn.addEventListener('click', () => {
        alert('Admin functionality would be implemented here.\n\nIn the full application, this would open an authentication modal and content management interface.');
    });
    
    // Modal overlay click to close
    elements.courseModal.addEventListener('click', (e) => {
        if (e.target === elements.courseModal) {
            closeModal();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (currentState.isFullscreen) {
                closeFullscreenCourse();
            } else if (currentState.isModalOpen) {
                closeModal();
            }
        }
    });
    
    // Prevent body scroll when modal is open
    elements.courseModal.addEventListener('transitionend', () => {
        if (!currentState.isModalOpen) {
            document.body.style.overflow = 'unset';
        }
    });
}

// Initialization
function init() {
    console.log('Initializing Course Management System...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Render navigation
    renderNavigation();
    
    // Update initial tab styles
    updateTabStyles();
    
    // Load initial data (resources)
    loadData('resource');
    
    console.log('Application initialized successfully!');
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}