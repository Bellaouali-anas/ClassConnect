# Weekly Class Schedule Management System

This document explains how to set up and use the new weekly class schedule management system in your ClassConnect application.

## Overview

The schedule system consists of two main tables:

- `time_slots`: Pre-defined 1-hour time blocks for each day of the week
- `schedules`: Links classes to specific time slots with optional classroom and notes

## Database Setup

### 1. Run the Setup Script

Copy and paste the contents of `setup_schedules.sql` into your Supabase SQL editor and execute it. This will:

- Create the `time_slots` and `schedules` tables
- Set up proper foreign key relationships
- Create indexes for performance
- Enable Row Level Security (RLS)
- Populate the `time_slots` table with 70 fixed time slots (10 per day, 7 days)

### 2. Verify Setup

After running the script, you should see:

- 70 time slots created (10 slots × 7 days)
- Schedules table ready for use

## Time Slots Structure

The system provides 10 fixed time slots per day:

| Slot | Time Range  | Period    |
| ---- | ----------- | --------- |
| 1    | 08:30-09:30 | Morning   |
| 2    | 09:30-10:30 | Morning   |
| 3    | 10:30-11:30 | Morning   |
| 4    | 11:30-12:30 | Morning   |
| 5    | 14:30-15:30 | Afternoon |
| 6    | 15:30-16:30 | Afternoon |
| 7    | 16:30-17:30 | Afternoon |
| 8    | 17:30-18:30 | Afternoon |
| 9    | 19:00-20:00 | Evening   |
| 10   | 20:00-21:00 | Evening   |

## Database Schema

### time_slots Table

```sql
CREATE TABLE time_slots (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  day_of_week text NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  slot_index integer NOT NULL CHECK (slot_index >= 1 AND slot_index <= 10),
  start_time time NOT NULL,
  end_time time NOT NULL,
  CONSTRAINT time_slots_pkey PRIMARY KEY (id),
  CONSTRAINT time_slots_unique_day_slot UNIQUE (day_of_week, slot_index)
);
```

### schedules Table

```sql
CREATE TABLE schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  class_id bigint NOT NULL,
  slot_id bigint NOT NULL,
  classroom text,
  notes text,
  CONSTRAINT schedules_pkey PRIMARY KEY (id),
  CONSTRAINT schedules_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.Classes(id) ON DELETE CASCADE,
  CONSTRAINT schedules_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.time_slots(id) ON DELETE CASCADE,
  CONSTRAINT schedules_unique_class_slot UNIQUE (class_id, slot_id)
);
```

## Frontend Integration

### TypeScript Interfaces

The following interfaces have been added to `client/src/lib/supabase.ts`:

```typescript
export interface TimeSlot {
  id: number;
  day_of_week:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  slot_index: number;
  start_time: string;
  end_time: string;
}

export interface Schedule {
  id: string;
  created_at: string;
  class_id: number;
  slot_id: number;
  classroom?: string;
  notes?: string;
}

export interface ScheduleWithDetails extends Schedule {
  class?: Class;
  time_slot?: TimeSlot;
}
```

### Custom Hook

A new custom hook `useSchedulesData` has been created in `client/src/hooks/useSchedulesData.ts` that provides:

- **Data fetching**: Fetches schedules for a teacher's classes with joined data
- **CRUD operations**: Add, update, delete schedules
- **Loading states**: Loading and error handling
- **Real-time updates**: Automatic refetch after operations

#### Usage Example:

```typescript
import { useSchedulesData } from "@/hooks/useSchedulesData";

function TeacherSchedule({ teacherId }: { teacherId: number }) {
  const {
    schedules,
    timeSlots,
    loading,
    error,
    addSchedule,
    deleteSchedule,
    updateSchedule,
  } = useSchedulesData(teacherId);

  // Add a new schedule
  const handleAddSchedule = async () => {
    try {
      await addSchedule(classId, slotId, "Room 101", "Optional notes");
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  // Delete a schedule
  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(scheduleId);
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };
}
```

## Security Features

### Row Level Security (RLS)

The system includes comprehensive RLS policies:

- **Time slots**: Read-only access for all authenticated users
- **Schedules**: Teachers can only access schedules for their own classes

### Data Integrity

- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate schedules
- Cascade deletes ensure cleanup when classes are removed

## Common Queries

### Get all schedules for a teacher

```sql
SELECT s.*, c.Class_Name, ts.day_of_week, ts.start_time, ts.end_time
FROM schedules s
JOIN Classes c ON s.class_id = c.id
JOIN time_slots ts ON s.slot_id = ts.id
WHERE c.Teacher_id = [teacher_id]
ORDER BY ts.day_of_week, ts.slot_index;
```

### Get available time slots for a specific day

```sql
SELECT ts.*
FROM time_slots ts
WHERE ts.day_of_week = 'Monday'
AND ts.id NOT IN (
  SELECT slot_id FROM schedules s
  JOIN Classes c ON s.class_id = c.id
  WHERE c.Teacher_id = [teacher_id]
)
ORDER BY ts.slot_index;
```

### Get teacher's weekly schedule

```sql
SELECT
  ts.day_of_week,
  ts.start_time,
  ts.end_time,
  c.Class_Name,
  s.classroom,
  s.notes
FROM time_slots ts
LEFT JOIN schedules s ON ts.id = s.slot_id
LEFT JOIN Classes c ON s.class_id = c.id AND c.Teacher_id = [teacher_id]
ORDER BY
  CASE ts.day_of_week
    WHEN 'Monday' THEN 1
    WHEN 'Tuesday' THEN 2
    WHEN 'Wednesday' THEN 3
    WHEN 'Thursday' THEN 4
    WHEN 'Friday' THEN 5
    WHEN 'Saturday' THEN 6
    WHEN 'Sunday' THEN 7
  END,
  ts.slot_index;
```

## Next Steps

1. **Run the setup script** in your Supabase SQL editor
2. **Test the database** by creating some sample schedules
3. **Integrate the frontend** using the provided hooks and interfaces
4. **Add UI components** for schedule management in your TeacherProfile or dedicated schedule page

## Troubleshooting

### Common Issues

1. **Foreign key constraint errors**: Ensure the class_id exists in the Classes table
2. **RLS policy errors**: Make sure the user is authenticated and owns the class
3. **Duplicate schedule errors**: Check the unique constraint on (class_id, slot_id)

### Verification Queries

```sql
-- Check if time slots were created
SELECT COUNT(*) FROM time_slots;

-- Check if schedules table exists
SELECT * FROM schedules LIMIT 1;

-- Verify RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('time_slots', 'schedules');
```
