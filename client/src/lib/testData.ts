import { supabase } from './supabase'

// Sample data arrays
const sampleUsers = [
  {
    First_name: 'John',
    Last_name: 'Smith',
    Email: 'john.smith@example.com',
    Phone: '+1234567890',
    Age: 35,
    Gender: 'Male',
    Address: '123 Main Street',
    CIty: 'New York',
    Bio: 'Experienced mathematics teacher with 10 years of teaching experience.',
    User_type: 'teacher'
  },
  {
    First_name: 'Sarah',
    Last_name: 'Johnson',
    Email: 'sarah.johnson@example.com',
    Phone: '+1234567891',
    Age: 28,
    Gender: 'Female',
    Address: '456 Oak Avenue',
    CIty: 'Los Angeles',
    Bio: 'Passionate physics teacher specializing in advanced physics concepts.',
    User_type: 'teacher'
  },
  {
    First_name: 'Michael',
    Last_name: 'Brown',
    Email: 'michael.brown@example.com',
    Phone: '+1234567892',
    Age: 42,
    Gender: 'Male',
    Address: '789 Pine Road',
    CIty: 'Chicago',
    Bio: 'Chemistry teacher with expertise in organic chemistry and laboratory safety.',
    User_type: 'teacher'
  }
]

const sampleTeachers = [
  {
    Experience_Years: 10,
    Subjects: ['Mathematics', 'Algebra', 'Calculus'],
    Schools: ['Lincoln High School', 'University Prep Academy'],
    User_Id: 3 // Will be updated after user insertion
  },
  {
    Experience_Years: 6,
    Subjects: ['Physics', 'Advanced Physics', 'Mechanics'],
    Schools: ['Science Academy', 'Tech High School'],
    User_Id: 4 // Will be updated after user insertion
  },
  {
    Experience_Years: 15,
    Subjects: ['Chemistry', 'Organic Chemistry', 'Biochemistry'],
    Schools: ['Central High School', 'Community College'],
    User_Id: 5 // Will be updated after user insertion
  }
]

const sampleClasses = [
  {
    Class_Name: 'Advanced Algebra',
    Level: 'High School',
    Grade: '11th Grade',
    subject: 'Mathematics',
    Description: 'Advanced algebra course covering complex equations, functions, and mathematical modeling.',
    Classroom: 'Room 101',
    Hours: 2.5,
    Max_Students: 25,
    School: 'Lincoln High School',
    Hourly_Payement: '50',
    Teacher_id: 2 // Will be updated after teacher insertion
  },
  {
    Class_Name: 'Physics Fundamentals',
    Level: 'High School',
    Grade: '10th Grade',
    subject: 'Physics',
    Description: 'Basic physics concepts including mechanics, energy, and waves.',
    Classroom: 'Lab 201',
    Hours: 2.0,
    Max_Students: 30,
    School: 'Science Academy',
    Hourly_Payement: '55',
    Teacher_id: 3 // Will be updated after teacher insertion
  },
  {
    Class_Name: 'Organic Chemistry',
    Level: 'College',
    Grade: 'College Level',
    subject: 'Chemistry',
    Description: 'Comprehensive study of organic chemistry including reactions and mechanisms.',
    Classroom: 'Lab 301',
    Hours: 3.5,
    Max_Students: 15,
    School: 'Central High School',
    Hourly_Payement: '70',
    Teacher_id: 4 // Will be updated after teacher insertion
  }
]

// Function to add comprehensive sample data
export const addComprehensiveData = async () => {
  try {
    console.log('🌱 Adding comprehensive sample data...')

    // Add users
    console.log('👥 Adding users...')
    const { data: users, error: usersError } = await supabase
      .from('Users')
      .insert(sampleUsers)
      .select()

    if (usersError) {
      console.error('❌ Error adding users:', usersError)
      return
    }

    console.log(`✅ Added ${users?.length || 0} users`)

    // Update teacher User_Ids with actual user IDs
    const teachersWithUserIds = sampleTeachers.map((teacher, index) => ({
      ...teacher,
      User_Id: users?.[index]?.id || (index + 3) // Fallback to expected IDs
    }))

    // Add teachers
    console.log('👨‍🏫 Adding teachers...')
    const { data: teachers, error: teachersError } = await supabase
      .from('Teachers')
      .insert(teachersWithUserIds)
      .select()

    if (teachersError) {
      console.error('❌ Error adding teachers:', teachersError)
      return
    }

    console.log(`✅ Added ${teachers?.length || 0} teachers`)

    // Update class Teacher_ids with actual teacher IDs
    const classesWithTeacherIds = sampleClasses.map((cls, index) => ({
      ...cls,
      Teacher_id: teachers?.[index]?.id || (index + 2) // Fallback to expected IDs
    }))

    // Add classes
    console.log('📚 Adding classes...')
    const { data: classes, error: classesError } = await supabase
      .from('Classes')
      .insert(classesWithTeacherIds)
      .select()

    if (classesError) {
      console.error('❌ Error adding classes:', classesError)
      return
    }

    console.log(`✅ Added ${classes?.length || 0} classes`)

    console.log('🎉 Comprehensive data added successfully!')
    console.log(`📊 Summary: ${users?.length || 0} users, ${teachers?.length || 0} teachers, ${classes?.length || 0} classes`)

    return { users, teachers, classes }

  } catch (error) {
    console.error('❌ Error adding comprehensive data:', error)
  }
}

// Function to check if database is connected
export const testConnection = async () => {
  try {
    console.log('🔍 Testing database connection...')
    
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error)
      return false
    }
    
    console.log('✅ Database connection successful!')
    console.log('📊 Found', data?.length || 0, 'users in database')
    return true
    
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return false
  }
}

// Make functions available globally for browser console
if (typeof window !== 'undefined') {
  ;(window as any).addComprehensiveData = addComprehensiveData
  ;(window as any).testConnection = testConnection
} 