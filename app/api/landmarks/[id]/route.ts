import { createClient } from '@/lib/supabase';
import { landmarkSchema } from '@/lib/validations/landmark';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Get the user's session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = landmarkSchema.parse(body);
    const { id } = await params;

    // First get the landmark to check its plan ownership
    const { data: landmark, error: landmarkError } = await supabase
      .from('landmarks')
      .select('plan_id')
      .eq('id', id)
      .single();

    if (landmarkError || !landmark) {
      return NextResponse.json(
        { error: 'Landmark not found' },
        { status: 404 }
      );
    }

    // Verify the plan belongs to the user
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('id')
      .eq('id', landmark.plan_id)
      .eq('user_id', user.id)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this landmark' },
        { status: 403 }
      );
    }

    // Update the landmark
    const { data: updatedLandmark, error: updateError } = await supabase
      .from('landmarks')
      .update({
        name: validatedData.name,
        is_visited: validatedData.is_visited,
        visit_date: validatedData.visit_date,
        category: validatedData.category,
        description: validatedData.description,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json(updatedLandmark);
  } catch (err) {
    console.error('Error updating landmark:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    // Get the user's session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First get the landmark to check its plan ownership
    const { data: landmark, error: landmarkError } = await supabase
      .from('landmarks')
      .select('plan_id')
      .eq('id', id)
      .single();

    if (landmarkError || !landmark) {
      return NextResponse.json(
        { error: 'Landmark not found' },
        { status: 404 }
      );
    }

    // Verify the plan belongs to the user
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('id')
      .eq('id', landmark.plan_id)
      .eq('user_id', session.user.id)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this landmark' },
        { status: 403 }
      );
    }

    // Delete the landmark
    const { error: deleteError } = await supabase
      .from('landmarks')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Landmark deleted successfully' });
  } catch (err) {
    console.error('Error deleting landmark:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
