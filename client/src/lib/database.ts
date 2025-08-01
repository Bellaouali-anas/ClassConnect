import { supabase, User, Teacher, Class } from './supabase'

// User operations
export const userService = {
  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    
    return data
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
    
    return data
  },

  // Create new user
  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    
    return data
  },

  // Update user
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user:', error)
      return null
    }
    
    return data
  }
}

// Teacher operations
export const teacherService = {
  // Get teacher by ID
  async getTeacherById(id: string): Promise<Teacher | null> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching teacher:', error)
      return null
    }
    
    return data
  },

  // Get teacher by user ID
  async getTeacherByUserId(userId: string): Promise<Teacher | null> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching teacher by user ID:', error)
      return null
    }
    
    return data
  },

  // Create new teacher
  async createTeacher(teacherData: Omit<Teacher, 'id' | 'created_at'>): Promise<Teacher | null> {
    const { data, error } = await supabase
      .from('teachers')
      .insert([teacherData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating teacher:', error)
      return null
    }
    
    return data
  },

  // Update teacher
  async updateTeacher(id: string, updates: Partial<Teacher>): Promise<Teacher | null> {
    const { data, error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating teacher:', error)
      return null
    }
    
    return data
  }
}

// Class operations
export const classService = {
  // Get all classes for a teacher
  async getClassesByTeacherId(teacherId: string): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching classes:', error)
      return []
    }
    
    return data || []
  },

  // Get class by ID
  async getClassById(id: string): Promise<Class | null> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching class:', error)
      return null
    }
    
    return data
  },

  // Create new class
  async createClass(classData: Omit<Class, 'id' | 'created_at'>): Promise<Class | null> {
    const { data, error } = await supabase
      .from('classes')
      .insert([classData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating class:', error)
      return null
    }
    
    return data
  },

  // Update class
  async updateClass(id: string, updates: Partial<Class>): Promise<Class | null> {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating class:', error)
      return null
    }
    
    return data
  },

  // Delete class
  async deleteClass(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting class:', error)
      return false
    }
    
    return true
  }
} 