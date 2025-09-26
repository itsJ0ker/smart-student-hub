import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST() {
  try {
    // Run the notifications migration
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS notifications (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id uuid REFERENCES students(id) ON DELETE CASCADE,
          title varchar(255) NOT NULL,
          message text NOT NULL,
          read boolean DEFAULT false,
          created_at timestamptz DEFAULT now()
        );

        CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
      `
    });

    if (error) {
      console.error('Migration error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}