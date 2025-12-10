import React, { useState, useEffect } from 'react';
import { Search, Plus, X, GripVertical } from 'lucide-react';
import { ContentService } from '../services/contentService';
import type { Content } from '../lib/supabase';
import { Card, CardContent } from './ui/card';

interface ResourceSelectorProps {
  selectedResources: Content[];
  onResourcesChange: (resources: Content[]) => void;
  onError: (error: string) => void;
}

export const ResourceSelector: React.FC<ResourceSelectorProps> = ({
  selectedResources,
  onResourcesChange,
  onError
}) => {
  const [availableResources, setAvailableResources] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    loadAvailableResources();
  }, []);

  const loadAvailableResources = async () => {
    try {
      setLoading(true);
      const resources = await ContentService.getContent('resource', 'published');
      setAvailableResources(resources);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = availableResources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedResources.some(selected => selected.id === resource.id)
  );

  const addResource = (resource: Content) => {
    onResourcesChange([...selectedResources, resource]);
  };

  const removeResource = (resourceId: string) => {
    onResourcesChange(selectedResources.filter(r => r.id !== resourceId));
  };

  const moveResource = (fromIndex: number, toIndex: number) => {
    const newResources = [...selectedResources];
    const [movedResource] = newResources.splice(fromIndex, 1);
    newResources.splice(toIndex, 0, movedResource);
    onResourcesChange(newResources);
  };

  const getResourceImage = (resource: Content) => {
    const primaryImage = resource.images?.find(ci => ci.is_primary)?.image;
    const firstImage = resource.images?.[0]?.image;
    return primaryImage?.file_path || firstImage?.file_path || "/screenshot-2024-05-27-at-2-52-1-15.png";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Course Resources ({selectedResources.length})
        </label>
        <button
          type="button"
          onClick={() => setShowSelector(!showSelector)}
          className="flex items-center px-3 py-1 text-sm bg-[#108C89] text-white rounded hover:bg-[#0e7a77] transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Resources
        </button>
      </div>

      {/* Selected Resources */}
      {selectedResources.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Resources:</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedResources.map((resource, index) => (
              <div
                key={resource.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group"
              >
                <button
                  type="button"
                  className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                  onMouseDown={(e) => {
                    // Simple drag implementation - you could enhance this with a proper drag library
                    e.preventDefault();
                  }}
                >
                  <GripVertical className="w-4 h-4" />
                </button>
                
                <img
                  src={getResourceImage(resource)}
                  alt={resource.title}
                  className="w-12 h-12 object-cover rounded"
                />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {resource.title}
                  </p>
                  {resource.description && (
                    <p className="text-xs text-gray-500 truncate">
                      {resource.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeResource(resource.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resource Selector Modal */}
      {showSelector && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">Select Resources</h4>
            <button
              type="button"
              onClick={() => setShowSelector(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
            />
          </div>

          {/* Available Resources */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-custom-teal"></div>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No resources found matching your search' : 'No available resources'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => addResource(resource)}
                  >
                    <img
                      src={getResourceImage(resource)}
                      alt={resource.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {resource.title}
                      </p>
                      {resource.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {resource.description}
                        </p>
                      )}
                    </div>
                    <Plus className="w-4 h-4 text-custom-teal" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};