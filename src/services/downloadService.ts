import { supabase } from '../lib/supabase';

export interface CreateDownloadableResourceRequest {
  title: string;
  description?: string;
  download_url: string;
  category_id?: string;
}

export interface DownloadRequest {
  resource_id: string;
}

export interface DownloadStats {
  total_downloads: number;
  unique_users: number;
  recent_downloads: any[];
  downloads_by_resource: Record<string, number>;
}

export class DownloadService {
  private static readonly EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-resource`;

  // Create a downloadable resource
  static async createDownloadableResource(data: CreateDownloadableResourceRequest) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required to create resources');
      }

      const response = await fetch(`${this.EDGE_FUNCTION_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create downloadable resource');
      }

      return result;
    } catch (error) {
      throw new Error(`Create resource failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Request download authorization and get download URL
  static async requestDownload(resourceId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required for downloads');
      }

      const response = await fetch(`${this.EDGE_FUNCTION_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ resource_id: resourceId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Download authorization failed');
      }

      return result;
    } catch (error) {
      throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Trigger download in browser
  static async downloadResource(resourceId: string, filename?: string) {
    try {
      // Get download authorization
      const downloadAuth = await this.requestDownload(resourceId);
      
      if (!downloadAuth.success) {
        throw new Error('Download not authorized');
      }

      // Open download URL in new tab
      const link = document.createElement('a');
      link.href = downloadAuth.download_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Set download attribute if filename provided
      if (filename || downloadAuth.filename) {
        link.download = filename || downloadAuth.filename;
      }
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: 'Download started',
        download_url: downloadAuth.download_url
      };

    } catch (error) {
      throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get download statistics
  static async getDownloadStats(resourceId?: string): Promise<DownloadStats> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required to view statistics');
      }

      const url = new URL(`${this.EDGE_FUNCTION_URL}/stats`);
      if (resourceId) {
        url.searchParams.set('resource_id', resourceId);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get download statistics');
      }

      return result.stats;
    } catch (error) {
      throw new Error(`Get stats failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate URL format (client-side validation)
  static validateDownloadUrl(url: string): { isValid: boolean; error?: string } {
    try {
      const urlObj = new URL(url);
      
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }
}