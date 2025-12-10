import { supabase } from '../lib/supabase';
import type { Image } from '../lib/supabase';

export class ImageService {
  // Upload image to Supabase Storage
  static async uploadImage(file: File, folder: string = 'content-images'): Promise<Image> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Get image dimensions (if it's an image)
      const dimensions = await this.getImageDimensions(file);

      // Save image metadata to database
      const imageData = {
        filename: fileName,
        original_name: file.name,
        file_path: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        width: dimensions?.width,
        height: dimensions?.height
      };

      const { data, error } = await supabase
        .from('images')
        .insert(imageData)
        .select()
        .single();

      if (error) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('images').remove([filePath]);
        throw new Error(`Failed to save image metadata: ${error.message}`);
      }

      return data as Image;
    } catch (error) {
      throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get image dimensions
  private static getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    });
  }

  // Get all images
  static async getImages() {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch images: ${error.message}`);
    }

    return data as Image[];
  }

  // Get single image
  static async getImageById(id: string) {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch image: ${error.message}`);
    }

    return data as Image;
  }

  // Update image metadata
  static async updateImage(id: string, updates: Partial<Image>) {
    const { data, error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update image: ${error.message}`);
    }

    return data as Image;
  }

  // Delete image
  static async deleteImage(id: string) {
    // Get image data first
    const image = await this.getImageById(id);

    // Delete from storage
    const filePath = image.file_path.split('/').pop();
    if (filePath) {
      await supabase.storage
        .from('images')
        .remove([`content-images/${filePath}`]);
    }

    // Delete from database
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }

    return true;
  }

  // Resize image (client-side)
  static async resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}