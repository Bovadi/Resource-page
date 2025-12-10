# WebSocket-Powered Course Management System

A real-time course and resource management application using WebSockets for live updates and instant synchronization.

## 🚀 Features

### **Real-Time Communication**
- **Live Updates**: Content changes appear instantly across all connected clients
- **Connection Management**: Automatic reconnection with exponential backoff
- **Offline Handling**: Graceful degradation when connection is lost
- **Message Queuing**: Queues messages when offline and sends when reconnected

### **WebSocket Channels**
- **ContentChannel**: Real-time content updates, creation, and deletion
- **AuthChannel**: User authentication and session management
- **Live Notifications**: Instant updates when content is modified by other users

### **Interactive Features**
- **Tab Navigation**: Switch between Courses and Resources
- **Label Filtering**: Filter content by categories with real-time updates
- **Modal System**: Course/resource previews with detailed information
- **Fullscreen Experience**: Immersive course viewing with video playback
- **Connection Status**: Visual indicator of WebSocket connection state

## 📁 File Structure

```
static/
├── websocket-index.html    # Main HTML with WebSocket-optimized layout
├── websocket-app.js        # Complete WebSocket application logic
└── websocket-README.md     # This documentation
```

## 🔧 WebSocket Architecture

### **WebSocketManager Class**
- Handles connection lifecycle (connect, disconnect, reconnect)
- Message routing and event handling
- Automatic reconnection with exponential backoff
- Connection state management

### **AppStateManager Class**
- Centralized state management with WebSocket integration
- Real-time state updates from WebSocket messages
- API-like methods for data fetching via WebSocket
- Event-driven architecture for UI updates

### **UIManager Class**
- Reactive UI updates based on state changes
- Real-time content rendering
- Connection status visualization
- Modal and interaction management

## 🌐 WebSocket Protocol

### **Message Format**
```javascript
{
  "type": "data",
  "channel": "ContentChannel",
  "action": "content_updated",
  "data": {
    "content": { /* updated content object */ }
  }
}
```

### **Supported Actions**

#### **ContentChannel**
- `fetch_content` - Request content with filters
- `content_updated` - Real-time content updates
- `content_created` - New content notifications
- `content_deleted` - Content deletion notifications

#### **AuthChannel**
- `sign_in` - User authentication
- `sign_up` - User registration
- `sign_out` - User logout
- `user_authenticated` - Authentication status updates

## 🔌 Backend Integration

### **Ruby on Rails Integration**
To connect with a Rails backend using Action Cable:

```ruby
# app/channels/content_channel.rb
class ContentChannel < ApplicationCable::Channel
  def subscribed
    stream_from "content_updates"
  end

  def fetch_content(data)
    content = Content.published
    content = content.where(type: data['type']) if data['type']
    content = content.joins(:labels).where(labels: { slug: data['labelSlug'] }) if data['labelSlug']
    
    ActionCable.server.broadcast("content_updates", {
      type: 'data',
      channel: 'ContentChannel',
      action: 'fetch_response',
      data: {
        requestId: data['requestId'],
        success: true,
        content: content.as_json(include: [:images, :labels])
      }
    })
  end
end
```

### **Node.js Integration**
For Node.js with Socket.IO:

```javascript
// server.js
io.on('connection', (socket) => {
  socket.on('ContentChannel:fetch_content', async (data) => {
    try {
      const content = await Content.find(data.filters);
      socket.emit('ContentChannel:fetch_response', {
        requestId: data.requestId,
        success: true,
        content
      });
    } catch (error) {
      socket.emit('ContentChannel:fetch_response', {
        requestId: data.requestId,
        success: false,
        error: error.message
      });
    }
  });
});
```

## 🛠️ Setup Instructions

### **Development Setup**
1. **Open the HTML file**:
   ```bash
   open websocket-index.html
   ```

2. **Or use a local server**:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

3. **Access the application**:
   ```
   http://localhost:8000/websocket-index.html
   ```

### **Production Setup**
1. **Configure WebSocket URL** in `websocket-app.js`:
   ```javascript
   const wsUrl = `wss://your-domain.com/cable`;
   ```

2. **Deploy static files** to your web server

3. **Ensure WebSocket server** is running and accessible

## 🔄 Real-Time Features

### **Live Content Updates**
- Content changes appear instantly across all connected clients
- New content automatically appears in filtered views
- Deleted content is removed from all client views immediately

### **Connection Management**
- **Visual Status Indicator**: Shows connection state (Connected/Offline/Reconnecting)
- **Automatic Reconnection**: Attempts to reconnect with exponential backoff
- **Message Queuing**: Stores messages when offline and sends when reconnected
- **Graceful Degradation**: Application remains functional during connection issues

### **Real-Time Collaboration**
- Multiple users can view content updates simultaneously
- Admin changes are reflected immediately for all users
- Live notifications for content modifications

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Touch-Friendly**: Large touch targets and smooth interactions
- **Adaptive Layout**: Adjusts to different screen sizes
- **Connection Awareness**: Shows connection status on all devices

## 🎯 Mock WebSocket (Development)

For development and testing, the application includes a mock WebSocket implementation:

```javascript
// Automatically uses mock WebSocket for development
const useMock = !window.location.host.includes('production-domain.com');
this.wsManager = useMock ? new MockWebSocketManager() : new WebSocketManager();
```

### **Mock Features**
- Simulates real WebSocket behavior
- Provides sample data for testing
- Simulates network delays and responses
- Demonstrates real-time update capabilities

## 🔐 Authentication

### **WebSocket Authentication**
- JWT token-based authentication
- Session management via WebSocket
- Real-time authentication status updates
- Secure admin panel access

### **Mock Authentication**
For development, any email/password combination will work:
- Email: `admin@example.com`
- Password: `password123`

## 🚨 Error Handling

### **Connection Errors**
- Automatic retry with exponential backoff
- User-friendly error messages
- Graceful fallback to cached data
- Connection status notifications

### **Message Errors**
- Request timeout handling
- Invalid message format handling
- Server error responses
- User notification system

## 📊 Performance Optimizations

### **Efficient Updates**
- Selective DOM updates based on state changes
- Debounced event handlers
- Lazy loading for images
- Optimized re-rendering

### **Memory Management**
- Proper event listener cleanup
- WebSocket connection cleanup on page unload
- Efficient state management
- Garbage collection friendly

## 🔧 Customization

### **Adding New Channels**
```javascript
// Subscribe to new channel
this.ws.subscribe('NotificationChannel');

// Handle channel messages
this.ws.on('NotificationChannel:new_notification', (data) => {
  this.showNotification(data.notification);
});
```

### **Custom Message Handlers**
```javascript
// Add custom message handler
this.ws.on('CustomChannel:custom_action', (data) => {
  // Handle custom message
  console.log('Custom message received:', data);
});
```

## 🐛 Troubleshooting

### **Connection Issues**
1. Check WebSocket server is running
2. Verify WebSocket URL is correct
3. Check browser console for errors
4. Ensure firewall allows WebSocket connections

### **Message Issues**
1. Verify message format matches expected structure
2. Check server-side message handling
3. Monitor network tab for WebSocket messages
4. Validate JSON message parsing

### **Performance Issues**
1. Monitor WebSocket message frequency
2. Check for memory leaks in event handlers
3. Optimize DOM update frequency
4. Use browser performance tools

## 🚀 Deployment

### **Static Hosting**
- Deploy to Netlify, Vercel, or similar
- Configure WebSocket URL for production
- Ensure HTTPS for secure WebSocket connections

### **CDN Integration**
- Serve static assets via CDN
- Configure proper CORS headers
- Optimize for global distribution

## 📈 Monitoring

### **Connection Monitoring**
- Track connection success/failure rates
- Monitor reconnection attempts
- Log connection duration and stability

### **Message Monitoring**
- Track message send/receive rates
- Monitor message processing times
- Log message errors and retries

## 🔮 Future Enhancements

- **Push Notifications**: Browser push notifications for offline users
- **Presence Indicators**: Show who's currently viewing content
- **Collaborative Editing**: Real-time collaborative content editing
- **Advanced Filtering**: Real-time search and advanced filters
- **Analytics Dashboard**: Real-time usage analytics
- **Mobile App**: React Native app with WebSocket integration

---

This WebSocket-powered application provides a modern, real-time user experience with instant updates and seamless collaboration capabilities.