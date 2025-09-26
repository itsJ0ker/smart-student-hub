import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all_time';

    // Check cache
    const { data: cached } = await supabase
      .from('leaderboards')
      .select('rank_json')
      .eq('period', period)
      .single();

    if (cached?.rank_json) {
      return NextResponse.json({ leaderboard: cached.rank_json });
    }

    // Fetch top students
    const { data: students, error } = await supabase
      .from('students')
      .select('id, name, roll_no, department, points')
      .order('points', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    const leaderboard = (students || []).map((student, index) => ({
      rank: index + 1,
      id: student.id,
      name: student.name,
      department: student.department,
      points: student.points
    }));

    // Cache the result
    await supabase
      .from('leaderboards')
      .upsert({
        period,
        rank_json: leaderboard,
        updated_at: new Date().toISOString()
      }, { onConflict: 'period' });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error in leaderboard API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}