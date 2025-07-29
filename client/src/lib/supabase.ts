import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your actual Supabase schema
export interface User {
  id: number
  created_at: string
  First_name: string
  Last_name: string
  Email: string
  Phone?: string
  Age?: number
  Gender?: string
  Address?: string
  CIty?: string
  Bio?: string
  User_type?: string
}

export interface Teacher {
  id: number
  created_at: string
  Experience_Years?: number
  Subjects?: string[]
  Schools?: string[]
  User_Id?: number
}

export interface Class {
  id: number
  created_at: string
  Class_Name?: string
  Level?: string
  Grade?: string
  subject?: string
  Description?: string
  Classroom?: string
  Hours?: number
  Max_Students?: number
  School?: string
  Hourly_Payement?: string
  Teacher_id: number
} 