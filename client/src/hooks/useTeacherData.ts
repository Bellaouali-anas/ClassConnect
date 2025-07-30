import { useState, useEffect } from 'react';
import { supabase, type User, type Teacher } from '@/lib/supabase';

export interface TeacherData {
  user: User | null;
  teacher: Teacher | null;
  loading: boolean;
  error: string | null;
}

export function useTeacherData(userId: number = 2) {
  const [data, setData] = useState<TeacherData>({
    user: null,
    teacher: null,
    loading: true,
    error: null
  });

  const fetchTeacherData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }

      // Fetch teacher data
      const { data: teacherData, error: teacherError } = await supabase
        .from('Teachers')
        .select('*')
        .eq('User_Id', userId)
        .single();

      if (teacherError && teacherError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw new Error(`Error fetching teacher: ${teacherError.message}`);
      }

      setData({
        user: userData,
        teacher: teacherData,
        loading: false,
        error: null
      });

    } catch (error) {
      setData({
        user: null,
        teacher: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [userId]);

  return { ...data, refetch: fetchTeacherData };
} 