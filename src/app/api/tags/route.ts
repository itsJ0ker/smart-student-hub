import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('student_tags')
      .select('tag, assigned_at')
      .eq('student_id', studentId)
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error fetching tags:', error);
      return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }

    return NextResponse.json({ tags: data || [] });
  } catch (error) {
    console.error('Error in tags API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}