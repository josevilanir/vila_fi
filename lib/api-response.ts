import { NextResponse } from 'next/server'
import { ApiResponse } from './types'

export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data, error: null }, { status })
}

export function err(code: string, message: string, status: number): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ data: null, error: { code, message } }, { status })
}
