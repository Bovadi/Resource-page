import { supabase, handleSupabaseError } from '../lib/supabase.js';

export class ContentService {
  static async getContent(type, status = 'published') {
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

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw handleSupabaseError(error, 'fetch content');
    }
  }

  static async getContentById(id) {
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

    if (data.perfect_for && typeof data.perfect_for === 'string') {
      try {
        data.perfect_for = JSON.parse(data.perfect_for);
      } catch (e) {
        console.warn('Failed to parse perfect_for JSON:', e);
        data.perfect_for = [];
      }
    }

    return data;
  }

  static async createContent(contentData) {
    const { data, error } = await supabase
      .from('content')
      .insert(contentData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create content: ${error.message}`);
    }

    return data;
  }

  static async updateContent(id, updates) {
    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update content: ${error.message}`);
    }

    return data;
  }

  static async deleteContent(id) {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete content: ${error.message}`);
    }

    return true;
  }

  static async getCourseResources(courseId) {
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

    return data;
  }

  static async addResourceToCourse(courseId, resourceId, sortOrder = 0) {
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

    return data;
  }
}
