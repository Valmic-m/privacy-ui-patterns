import { createServerComponentClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerComponentClient();
    
    // Fetch all categories with pattern count and first pattern
    const { data: categories, error } = await supabase
      .from('pattern_categories')
      .select(`
        *,
        patterns:patterns(count),
        main_pattern:patterns(id, slug)
      `)
      .order('order_index', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Transform the data to include pattern count and main pattern slug
    const transformedCategories = categories?.map(category => ({
      ...category,
      pattern_count: category.patterns?.[0]?.count || 0,
      main_pattern_slug: category.main_pattern?.[0]?.slug || null,
      patterns: undefined, // Remove the patterns array
      main_pattern: undefined // Remove the main_pattern array
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: transformedCategories 
    });
    
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch categories' 
      },
      { status: 500 }
    );
  }
}