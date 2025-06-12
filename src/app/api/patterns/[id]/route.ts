import { createServerComponentClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const { id } = await params;
    
    // Fetch pattern with category and examples
    const { data: pattern, error } = await supabase
      .from('patterns')
      .select(`
        *,
        category:pattern_categories(*),
        examples:examples(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Pattern not found' 
          },
          { status: 404 }
        );
      }
      throw error;
    }
    
    // Sort examples by display_order
    if (pattern.examples) {
      pattern.examples.sort((a: any, b: any) => a.display_order - b.display_order);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: pattern 
    });
    
  } catch (error: any) {
    console.error('Error fetching pattern:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch pattern' 
      },
      { status: 500 }
    );
  }
}