import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        landmkars: ["1", "2", "3"]
    })
}
