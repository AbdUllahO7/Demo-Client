import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  // Redirect to the correct page route
  return NextResponse.redirect(new URL(`/vcard/${name}`, request.url));
}