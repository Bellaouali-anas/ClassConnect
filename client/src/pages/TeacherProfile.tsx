import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Edit, Save, X, Plus, Trash2, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Cropper from 'react-easy-crop'
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherData } from "@/hooks/useTeacherData";
import { useClassesData } from "@/hooks/useClassesData";
import { useSchedulesData } from "@/hooks/useSchedulesData";
import { supabase } from "@/lib/supabase";

interface ClassInfo {
  id: string;
  name: string;
  level: string;
  grade: string; // College 1st-3rd year or Lycee 1st-3rd year
  hoursPerWeek: number;
  students: number;
  school: string; // Which school this class belongs to
}

interface WeeklySchedule {
  day: string;
  classes: Array<{
    from: string;
    to: string;
    class: string;
    classroom: string;
  }>;
}

export default function TeacherProfile() {
  const { profilePhoto, setProfilePhoto } = useProfile();
  const { user: authUser } = useAuth();
  
  // Get the user ID from the authenticated user
  const userId = authUser?.id || '';
  
  const { user, teacher, loading, error, refetch } = useTeacherData(userId);
  const { classes: fetchedClasses, loading: classesLoading, error: classesError, refetch: refetchClasses } = useClassesData(teacher?.id || 0);
  const { schedules, timeSlots, loading: schedulesLoading, error: schedulesError, refetch: refetchSchedules, addSchedule, deleteSchedule, updateSchedule } = useSchedulesData(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize profile with fetched data or defaults
  const [profile, setProfile] = useState({
            firstName: user?.first_name || "Loading...",
        lastName: user?.last_name || "Loading...",
        email: user?.email || "Loading...",
        phone: user?.phone || "",
        age: user?.age || 0,
        gender: user?.gender || "",
        address: user?.address || "",
        city: user?.city || "",
        bio: user?.bio || "",
        experience: teacher?.experience_years || 0,
        subject: teacher?.subjects?.[0] || "",
    photo: profilePhoto,
            schools: teacher?.schools?.map(school => ({ name: school, type: "both" })) || [
      { name: "Al Akhawayn University", type: "both" },
      { name: "International School of Morocco", type: "lycee" }
    ],
    startDate: new Date(2024, 8, 1), // September 1, 2024
    endDate: new Date(2025, 5, 30), // June 30, 2025
    totalWeeks: 36
  });
  
  // Store the original profile photo to revert changes if needed
  const [originalProfilePhoto, setOriginalProfilePhoto] = useState(profilePhoto);
  
  // Update profile photo when context changes
  React.useEffect(() => {
    setProfile(prev => ({ ...prev, photo: profilePhoto }));
    setOriginalProfilePhoto(profilePhoto);
  }, [profilePhoto]);

  // Update profile when user and teacher data is loaded
  React.useEffect(() => {
    if (user && teacher) {
      setProfile(prev => ({
        ...prev,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone || "",
        age: user.age || 0,
        gender: user.gender || "",
        address: user.address || "",
        city: user.city || "",
        bio: user.bio || "",
        experience: teacher.experience_years || 0,
        subject: teacher.subjects?.[0] || "",
        schools: teacher.schools?.map(school => ({ name: school, type: "both" })) || prev.schools
      }));
    }
  }, [user, teacher]);

  // Update weekly schedule when schedules data changes
  React.useEffect(() => {
    setWeeklySchedule(convertSchedulesToWeeklyFormat());
  }, [schedules]);

  // Convert fetched classes to ClassInfo format for display
  const classes: ClassInfo[] = fetchedClasses.map(cls => ({
    id: cls.id.toString(),
    name: cls.class_name || '',
    level: cls.level || '',
    grade: cls.grade || '',
    hoursPerWeek: cls.hours || 0,
    students: cls.max_students || 0,
    school: cls.school || ''
  }));

  // Convert database schedules to UI format using direct mapping
  const convertSchedulesToWeeklyFormat = (): WeeklySchedule[] => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return daysOfWeek.map(day => {
      const daySchedules = schedules.filter(schedule => 
        schedule.time_slot?.day_of_week === day
      );
      
      const dayClasses = daySchedules.map(schedule => ({
        from: schedule.time_slot?.start_time || '',
        to: schedule.time_slot?.end_time || '',
        class: schedule.class?.class_name || '',
        classroom: schedule.class_room || ''
      }));
      
      return {
        day,
        classes: dayClasses
      };
    });
  };

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>(convertSchedulesToWeeklyFormat());

  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState({
    day: "",
    from: "",
    to: "",
    class: "",
    classroom: ""
  });

  const [newClass, setNewClass] = useState({
    name: "",
    level: "",
    grade: "",
    hoursPerWeek: 0,
    students: 0,
    school: ""
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);

  // Schools management states
  const [newSchool, setNewSchool] = useState({ name: "", type: "both" });
  const [showAddSchool, setShowAddSchool] = useState(false);

  // Course management states
  const [courses, setCourses] = useState([
    { id: "1", name: "Mathematics Fundamentals", level: "College", grade: "1st Grade", file: "math-fundamentals.pdf", size: "2.3 MB" },
    { id: "2", name: "Algebra Basics", level: "Lycee", grade: "2nd Grade", file: "algebra-basics.pdf", size: "1.8 MB" },
    { id: "3", name: "Geometry Course", level: "College", grade: "3rd Grade", file: "geometry-course.pdf", size: "3.1 MB" }
  ]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingCourses, setIsEditingCourses] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", level: "", grade: "", file: null as File | null });

  // Photo upload and cropping states
  const [showPhotoCropper, setShowPhotoCropper] = useState(false);
  const [photoToCrop, setPhotoToCrop] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoToCrop(result);
        setShowPhotoCropper(true);
        // Reset crop and zoom
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle crop save
  const handleCropSave = () => {
    if (!croppedAreaPixels) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 96;
      canvas.height = 96;
      
      if (ctx) {
        // Use the cropped area pixels from react-easy-crop
        const { x, y, width, height } = croppedAreaPixels;
        
        // Draw the cropped image
        ctx.drawImage(
          img,
          x, y, width, height,
          0, 0, 96, 96
        );
        
        const croppedPhoto = canvas.toDataURL('image/jpeg', 0.9);
        setProfile(prev => ({ ...prev, photo: croppedPhoto }));
        // Don't update global profile photo here - only update when user hits save
        setShowPhotoCropper(false);
        setPhotoToCrop("");
      }
    };
    
    img.src = photoToCrop;
  };

  // Handle crop cancel
  const handleCropCancel = () => {
    setShowPhotoCropper(false);
    setPhotoToCrop("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Handle crop complete
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    if (!user || !teacher) {
      alert('User data not available. Please refresh the page and try again.');
      return;
    }
    
    // Ask for confirmation
    const confirmed = window.confirm('Are you sure you want to save these changes?');
    if (!confirmed) {
      return;
    }
    
    try {
      // Show loading state
      setIsSaving(true);
      setIsEditing(false);
      
      // Update the global profile photo
      setProfilePhoto(profile.photo);
      setOriginalProfilePhoto(profile.photo);
      
      // Validate required fields
      if (!profile.firstName || !profile.lastName) {
        alert('Please fill in all required fields (First Name and Last Name).');
        setIsEditing(true); // Re-enable editing
        return;
      }
      
      // Update user data in Supabase
      const { data: updatedUser, error: userError } = await supabase
        .from('users')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone || null,
          age: profile.age || null,
          gender: profile.gender || null,
          address: profile.address || null,
          city: profile.city || null,
          bio: profile.bio || null
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (userError) {
        throw new Error(`Error updating user profile: ${userError.message}`);
      }
      
      // Update teacher data in Supabase
      const { data: updatedTeacher, error: teacherError } = await supabase
        .from('teachers')
        .update({
          experience_years: profile.experience || null,
          subjects: profile.subject ? [profile.subject] : null,
          schools: profile.schools.length > 0 ? profile.schools.map(school => school.name) : null
        })
        .eq('id', teacher.id)
        .select()
        .single();
      
      if (teacherError) {
        throw new Error(`Error updating teacher profile: ${teacherError.message}`);
      }
      
      // Show success message
      alert('Profile updated successfully!');
      console.log('Profile updated successfully:', { updatedUser, updatedTeacher });
      
      // Refresh the data to show the latest changes
      await refetch();
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Error saving profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsEditing(true); // Re-enable editing on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Revert profile photo to original state
    setProfile(prev => ({ ...prev, photo: originalProfilePhoto }));
    // Reset any other profile changes to their original state
    // (You could add more revert logic here if needed)
  };

  const addClass = async () => {
    if (!teacher) {
      alert('Teacher data not available. Please refresh the page and try again.');
      return;
    }

    if (!newClass.name || !newClass.level || !newClass.grade || !newClass.school) {
      alert('Please fill in all required fields (Class Name, Level, Grade, and School).');
      return;
    }

    try {
      const { data: newClassData, error } = await supabase
        .from('classes')
        .insert({
          class_name: newClass.name,
          level: newClass.level,
          grade: newClass.grade,
          subject: profile.subject || 'General',
          description: `${newClass.level} ${newClass.grade} class`,
          classroom: 'TBD',
          hours: newClass.hoursPerWeek,
          max_students: 30, // Default value
          school: newClass.school,
          hourly_payement: '50', // Default value
          teacher_id: teacher.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error adding class: ${error.message}`);
      }

      // Clear the form
      setNewClass({ name: "", level: "", grade: "", hoursPerWeek: 0, students: 0, school: "" });
      
      // Refresh the classes data
      await refetchClasses();
      
      alert('Class added successfully!');
    } catch (error) {
      console.error('Error adding class:', error);
      alert(`Error adding class: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addSchool = () => {
    if (newSchool.name && newSchool.type) {
      setProfile(prev => ({
        ...prev,
        schools: [...prev.schools, { ...newSchool }]
      }));
      setNewSchool({ name: "", type: "both" });
      setShowAddSchool(false);
    }
  };

  const removeSchool = (index: number) => {
    setProfile(prev => ({
      ...prev,
      schools: prev.schools.filter((_, i) => i !== index)
    }));
  };

  // Course management functions
  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf') {
        const newCourse = {
          id: Date.now().toString(),
          name: file.name.replace('.pdf', ''),
          level: "College", // Default level
          grade: "1st Grade", // Default grade
          file: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        };
        setCourses(prev => [...prev, newCourse]);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const removeClass = async (id: string) => {
    const classToDelete = classes.find(cls => cls.id === id);
    const className = classToDelete?.name || 'this class';
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${className}?\n\n` +
      `⚠️ WARNING: This will permanently delete:\n` +
      `• All students in this class\n` +
      `• All schedule entries for this class\n` +
      `• All grades and assignments\n` +
      `• All attendance records\n\n` +
      `This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('Classes')
          .delete()
          .eq('id', parseInt(id));

        if (error) {
          throw new Error(`Error deleting class: ${error.message}`);
        }

        // Refresh the classes data
        await refetchClasses();
        
        // Also remove this class from the weekly schedule
        setWeeklySchedule(prev => prev.map(day => ({
          ...day,
          classes: day.classes.filter(cls => cls.class !== classToDelete?.name)
        })));
        
        alert('Class deleted successfully!');
      } catch (error) {
        console.error('Error deleting class:', error);
        alert(`Error deleting class: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  // Time validation functions
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };


  const addScheduleItem = async () => {
    if (!newScheduleItem.day || !newScheduleItem.class) {
      alert('Please select a day and class.');
      return;
    }

    try {
      // Find the time slot that matches the selected time
      const timeSlot = timeSlots.find(slot => 
        slot.day_of_week === newScheduleItem.day && 
        slot.start_time === newScheduleItem.from && 
        slot.end_time === newScheduleItem.to
      );

      if (!timeSlot) {
        alert('Selected time slot not found. Please try again.');
        return;
      }

      // Find the class that matches the selected class name
      const selectedClass = classes.find(cls => cls.name === newScheduleItem.class);

      if (!selectedClass) {
        alert('Selected class not found. Please try again.');
        return;
      }

      if (editingScheduleId) {
        // Update existing schedule
                  await updateScheduleItem(editingScheduleId, {
            class_id: parseInt(selectedClass.id),
            class_room: newScheduleItem.classroom,
            notes: ''
          });
        
        // Clear editing state
        setEditingScheduleId(null);
        alert('Schedule item updated successfully!');
      } else {
        // Check if there's already a schedule in this time slot
        const existingSchedule = schedules.find(schedule => 
          schedule.slot_id === timeSlot.id
        );

        if (existingSchedule) {
          alert('There is already a class scheduled in this time slot. Please choose a different time.');
          return;
        }

        // Add new schedule to the database
        await addSchedule(
          parseInt(selectedClass.id), 
          timeSlot.id, 
          newScheduleItem.classroom, 
          ''
        );
        
        alert('Schedule item added successfully!');
      }

      // Clear the form
      setNewScheduleItem({ day: "", from: "", to: "", class: "", classroom: "" });
      setSelectedTimeSlot("");
      
    } catch (error) {
      console.error('Error adding/updating schedule item:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateScheduleItem = async (scheduleId: number, updates: {
    class_id?: number;
    class_room?: string;
    notes?: string;
  }) => {
    try {
      await updateSchedule(scheduleId, updates);
      alert('Schedule item updated successfully!');
    } catch (error) {
      console.error('Error updating schedule item:', error);
      alert(`Error updating schedule item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const removeScheduleItem = async (day: string, index: number) => {
    try {
      // Find the schedule to remove
      const daySchedules = schedules.filter(schedule => 
        schedule.time_slot?.day_of_week === day
      );
      
      if (index < daySchedules.length) {
        const scheduleToRemove = daySchedules[index];
        
        // Confirm deletion
        const confirmed = window.confirm(
          `Are you sure you want to remove "${scheduleToRemove.class?.class_name}" from ${day} ${scheduleToRemove.time_slot?.start_time}-${scheduleToRemove.time_slot?.end_time}?`
        );
        
        if (confirmed) {
          // Delete from database
          await deleteSchedule(scheduleToRemove.id);
          alert('Schedule item removed successfully!');
        }
      }
    } catch (error) {
      console.error('Error removing schedule item:', error);
      alert(`Error removing schedule item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Generate time slots for the calendar view
  const generateTimeSlots = () => {
    const slots = [];
    
    // Morning session: 08:30 - 12:30 (4 rows)
    slots.push("08:30 - 09:30");
    slots.push("09:30 - 10:30");
    slots.push("10:30 - 11:30");
    slots.push("11:30 - 12:30");
    
    // Break time: 12:30 - 14:30 (1 row)
    slots.push("12:30 - 14:30");
    
    // Afternoon session: 14:30 - 18:30 (4 rows)
    slots.push("14:30 - 15:30");
    slots.push("15:30 - 16:30");
    slots.push("16:30 - 17:30");
    slots.push("17:30 - 18:30");
    
    // Evening session: 19:00 - 21:00 (1 row - 2-hour block)
    slots.push("19:00 - 21:00");
    
    return slots;
  };

  const calculateDuration = (from: string, to: string) => {
    const fromMinutes = timeToMinutes(from);
    const toMinutes = timeToMinutes(to);
    const durationMinutes = toMinutes - fromMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleTimeSlotClick = (timeSlot: string, day: string) => {
    if (!isEditingSchedule) return;
    
    // Extract time range from the slot (e.g., "08:30 - 09:30" -> "08:30" and "09:30")
    const [from, to] = timeSlot.split(" - ");
    
    // Check if there's an existing class in this slot
    const existingClass = weeklySchedule
      .find(daySchedule => daySchedule.day === day)
      ?.classes.find(cls => cls.from === from && cls.to === to);
    
    if (existingClass) {
      // Find the actual schedule object to get the ID
      const existingSchedule = schedules.find(schedule => 
        schedule.time_slot?.day_of_week === day &&
        schedule.time_slot?.start_time === from &&
        schedule.time_slot?.end_time === to
      );
      
      // If there's an existing class, populate the form with its data and set editing mode
      setNewScheduleItem({
        day: day,
        from: from,
        to: to,
        class: existingClass.class || "",
        classroom: existingClass.classroom || ""
      });
      
      // Set the editing schedule ID
      setEditingScheduleId(existingSchedule?.id || null);
      console.log("Editing existing class:", existingClass, "Schedule ID:", existingSchedule?.id);
    } else {
      // If it's an empty slot, just set the time and clear editing mode
      setNewScheduleItem(prev => ({
        ...prev,
        day: day,
        from: from,
        to: to,
        class: "",
        classroom: ""
      }));
      setEditingScheduleId(null);
      console.log("Adding new class to empty slot");
    }
    
    setSelectedTimeSlot(timeSlot);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading teacher profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Error loading profile</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Photo Cropper Modal */}
      {showPhotoCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Crop Your Photo</h3>
            <div className="relative w-48 h-48 mx-auto mb-4 border-2 border-gray-300 rounded-full overflow-hidden">
              <Cropper
                image={photoToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f3f4f6'
                  }
                }}
              />
            </div>
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium">Zoom:</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCropSave} className="flex-1">
                Save
              </Button>
              <Button variant="outline" onClick={handleCropCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add School Modal */}
      {showAddSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New School</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="school-name">School Name</Label>
                <Input
                  id="school-name"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter school name"
                />
              </div>
              <div>
                <Label htmlFor="school-type">School Type</Label>
                <Select value={newSchool.type} onValueChange={(value) => setNewSchool(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="college">College Only</SelectItem>
                    <SelectItem value="lycee">Lycee Only</SelectItem>
                    <SelectItem value="both">Both College & Lycee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button onClick={addSchool} className="flex-1">
                Add School
              </Button>
              <Button variant="outline" onClick={() => setShowAddSchool(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {user ? `${user.first_name} ${user.last_name}'s Profile` : "Teacher Profile"}
        </h1>
        <p className="text-gray-600">Manage your personal information and class schedule</p>
        {user && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Data Source:</strong> Fetched from Supabase (User ID: {user.id})
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Last updated: {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Personal Information
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.photo} />
                    <AvatarFallback className="text-2xl bg-primary text-white">
                      {`${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && profile.photo && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0 h-6 w-6 p-0 rounded-full"
                      onClick={() => {
                        setProfile(prev => ({ ...prev, photo: "" }));
                        // Don't clear global profile photo here - only when user hits save
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {isEditing && (
                  <div className="flex flex-col items-center space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm"
                    >
                      {profile.photo ? "Change Photo" : "Add Photo"}
                    </label>
                  </div>
                )}
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-600">{profile.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-600">{profile.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <p className="text-gray-600">{profile.email}</p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-600">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p className="text-gray-600">{profile.age} years old</p>
                  )}
                </div>

                {(isEditing || profile.gender) && (
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-600">{profile.gender}</p>
                    )}
                  </div>
                )}

                {(isEditing || profile.address) && (
                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-600">{profile.address}</p>
                    )}
                  </div>
                )}

                {(isEditing || profile.city) && (
                  <div>
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-600">{profile.city}</p>
                    )}
                  </div>
                )}

                {(isEditing || profile.bio) && (
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-600">{profile.bio}</p>
                    )}
                  </div>
                )}

                {(isEditing || profile.experience) && (
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    {isEditing ? (
                      <Input
                        id="experience"
                        type="number"
                        value={profile.experience}
                        onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) })}
                      />
                    ) : (
                      <p className="text-gray-600">{profile.experience} years</p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  {isEditing ? (
                    <Input
                      id="subject"
                      value={profile.subject}
                      onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-600">{profile.subject}</p>
                  )}
                </div>

                <div>
                  <Label>Schools</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      {profile.schools.map((school, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                          <span className="text-gray-800 font-medium">{school.name}</span>
                          <span className="text-sm text-gray-600">({school.type})</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSchool(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setShowAddSchool(true)}
                        className="w-full text-left text-sm text-gray-600"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add New School
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {profile.schools.map((school, index) => (
                        <p key={index} className="text-gray-600">• {school.name} ({school.type})</p>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Academic Year</Label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={profile.startDate.toISOString().split('T')[0]}
                          onChange={(e) => setProfile({ ...profile, startDate: new Date(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={profile.endDate.toISOString().split('T')[0]}
                          onChange={(e) => setProfile({ ...profile, endDate: new Date(e.target.value) })}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      {profile.startDate.toLocaleDateString()} - {profile.endDate.toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="totalWeeks">Total Weeks</Label>
                  {isEditing ? (
                    <Input
                      id="totalWeeks"
                      type="number"
                      value={profile.totalWeeks}
                      onChange={(e) => setProfile({ ...profile, totalWeeks: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p className="text-gray-600">{profile.totalWeeks} weeks</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Academic Year & Classes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Year */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Academic Year Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !profile.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {profile.startDate ? format(profile.startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={profile.startDate}
                        onSelect={(date) => date && setProfile({ ...profile, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !profile.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {profile.endDate ? format(profile.endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={profile.endDate}
                        onSelect={(date) => date && setProfile({ ...profile, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="weeks">Total Weeks</Label>
                  <Input
                    id="weeks"
                    type="number"
                    value={profile.totalWeeks}
                    onChange={(e) => setProfile({ ...profile, totalWeeks: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classes Management */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Classes Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add New Class */}
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    {/* First Row: Class Name, Level, Grade */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Class Name (e.g., 1A)"
                        value={newClass.name}
                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                      />
                      <Select value={newClass.level} onValueChange={(value) => setNewClass({ ...newClass, level: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="College">College</SelectItem>
                          <SelectItem value="Lycee">Lycee</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={newClass.grade} onValueChange={(value) => setNewClass({ ...newClass, grade: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Grade">1st Grade</SelectItem>
                          <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                          <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Second Row: School, Hours/Week, Add Class Button */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select value={newClass.school} onValueChange={(value) => setNewClass({ ...newClass, school: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="School" />
                        </SelectTrigger>
                        <SelectContent>
                          {profile.schools.map((school, index) => (
                            <SelectItem key={index} value={school.name}>
                              {school.name} ({school.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Hours/Week"
                        value={newClass.hoursPerWeek || ''}
                        onChange={(e) => setNewClass({ ...newClass, hoursPerWeek: parseInt(e.target.value) || 0 })}
                      />
                      <Button onClick={addClass} className="flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Class
                      </Button>
                    </div>
                  </div>

                  {/* Classes List */}
                  <div className="space-y-2">
                    {classesLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span className="text-gray-600">Loading classes...</span>
                      </div>
                    ) : classesError ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">Error loading classes: {classesError}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={refetchClasses}
                          className="mt-2"
                        >
                          Retry
                        </Button>
                      </div>
                    ) : classes.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>No classes found. Add your first class above.</p>
                      </div>
                    ) : (
                      classes.map((cls) => (
                        <div key={cls.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-20 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm px-2 cursor-pointer hover:bg-primary/90 transition-colors"
                              onClick={() => window.location.href = `/classes/${cls.id}`}
                            >
                              {cls.name.length > 7 ? `${cls.name.substring(0, 7)}...` : cls.name}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{cls.name}</p>
                              <p className="text-sm text-gray-600">{cls.grade} • {cls.hoursPerWeek}h/week • {cls.students} students • {cls.school}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeClass(cls.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Management */}
            <Card className="shadow-sm border border-gray-200 mt-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Course Materials
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingCourses(!isEditingCourses)}
                >
                  {isEditingCourses ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditingCourses && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                          placeholder="Course Name"
                          value={newCourse.name}
                          onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Select value={newCourse.level} onValueChange={(value) => setNewCourse(prev => ({ ...prev, level: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="College">College</SelectItem>
                            <SelectItem value="Lycee">Lycee</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={newCourse.grade} onValueChange={(value) => setNewCourse(prev => ({ ...prev, grade: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1st Grade">1st Grade</SelectItem>
                            <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                            <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                          </SelectContent>
                        </Select>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setNewCourse(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                          className="hidden"
                          id="course-file-upload"
                        />
                        <label
                          htmlFor="course-file-upload"
                          className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm"
                        >
                          Browse Files
                        </label>
                      </div>
                      <Button onClick={() => {
                        if (newCourse.name && newCourse.level && newCourse.grade && newCourse.file) {
                          const newCourseData = {
                            id: Date.now().toString(),
                            name: newCourse.name,
                            level: newCourse.level,
                            grade: newCourse.grade,
                            file: newCourse.file.name,
                            size: `${(newCourse.file.size / (1024 * 1024)).toFixed(1)} MB`
                          };
                          setCourses(prev => [...prev, newCourseData]);
                          setNewCourse({ name: "", level: "", grade: "", file: null });
                        }
                      }} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Course
                      </Button>
                    </div>
                  )}

                  {/* Course List */}
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          // Open PDF in new tab/window
                          const pdfUrl = `/courses/${course.file}`; // This would be the actual PDF URL
                          window.open(pdfUrl, '_blank');
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <FileText className="w-8 h-8 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {course.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {course.level} • {course.grade}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {course.file} • {course.size}
                            </p>
                          </div>
                          {isEditingCourses && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent opening PDF when clicking delete
                                removeCourse(course.id);
                              }}
                              className="flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {courses.length === 0 && !isEditingCourses && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No course materials uploaded yet</p>
                      <p className="text-sm">Click edit to add your course materials</p>
                    </div>
                  )}

                  {/* Scroll indicator for multiple courses */}
                  {courses.length > 3 && (
                    <div className="text-center mt-2">
                      <p className="text-xs text-gray-400">← Scroll to see more courses →</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Weekly Schedule - Full Width */}
      <div className="mt-8">
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Weekly Schedule
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingSchedule(!isEditingSchedule)}
            >
              {isEditingSchedule ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Loading and Error States */}
              {schedulesLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-gray-600">Loading schedule...</span>
                </div>
              )}

              {schedulesError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">Error loading schedule: {schedulesError}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refetchSchedules}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Add New Schedule Item */}
              {isEditingSchedule && !schedulesLoading && !schedulesError && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Select value={newScheduleItem.day} onValueChange={(value) => setNewScheduleItem({ ...newScheduleItem, day: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center justify-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
                      From: {newScheduleItem.from || "Select time"}
                    </div>
                    <div className="flex items-center justify-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
                      To: {newScheduleItem.to || "Select time"}
                    </div>
                    <Select value={newScheduleItem.class} onValueChange={(value) => setNewScheduleItem({ ...newScheduleItem, class: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Classroom"
                      value={newScheduleItem.classroom}
                      onChange={(e) => setNewScheduleItem({ ...newScheduleItem, classroom: e.target.value })}
                    />
                  </div>
                  <Button onClick={addScheduleItem} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    {editingScheduleId ? "Update Schedule" : "Add Class to Schedule"}
                  </Button>
                </div>
              )}

              {/* Weekly Calendar View */}
              {!schedulesLoading && !schedulesError && (
                <div className="w-full">
                <div className="w-full">
                  {/* Header Row */}
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    <div className="p-2 font-medium text-gray-600 text-center">Time</div>
                    {weeklySchedule.map((day) => (
                      <div key={day.day} className="p-2 font-medium text-gray-800 text-center bg-gray-100 rounded">
                        {day.day.slice(0, 3)}
                      </div>
                    ))}
                  </div>

                  {/* Time Slots */}
                  {generateTimeSlots().map((timeSlot) => (
                    <div key={timeSlot} className="grid grid-cols-8 gap-1 mb-1">
                      <div className="p-2 text-sm text-gray-600 text-center bg-gray-50 rounded flex items-center justify-center">
                        {timeSlot}
                      </div>
                      {weeklySchedule.map((day) => {
                        const classInSlot = day.classes.find(cls => {
                          // Create the time slot string from the class data
                          const classTimeSlot = `${cls.from} - ${cls.to}`;
                          return classTimeSlot === timeSlot;
                        });
                        
                        // Check if this is break time
                        const isBreakTime = timeSlot >= "12:30" && timeSlot < "14:30";
                        
                        return (
                          <div 
                            key={`${day.day}-${timeSlot}`} 
                            className={`min-h-[80px] p-2 border rounded relative ${
                              isEditingSchedule && !isBreakTime
                                ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors' 
                                : ''
                            } ${
                              isEditingSchedule && selectedTimeSlot === timeSlot && newScheduleItem.day === day.day
                                ? 'bg-green-100 border-green-400 ring-2 ring-green-200' 
                                : ''
                            }`}
                            onClick={() => handleTimeSlotClick(timeSlot, day.day)}
                          >
                            {isBreakTime ? (
                              <div className="bg-yellow-100 text-yellow-800 p-3 rounded text-sm font-medium h-full flex flex-col justify-center items-center">
                                <div className="text-center">
                                  <div className="font-bold text-xs">BREAK</div>
                                  <div className="text-xs opacity-75">12:30 - 14:30</div>
                                </div>
                              </div>
                            ) : classInSlot ? (
                              <div className="bg-primary text-white p-3 rounded text-sm font-medium h-full flex flex-col justify-center items-center text-center">
                                <div className="font-bold text-base">{classInSlot.class}</div>
                                <div className="text-xs opacity-90 mt-1">{classInSlot.classroom}</div>
                                {isEditingSchedule && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-1 right-1 h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeScheduleItem(day.day, day.classes.indexOf(classInSlot));
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                                {isEditingSchedule && (
                                  <div className="text-center">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full mx-auto mb-1"></div>
                                    <span>Empty</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 