import { createServerComponentClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createServerComponentClient();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        success: true, 
        data: {
          patterns: [],
          examples: []
        }
      });
    }
    
    // Search patterns by title and description
    const { data: patterns, error: patternsError } = await supabase
      .from('patterns')
      .select(`
        id,
        title,
        slug,
        description,
        category:pattern_categories(
          id,
          name,
          slug
        )
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,explanation.ilike.%${query}%`)
      .limit(10);
    
    if (patternsError) {
      throw patternsError;
    }
    
    // Search examples by company name and title
    const { data: examples, error: examplesError } = await supabase
      .from('examples')
      .select(`
        id,
        company,
        title,
        pattern:patterns(
          id,
          title,
          slug,
          category:pattern_categories(
            id,
            name,
            slug
          )
        )
      `)
      .or(`company.ilike.%${query}%,title.ilike.%${query}%,use_case.ilike.%${query}%`)
      .limit(10);
    
    if (examplesError) {
      throw examplesError;
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        patterns: patterns || [],
        examples: examples || []
      }
    });
    
  } catch (error: any) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to search' 
      },
      { status: 500 }
    );
  }
}