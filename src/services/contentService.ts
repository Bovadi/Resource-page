import { supabase, handleSupabaseError } from '../lib/supabase';
import type { Content, Image, ContentImage, CourseResource } from '../lib/supabase';

export class ContentService {
  // Get all content with images
  static async getContent(type?: 'course' | 'resource', status: string = 'published') {
    try {
      let query = supabase
        .from('content')
        .select(`
          *,
          category:categories(*),
          images:content_images(
            *,
            image:images(*)
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        throw handleSupabaseError(error, 'fetch content');
      }

      return data as Content[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw handleSupabaseError(error, 'fetch content');
    }
  }

  // Get single content item
  static async getContentById(id: string) {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        category:categories(*),
        images:content_images(
          *,
          image:images(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch content: ${error.message}`);
    }

    // Parse perfect_for JSON if it exists
    if (data.perfect_for && typeof data.perfect_for === 'string') {
      try {
        data.perfect_for = JSON.parse(data.perfect_for);
      } catch (e) {
        console.warn('Failed to parse perfect_for JSON:', e);
        data.perfect_for = [];
      }
    }

    return data as Content;
  }

  // Create new content
  static async createContent(contentData: Omit<Content, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('content')
      .insert(contentData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create content: ${error.message}`);
    }

    return data as Content;
  }

  // Update content
  static async updateContent(id: string, updates: Partial<Content>) {
    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update content: ${error.message}`);
    }

    return data as Content;
  }

  // Delete content
  static async deleteContent(id: string) {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete content: ${error.message}`);
    }

    return true;
  }

  // Associate image with content
  static async addImageToContent(contentId: string, imageId: string, isPrimary: boolean = false, sortOrder: number = 0) {
    const { data, error } = await supabase
      .from('content_images')
      .insert({
        content_id: contentId,
        image_id: imageId,
        is_primary: isPrimary,
        sort_order: sortOrder
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to associate image with content: ${error.message}`);
    }

    return data as ContentImage;
  }

  // Remove image from content
  static async removeImageFromContent(contentId: string, imageId: string) {
    const { error } = await supabase
      .from('content_images')
      .delete()
      .eq('content_id', contentId)
      .eq('image_id', imageId);

    if (error) {
      throw new Error(`Failed to remove image from content: ${error.message}`);
    }

    return true;
  }

  // Remove all images from content
  static async removeAllImagesFromContent(contentId: string) {
    const { error } = await supabase
      .from('content_images')
      .delete()
      .eq('content_id', contentId);

    if (error) {
      throw new Error(`Failed to remove all images from content: ${error.message}`);
    }

    return true;
  }

  // Course-Resource relationship methods
  
  // Get resources associated with a specific course
  static async getCourseResources(courseId: string) {
    const { data, error } = await supabase
      .from('course_resources')
      .select(`
        *,
        resource:content!resource_id(
          *,
          images:content_images(
            *,
            image:images(*)
          )
        )
      `)
      .eq('course_id', courseId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch course resources: ${error.message}`);
    }

    return data as (CourseResource & { resource: Content })[];
  }

  // Associate a resource with a course
  static async addResourceToCourse(courseId: string, resourceId: string, sortOrder: number = 0) {
    const { data, error } = await supabase
      .from('course_resources')
      .insert({
        course_id: courseId,
        resource_id: resourceId,
        sort_order: sortOrder
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to associate resource with course: ${error.message}`);
    }

    return data as CourseResource;
  }

  // Remove a resource from a course
  static async removeResourceFromCourse(courseId: string, resourceId: string) {
    const { error } = await supabase
      .from('course_resources')
      .delete()
      .eq('course_id', courseId)
      .eq('resource_id', resourceId);

    if (error) {
      throw new Error(`Failed to remove resource from course: ${error.message}`);
    }

    return true;
  }

  // Remove all resources from a course
  static async removeAllResourcesFromCourse(courseId: string) {
    const { error } = await supabase
      .from('course_resources')
      .delete()
      .eq('course_id', courseId);

    if (error) {
      throw new Error(`Failed to remove all resources from course: ${error.message}`);
    }

    return true;
  }

  // Update resource order for a course
  static async updateCourseResourceOrder(courseId: string, resourceUpdates: { resourceId: string; sortOrder: number }[]) {
    const updates = resourceUpdates.map(({ resourceId, sortOrder }) => 
      supabase
        .from('course_resources')
        .update({ sort_order: sortOrder })
        .eq('course_id', courseId)
        .eq('resource_id', resourceId)
    );

    const results = await Promise.all(updates);
    
    for (const result of results) {
      if (result.error) {
        throw new Error(`Failed to update resource order: ${result.error.message}`);
      }
    }

    return true;
  }
}