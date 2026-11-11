import { NextResponse } from 'next/server';
import discountData from '@/data/discount.json';

export async function GET() {
  return NextResponse.json({
    discountPercentage: discountData.discountPercentage ?? 55,
  });
}
