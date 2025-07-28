import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// For local development, you can use the direct database connection
// or set up a simple Supabase project online

// Option 1: Use a local Supabase instance (if you have one running)
// const supabaseUrl = 'http://127.0.0.1:54321'
// const supabaseAnonKey = 'your-local-anon-key'

// Option 2: Use a hosted Supabase project (recommended for simplicity)
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co' // Replace with your project URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key' // Replace with your anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedData() {
  console.log('🌱 Starting database seeding...')
  console.log('🔗 Supabase URL:', supabaseUrl)
  console.log('🔑 API Key:', supabaseAnonKey.substring(0, 20) + '...')

  try {
    // 1. Create Classes
    console.log('📚 Creating classes...')
    const classes = [
      { name: 'Mathematics 101', student_count: 25 },
      { name: 'Physics Fundamentals', student_count: 20 },
      { name: 'Chemistry Lab', student_count: 18 },
      { name: 'English Literature', student_count: 22 },
      { name: 'Computer Science', student_count: 15 },
      { name: 'History of Science', student_count: 12 },
    ]

    const { data: createdClasses, error: classesError } = await supabase
      .from('classes')
      .insert(classes)
      .select()

    if (classesError) {
      console.error('Error creating classes:', classesError)
      return
    }

    console.log(`✅ Created ${createdClasses?.length} classes`)

    // 2. Create Students
    console.log('👨‍🎓 Creating students...')
    const students = [
      // Mathematics 101 students
      { name: 'Ahmed Alami', email: 'ahmed.alami@email.com', class_id: createdClasses[0].id, class_name: 'Mathematics 101', gender: 'Male', attendance_rate: 95, average_grade: 'A' },
      { name: 'Fatima Zahra', email: 'fatima.zahra@email.com', class_id: createdClasses[0].id, class_name: 'Mathematics 101', gender: 'Female', attendance_rate: 88, average_grade: 'B+' },
      { name: 'Omar Benjelloun', email: 'omar.benjelloun@email.com', class_id: createdClasses[0].id, class_name: 'Mathematics 101', gender: 'Male', attendance_rate: 92, average_grade: 'A-' },
      { name: 'Amina Tazi', email: 'amina.tazi@email.com', class_id: createdClasses[0].id, class_name: 'Mathematics 101', gender: 'Female', attendance_rate: 85, average_grade: 'B' },
      { name: 'Youssef El Fassi', email: 'youssef.elfassi@email.com', class_id: createdClasses[0].id, class_name: 'Mathematics 101', gender: 'Male', attendance_rate: 90, average_grade: 'B+' },

      // Physics Fundamentals students
      { name: 'Layla Mansouri', email: 'layla.mansouri@email.com', class_id: createdClasses[1].id, class_name: 'Physics Fundamentals', gender: 'Female', attendance_rate: 94, average_grade: 'A' },
      { name: 'Karim Idrissi', email: 'karim.idrissi@email.com', class_id: createdClasses[1].id, class_name: 'Physics Fundamentals', gender: 'Male', attendance_rate: 87, average_grade: 'B' },
      { name: 'Nour El Haddad', email: 'nour.elhaddad@email.com', class_id: createdClasses[1].id, class_name: 'Physics Fundamentals', gender: 'Female', attendance_rate: 91, average_grade: 'A-' },
      { name: 'Adam Bennis', email: 'adam.bennis@email.com', class_id: createdClasses[1].id, class_name: 'Physics Fundamentals', gender: 'Male', attendance_rate: 89, average_grade: 'B+' },
      { name: 'Sara Alami', email: 'sara.alami@email.com', class_id: createdClasses[1].id, class_name: 'Physics Fundamentals', gender: 'Female', attendance_rate: 93, average_grade: 'A' },

      // Chemistry Lab students
      { name: 'Hassan Tazi', email: 'hassan.tazi@email.com', class_id: createdClasses[2].id, class_name: 'Chemistry Lab', gender: 'Male', attendance_rate: 96, average_grade: 'A+' },
      { name: 'Zineb El Fassi', email: 'zineb.elfassi@email.com', class_id: createdClasses[2].id, class_name: 'Chemistry Lab', gender: 'Female', attendance_rate: 88, average_grade: 'B' },
      { name: 'Mehdi Benjelloun', email: 'mehdi.benjelloun@email.com', class_id: createdClasses[2].id, class_name: 'Chemistry Lab', gender: 'Male', attendance_rate: 90, average_grade: 'B+' },
      { name: 'Aisha Mansouri', email: 'aisha.mansouri@email.com', class_id: createdClasses[2].id, class_name: 'Chemistry Lab', gender: 'Female', attendance_rate: 92, average_grade: 'A-' },
      { name: 'Rachid Idrissi', email: 'rachid.idrissi@email.com', class_id: createdClasses[2].id, class_name: 'Chemistry Lab', gender: 'Male', attendance_rate: 85, average_grade: 'B' },

      // English Literature students
      { name: 'Nadia El Haddad', email: 'nadia.elhaddad@email.com', class_id: createdClasses[3].id, class_name: 'English Literature', gender: 'Female', attendance_rate: 94, average_grade: 'A' },
      { name: 'Khalid Bennis', email: 'khalid.bennis@email.com', class_id: createdClasses[3].id, class_name: 'English Literature', gender: 'Male', attendance_rate: 87, average_grade: 'B' },
      { name: 'Mariam Alami', email: 'mariam.alami@email.com', class_id: createdClasses[3].id, class_name: 'English Literature', gender: 'Female', attendance_rate: 91, average_grade: 'A-' },
      { name: 'Tariq Tazi', email: 'tariq.tazi@email.com', class_id: createdClasses[3].id, class_name: 'English Literature', gender: 'Male', attendance_rate: 89, average_grade: 'B+' },
      { name: 'Hana El Fassi', email: 'hana.elfassi@email.com', class_id: createdClasses[3].id, class_name: 'English Literature', gender: 'Female', attendance_rate: 93, average_grade: 'A' },

      // Computer Science students
      { name: 'Younes Benjelloun', email: 'younes.benjelloun@email.com', class_id: createdClasses[4].id, class_name: 'Computer Science', gender: 'Male', attendance_rate: 95, average_grade: 'A+' },
      { name: 'Leila Mansouri', email: 'leila.mansouri@email.com', class_id: createdClasses[4].id, class_name: 'Computer Science', gender: 'Female', attendance_rate: 88, average_grade: 'B' },
      { name: 'Amir Idrissi', email: 'amir.idrissi@email.com', class_id: createdClasses[4].id, class_name: 'Computer Science', gender: 'Male', attendance_rate: 92, average_grade: 'A-' },
      { name: 'Dina El Haddad', email: 'dina.elhaddad@email.com', class_id: createdClasses[4].id, class_name: 'Computer Science', gender: 'Female', attendance_rate: 90, average_grade: 'B+' },
      { name: 'Samir Bennis', email: 'samir.bennis@email.com', class_id: createdClasses[4].id, class_name: 'Computer Science', gender: 'Male', attendance_rate: 86, average_grade: 'B' },

      // History of Science students
      { name: 'Rania Alami', email: 'rania.alami@email.com', class_id: createdClasses[5].id, class_name: 'History of Science', gender: 'Female', attendance_rate: 93, average_grade: 'A' },
      { name: 'Adil Tazi', email: 'adil.tazi@email.com', class_id: createdClasses[5].id, class_name: 'History of Science', gender: 'Male', attendance_rate: 87, average_grade: 'B' },
      { name: 'Yasmin El Fassi', email: 'yasmin.elfassi@email.com', class_id: createdClasses[5].id, class_name: 'History of Science', gender: 'Female', attendance_rate: 91, average_grade: 'A-' },
      { name: 'Bilal Benjelloun', email: 'bilal.benjelloun@email.com', class_id: createdClasses[5].id, class_name: 'History of Science', gender: 'Male', attendance_rate: 89, average_grade: 'B+' },
      { name: 'Nour Mansouri', email: 'nour.mansouri@email.com', class_id: createdClasses[5].id, class_name: 'History of Science', gender: 'Female', attendance_rate: 94, average_grade: 'A' },
    ]

    const { data: createdStudents, error: studentsError } = await supabase
      .from('students')
      .insert(students)
      .select()

    if (studentsError) {
      console.error('Error creating students:', studentsError)
      return
    }

    console.log(`✅ Created ${createdStudents?.length} students`)

    // 3. Create Assignments
    console.log('📝 Creating assignments...')
    const assignments = [
      {
        title: 'Algebra Problem Set 1',
        description: 'Complete problems 1-15 in Chapter 2. Show all work and solutions.',
        due_date: '2024-12-15',
        classes: ['Mathematics 101']
      },
      {
        title: 'Physics Lab Report: Motion',
        description: 'Write a comprehensive lab report on the motion experiment conducted in class.',
        due_date: '2024-12-20',
        classes: ['Physics Fundamentals']
      },
      {
        title: 'Chemistry Safety Quiz',
        description: 'Complete the online safety quiz before entering the laboratory.',
        due_date: '2024-12-10',
        classes: ['Chemistry Lab']
      },
      {
        title: 'Shakespeare Essay',
        description: 'Write a 1000-word essay analyzing the themes in Hamlet.',
        due_date: '2024-12-25',
        classes: ['English Literature']
      },
      {
        title: 'Programming Project: Calculator',
        description: 'Create a simple calculator application using Python.',
        due_date: '2024-12-30',
        classes: ['Computer Science']
      },
      {
        title: 'Scientific Revolution Research',
        description: 'Research and present on a key figure from the Scientific Revolution.',
        due_date: '2024-12-18',
        classes: ['History of Science']
      }
    ]

    const { data: createdAssignments, error: assignmentsError } = await supabase
      .from('assignments')
      .insert(assignments)
      .select()

    if (assignmentsError) {
      console.error('Error creating assignments:', assignmentsError)
      return
    }

    console.log(`✅ Created ${createdAssignments?.length} assignments`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Classes: ${createdClasses?.length}`)
    console.log(`- Students: ${createdStudents?.length}`)
    console.log(`- Assignments: ${createdAssignments?.length}`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

// Run the seeding function
seedData() 