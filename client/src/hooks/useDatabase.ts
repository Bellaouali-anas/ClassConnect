import { useState, useEffect } from 'react'
import { classService, teacherService, userService } from '@/lib/database'
import { Class, Teacher, User } from '@/lib/supabase'

// Hook for managing classes
export const useClasses = (teacherId: number) => {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await classService.getClassesByTeacherId(teacherId)
      setClasses(data)
    } catch (err) {
      setError('Failed to fetch classes')
      console.error('Error fetching classes:', err)
    } finally {
      setLoading(false)
    }
  }

  const addClass = async (classData: Omit<Class, 'id' | 'created_at'>) => {
    try {
      const newClass = await classService.createClass(classData)
      if (newClass) {
        setClasses(prev => [newClass, ...prev])
        return newClass
      }
      return null
    } catch (err) {
      setError('Failed to create class')
      console.error('Error creating class:', err)
      return null
    }
  }

  const updateClass = async (id: number, updates: Partial<Class>) => {
    try {
      const updatedClass = await classService.updateClass(id, updates)
      if (updatedClass) {
        setClasses(prev => prev.map(cls => cls.id === id ? updatedClass : cls))
        return updatedClass
      }
      return null
    } catch (err) {
      setError('Failed to update class')
      console.error('Error updating class:', err)
      return null
    }
  }

  const deleteClass = async (id: number) => {
    try {
      const success = await classService.deleteClass(id)
      if (success) {
        setClasses(prev => prev.filter(cls => cls.id !== id))
        return true
      }
      return false
    } catch (err) {
      setError('Failed to delete class')
      console.error('Error deleting class:', err)
      return false
    }
  }

  useEffect(() => {
    if (teacherId) {
      fetchClasses()
    }
  }, [teacherId])

  return {
    classes,
    loading,
    error,
    fetchClasses,
    addClass,
    updateClass,
    deleteClass
  }
}

// Hook for managing teacher profile
export const useTeacher = (teacherId: number) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeacher = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await teacherService.getTeacherById(teacherId)
      setTeacher(data)
    } catch (err) {
      setError('Failed to fetch teacher')
      console.error('Error fetching teacher:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateTeacher = async (updates: Partial<Teacher>) => {
    if (!teacher) return null
    
    try {
      const updatedTeacher = await teacherService.updateTeacher(teacher.id, updates)
      if (updatedTeacher) {
        setTeacher(updatedTeacher)
        return updatedTeacher
      }
      return null
    } catch (err) {
      setError('Failed to update teacher')
      console.error('Error updating teacher:', err)
      return null
    }
  }

  useEffect(() => {
    if (teacherId) {
      fetchTeacher()
    }
  }, [teacherId])

  return {
    teacher,
    loading,
    error,
    fetchTeacher,
    updateTeacher
  }
}

// Hook for managing user data
export const useUser = (userId: number) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getUserById(userId)
      setUser(data)
    } catch (err) {
      setError('Failed to fetch user')
      console.error('Error fetching user:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return null
    
    try {
      const updatedUser = await userService.updateUser(user.id, updates)
      if (updatedUser) {
        setUser(updatedUser)
        return updatedUser
      }
      return null
    } catch (err) {
      setError('Failed to update user')
      console.error('Error updating user:', err)
      return null
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId])

  return {
    user,
    loading,
    error,
    fetchUser,
    updateUser
  }
} 