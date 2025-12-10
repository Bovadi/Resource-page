import { supabase, handleSupabaseError } from '../lib/supabase';

export interface ContentLabel {
  id: string;
  name: string;
  description?: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentLabelAssignment {
  id: string;
  content_id: string;
  label_id: string;
  created_at: string;
  label?: ContentLabel;
}

export class LabelService {
  // Get all active labels ordered by display_order
  static async getActiveLabels(): Promise<ContentLabel[]> {
    try {
      const { data, error } = await supabase
        .from('content_labels')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        throw handleSupabaseError(error, 'fetch labels');
      }

      return data as ContentLabel[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw handleSupabaseError(error, 'fetch labels');
    }
  }

  // Get all labels (for admin)
  static async getAllLabels(): Promise<ContentLabel[]> {
    try {
      const { data, error } = await supabase
        .from('content_labels')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw handleSupabaseError(error, 'fetch all labels');
      }

      return data as ContentLabel[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw handleSupabaseError(error, 'fetch all labels');
    }
  }

  // Create new label
  static async createLabel(labelData: Omit<ContentLabel, 'id' | 'created_at' | 'updated_at'>): Promise<ContentLabel> {
    const { data, error } = await supabase
      .from('content_labels')
      .insert(labelData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create label: ${error.message}`);
    }

    return data as ContentLabel;
  }

  // Update label
  static async updateLabel(id: string, updates: Partial<ContentLabel>): Promise<ContentLabel> {
    const { data, error } = await supabase
      .from('content_labels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update label: ${error.message}`);
    }

    return data as ContentLabel;
  }

  // Delete label
  static async deleteLabel(id: string): Promise<void> {
    const { error } = await supabase
      .from('content_labels')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete label: ${error.message}`);
    }
  }

  // Get content by label
  static async getContentByLabel(labelSlug: string, contentType?: 'course' | 'resource', status: string = 'published') {
    let query = supabase
      .from('content')
      .select(`
        *,
        category:categories(*),
        images:content_images(
          *,
          image:images(*)
        ),
        label_assignments:content_label_assignments(
          *,
          label:content_labels(*)
        )
      `)
      .eq('status', status);

    if (contentType) {
      query = query.eq('type', contentType);
    }

    const { data: allContent, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch content by label: ${error.message}`);
    }

    // Filter content that has the specified label
    const filteredContent = allContent?.filter(content => 
      content.label_assignments?.some((assignment: any) => 
        assignment.label?.slug === labelSlug
      )
    ) || [];

    return filteredContent;
  }

  // Get labels for specific content
  static async getContentLabels(contentId: string): Promise<ContentLabel[]> {
    const { data, error } = await supabase
      .from('content_label_assignments')
      .select(`
        *,
        label:content_labels(*)
      `)
      .eq('content_id', contentId);

    if (error) {
      throw new Error(`Failed to fetch content labels: ${error.message}`);
    }

    return data?.map(assignment => assignment.label).filter(Boolean) || [];
  }

  // Assign label to content
  static async assignLabelToContent(contentId: string, labelId: string): Promise<ContentLabelAssignment> {
    const { data, error } = await supabase
      .from('content_label_assignments')
      .insert({
        content_id: contentId,
        label_id: labelId
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign label to content: ${error.message}`);
    }

    return data as ContentLabelAssignment;
  }

  // Remove label from content
  static async removeLabelFromContent(contentId: string, labelId: string): Promise<void> {
    const { error } = await supabase
      .from('content_label_assignments')
      .delete()
      .eq('content_id', contentId)
      .eq('label_id', labelId);

    if (error) {
      throw new Error(`Failed to remove label from content: ${error.message}`);
    }
  }

  // Update all labels for content (replace existing)
  static async updateContentLabels(contentId: string, labelIds: string[]): Promise<void> {
    // Remove all existing assignments
    await supabase
      .from('content_label_assignments')
      .delete()
      .eq('content_id', contentId);

    // Add new assignments
    if (labelIds.length > 0) {
      const assignments = labelIds.map(labelId => ({
        content_id: contentId,
        label_id: labelId
      }));

      const { error } = await supabase
        .from('content_label_assignments')
        .insert(assignments);

      if (error) {
        throw new Error(`Failed to update content labels: ${error.message}`);
      }
    }
  }

  // Get content count by label
  static async getContentCountByLabel(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('content_label_assignments')
      .select(`
        label_id,
        label:content_labels(slug),
        content:content!inner(status)
      `)
      .eq('content.status', 'published');

    if (error) {
      throw new Error(`Failed to get content count by label: ${error.message}`);
    }

    const counts: Record<string, number> = {};
    data?.forEach(assignment => {
      const slug = assignment.label?.slug;
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1;
      }
    });

    return counts;
  }

  // Get content count by label and type
  static async getContentCountByLabelAndType(): Promise<Record<string, { courses: number; resources: number }>> {
    const { data, error } = await supabase
      .from('content_label_assignments')
      .select(`
        label_id,
        label:content_labels(slug),
        content:content!inner(status, type)
      `)
      .eq('content.status', 'published');

    if (error) {
      throw new Error(`Failed to get content count by label and type: ${error.message}`);
    }

    const counts: Record<string, { courses: number; resources: number }> = {};
    data?.forEach(assignment => {
      const slug = assignment.label?.slug;
      const contentType = assignment.content?.type;
      
      if (slug && contentType) {
        if (!counts[slug]) {
          counts[slug] = { courses: 0, resources: 0 };
        }
        
        if (contentType === 'course') {
          counts[slug].courses += 1;
        } else if (contentType === 'resource') {
          counts[slug].resources += 1;
        }
      }
    });

    return counts;
  }

  // Generate slug from name
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }
}