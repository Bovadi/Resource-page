import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageService } from '../services/imageService';
import type { Image } from '../lib/supabase';

interface ImageUploadProps {
  onImageUploaded: (image: Image) => void;
  onError: (error: string) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  onError,
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeInMB = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate files
    for (const file of fileArray) {
      if (!acceptedTypes.includes(file.type)) {
        onError(`File type ${file.type} is not supported`);
        return;
      }
      
      if (file.size > maxSizeInMB * 1024 * 1024) {
        onError(`File ${file.name} is too large. Maximum size is ${maxSizeInMB}MB`);
        return;
      }
    }

    if (fileArray.length > maxFiles) {
      onError(`Too many files. Maximum is ${maxFiles}`);
      return;
    }

    setUploading(true);

    try {
      // Create previews
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setPreviews(previewUrls);

      // Upload files
      for (const file of fileArray) {
        // Resize image before upload
        const resizedFile = await ImageService.resizeImage(file, 800, 600, 0.8);
        const uploadedImage = await ImageService.uploadImage(resizedFile);
        onImageUploaded(uploadedImage);
      }

      // Clean up previews
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviews([]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const clearPreviews = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-[#108C89] bg-[#f0fffe]'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-gray-100 rounded-full">
            <Upload className="w-6 h-6 text-gray-600" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploading ? 'Uploading...' : 'Drop images here or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports JPEG, PNG, WebP up to {maxSizeInMB}MB each
            </p>
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-teal"></div>
          </div>
        )}
      </div>

      {/* Preview Area */}
      {previews.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">Preview</h4>
            <button
              onClick={clearPreviews}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => {
                    URL.revokeObjectURL(preview);
                    setPreviews(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};