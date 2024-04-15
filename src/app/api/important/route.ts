import { NextResponse } from 'next/server'

export async function GET() {
  console.log('- Important -')

  try {
    return NextResponse.json({ message: 'Cập nhật thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
