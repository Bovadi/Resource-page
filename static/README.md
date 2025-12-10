# Static Course Management System

A static HTML implementation of a course and resource management system using Tailwind CSS and vanilla JavaScript.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Course Management**: Browse and view courses with video content
- **Resource Library**: Download educational resources and materials
- **Interactive Navigation**: Filter content by categories/labels
- **Modal System**: Detailed course and resource previews
- **Fullscreen Course View**: Immersive learning experience with supporting materials

## File Structure

```
static/
├── index.html          # Main HTML file with complete UI structure
├── app.js             # All JavaScript functionality and data management
└── README.md          # This documentation file
```

## Setup Instructions

1. **Simple Setup**: Just open `index.html` in any modern web browser
2. **Local Server** (recommended for development):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Navigate to `http://localhost:8000` in your browser

## Dependencies

- **Tailwind CSS**: Loaded via CDN (no build process required)
- **No JavaScript frameworks**: Pure vanilla JavaScript
- **No external APIs**: Uses static sample data

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Key Features Implemented

### 1. Navigation System
- **Tab Navigation**: Switch between Courses and Resources
- **Label Filtering**: Filter content by categories
- **Responsive Sidebar**: Collapsible on mobile devices

### 2. Card Grid Layout
- **Responsive Grid**: Auto-adjusting columns based on screen size
- **Consistent Heights**: Fixed title areas prevent layout shifting
- **Loading States**: Skeleton screens during data loading
- **Error Handling**: User-friendly error messages with retry functionality

### 3. Modal System
- **Course Preview**: Detailed course information with "Perfect for" sections
- **Resource Preview**: Download-focused interface for resources
- **Responsive Design**: Optimized for all screen sizes
- **Keyboard Navigation**: ESC key support for closing modals

### 4. Fullscreen Course Experience
- **Video Player**: HTML5 video with custom controls
- **Supporting Materials**: Grid of downloadable resources
- **Navigation Header**: Course title with test and exit buttons
- **Responsive Layout**: Adapts to different screen sizes

### 5. Interactive Elements
- **Hover Effects**: Smooth transitions and visual feedback
- **Click Handlers**: Proper event delegation for dynamic content
- **Download Functionality**: Automatic file downloads for resources
- **Loading Animations**: Pulse effects for skeleton screens

## Customization

### Adding New Content
Edit the `SAMPLE_DATA` object in `app.js`:

```javascript
const SAMPLE_DATA = {
    labels: [
        // Add new navigation labels
    ],
    content: [
        // Add new courses and resources
    ],
    supportingMaterials: {
        // Link resources to courses
    }
};
```

### Styling Modifications
- **Colors**: Update the Tailwind config in `index.html`
- **Layout**: Modify CSS classes in HTML structure
- **Animations**: Adjust transition durations and effects

### Adding New Features
- **Authentication**: Implement login/logout functionality
- **Search**: Add content search capabilities
- **Favorites**: Allow users to bookmark content
- **Progress Tracking**: Track course completion

## Limitations Compared to Original React App

1. **No Real Database**: Uses static sample data instead of Supabase
2. **No Authentication**: Admin features are placeholder only
3. **No File Upload**: Image management is simplified
4. **No Real-time Updates**: Content changes require page refresh
5. **Limited State Management**: No complex state persistence
6. **No Server-side Features**: No edge functions or API endpoints

## Performance Considerations

- **Lazy Loading**: Images load only when needed
- **Debounced Events**: Prevents excessive function calls
- **Efficient DOM Updates**: Minimal DOM manipulation
- **CSS Animations**: Hardware-accelerated transitions
- **Small Bundle Size**: No framework overhead

## Development Notes

### Code Organization
- **Modular Functions**: Each feature has dedicated functions
- **Event Delegation**: Efficient event handling for dynamic content
- **State Management**: Simple object-based state tracking
- **Error Boundaries**: Graceful error handling throughout

### Best Practices Implemented
- **Semantic HTML**: Proper ARIA labels and roles
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized loading and rendering
- **Maintainability**: Well-commented and structured code

## Future Enhancements

1. **Progressive Web App**: Add service worker for offline functionality
2. **Local Storage**: Persist user preferences and progress
3. **Advanced Search**: Full-text search with filters
4. **Accessibility**: Enhanced screen reader support
5. **Internationalization**: Multi-language support
6. **Analytics**: User interaction tracking

## Troubleshooting

### Common Issues

1. **Styles not loading**: Ensure internet connection for Tailwind CDN
2. **Videos not playing**: Check video URL accessibility
3. **Downloads not working**: Verify download URLs are valid
4. **Layout issues**: Clear browser cache and refresh

### Browser Console Errors
- Check browser developer tools for JavaScript errors
- Ensure all image URLs are accessible
- Verify no CORS issues with external resources

## Support

For questions or issues with this static implementation:
1. Check browser console for error messages
2. Verify all file paths are correct
3. Ensure modern browser compatibility
4. Test with local server instead of file:// protocol