import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock LMS sync - in real app, this would integrate with actual LMS API
export async function POST(request: NextRequest) {
  try {
    const { student_id } = await request.json();

    // Mock activities from LMS
    const mockActivities = [
      {
        student_id,
        title: 'Completed Online Course on React',
        activity_type: 'Online Course',
        status: 'approved',
        hours: 10,
        evidence_url: 'https://example.com/cert.pdf',
        provider: 'Coursera',
        faculty_approver: null,
        approved_at: new Date().toISOString(),
        verification_score: 0.95,
        ai_flag_reason: 'Verified certificate authenticity'
      },
      {
        student_id,
        title: 'Attended Webinar on AI Ethics',
        activity_type: 'Webinar',
        status: 'approved',
        hours: 2,
        evidence_url: 'https://example.com/webinar-cert.pdf',
        provider: 'IEEE',
        faculty_approver: null,
        approved_at: new Date().toISOString(),
        verification_score: 0.88,
        ai_flag_reason: 'Valid attendance record'
      }
    ];

    // Insert mock activities
    const { data, error } = await supabase
      .from('activities')
      .insert(mockActivities)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'LMS sync completed', synced: data.length });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}