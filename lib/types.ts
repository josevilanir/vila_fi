export interface SafeUser {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export interface FrontendPreset {
  id: string
  name: string
  sounds: Record<string, number>
  radioId: string
  createdAt: string
}

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { code: string; message: string } }
