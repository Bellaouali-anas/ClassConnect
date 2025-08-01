import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Schedule, ScheduleWithDetails, TimeSlot, Class } from '@/lib/supabase';

export const useSchedulesData = (userId: string) => {
  const [schedules, setSchedules] = useState<ScheduleWithDetails[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch all schedules for the specific user
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', userId)
        .order('slot_id', { ascending: true });

      if (schedulesError) {
        throw new Error(`Error fetching schedules: ${schedulesError.message}`);
      }

      console.log('Raw schedules data for user', userId, ':', schedulesData);

      // Step 2: For each schedule, fetch the corresponding time slot and class data
      const schedulesWithDetails: ScheduleWithDetails[] = [];
      
      if (schedulesData) {
        for (const schedule of schedulesData) {
          // Fetch the time slot for this schedule using slot_id
          const { data: timeSlotData, error: timeSlotError } = await supabase
            .from('time_slots')
            .select('*')
            .eq('id', schedule.slot_id)
            .single();

          if (timeSlotError) {
            console.error(`Error fetching time slot ${schedule.slot_id}:`, timeSlotError);
            continue;
          }

          // Fetch the class for this schedule
          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('*')
            .eq('id', schedule.class_id)
            .single();

          if (classError) {
            console.error(`Error fetching class ${schedule.class_id}:`, classError);
            continue;
          }

          // Combine the data
          const scheduleWithDetails: ScheduleWithDetails = {
            ...schedule,
            time_slot: timeSlotData,
            class: classData
          };

          schedulesWithDetails.push(scheduleWithDetails);
          console.log(`Schedule ${schedule.id}: slot_id ${schedule.slot_id} -> ${timeSlotData.day_of_week} ${timeSlotData.start_time}-${timeSlotData.end_time} -> Class: ${classData.class_name}`);
        }
      }

      console.log('Schedules with details:', schedulesWithDetails);

      // Step 3: Fetch all time slots for reference
      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('time_slots')
        .select('*')
        .order('id', { ascending: true });

      if (timeSlotsError) {
        throw new Error(`Error fetching time slots: ${timeSlotsError.message}`);
      }

      setSchedules(schedulesWithDetails);
      setTimeSlots(timeSlotsData || []);

    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async (classId: number, slotId: number, classroom?: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert({
          user_id: userId,
          class_id: classId,
          slot_id: slotId,
          class_room: classroom,
          notes: notes
        })
        .select('*')
        .single();

      if (error) {
        throw new Error(`Error adding schedule: ${error.message}`);
      }

      // Fetch the time slot and class data for the new schedule
      const { data: timeSlotData } = await supabase
        .from('time_slots')
        .select('*')
        .eq('id', slotId)
        .single();

      const { data: classData } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      const newScheduleWithDetails: ScheduleWithDetails = {
        ...data,
        time_slot: timeSlotData,
        class: classData
      };

      setSchedules(prev => [...prev, newScheduleWithDetails]);
      return newScheduleWithDetails;

    } catch (err) {
      console.error('Error adding schedule:', err);
      throw err;
    }
  };

  const updateSchedule = async (scheduleId: number, updates: Partial<Schedule>) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', scheduleId)
        .select('*')
        .single();

      if (error) {
        throw new Error(`Error updating schedule: ${error.message}`);
      }

      // Fetch the time slot and class data for the updated schedule
      const { data: timeSlotData } = await supabase
        .from('time_slots')
        .select('*')
        .eq('id', data.slot_id)
        .single();

      const { data: classData } = await supabase
        .from('classes')
        .select('*')
        .eq('id', data.class_id)
        .single();

      const updatedScheduleWithDetails: ScheduleWithDetails = {
        ...data,
        time_slot: timeSlotData,
        class: classData
      };

      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId ? updatedScheduleWithDetails : schedule
      ));
      return updatedScheduleWithDetails;

    } catch (err) {
      console.error('Error updating schedule:', err);
      throw err;
    }
  };

  const deleteSchedule = async (scheduleId: number) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) {
        throw new Error(`Error deleting schedule: ${error.message}`);
      }

      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));

    } catch (err) {
      console.error('Error deleting schedule:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSchedules();
    }
  }, [userId]);

  return {
    schedules,
    timeSlots,
    loading,
    error,
    refetch: fetchSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule
  };
}; 