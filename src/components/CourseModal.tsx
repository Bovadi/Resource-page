import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../hooks/useCardData';
import { ContentService } from '../services/contentService';
import { Content, CourseResource } from '../lib/supabase';
import { Card as UICard, CardContent } from './ui/card';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Card | null;
  contentType?: 'course' | 'resource';
}

interface SupportingMaterial {
  id: string;
  title: string;
  image: string;
  downloadUrl?: string;
  description?: string;
  description_long?: string;
  perfect_for?: string[];
  type: 'resource';
}

export const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course, contentType = 'course' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supportingMaterials, setSupportingMaterials] = useState<SupportingMaterial[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<SupportingMaterial | null>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent page scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isFullscreen, onClose]);

  // Load supporting materials when course is selected
  useEffect(() => {
    const loadSupportingMaterials = async () => {
      if (!course || !isOpen) return;
      
      setLoadingResources(true);
      try {
        // Get resources specifically associated with this course
        const courseResources = await ContentService.getCourseResources(course.id);
        
        // Convert to supporting materials format
        const materials: SupportingMaterial[] = courseResources.map(courseResource => {
          const resource = courseResource.resource;
          const primaryImage = resource.images?.find(ci => ci.is_primary)?.image;
          const firstImage = resource.images?.[0]?.image;
          const imageUrl = primaryImage?.file_path || firstImage?.file_path || "/screenshot-2024-05-27-at-2-52-1-15.png";
          
          return {
            id: resource.id,
            title: resource.title,
            image: imageUrl,
            downloadUrl: resource.download_url,
            description: resource.description,
            description_long: resource.description_long,
            perfect_for: resource.perfect_for,
            type: 'resource' as const
          };
        });
        
        setSupportingMaterials(materials);
      } catch (error) {
        console.error('Failed to load course resources:', error);
        // Fallback to empty array
        setSupportingMaterials([]);
      } finally {
        setLoadingResources(false);
      }
    };

    loadSupportingMaterials();
  }, [course, isOpen]);
  // Handle click outside modal (only for initial modal, not fullscreen)
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isFullscreen) {
      onClose();
    }
  };

  // Handle Start Course button click
  const handleStartCourse = () => {
    if (contentType === 'resource' && course?.download_url) {
      // For resources, trigger download instead of fullscreen
      handleResourceDownload();
    } else {
      // For courses, open fullscreen view
      setIsFullscreen(true);
    }
  };

  // Handle resource download
  const handleResourceDownload = async () => {
    if (!course?.download_url) return;
    
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = course.download_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Set download attribute to force download
      const fileName = course.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileExtension = course.download_url.split('.').pop() || 'file';
      link.download = `${fileName}.${fileExtension}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Close modal after download starts
      onClose();
      
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open URL in new tab
      window.open(course.download_url, '_blank', 'noopener,noreferrer');
    }
  };
  // Handle Exit Course button click
  const handleExitCourse = () => {
    setIsFullscreen(false);
    onClose();
  };

  // Handle Take Test button click
  const handleTakeTest = () => {
    const testUrl = course?.test_url || 'https://example.com/test';
    window.open(testUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle resource download
  const handleResourceClick = (material: SupportingMaterial) => {
    // Convert SupportingMaterial to Card format for modal
    const resourceCard = {
      id: material.id,
      image: material.image,
      title: material.title,
      type: material.type,
      description: material.description,
      description_long: material.description_long,
      download_url: material.downloadUrl,
      perfect_for: material.perfect_for
    };
    
    setSelectedResource(material);
    setResourceModalOpen(true);
  };

  const handleResourceModalClose = () => {
    setResourceModalOpen(false);
    setTimeout(() => {
      setSelectedResource(null);
    }, 300);
  };

  // Reset fullscreen state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  if (!isOpen || !course) return null;

  // Fullscreen course view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 shadow-sm" style={{ backgroundColor: '#F8F5EF' }}>
          <button
            onClick={handleExitCourse}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Exit course"
          >
            Exit Course
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900 text-center flex-1 px-4">
            Creating Visual BIPs for Confident Parent & Staff Support
          </h1>
          
          <button
            onClick={handleTakeTest}
            className="px-4 py-2 border-2 bg-white rounded hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#108C89]"
            style={{ borderColor: '#108C89', color: '#108C89' }}
            aria-label="Take the test"
          >
            Take the test
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
          {/* Video Section */}
          <div className="mb-8">
            <div className="relative w-full max-w-4xl mx-auto">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  className="w-full h-full"
                  controls
                 preload="metadata"
                  poster={course?.image || "/BCBA Course.png"}
                  aria-label="Course video player"
                 onError={(e) => {
                   console.error('Video error:', e.target.error);
                   console.error('Video URL:', course?.video_url);
                 }}
                 onLoadStart={() => console.log('Video load started')}
                 onLoadedData={() => console.log('Video data loaded')}
                 onCanPlay={() => console.log('Video can play')}
                >
                  <source 
                    src={course?.video_url || "https://example.com/course-video.mp4"} 
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Supporting Materials Section */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#F8F5EF] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Supporting Materials</h2>
            
          {loadingResources ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(null).map((_, index) => (
                <div key={`skeleton-${index}`} className="animate-pulse">
                  <UICard className="bg-white border border-gray-200 mb-3">
                    <CardContent className="p-4">
                      <div className="relative w-full aspect-[246/252] bg-gray-200 rounded-sm"></div>
                    </CardContent>
                  </UICard>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {supportingMaterials.map((material) => (
                <div
                  key={material.id}
                  className="cursor-pointer group"
                  onClick={() => handleResourceClick(material)}
                >
                  <UICard className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200 mb-3">
                    <CardContent className="p-4">
                      <div className="relative w-full aspect-[246/252]">
                        <img
                          className="w-full h-full object-cover rounded-sm"
                          alt={material.title}
                          src={material.image}
                          loading="lazy"
                        />
                        
                        {/* Download indicator overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                            <svg className="w-6 h-6 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {material.downloadUrl ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              )}
                            </svg>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </UICard>
                  <div>
                    <p className="font-normal text-[#343434] text-sm leading-[16.8px] text-left group-hover:text-custom-teal transition-colors duration-200">
                      {material.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loadingResources && supportingMaterials.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No resources have been assigned to this course</p>
            </div>
          )}
            </div>
          </div>
        </div>
        </div>
        
        {/* Resource Modal */}
        {selectedResource && (
          <CourseModal
            isOpen={resourceModalOpen}
            onClose={handleResourceModalClose}
            course={{
              id: selectedResource.id,
              image: selectedResource.image,
              title: selectedResource.title,
              type: selectedResource.type,
              description: selectedResource.description,
              description_long: selectedResource.description_long,
              download_url: selectedResource.downloadUrl,
              perfect_for: selectedResource.perfect_for
            }}
            contentType="resource"
          />
        )}
      </div>
    );
  }

  // Initial modal view
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Semi-transparent blurry overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
      
      {/* Modal content */}
      <div
        id="course-modal"
        className={`relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {contentType === 'resource' ? 'Download Resource' : 'Start new course'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#108C89]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-4 sm:p-6">
            {/* Course image */}
            <div className="mb-4 sm:mb-6">
              <div className="w-full h-64 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F7F7F7' }}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Course title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {course.title}
            </h3>

            {/* Course description */}
            <div id="modal-description" className="space-y-4 text-gray-700 mb-4">
              <p className="leading-relaxed">
                {course?.description || 'Course description not available.'}
              </p>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Perfect for:</h4>
                {course?.perfect_for && course.perfect_for.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {course.perfect_for.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-custom-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No specific use cases defined for this course.
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Footer with action button */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex-shrink-0">
          <button 
            onClick={handleStartCourse}
            className="w-full bg-[#108C89] text-white py-3 px-4 rounded-lg hover:bg-[#0e7a77] transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#108C89] focus:ring-offset-2 min-h-[48px]"
          >
            {contentType === 'resource' ? 'Download Resource' : 'Start Course'}
          </button>
        </div>
      </div>
    </div>
  );
};