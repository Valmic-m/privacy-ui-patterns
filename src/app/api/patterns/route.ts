import { createServerComponentClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createServerComponentClient();
    const { searchParams } = new URL(request.url);
    
    // Optional filters
    const categoryId = searchParams.get('category_id');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    
    let query = supabase
      .from('patterns')
      .select(`
        *,
        category:pattern_categories(*),
        examples:examples(count)
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data: patterns, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Transform the data to include example count
    const transformedPatterns = patterns?.map(pattern => ({
      ...pattern,
      example_count: pattern.examples?.[0]?.count || 0,
      examples: undefined // Remove the examples array
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: transformedPatterns,
      pagination: {
        limit,
        offset
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching patterns:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch patterns' 
      },
      { status: 500 }
    );
  }
}