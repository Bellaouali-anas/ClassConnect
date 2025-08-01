import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your actual Supabase schema
export interface User {
  id: string
  created_at: string
  first_name?: string
  last_name?: string
  email: string
  phone?: number
  age?: number
  gender?: string
  address?: string
  city?: string
  bio?: string
  user_type?: string
}

export interface Teacher {
  id: string
  created_at: string
  experience_years?: number
  subjects?: any // JSONB
  schools?: any // JSONB
  user_id?: string
}

export interface Class {
  id: string
  created_at: string
  class_name?: string
  level?: string
  grade?: string
  subject?: string
  description?: string
  classroom?: string
  hours?: number
  max_students?: number
  school?: string
  hourly_payement?: number
  teacher_id?: string
}

export interface TimeSlot {
  id: number
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  slot_index: number
  start_time: string
  end_time: string
}

export interface Schedule {
  id: string
  created_at: string
  user_id?: string
  class_id?: string
  slot_id?: number
  class_room?: string
  notes?: string
}

// Extended interfaces for joined data
export interface ScheduleWithDetails extends Schedule {
  class?: Class
  time_slot?: TimeSlot
  user?: User
} 