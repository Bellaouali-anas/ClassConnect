# Database Seeding Script

This script populates the Supabase database with dummy data for testing and development purposes.

## What it creates:

### 👥 Users (3)

- `teacher1` / `password123`
- `teacher2` / `password123`
- `admin` / `admin123`

### 📚 Classes (6)

- Mathematics 101 (25 students)
- Physics Fundamentals (20 students)
- Chemistry Lab (18 students)
- English Literature (22 students)
- Computer Science (15 students)
- History of Science (12 students)

### 👨‍🎓 Students (30)

- 5 students per class
- Realistic Moroccan names
- Varied attendance rates and grades

### 📊 Grades (90-150)

- 3-5 grades per student
- Random scores (0-20 scale)
- Various subjects and grade types

### 📅 Attendance Records (900)

- 30 days of attendance data
- 90% average attendance rate
- Includes late and excused absences

### 📝 Assignments (8)

- Various assignment types
- Different due dates
- Multiple class assignments

## How to run:

### Prerequisites

1. Make sure Supabase is running locally:

   ```bash
   supabase start
   ```

2. Set up environment variables (create `.env` file):
   ```env
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_ANON_KEY=your-anon-key-from-supabase-start
   ```

### Run the seeding script:

```bash
npm run seed
```

## What happens:

1. **Clears existing data** from all tables
2. **Creates users** with login credentials
3. **Creates classes** with student counts
4. **Creates students** assigned to classes
5. **Creates grades** for each student
6. **Creates attendance records** for the last 30 days
7. **Creates assignments** with due dates

## Expected output:

```
🌱 Starting database seeding...
🧹 Clearing existing data...
👥 Creating users...
📚 Creating classes...
✅ Created 6 classes
👨‍🎓 Creating students...
✅ Created 30 students
📊 Creating grades...
✅ Created 120 grades
📅 Creating attendance records...
✅ Created 900 attendance records
📝 Creating assignments...
✅ Created 8 assignments
🎉 Database seeding completed successfully!

📊 Summary:
- Users: 3
- Classes: 6
- Students: 30
- Grades: 120
- Attendance Records: 900
- Assignments: 8
```

## Notes:

- The script will **clear all existing data** before seeding
- All data is realistic and interconnected
- Perfect for testing the application features
- Can be run multiple times safely
