import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { activityId } = await request.json();

    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID required' }, { status: 400 });
    }

    // Simulate AI verification
    const score = Math.random() * 100; // Random score for demo
    const aiFlag = score < 50 ? 'Low confidence in evidence' : null;

    await supabase
      .from('activities')
      .update({
        verification_score: score,
        ai_flag_reason: aiFlag
      })
      .eq('id', activityId);

    return NextResponse.json({ success: true, score, aiFlag });
  } catch (error) {
    console.error('Error in verify-ai API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}