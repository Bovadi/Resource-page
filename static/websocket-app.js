// WebSocket-Powered Course Management System
// Real-time communication with backend using WebSockets

class WebSocketManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.messageHandlers = new Map();
        this.connectionState = 'disconnected'; // disconnected, connecting, connected
        this.messageQueue = [];
        
        this.init();
    }

    init() {
        this.connect();
        this.setupEventHandlers();
    }

    connect() {
        if (this.connectionState === 'connecting') return;
        
        this.connectionState = 'connecting';
        console.log('🔌 Connecting to WebSocket server...');
        
        // Use secure WebSocket in production, regular in development
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/cable`;
        
        try {
            this.ws = new WebSocket(wsUrl);
            this.setupWebSocketHandlers();
        } catch (error) {
            console.error('❌ WebSocket connection failed:', error);
            this.handleConnectionError();
        }
    }

    setupWebSocketHandlers() {
        this.ws.onopen = () => {
            console.log('✅ WebSocket connected');
            this.connectionState = 'connected';
            this.reconnectAttempts = 0;
            
            // Send queued messages
            this.flushMessageQueue();
            
            // Subscribe to channels
            this.subscribe('ContentChannel');
            this.subscribe('AuthChannel');
            
            // Notify UI of connection
            this.emit('connection:established');
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                console.error('❌ Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log('🔌 WebSocket disconnected:', event.code, event.reason);
            this.connectionState = 'disconnected';
            this.emit('connection:lost');
            
            if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.scheduleReconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            this.handleConnectionError();
        };
    }

    handleMessage(message) {
        const { type, channel, data, action } = message;
        
        console.log('📨 Received message:', { type, channel, action });
        
        // Handle different message types
        switch (type) {
            case 'ping':
                this.send({ type: 'pong' });
                break;
                
            case 'welcome':
                console.log('👋 WebSocket welcome received');
                break;
                
            case 'confirm_subscription':
                console.log(`✅ Subscribed to ${message.identifier}`);
                break;
                
            case 'data':
                this.handleDataMessage(channel, action, data);
                break;
                
            default:
                console.log('📦 Unknown message type:', message);
        }
    }

    handleDataMessage(channel, action, data) {
        const handlerKey = `${channel}:${action}`;
        const handlers = this.messageHandlers.get(handlerKey) || [];
        
        handlers.forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`❌ Handler error for ${handlerKey}:`, error);
            }
        });
    }

    subscribe(channel) {
        const subscription = {
            command: 'subscribe',
            identifier: JSON.stringify({ channel })
        };
        
        this.send(subscription);
    }

    unsubscribe(channel) {
        const subscription = {
            command: 'unsubscribe',
            identifier: JSON.stringify({ channel })
        };
        
        this.send(subscription);
    }

    send(message) {
        if (this.connectionState === 'connected' && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            // Queue message for later
            this.messageQueue.push(message);
        }
    }

    flushMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.send(message);
        }
    }

    // Event system for UI components
    on(event, handler) {
        if (!this.messageHandlers.has(event)) {
            this.messageHandlers.set(event, []);
        }
        this.messageHandlers.get(event).push(handler);
    }

    off(event, handler) {
        const handlers = this.messageHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    emit(event, data = null) {
        const handlers = this.messageHandlers.get(event) || [];
        handlers.forEach(handler => handler(data));
    }

    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
        
        setTimeout(() => {
            this.connect();
        }, delay);
    }

    handleConnectionError() {
        this.connectionState = 'disconnected';
        this.emit('connection:error');
    }

    setupEventHandlers() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.connectionState === 'disconnected') {
                this.connect();
            }
        });

        // Handle online/offline events
        window.addEventListener('online', () => {
            if (this.connectionState === 'disconnected') {
                this.connect();
            }
        });

        window.addEventListener('offline', () => {
            this.emit('connection:offline');
        });
    }

    // API-like methods for the application
    async fetchContent(type = null, labelSlug = null) {
        return new Promise((resolve, reject) => {
            const requestId = this.generateRequestId();
            
            // Set up response handler
            const responseHandler = (data) => {
                if (data.requestId === requestId) {
                    this.off(`ContentChannel:fetch_response`, responseHandler);
                    if (data.success) {
                        resolve(data.content);
                    } else {
                        reject(new Error(data.error));
                    }
                }
            };
            
            this.on(`ContentChannel:fetch_response`, responseHandler);
            
            // Send request
            this.sendChannelMessage('ContentChannel', 'fetch_content', {
                requestId,
                type,
                labelSlug
            });
            
            // Timeout after 10 seconds
            setTimeout(() => {
                this.off(`ContentChannel:fetch_response`, responseHandler);
                reject(new Error('Request timeout'));
            }, 10000);
        });
    }

    async authenticate(email, password, isSignUp = false) {
        return new Promise((resolve, reject) => {
            const requestId = this.generateRequestId();
            
            const responseHandler = (data) => {
                if (data.requestId === requestId) {
                    this.off(`AuthChannel:auth_response`, responseHandler);
                    if (data.success) {
                        resolve(data.user);
                    } else {
                        reject(new Error(data.error));
                    }
                }
            };
            
            this.on(`AuthChannel:auth_response`, responseHandler);
            
            this.sendChannelMessage('AuthChannel', isSignUp ? 'sign_up' : 'sign_in', {
                requestId,
                email,
                password
            });
            
            setTimeout(() => {
                this.off(`AuthChannel:auth_response`, responseHandler);
                reject(new Error('Authentication timeout'));
            }, 10000);
        });
    }

    sendChannelMessage(channel, action, data) {
        const message = {
            command: 'message',
            identifier: JSON.stringify({ channel }),
            data: JSON.stringify({ action, ...data })
        };
        
        this.send(message);
    }

    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    disconnect() {
        if (this.ws) {
            this.ws.close(1000, 'Client disconnect');
        }
    }
}

// Application State Manager with WebSocket integration
class AppStateManager {
    constructor(wsManager) {
        this.ws = wsManager;
        this.state = {
            activeTab: 'resources',
            selectedLabel: null,
            cards: [],
            labels: [],
            loading: false,
            error: null,
            user: null,
            isAuthenticated: false,
            connectionStatus: 'disconnected'
        };
        
        this.listeners = new Set();
        this.setupWebSocketHandlers();
    }

    setupWebSocketHandlers() {
        // Connection status updates
        this.ws.on('connection:established', () => {
            this.updateState({ connectionStatus: 'connected', error: null });
            this.loadInitialData();
        });

        this.ws.on('connection:lost', () => {
            this.updateState({ connectionStatus: 'disconnected' });
        });

        this.ws.on('connection:error', () => {
            this.updateState({ 
                connectionStatus: 'error',
                error: 'Connection lost. Attempting to reconnect...'
            });
        });

        // Real-time content updates
        this.ws.on('ContentChannel:content_updated', (data) => {
            console.log('📝 Content updated:', data);
            this.handleContentUpdate(data);
        });

        this.ws.on('ContentChannel:content_created', (data) => {
            console.log('✨ New content created:', data);
            this.handleContentCreated(data);
        });

        this.ws.on('ContentChannel:content_deleted', (data) => {
            console.log('🗑️ Content deleted:', data);
            this.handleContentDeleted(data);
        });

        // Authentication updates
        this.ws.on('AuthChannel:user_authenticated', (data) => {
            this.updateState({ 
                user: data.user, 
                isAuthenticated: true 
            });
        });

        this.ws.on('AuthChannel:user_signed_out', () => {
            this.updateState({ 
                user: null, 
                isAuthenticated: false 
            });
        });
    }

    updateState(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener(this.state);
            } catch (error) {
                console.error('❌ State listener error:', error);
            }
        });
    }

    async loadInitialData() {
        try {
            this.updateState({ loading: true, error: null });
            
            // Load labels and initial content in parallel
            const [labels, content] = await Promise.all([
                this.loadLabels(),
                this.ws.fetchContent('resource')
            ]);
            
            this.updateState({
                labels,
                cards: content,
                loading: false
            });
        } catch (error) {
            console.error('❌ Failed to load initial data:', error);
            this.updateState({
                loading: false,
                error: error.message
            });
        }
    }

    async loadLabels() {
        // For now, return static labels - in real app, this would come from WebSocket
        return [
            { id: '1', name: 'Welcome Start here', slug: 'welcome-start-here', display_order: 1 },
            { id: '2', name: 'Developing FBA & BIPs', slug: 'developing-fba-bips', display_order: 2 },
            { id: '3', name: 'Stakeholder Support Guides', slug: 'stakeholder-support-guides', display_order: 3 },
            { id: '4', name: 'Visual Supports', slug: 'visual-supports', display_order: 4 },
            { id: '5', name: 'Resources for Stakeholders', slug: 'resources-for-stakeholders', display_order: 5 }
        ];
    }

    async switchTab(tabType) {
        if (tabType === this.state.activeTab || this.state.loading) return;
        
        try {
            this.updateState({ activeTab: tabType, loading: true, error: null });
            
            const content = await this.ws.fetchContent(
                tabType === 'courses' ? 'course' : 'resource',
                this.state.selectedLabel
            );
            
            this.updateState({
                cards: content,
                loading: false
            });
        } catch (error) {
            console.error('❌ Failed to switch tab:', error);
            this.updateState({
                loading: false,
                error: error.message
            });
        }
    }

    async filterByLabel(labelSlug) {
        try {
            this.updateState({ selectedLabel: labelSlug, loading: true, error: null });
            
            const cardType = this.state.activeTab === 'courses' ? 'course' : 'resource';
            const content = await this.ws.fetchContent(cardType, labelSlug);
            
            this.updateState({
                cards: content,
                loading: false
            });
        } catch (error) {
            console.error('❌ Failed to filter by label:', error);
            this.updateState({
                loading: false,
                error: error.message
            });
        }
    }

    async authenticate(email, password, isSignUp = false) {
        try {
            const user = await this.ws.authenticate(email, password, isSignUp);
            this.updateState({ 
                user, 
                isAuthenticated: true,
                error: null
            });
            return user;
        } catch (error) {
            this.updateState({ error: error.message });
            throw error;
        }
    }

    signOut() {
        this.ws.sendChannelMessage('AuthChannel', 'sign_out', {});
        this.updateState({ 
            user: null, 
            isAuthenticated: false 
        });
    }

    // Real-time update handlers
    handleContentUpdate(data) {
        const updatedCards = this.state.cards.map(card => 
            card.id === data.content.id ? { ...card, ...data.content } : card
        );
        this.updateState({ cards: updatedCards });
    }

    handleContentCreated(data) {
        // Only add if it matches current filter
        const shouldAdd = this.shouldIncludeContent(data.content);
        if (shouldAdd) {
            this.updateState({ 
                cards: [data.content, ...this.state.cards] 
            });
        }
    }

    handleContentDeleted(data) {
        const filteredCards = this.state.cards.filter(card => card.id !== data.contentId);
        this.updateState({ cards: filteredCards });
    }

    shouldIncludeContent(content) {
        // Check if content matches current tab
        const tabType = this.state.activeTab === 'courses' ? 'course' : 'resource';
        if (content.type !== tabType) return false;
        
        // Check if content matches current label filter
        if (this.state.selectedLabel) {
            return content.labels && content.labels.includes(this.state.selectedLabel);
        }
        
        return true;
    }
}

// UI Manager for WebSocket-powered interface
class UIManager {
    constructor(stateManager) {
        this.state = stateManager;
        this.elements = {};
        this.modals = {
            course: null,
            auth: null
        };
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupStateSubscription();
        this.renderConnectionStatus();
    }

    cacheElements() {
        this.elements = {
            // Navigation
            navigationList: document.getElementById('navigationList'),
            coursesTab: document.getElementById('coursesTab'),
            resourcesTab: document.getElementById('resourcesTab'),
            
            // Content
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            errorMessage: document.getElementById('errorMessage'),
            retryBtn: document.getElementById('retryBtn'),
            cardGrid: document.getElementById('cardGrid'),
            
            // Connection status
            connectionStatus: document.getElementById('connectionStatus'),
            
            // Admin
            adminBtn: document.getElementById('adminBtn')
        };
    }

    setupEventListeners() {
        // Tab navigation
        this.elements.coursesTab?.addEventListener('click', () => {
            this.state.switchTab('courses');
        });

        this.elements.resourcesTab?.addEventListener('click', () => {
            this.state.switchTab('resources');
        });

        // Error retry
        this.elements.retryBtn?.addEventListener('click', () => {
            this.state.loadInitialData();
        });

        // Admin button
        this.elements.adminBtn?.addEventListener('click', () => {
            if (this.state.state.isAuthenticated) {
                this.showContentManager();
            } else {
                this.showAuthModal();
            }
        });

        // Navigation labels (delegated event handling)
        this.elements.navigationList?.addEventListener('click', (e) => {
            const button = e.target.closest('.nav-link');
            if (button) {
                const labelSlug = button.getAttribute('data-label');
                if (labelSlug === '') {
                    this.state.filterByLabel(null);
                } else {
                    this.state.filterByLabel(labelSlug);
                }
            }
        });

        // Card clicks (delegated event handling)
        this.elements.cardGrid?.addEventListener('click', (e) => {
            const cardElement = e.target.closest('[data-card-id]');
            if (cardElement) {
                const cardId = cardElement.getAttribute('data-card-id');
                const card = this.state.state.cards.find(c => c.id === cardId);
                if (card) {
                    this.showCourseModal(card);
                }
            }
        });
    }

    setupStateSubscription() {
        this.state.subscribe((newState) => {
            this.render(newState);
        });
    }

    render(state) {
        this.renderTabs(state);
        this.renderNavigation(state);
        this.renderContent(state);
        this.renderConnectionStatus(state);
        this.renderAdminButton(state);
    }

    renderTabs(state) {
        // Update tab styles
        if (this.elements.coursesTab) {
            this.elements.coursesTab.className = state.activeTab === 'courses' 
                ? 'tab-button px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center box-border bg-[#f8f8f9] text-[#343434] shadow-sm'
                : 'tab-button px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center box-border text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent';
        }

        if (this.elements.resourcesTab) {
            this.elements.resourcesTab.className = state.activeTab === 'resources'
                ? 'tab-button px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center box-border bg-[#f8f8f9] text-[#343434] shadow-sm'
                : 'tab-button px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center box-border text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent';
        }
    }

    renderNavigation(state) {
        if (!this.elements.navigationList) return;

        // Clear existing navigation items (except "Show All")
        const existingItems = this.elements.navigationList.querySelectorAll('li:not(:first-child)');
        existingItems.forEach(item => item.remove());

        // Add label navigation items
        state.labels.forEach(label => {
            const li = document.createElement('li');
            li.innerHTML = `
                <button class="nav-link w-full text-left py-3 px-4 text-sm rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border border border-transparent ${
                    state.selectedLabel === label.slug 
                        ? 'bg-[#f8f8f9] text-[#343434] shadow-sm border-gray-100 font-medium'
                        : ''
                }" data-label="${label.slug}">
                    <span>${label.name}</span>
                </button>
            `;
            this.elements.navigationList.appendChild(li);
        });

        // Update "Show All" button
        const showAllButton = this.elements.navigationList.querySelector('[data-label=""]');
        if (showAllButton) {
            showAllButton.className = `nav-link w-full text-left py-3 px-4 text-sm rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border border border-transparent ${
                state.selectedLabel === null
                    ? 'bg-[#f8f8f9] text-[#343434] shadow-sm border-gray-100 font-medium'
                    : ''
            }`;
        }
    }

    renderContent(state) {
        if (state.loading) {
            this.showLoading();
        } else if (state.error) {
            this.showError(state.error);
        } else {
            this.showCards(state.cards);
        }
    }

    showLoading() {
        this.hideElement(this.elements.errorState);
        this.hideElement(this.elements.cardGrid);
        this.showElement(this.elements.loadingState);
        
        // Generate loading skeletons
        const skeletonHTML = Array(8).fill(null).map(() => `
            <div class="w-full max-w-[280px] cursor-pointer group animate-pulse">
                <div class="bg-white border border-gray-200 shadow-sm mb-3 rounded-lg p-4">
                    <div class="relative w-full aspect-[246/252] bg-gray-200 rounded-sm"></div>
                </div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
        `).join('');
        
        this.elements.loadingState.innerHTML = skeletonHTML;
    }

    showError(error) {
        this.hideElement(this.elements.loadingState);
        this.hideElement(this.elements.cardGrid);
        this.showElement(this.elements.errorState);
        
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = error;
        }
    }

    showCards(cards) {
        this.hideElement(this.elements.loadingState);
        this.hideElement(this.elements.errorState);
        this.showElement(this.elements.cardGrid);
        
        if (cards.length === 0) {
            this.elements.cardGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500">No content found.</p>
                </div>
            `;
            return;
        }
        
        const cardsHTML = cards.map(card => `
            <div class="w-full max-w-[560px] flex flex-col">
                <div class="group scale-200 cursor-pointer" data-card-id="${card.id}">
                    <div class="bg-white border border-gray-200 hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-3 rounded-lg">
                        <div class="p-4">
                            <div class="relative w-full aspect-[246/252]">
                                <img
                                    class="w-full h-full object-cover rounded-sm"
                                    alt="${card.title}"
                                    src="${card.image || '/screenshot-2024-05-27-at-2-52-1-15.png'}"
                                    loading="lazy"
                                />
                                
                                ${card.type === 'resource' ? `
                                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                                            <svg class="w-6 h-6 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
        
        this.elements.cardGrid.innerHTML = cardsHTML;
    }

    renderConnectionStatus(state) {
        if (!this.elements.connectionStatus) return;
        
        const status = state.connectionStatus;
        let statusHTML = '';
        
        switch (status) {
            case 'connected':
                statusHTML = `
                    <div class="flex items-center text-green-600 text-sm">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Live
                    </div>
                `;
                break;
            case 'disconnected':
                statusHTML = `
                    <div class="flex items-center text-red-600 text-sm">
                        <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Offline
                    </div>
                `;
                break;
            case 'error':
                statusHTML = `
                    <div class="flex items-center text-yellow-600 text-sm">
                        <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                        Reconnecting...
                    </div>
                `;
                break;
        }
        
        this.elements.connectionStatus.innerHTML = statusHTML;
    }

    renderAdminButton(state) {
        if (!this.elements.adminBtn) return;
        
        const buttonText = state.isAuthenticated ? 'Admin Panel' : 'Admin Login';
        this.elements.adminBtn.querySelector('span').textContent = buttonText;
    }

    showElement(element) {
        if (element) element.classList.remove('hidden');
    }

    hideElement(element) {
        if (element) element.classList.add('hidden');
    }

    showCourseModal(card) {
        // Implementation for course modal
        console.log('Show course modal for:', card);
    }

    showAuthModal() {
        // Implementation for auth modal
        console.log('Show auth modal');
    }

    showContentManager() {
        // Implementation for content manager
        console.log('Show content manager');
    }
}

// Sample data for WebSocket simulation
const SAMPLE_DATA = {
    labels: [
        { id: '1', name: 'Welcome Start here', slug: 'welcome-start-here', display_order: 1 },
        { id: '2', name: 'Developing FBA & BIPs', slug: 'developing-fba-bips', display_order: 2 },
        { id: '3', name: 'Stakeholder Support Guides', slug: 'stakeholder-support-guides', display_order: 3 },
        { id: '4', name: 'Visual Supports', slug: 'visual-supports', display_order: 4 },
        { id: '5', name: 'Resources for Stakeholders', slug: 'resources-for-stakeholders', display_order: 5 }
    ],
    
    content: [
        {
            id: '1',
            title: 'Creating Visual BIPs for Confident Parent & Staff Support',
            description: 'Learn to create effective visual behavior intervention plans',
            type: 'course',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGOUZGIi8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJzZSBJbWFnZTwvdGV4dD4KPHN2Zz4=',
            labels: ['developing-fba-bips']
        },
        {
            id: '2',
            title: '5-4-3-2-1 Calm Visual Poster',
            description: 'Downloadable poster for calming strategies',
            type: 'resource',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRjBGRkY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhbG0gUG9zdGVyPC90ZXh0Pgo8c3ZnPg==',
            labels: ['visual-supports']
        },
        {
            id: '3',
            title: 'Self-Advocacy Visual: I need help',
            description: 'Visual communication tool for self-advocacy',
            type: 'resource',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2IiBoZWlnaHQ9IjI1MiIgdmlld0JveD0iMCAwIDI0NiAyNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDYiIGhlaWdodD0iMjUyIiBmaWxsPSIjRkZGMEY4Ii8+Cjx0ZXh0IHg9IjEyMyIgeT0iMTI2IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNlbGYtQWR2b2NhY3k8L3RleHQ+CjxzdmcNCg==',
            labels: ['visual-supports', 'resources-for-stakeholders']
        }
    ]
};

// WebSocket Mock for Development/Testing
class MockWebSocketManager extends WebSocketManager {
    constructor() {
        super();
        this.connectionState = 'connected';
        this.setupMockHandlers();
    }

    connect() {
        console.log('🔌 Mock WebSocket connected');
        setTimeout(() => {
            this.emit('connection:established');
        }, 100);
    }

    setupMockHandlers() {
        // Override send method to simulate responses
        this.originalSend = this.send;
        this.send = (message) => {
            if (typeof message === 'object' && message.command === 'message') {
                this.handleMockMessage(message);
            }
        };
    }

    handleMockMessage(message) {
        try {
            const data = JSON.parse(message.data);
            const { action, requestId } = data;
            
            setTimeout(() => {
                switch (action) {
                    case 'fetch_content':
                        this.mockFetchContent(data);
                        break;
                    case 'sign_in':
                    case 'sign_up':
                        this.mockAuthentication(data);
                        break;
                }
            }, 500); // Simulate network delay
        } catch (error) {
            console.error('Mock message handling error:', error);
        }
    }

    mockFetchContent(data) {
        const { type, labelSlug, requestId } = data;
        
        let content = SAMPLE_DATA.content;
        
        // Filter by type
        if (type) {
            content = content.filter(item => item.type === type);
        }
        
        // Filter by label
        if (labelSlug) {
            content = content.filter(item => 
                item.labels && item.labels.includes(labelSlug)
            );
        }
        
        this.emit('ContentChannel:fetch_response', {
            requestId,
            success: true,
            content
        });
    }

    mockAuthentication(data) {
        const { email, requestId } = data;
        
        // Simulate successful authentication
        this.emit('AuthChannel:auth_response', {
            requestId,
            success: true,
            user: {
                id: '1',
                email,
                name: 'Admin User'
            }
        });
    }

    // Simulate real-time updates
    simulateContentUpdate() {
        setTimeout(() => {
            this.emit('ContentChannel:content_updated', {
                content: {
                    id: '1',
                    title: 'Updated: Creating Visual BIPs for Confident Parent & Staff Support',
                    description: 'Updated description with new content'
                }
            });
        }, 3000);
    }
}

// Application Initialization
class WebSocketApp {
    constructor() {
        this.wsManager = null;
        this.stateManager = null;
        this.uiManager = null;
        
        this.init();
    }

    init() {
        // Use mock WebSocket for development, real WebSocket for production
        const useMock = !window.location.host.includes('production-domain.com');
        
        this.wsManager = useMock ? new MockWebSocketManager() : new WebSocketManager();
        this.stateManager = new AppStateManager(this.wsManager);
        this.uiManager = new UIManager(this.stateManager);
        
        // For development: simulate some real-time updates
        if (useMock) {
            this.wsManager.simulateContentUpdate();
        }
        
        console.log('🚀 WebSocket-powered application initialized');
    }

    destroy() {
        if (this.wsManager) {
            this.wsManager.disconnect();
        }
    }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new WebSocketApp();
    });
} else {
    window.app = new WebSocketApp();
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.destroy();
    }
});