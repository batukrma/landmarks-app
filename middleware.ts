import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from './lib/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If there's no session and the user is trying to access protected routes
  if (!user && req.nextUrl.pathname !== '/login') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and the user is on the login page
  if (user && req.nextUrl.pathname === '/login') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/', '/login'],
};
