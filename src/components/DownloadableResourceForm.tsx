import React, { useState } from 'react';
import { Download, ExternalLink, AlertCircle } from 'lucide-react';
import { DownloadService, CreateDownloadableResourceRequest } from '../services/downloadService';

interface DownloadableResourceFormProps {
  onSuccess: (resource: any) => void;
  onError: (error: string) => void;
}

export const DownloadableResourceForm: React.FC<DownloadableResourceFormProps> = ({
  onSuccess,
  onError
}) => {
  const [formData, setFormData] = useState<CreateDownloadableResourceRequest>({
    title: '',
    description: '',
    download_url: '',
    category_id: undefined
  });
  const [loading, setLoading] = useState(false);
  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; error?: string } | null>(null);

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, download_url: url }));
    
    if (url.trim()) {
      const validation = DownloadService.validateDownloadUrl(url);
      setUrlValidation(validation);
    } else {
      setUrlValidation(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.download_url.trim()) {
      onError('Title and download URL are required');
      return;
    }

    if (urlValidation && !urlValidation.isValid) {
      onError(urlValidation.error || 'Invalid URL');
      return;
    }

    setLoading(true);

    try {
      const result = await DownloadService.createDownloadableResource(formData);
      onSuccess(result.resource);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        download_url: '',
        category_id: undefined
      });
      setUrlValidation(null);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to create downloadable resource');
    } finally {
      setLoading(false);
    }
  };

  const testUrl = () => {
    if (formData.download_url) {
      window.open(formData.download_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Download className="w-5 h-5 text-custom-teal mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Create Downloadable Resource</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resource Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108C89]"
            placeholder="e.g., Behavior Intervention Plan Template"
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
            placeholder="Describe what this resource contains..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Download URL *
          </label>
          <div className="space-y-2">
            <div className="flex">
              <input
                type="url"
                required
                value={formData.download_url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#108C89] ${
                  urlValidation?.isValid === false ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/file.pdf"
              />
              <button
                type="button"
                onClick={testUrl}
                disabled={!formData.download_url || loading}
                className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Test URL"
              >
                <ExternalLink className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {urlValidation && !urlValidation.isValid && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {urlValidation.error}
              </div>
            )}
            
            {urlValidation?.isValid && (
              <div className="flex items-center text-[#108C89] text-sm">
                <div className="w-4 h-4 mr-1 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#108C89] rounded-full"></div>
                </div>
                URL format is valid
              </div>
            )}
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            <p><strong>Allowed domains:</strong> Shopify CDN, Google Drive, Dropbox, AWS, Supabase, GitHub</p>
            <p><strong>Supported formats:</strong> PDF, Office docs, images, videos, audio, archives</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading || (urlValidation && !urlValidation.isValid)}
            className="px-4 py-2 bg-[#108C89] text-white rounded-lg hover:bg-[#0e7a77] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Creating...' : 'Create Downloadable Resource'}
          </button>
        </div>
      </form>
    </div>
  );
};