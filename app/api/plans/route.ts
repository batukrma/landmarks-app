import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

interface Landmark {
  name: string;
  position: [number, number];
  visit_date?: string;
}

interface RequestBody {
  name: string;
  landmarks: Landmark[];
}

export async function GET() {
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

    const { data: plans, error } = await supabase
      .from('plans')
      .select('id, name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(plans);
  } catch (err) {
    console.error('Error fetching plans:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = (await request.json()) as RequestBody;
    const { name, landmarks } = body;

    // Insert plan with user_id
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (planError) {
      return NextResponse.json({ error: planError.message }, { status: 400 });
    }

    // Insert landmarks using the new plan_id
    const landmarksWithPlanId = landmarks.map((landmark) => ({
      plan_id: planData.id,
      name: landmark.name,
      latitude: landmark.position[0],
      longitude: landmark.position[1],
      visit_date: landmark.visit_date || null,
    }));

    const { error: landmarksError } = await supabase
      .from('landmarks')
      .insert(landmarksWithPlanId);

    if (landmarksError) {
      return NextResponse.json(
        { error: landmarksError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Plan and landmarks created successfully',
      plan_id: planData.id,
    });
  } catch (err) {
    console.error('Error creating plan:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
