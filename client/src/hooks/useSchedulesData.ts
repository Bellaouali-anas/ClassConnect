import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Schedule, ScheduleWithDetails, TimeSlot, Class } from '@/lib/supabase';

export const useSchedulesData = (userId: number) => {
  const [schedules, setSchedules] = useState<ScheduleWithDetails[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch all schedules for user ID 2
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('Schedules')
        .select('*')
        .eq('User_Id', userId)
        .order('Slot_Id', { ascending: true });

      if (schedulesError) {
        throw new Error(`Error fetching schedules: ${schedulesError.message}`);
      }

      console.log('Raw schedules data for user', userId, ':', schedulesData);

      // Step 2: For each schedule, fetch the corresponding time slot and class data
      const schedulesWithDetails: ScheduleWithDetails[] = [];
      
      if (schedulesData) {
        for (const schedule of schedulesData) {
          // Fetch the time slot for this schedule using Slot_Id
          const { data: timeSlotData, error: timeSlotError } = await supabase
            .from('Time_slots')
            .select('*')
            .eq('id', schedule.Slot_Id)
            .single();

          if (timeSlotError) {
            console.error(`Error fetching time slot ${schedule.Slot_Id}:`, timeSlotError);
            continue;
          }

          // Fetch the class for this schedule
          const { data: classData, error: classError } = await supabase
            .from('Classes')
            .select('*')
            .eq('id', schedule.Class_Id)
            .single();

          if (classError) {
            console.error(`Error fetching class ${schedule.Class_Id}:`, classError);
            continue;
          }

          // Combine the data
          const scheduleWithDetails: ScheduleWithDetails = {
            ...schedule,
            time_slot: timeSlotData,
            class: classData
          };

          schedulesWithDetails.push(scheduleWithDetails);
          console.log(`Schedule ${schedule.id}: Slot_Id ${schedule.Slot_Id} -> ${timeSlotData.day_of_week} ${timeSlotData.start_time}-${timeSlotData.end_time} -> Class: ${classData.Class_Name}`);
        }
      }

      console.log('Schedules with details:', schedulesWithDetails);

      // Step 3: Fetch all time slots for reference
      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('Time_slots')
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
        .from('Schedules')
        .insert({
          User_Id: userId,
          Class_Id: classId,
          Slot_Id: slotId,
          class_room: classroom,
          Notes: notes
        })
        .select('*')
        .single();

      if (error) {
        throw new Error(`Error adding schedule: ${error.message}`);
      }

      // Fetch the time slot and class data for the new schedule
      const { data: timeSlotData } = await supabase
        .from('Time_slots')
        .select('*')
        .eq('id', slotId)
        .single();

      const { data: classData } = await supabase
        .from('Classes')
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
        .from('Schedules')
        .update(updates)
        .eq('id', scheduleId)
        .select('*')
        .single();

      if (error) {
        throw new Error(`Error updating schedule: ${error.message}`);
      }

      // Fetch the time slot and class data for the updated schedule
      const { data: timeSlotData } = await supabase
        .from('Time_slots')
        .select('*')
        .eq('id', data.Slot_Id)
        .single();

      const { data: classData } = await supabase
        .from('Classes')
        .select('*')
        .eq('id', data.Class_Id)
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
        .from('Schedules')
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