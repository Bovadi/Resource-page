import React, { useState } from 'react';
import { Download, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { DownloadService } from '../services/downloadService';

interface DownloadButtonProps {
  resourceId: string;
  title: string;
  downloadUrl?: string;
  className?: string;
  variant?: 'button' | 'link' | 'card';
  showIcon?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  resourceId,
  title,
  downloadUrl,
  className = '',
  variant = 'button',
  showIcon = true
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const result = await DownloadService.downloadResource(resourceId, title);
      
      if (result.success) {
        setStatus('success');
        setMessage('Download started');
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Download failed');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Downloading...
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          {showIcon && <CheckCircle className="w-4 h-4 mr-2" />}
          Downloaded
        </>
      );
    }

    if (status === 'error') {
      return (
        <>
          {showIcon && <AlertCircle className="w-4 h-4 mr-2" />}
          Try Again
        </>
      );
    }

    return (
      <>
        {showIcon && <Download className="w-4 h-4 mr-2" />}
        Download
      </>
    );
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'link':
        return `${baseClasses} text-custom-teal hover:text-[#0e7a77] focus:ring-[#108C89] ${className}`;
      
      case 'card':
        return `${baseClasses} w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:text-gray-900 focus:ring-[#108C89] ${className}`;
      
      default: // button
        const statusClasses = {
          success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          idle: 'bg-[#108C89] hover:bg-[#0e7a77] focus:ring-[#108C89]'
        };
        
        return `${baseClasses} px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${statusClasses[status]} ${className}`;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDownload}
        disabled={loading}
        className={getButtonClasses()}
        title={`Download ${title}`}
      >
        {getButtonContent()}
      </button>
      
      {message && (
        <div className={`absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 ${
          status === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};