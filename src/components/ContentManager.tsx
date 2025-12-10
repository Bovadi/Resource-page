import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { ContentService } from '../services/contentService';
import { ImageService } from '../services/imageService';
import type { Content, Image } from '../lib/supabase';
import { ImageUpload } from './ImageUpload';
import { ResourceSelector } from './ResourceSelector';
import { DownloadableResourceForm } from './DownloadableResourceForm';
import { LabelSelector } from './LabelSelector';
import { LabelService, ContentLabel } from '../services/labelService';

export const ContentManager: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'resource' as 'course' | 'resource',
    video_url: '',
    test_url: '',
    download_url: '',
    status: 'draft' as 'draft' | 'published' | 'archived'
  });

  const [perfectForItems, setPerfectForItems] = useState<string[]>([]);
  const [newPerfectForItem, setNewPerfectForItem] = useState('');
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [selectedResources, setSelectedResources] = useState<Content[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<ContentLabel[]>([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await ContentService.getContent();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let savedContent: Content;
      
      // Prepare form data with perfect_for array
      const contentData = {
        ...formData,
        perfect_for: perfectForItems
      };
      
      if (editingContent) {
        savedContent = await ContentService.updateContent(editingContent.id, contentData);
      } else {
        savedContent = await ContentService.createContent(contentData);
      }

      // If updating existing content, remove all existing image associations first
      if (editingContent) {
        await ContentService.removeAllImagesFromContent(savedContent.id);
        
        // For courses, also remove existing resource associations
        if (savedContent.type === 'course') {
          await ContentService.removeAllResourcesFromCourse(savedContent.id);
        }
      }

      // Associate selected images with content
      for (let i = 0; i < selectedImages.length; i++) {
        await ContentService.addImageToContent(
          savedContent.id,
          selectedImages[i].id,
          i === 0, // First image is primary
          i
        );
      }

      // For courses, associate selected resources
      if (savedContent.type === 'course') {
        for (let i = 0; i < selectedResources.length; i++) {
          await ContentService.addResourceToCourse(
            savedContent.id,
            selectedResources[i].id,
            i
          );
        }
      }

      // Update content labels
      const labelIds = selectedLabels.map(label => label.id);
      await LabelService.updateContentLabels(savedContent.id, labelIds);

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'resource',
        video_url: '',
        test_url: '',
        download_url: '',
        status: 'draft'
      });
      setPerfectForItems([]);
      setNewPerfectForItem('');
      setSelectedImages([]);
      setSelectedResources([]);
      setSelectedLabels([]);
      setShowCreateForm(false);
      setEditingContent(null);
      
      // Reload content
      await loadContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    }
  };

  const handleEdit = (item: Content) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      video_url: item.video_url || '',
      test_url: item.test_url || '',
      download_url: item.download_url || '',
      status: item.status
    });
    setPerfectForItems(item.perfect_for || []);
    setSelectedImages(item.images?.map(ci => ci.image) || []);
    
    // Load associated resources for courses
    if (item.type === 'course') {
      loadCourseResources(item.id);
    } else {
      setSelectedResources([]);
    }
    
    // Load associated labels
    loadContentLabels(item.id);
    setShowCreateForm(true);
  };

  const loadCourseResources = async (courseId: string) => {
    try {
      const courseResources = await ContentService.getCourseResources(courseId);
      setSelectedResources(courseResources.map(cr => cr.resource));
    } catch (err) {
      console.error('Failed to load course resources:', err);
      setSelectedResources([]);
    }
  };

  const loadContentLabels = async (contentId: string) => {
    try {
      const labels = await LabelService.getContentLabels(contentId);
      setSelectedLabels(labels);
    } catch (err) {
      console.error('Failed to load content labels:', err);
      setSelectedLabels([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await ContentService.deleteContent(id);
      await loadContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete content');
    }
  };

  const handleImageUploaded = (image: Image) => {
    setSelectedImages(prev => [...prev, image]);
  };

  const handleImageError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleDownloadableResourceSuccess = (resource: any) => {
    loadContent(); // Reload the content list
  };

  const addPerfectForItem = () => {
    if (newPerfectForItem.trim() && !perfectForItems.includes(newPerfectForItem.trim())) {
      setPerfectForItems(prev => [...prev, newPerfectForItem.trim()]);
      setNewPerfectForItem('');
    }
  };

  const removePerfectForItem = (index: number) => {
    setPerfectForItems(prev => prev.filter((_, i) => i !== index));
  };

  const removeSelectedImage = (imageId: string) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-[#108C89] text-white rounded-lg hover:bg-[#0e7a77] transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingContent ? 'Edit Content' : 'Create New Content'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
                  />
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'course' | 'resource' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
                    >
                      <option value="resource">Resource</option>
                      <option value="course">Course</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' | 'archived' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {formData.type === 'course' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={formData.video_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Test URL
                      </label>
                      <input
                        type="url"
                        value={formData.test_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, test_url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
                      />
                    </div>
                  </div>
                )}

                {formData.type === 'resource' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Download URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.download_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, download_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
                      placeholder="https://example.com/file.pdf"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add a direct download link for this resource
                    </p>
                  </div>
                )}

                {/* Perfect For Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perfect For (Use Cases)
                  </label>
                  
                  {/* Add new item */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newPerfectForItem}
                      onChange={(e) => setNewPerfectForItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPerfectForItem())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
                      placeholder="e.g., Supporting new team members"
                    />
                    <button
                      type="button"
                      onClick={addPerfectForItem}
                      className="px-4 py-2 bg-[#108C89] text-white rounded-lg hover:bg-[#0e7a77] transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Display current items */}
                  {perfectForItems.length > 0 && (
                    <div className="space-y-2">
                      {perfectForItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-custom-teal rounded-full mr-3"></span>
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePerfectForItem(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Add bullet points describing what this content is perfect for
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <ImageUpload
                    onImageUploaded={handleImageUploaded}
                    onError={handleImageError}
                  />
                  
                  {selectedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.file_path}
                            alt={image.alt_text || image.original_name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          {index === 0 && (
                            <span className="absolute top-1 left-1 px-2 py-1 bg-custom-teal text-white text-xs rounded">
                              Primary
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(image.id)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resource Selector for Courses */}
                {formData.type === 'course' && (
                  <ResourceSelector
                    selectedResources={selectedResources}
                    onResourcesChange={setSelectedResources}
                    onError={setError}
                  />
                )}

                {/* Label Selector */}
                <LabelSelector
                  selectedLabels={selectedLabels}
                  onLabelsChange={setSelectedLabels}
                  onError={setError}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingContent(null);
                      setSelectedImages([]);
                      setSelectedResources([]);
                      setSelectedLabels([]);
                      setPerfectForItems([]);
                      setNewPerfectForItem('');
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#108C89] text-white rounded-lg hover:bg-[#0e7a77] transition-colors duration-200"
                  >
                    {editingContent ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="grid gap-4">
        {content.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.type === 'course' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                
                {item.description && (
                  <p className="text-gray-600 mb-2">{item.description}</p>
                )}
                
                {item.images && item.images.length > 0 && (
                  <div className="flex space-x-2 mb-2">
                    {item.images.slice(0, 3).map((contentImage) => (
                      <img
                        key={contentImage.id}
                        src={contentImage.image.file_path}
                        alt={contentImage.image.alt_text || contentImage.image.original_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                    {item.images.length > 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                        +{item.images.length - 3}
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-sm text-gray-500">
                  Created: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {content.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No content found. Create your first item!</p>
        </div>
      )}
    </div>
  );
};