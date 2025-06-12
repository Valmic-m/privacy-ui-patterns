import { createServerComponentClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    
    // First get the category by slug
    const { data: category, error: categoryError } = await supabase
      .from('pattern_categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (categoryError) {
      if (categoryError.code === 'PGRST116') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Category not found' 
          },
          { status: 404 }
        );
      }
      throw categoryError;
    }
    
    // Fetch patterns for this category
    const { data: patterns, error: patternsError } = await supabase
      .from('patterns')
      .select(`
        *,
        examples:examples(count)
      `)
      .eq('category_id', category.id)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (patternsError) {
      throw patternsError;
    }
    
    // Transform the data to include example count
    const transformedPatterns = patterns?.map(pattern => ({
      ...pattern,
      example_count: pattern.examples?.[0]?.count || 0,
      examples: undefined // Remove the examples array
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: {
        category,
        patterns: transformedPatterns
      },
      pagination: {
        limit,
        offset
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching patterns by category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch patterns' 
      },
      { status: 500 }
    );
  }
}