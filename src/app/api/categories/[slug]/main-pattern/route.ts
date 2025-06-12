import { createServerComponentClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const { slug } = await params;
    
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
    
    // Get the first pattern for this category (ordered by created_at)
    const { data: pattern, error: patternError } = await supabase
      .from('patterns')
      .select('*')
      .eq('category_id', category.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (patternError) {
      if (patternError.code === 'PGRST116') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No patterns found for this category' 
          },
          { status: 404 }
        );
      }
      throw patternError;
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        category,
        pattern
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching main pattern:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch main pattern' 
      },
      { status: 500 }
    );
  }
}