import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function PATCH(request: NextRequest) {
  try {
    const { activityId, approverId, approve } = await request.json();

    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID required' }, { status: 400 });
    }

    const status = approve ? 'approved' : 'rejected';

    // Update activity status
    const { data: activity, error: updateError } = await supabase
      .from('activities')
      .update({
        status,
        faculty_approver: approverId,
        approved_at: new Date().toISOString()
      })
      .eq('id', activityId)
      .select('*, students(id, name)')
      .single();

    if (updateError) {
      console.error('Error updating activity:', updateError);
      return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
    }

    // If approved, award points and badge
    if (approve && activity) {
      const points = activity.hours * 10; // Example: 10 points per hour
      await supabase
        .from('students')
        .update({ points: activity.students.points + points })
        .eq('id', activity.student_id);

      // Award badge
      const badgeName = `Badge for ${activity.title}`;
      await supabase.from('badges').insert({
        student_id: activity.student_id,
        activity_id: activityId,
        name: badgeName,
        criteria: 'Approved evidence for activity'
      });

      // Assign tags based on activity type
      const tagMap: { [key: string]: string } = {
        'hackathon': 'Innovator',
        'competition': 'Achiever',
        'team project': 'Team Player',
        'leadership': 'Leader',
        'nss': 'Community Servant',
        'ncc': 'Disciplined',
        'club': 'Creative',
        'volunteer': 'Altruist',
        'workshop': 'Learner',
        'seminar': 'Knowledge Seeker'
      };

      const tag = tagMap[activity.activity_type.toLowerCase()];
      if (tag) {
        await supabase.from('student_tags').insert({
          student_id: activity.student_id,
          tag
        }).select().single(); // Ignore if exists due to unique constraint
      }
    }

    // Send notification
    const notificationTitle = approve ? 'Activity Approved' : 'Activity Rejected';
    const notificationMessage = approve
      ? `Your activity "${activity.title}" has been approved! You earned ${activity.hours * 10} points.`
      : `Your activity "${activity.title}" has been rejected.`;

    await supabase.from('notifications').insert({
      user_id: activity.student_id,
      title: notificationTitle,
      message: notificationMessage,
      read: false
    });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Error in approve API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}