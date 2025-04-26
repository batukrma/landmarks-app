import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    // Get the user's session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First verify that the plan belongs to the user
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Plan not found or unauthorized' },
        { status: 404 }
      );
    }

    // Now fetch the landmarks
    const { data: landmarks, error } = await supabase
      .from('landmarks')
      .select('*')
      .eq('plan_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(landmarks);
  } catch (err) {
    console.error('Error fetching landmarks:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
