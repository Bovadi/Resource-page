# Course Video Troubleshooting Guide

## Overview
This guide helps diagnose and resolve issues when course videos are not displaying in the video player within your course management application.

---

## 1. Video File Requirements Check

### Supported Formats
✅ **Recommended formats:**
- MP4 (H.264 codec) - Best compatibility
- WebM (VP8/VP9 codec) - Modern browsers
- OGV (Theora codec) - Fallback option

❌ **Unsupported formats:**
- AVI, MOV, WMV, FLV (require conversion)

### File Size Limits
- **Supabase Storage**: 50MB per file (free tier)
- **Browser limits**: Varies by browser and device memory
- **Recommended**: Keep videos under 100MB for optimal performance

### Encoding Requirements
- **Video codec**: H.264 (most compatible)
- **Audio codec**: AAC
- **Container**: MP4
- **Resolution**: 1920x1080 or lower
- **Frame rate**: 30fps or lower

### Upload Status Verification
```bash
# Check if upload completed successfully
1. Go to Supabase Dashboard → Storage → images bucket
2. Verify file appears in the storage browser
3. Check file size matches original
4. Ensure no error indicators are present
```

---

## 2. Backend Configuration Verification

### Video URL Path Check
```sql
-- Check if video URL is stored correctly in database
SELECT id, title, video_url, status 
FROM content 
WHERE type = 'course' 
AND video_url IS NOT NULL;
```

**Expected format:**
- Direct URL: `https://your-project.supabase.co/storage/v1/object/public/images/videos/filename.mp4`
- External URL: `https://youtube.com/watch?v=...` or `https://vimeo.com/...`

### File Permissions Check
```bash
# In Supabase Dashboard → Storage → images bucket
1. Click on your video file
2. Verify "Public" toggle is enabled
3. Test the public URL directly in browser
4. Should download/play the video file
```

### Storage Accessibility Test
```javascript
// Test direct access to video URL
const testVideoUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log('Video accessible:', response.ok);
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('Content-Length:', response.headers.get('content-length'));
  } catch (error) {
    console.error('Video not accessible:', error);
  }
};
```

### Database Entry Verification
```sql
-- Verify complete content record
SELECT 
  c.id,
  c.title,
  c.video_url,
  c.status,
  c.type,
  ci.image_id,
  i.file_path as thumbnail_path
FROM content c
LEFT JOIN content_images ci ON c.id = ci.content_id AND ci.is_primary = true
LEFT JOIN images i ON ci.image_id = i.id
WHERE c.type = 'course';
```

---

## 3. Frontend Implementation Inspection

### Video Player Component Check
```javascript
// In CourseModal.tsx - verify video element structure
<video
  className="w-full h-full"
  controls
  poster="/BCBA Course.png"  // ← Check if poster image exists
  aria-label="Course video player"
>
  <source src={course?.video_url || "fallback-url"} type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

### Source URL Verification
```javascript
// Add debugging to CourseModal.tsx
console.log('Course data:', course);
console.log('Video URL:', course?.video_url);
console.log('Video URL type:', typeof course?.video_url);
console.log('Video URL length:', course?.video_url?.length);
```

### Browser Console Error Check
**Open Developer Tools (F12) → Console tab and look for:**
- `404 Not Found` - Video file doesn't exist
- `403 Forbidden` - Permission denied
- `CORS error` - Cross-origin request blocked
- `Network error` - Connection issues
- `Decode error` - Video format/encoding issues

### Network Tab Investigation
**Open Developer Tools (F12) → Network tab:**
1. Filter by "Media" or "XHR"
2. Reload the course modal
3. Look for video file request
4. Check status code and response headers
5. Verify Content-Type is `video/mp4` or similar

---

## 4. Video Playback Testing

### Browser Compatibility Test
Test in multiple browsers:
- ✅ Chrome (best H.264 support)
- ✅ Firefox (WebM preferred)
- ✅ Safari (MP4 required)
- ✅ Edge (similar to Chrome)

### Direct URL Access Test
```bash
# Copy video URL from database and test directly
1. Open new browser tab
2. Paste video URL
3. Video should download or play directly
4. If not accessible, check storage permissions
```

### Course Tab Loading Verification
```javascript
// Check if course data loads correctly
const debugCourseLoading = () => {
  console.log('Active tab:', activeTab);
  console.log('Cards loaded:', cards.length);
  console.log('Course cards:', cards.filter(c => c.type === 'course'));
  console.log('Selected course:', selectedCourse);
};
```

### Player Controls Verification
**Expected behavior:**
- Play/pause button appears
- Progress bar is visible
- Volume controls work
- Fullscreen option available
- Video duration displays correctly

---

## 5. Common Issues & Solutions

### Issue: Video URL is null or undefined
**Solution:**
```sql
-- Update content with correct video URL
UPDATE content 
SET video_url = 'https://your-project.supabase.co/storage/v1/object/public/images/videos/your-video.mp4'
WHERE id = 'your-content-id';
```

### Issue: 404 Not Found
**Solutions:**
1. Re-upload video to Supabase Storage
2. Verify bucket name is 'images'
3. Check file path in storage browser
4. Update database with correct URL

### Issue: Video loads but won't play
**Solutions:**
1. Convert video to MP4 with H.264 codec
2. Reduce file size if over 100MB
3. Check if video is corrupted
4. Test with different video file

### Issue: CORS errors
**Solutions:**
1. Ensure Supabase bucket is public
2. Check storage policies allow public access
3. Verify URL format is correct

### Issue: Player shows but video is black
**Solutions:**
1. Check video encoding format
2. Verify video isn't corrupted
3. Test poster image loads correctly
4. Try different video codec

---

## 6. Information to Provide for Support

When reporting video playback issues, please provide:

### Video File Details
```
- File name: ________________
- File size: ________________
- Format: ________________
- Duration: ________________
- Resolution: ________________
- Encoding software used: ________________
```

### Backend Storage Configuration
```
- Supabase project URL: ________________
- Storage bucket name: ________________
- File path in storage: ________________
- Public URL: ________________
- Database video_url value: ________________
```

### Frontend Implementation Code
```javascript
// Copy the video element code from CourseModal.tsx
// Include any custom modifications made
```

### Error Messages
```
- Browser console errors: ________________
- Network tab status codes: ________________
- Supabase dashboard errors: ________________
- Any other error messages: ________________
```

### Testing Results
```
- Direct URL access works: Yes/No
- Video loads in other browsers: Yes/No
- File exists in Supabase storage: Yes/No
- Database entry exists: Yes/No
- Player controls appear: Yes/No
```

---

## 7. Quick Diagnostic Checklist

**Before reporting issues, verify:**

- [ ] Video file is in MP4 format with H.264 codec
- [ ] File size is under 100MB
- [ ] Video uploaded successfully to Supabase Storage
- [ ] Storage bucket 'images' is public
- [ ] Database `video_url` field contains correct URL
- [ ] Content status is 'published'
- [ ] Content type is 'course'
- [ ] Browser console shows no errors
- [ ] Network tab shows successful video request
- [ ] Direct URL access works in browser
- [ ] Video plays in other video players

**If all items are checked and video still doesn't work, provide the information requested in Section 6 for further assistance.**

---

## 8. Advanced Debugging

### Enable Detailed Logging
Add this to `CourseModal.tsx` for detailed debugging:

```javascript
// Add after course prop is received
useEffect(() => {
  if (course) {
    console.group('🎥 Video Debug Info');
    console.log('Course ID:', course.id);
    console.log('Course Title:', course.title);
    console.log('Video URL:', course.video_url);
    console.log('Video URL Valid:', !!course.video_url);
    console.log('Video URL Type:', typeof course.video_url);
    console.groupEnd();
  }
}, [course]);

// Add video event listeners
const handleVideoError = (e) => {
  console.error('Video Error:', e.target.error);
  console.error('Error Code:', e.target.error?.code);
  console.error('Error Message:', e.target.error?.message);
};

const handleVideoLoad = () => {
  console.log('✅ Video loaded successfully');
};

// Add to video element
<video
  onError={handleVideoError}
  onLoadedData={handleVideoLoad}
  // ... other props
>
```

### Test Video Compatibility
```javascript
// Check browser video format support
const checkVideoSupport = () => {
  const video = document.createElement('video');
  console.log('MP4 Support:', video.canPlayType('video/mp4'));
  console.log('WebM Support:', video.canPlayType('video/webm'));
  console.log('OGV Support:', video.canPlayType('video/ogg'));
};
```

This comprehensive guide should help identify and resolve most video playback issues in your course management system.