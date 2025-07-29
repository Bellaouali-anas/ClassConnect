import { supabase } from './supabase'

// Sample data for seeding the database
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
  },
  {
    First_name: 'Emily',
    Last_name: 'Davis',
    Email: 'emily.davis@example.com',
    Phone: '+1234567893',
    Age: 31,
    Gender: 'Female',
    Address: '321 Elm Street',
    CIty: 'Boston',
    Bio: 'English literature teacher with a focus on modern American literature.',
    User_type: 'teacher'
  },
  {
    First_name: 'David',
    Last_name: 'Wilson',
    Email: 'david.wilson@example.com',
    Phone: '+1234567894',
    Age: 38,
    Gender: 'Male',
    Address: '654 Maple Drive',
    CIty: 'Seattle',
    Bio: 'Computer science teacher specializing in programming and algorithms.',
    User_type: 'teacher'
  }
]

const sampleTeachers = [
  {
    Experience_Years: 10,
    Subjects: ['Mathematics', 'Algebra', 'Calculus'],
    Schools: ['Lincoln High School', 'University Prep Academy'],
    User_Id: 1
  },
  {
    Experience_Years: 6,
    Subjects: ['Physics', 'Advanced Physics', 'Mechanics'],
    Schools: ['Science Academy', 'Tech High School'],
    User_Id: 2
  },
  {
    Experience_Years: 15,
    Subjects: ['Chemistry', 'Organic Chemistry', 'Biochemistry'],
    Schools: ['Central High School', 'Community College'],
    User_Id: 3
  },
  {
    Experience_Years: 8,
    Subjects: ['English Literature', 'Creative Writing', 'American Literature'],
    Schools: ['Arts Academy', 'Liberal Arts High'],
    User_Id: 4
  },
  {
    Experience_Years: 12,
    Subjects: ['Computer Science', 'Programming', 'Data Structures'],
    Schools: ['Tech Institute', 'STEM Academy'],
    User_Id: 5
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
    Teacher_id: 1
  },
  {
    Class_Name: 'Calculus I',
    Level: 'High School',
    Grade: '12th Grade',
    subject: 'Mathematics',
    Description: 'Introduction to calculus concepts including limits, derivatives, and integrals.',
    Classroom: 'Room 102',
    Hours: 3.0,
    Max_Students: 20,
    School: 'Lincoln High School',
    Hourly_Payement: '60',
    Teacher_id: 1
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
    Teacher_id: 2
  },
  {
    Class_Name: 'Advanced Physics',
    Level: 'High School',
    Grade: '12th Grade',
    subject: 'Physics',
    Description: 'Advanced physics topics including quantum mechanics and relativity.',
    Classroom: 'Lab 202',
    Hours: 2.5,
    Max_Students: 18,
    School: 'Science Academy',
    Hourly_Payement: '65',
    Teacher_id: 2
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
    Teacher_id: 3
  },
  {
    Class_Name: 'English Literature',
    Level: 'High School',
    Grade: '11th Grade',
    subject: 'English',
    Description: 'Study of classic and modern literature with focus on analysis and interpretation.',
    Classroom: 'Room 401',
    Hours: 2.0,
    Max_Students: 28,
    School: 'Arts Academy',
    Hourly_Payement: '45',
    Teacher_id: 4
  },
  {
    Class_Name: 'Creative Writing',
    Level: 'High School',
    Grade: '12th Grade',
    subject: 'English',
    Description: 'Creative writing workshop focusing on poetry, short stories, and personal essays.',
    Classroom: 'Room 402',
    Hours: 2.0,
    Max_Students: 20,
    School: 'Arts Academy',
    Hourly_Payement: '50',
    Teacher_id: 4
  },
  {
    Class_Name: 'Introduction to Programming',
    Level: 'High School',
    Grade: '10th Grade',
    subject: 'Computer Science',
    Description: 'Basic programming concepts using Python and JavaScript.',
    Classroom: 'Computer Lab 1',
    Hours: 2.5,
    Max_Students: 22,
    School: 'Tech Institute',
    Hourly_Payement: '55',
    Teacher_id: 5
  },
  {
    Class_Name: 'Data Structures & Algorithms',
    Level: 'College',
    Grade: 'College Level',
    subject: 'Computer Science',
    Description: 'Advanced programming concepts including data structures and algorithm design.',
    Classroom: 'Computer Lab 2',
    Hours: 3.0,
    Max_Students: 18,
    School: 'Tech Institute',
    Hourly_Payement: '75',
    Teacher_id: 5
  }
]

// Function to seed the database
export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    // Insert users
    console.log('👥 Inserting users...')
    const { data: users, error: usersError } = await supabase
      .from('Users')
      .insert(sampleUsers)
      .select()

    if (usersError) {
      console.error('❌ Error inserting users:', usersError)
      return
    }

    console.log(`✅ Inserted ${users?.length || 0} users`)

    // Insert teachers
    console.log('👨‍🏫 Inserting teachers...')
    const { data: teachers, error: teachersError } = await supabase
      .from('Teachers')
      .insert(sampleTeachers)
      .select()

    if (teachersError) {
      console.error('❌ Error inserting teachers:', teachersError)
      return
    }

    console.log(`✅ Inserted ${teachers?.length || 0} teachers`)

    // Insert classes
    console.log('📚 Inserting classes...')
    const { data: classes, error: classesError } = await supabase
      .from('Classes')
      .insert(sampleClasses)
      .select()

    if (classesError) {
      console.error('❌ Error inserting classes:', classesError)
      return
    }

    console.log(`✅ Inserted ${classes?.length || 0} classes`)

    console.log('🎉 Database seeding completed successfully!')
    console.log(`📊 Summary: ${users?.length || 0} users, ${teachers?.length || 0} teachers, ${classes?.length || 0} classes`)

    return {
      users: users?.length || 0,
      teachers: teachers?.length || 0,
      classes: classes?.length || 0
    }

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    return null
  }
}

// Function to clear all data (for testing)
export const clearDatabase = async () => {
  try {
    console.log('🧹 Clearing database...')

    // Delete in reverse order due to foreign key constraints
    const { error: classesError } = await supabase
      .from('Classes')
      .delete()
      .neq('id', 0)

    const { error: teachersError } = await supabase
      .from('Teachers')
      .delete()
      .neq('id', 0)

    const { error: usersError } = await supabase
      .from('Users')
      .delete()
      .neq('id', 0)

    if (classesError || teachersError || usersError) {
      console.error('❌ Error clearing database:', { classesError, teachersError, usersError })
      return false
    }

    console.log('✅ Database cleared successfully!')
    return true

  } catch (error) {
    console.error('❌ Error clearing database:', error)
    return false
  }
} 