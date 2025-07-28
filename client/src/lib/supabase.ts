import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ufechvwrkzlsdeyreuih.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZWNodndya3psc2RleXJldWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzgwNjQsImV4cCI6MjA2OTMxNDA2NH0.3YklFPUncJAdCNrj_8AhcFmSYH34mGAgmm9HPRYHCNY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for client-side use
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password: string
          created_at?: string
        }
        Insert: {
          id?: string
          username: string
          password: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          created_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          student_count: number
          created_at?: string
        }
        Insert: {
          id?: string
          name: string
          student_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          student_count?: number
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          email: string
          class_id: string | null
          class_name: string
          gender: string
          attendance_rate: number
          average_grade: string
          created_at?: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          class_id?: string | null
          class_name: string
          gender: string
          attendance_rate?: number
          average_grade?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          class_id?: string | null
          class_name?: string
          gender?: string
          attendance_rate?: number
          average_grade?: string
          created_at?: string
        }
      }
      grades: {
        Row: {
          id: string
          student_id: string | null
          student_name: string
          grade_type: string
          subject: string
          score: number
          date: string
          created_at?: string
        }
        Insert: {
          id?: string
          student_id?: string | null
          student_name: string
          grade_type: string
          subject: string
          score: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string | null
          student_name?: string
          grade_type?: string
          subject?: string
          score?: number
          date?: string
          created_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string | null
          student_name: string
          date: string
          present: boolean
          absent: boolean
          late: boolean
          excused: boolean
          created_at?: string
        }
        Insert: {
          id?: string
          student_id?: string | null
          student_name: string
          date: string
          present?: boolean
          absent?: boolean
          late?: boolean
          excused?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string | null
          student_name?: string
          date?: string
          present?: boolean
          absent?: boolean
          late?: boolean
          excused?: boolean
          created_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          title: string
          description: string
          due_date: string
          classes: string[]
          created_at?: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          due_date: string
          classes: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          due_date?: string
          classes?: string[]
          created_at?: string
        }
      }
    }
  }
} 