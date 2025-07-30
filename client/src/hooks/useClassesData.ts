import { useState, useEffect } from 'react';
import { supabase, type Class } from '@/lib/supabase';

export interface ClassesData {
  classes: Class[];
  loading: boolean;
  error: string | null;
}

export function useClassesData(teacherId: number) {
  const [data, setData] = useState<ClassesData>({
    classes: [],
    loading: true,
    error: null
  });

  const fetchClassesData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch classes data for the specific teacher
      const { data: classesData, error: classesError } = await supabase
        .from('Classes')
        .select('*')
        .eq('Teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (classesError) {
        throw new Error(`Error fetching classes: ${classesError.message}`);
      }

      setData({
        classes: classesData || [],
        loading: false,
        error: null
      });

    } catch (error) {
      setData({
        classes: [],
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchClassesData();
    }
  }, [teacherId]);

  return { ...data, refetch: fetchClassesData };
} 