// app/api/ip/route.js
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getClientIp } from 'next-request-ip';

export async function GET() {
  const headersList = await headers();
  const ip = getClientIp(headersList) || 'غير معروف';
  
  return NextResponse.json({ ip });
}