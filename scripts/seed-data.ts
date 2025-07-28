import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedData() {
  console.log('🌱 Starting database seeding...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await supabase.from('assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('attendance').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('grades').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('classes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // 1. Create Users
    console.log('👥 Creating users...')
    const users = [
      { username: 'teacher1', password: 'password123' },
      { username: 'teacher2', password: 'password123' },
      { username: 'admin', password: 'admin123' },
    ]

    for (const user of users) {
      const { error } = await supabase.from('users').insert(user)
      if (error) console.error('Error creating user:', error)
    }

    // 2. Create Classes
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

    // 3. Create Students
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

    // 4. Create Grades
    console.log('📊 Creating grades...')
    const grades: any[] = []
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'History']
    const gradeTypes = ['Quiz', 'Midterm', 'Final', 'Assignment', 'Lab Report']

    for (const student of createdStudents) {
      // Create 3-5 grades per student
      const numGrades = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < numGrades; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)]
        const gradeType = gradeTypes[Math.floor(Math.random() * gradeTypes.length)]
        const score = Math.floor(Math.random() * 21) // 0-20 scale
        const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]

        grades.push({
          student_id: student.id,
          student_name: student.name,
          grade_type: gradeType,
          subject: subject,
          score: score,
          date: date
        })
      }
    }

    const { data: createdGrades, error: gradesError } = await supabase
      .from('grades')
      .insert(grades)
      .select()

    if (gradesError) {
      console.error('Error creating grades:', gradesError)
      return
    }

    console.log(`✅ Created ${createdGrades?.length} grades`)

    // 5. Create Attendance Records
    console.log('📅 Creating attendance records...')
    const attendance: any[] = []
    const currentDate = new Date()
    
    // Create attendance records for the last 30 days
    for (let day = 0; day < 30; day++) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - day)
      const dateString = date.toISOString().split('T')[0]

      for (const student of createdStudents) {
        const isPresent = Math.random() > 0.1 // 90% attendance rate
        const isLate = isPresent && Math.random() > 0.8 // 20% of present students are late
        const isExcused = !isPresent && Math.random() > 0.7 // 30% of absent students are excused

        attendance.push({
          student_id: student.id,
          student_name: student.name,
          date: dateString,
          present: isPresent && !isLate,
          absent: !isPresent && !isExcused,
          late: isLate,
          excused: isExcused
        })
      }
    }

    const { data: createdAttendance, error: attendanceError } = await supabase
      .from('attendance')
      .insert(attendance)
      .select()

    if (attendanceError) {
      console.error('Error creating attendance:', attendanceError)
      return
    }

    console.log(`✅ Created ${createdAttendance?.length} attendance records`)

    // 6. Create Assignments
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
      },
      {
        title: 'Final Exam Preparation',
        description: 'Review all course materials and complete practice problems.',
        due_date: '2024-12-31',
        classes: ['Mathematics 101', 'Physics Fundamentals', 'Chemistry Lab']
      },
      {
        title: 'Group Presentation',
        description: 'Prepare and deliver a 15-minute group presentation on your chosen topic.',
        due_date: '2024-12-22',
        classes: ['English Literature', 'Computer Science', 'History of Science']
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
    console.log(`- Users: ${users.length}`)
    console.log(`- Classes: ${createdClasses?.length}`)
    console.log(`- Students: ${createdStudents?.length}`)
    console.log(`- Grades: ${createdGrades?.length}`)
    console.log(`- Attendance Records: ${createdAttendance?.length}`)
    console.log(`- Assignments: ${createdAssignments?.length}`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

// Run the seeding function
seedData() 