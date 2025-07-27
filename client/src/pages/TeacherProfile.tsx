import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Edit, Save, X, Plus, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Cropper from 'react-easy-crop'

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
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Mr. Anas Bellaouali",
    email: "anas.bellaouali@school.edu",
    phone: "+212 6 12 34 56 78",
    age: 28,
    gender: "Male",
    address: "123 Education Street",
    city: "Ifrane",
    bio: "Experienced mathematics teacher with 5 years of teaching experience. Passionate about making math accessible and engaging for all students.",
    experience: 5,
    subject: "Mathematics",
    photo: "",
    schools: [
      { name: "Al Akhawayn University", type: "both" },
      { name: "International School of Morocco", type: "lycee" }
    ],
    startDate: new Date(2024, 8, 1), // September 1, 2024
    endDate: new Date(2025, 5, 30), // June 30, 2025
    totalWeeks: 36
  });

  const [classes, setClasses] = useState<ClassInfo[]>([
    { id: "1", name: "1A", level: "College", grade: "1st Grade", hoursPerWeek: 6, students: 24, school: "Al Akhawayn University" },
    { id: "2", name: "2A", level: "College", grade: "2nd Grade", hoursPerWeek: 5, students: 22, school: "Al Akhawayn University" },
    { id: "3", name: "3A", level: "College", grade: "3rd Grade", hoursPerWeek: 4, students: 26, school: "Al Akhawayn University" },
    { id: "4", name: "1B", level: "Lycee", grade: "1st Grade", hoursPerWeek: 6, students: 28, school: "International School of Morocco" }
  ]);

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([
    {
      day: "Monday",
      classes: [
        { from: "08:30", to: "09:30", class: "1A", classroom: "Room 101" },
        { from: "10:00", to: "11:00", class: "2A", classroom: "Room 102" },
        { from: "14:30", to: "15:30", class: "3A", classroom: "Room 103" },
        { from: "16:00", to: "17:00", class: "1B", classroom: "Room 201" }
      ]
    },
    {
      day: "Tuesday",
      classes: [
        { from: "08:30", to: "09:30", class: "1B", classroom: "Room 201" },
        { from: "11:00", to: "12:00", class: "1A", classroom: "Room 101" },
        { from: "14:30", to: "15:30", class: "2A", classroom: "Room 102" },
        { from: "19:00", to: "20:00", class: "3A", classroom: "Room 103" }
      ]
    },
    {
      day: "Wednesday",
      classes: [
        { from: "08:30", to: "09:30", class: "2A", classroom: "Room 102" },
        { from: "10:00", to: "11:00", class: "1A", classroom: "Room 101" },
        { from: "14:30", to: "15:30", class: "3A", classroom: "Room 103" },
        { from: "16:00", to: "17:00", class: "1B", classroom: "Room 201" }
      ]
    },
    {
      day: "Thursday",
      classes: [
        { from: "09:00", to: "10:00", class: "1B", classroom: "Room 201" },
        { from: "11:00", to: "12:00", class: "2A", classroom: "Room 102" },
        { from: "14:30", to: "15:30", class: "1A", classroom: "Room 101" },
        { from: "19:00", to: "20:00", class: "3A", classroom: "Room 103" }
      ]
    },
    {
      day: "Friday",
      classes: [
        { from: "08:30", to: "09:30", class: "2A", classroom: "Room 102" },
        { from: "10:00", to: "11:00", class: "1A", classroom: "Room 101" },
        { from: "14:30", to: "15:30", class: "3A", classroom: "Room 103" },
        { from: "16:00", to: "17:00", class: "1B", classroom: "Room 201" }
      ]
    },
    {
      day: "Saturday",
      classes: [
        { from: "08:30", to: "09:30", class: "1A", classroom: "Room 101" },
        { from: "10:00", to: "11:00", class: "2A", classroom: "Room 102" },
        { from: "14:30", to: "15:30", class: "3A", classroom: "Room 103" }
      ]
    },
    {
      day: "Sunday",
      classes: [
        { from: "08:30", to: "09:30", class: "1B", classroom: "Room 201" },
        { from: "11:00", to: "12:00", class: "2A", classroom: "Room 102" },
        { from: "14:30", to: "15:30", class: "3A", classroom: "Room 103" },
        { from: "19:00", to: "20:00", class: "1A", classroom: "Room 101" }
      ]
    }
  ]);

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

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const addClass = () => {
    if (newClass.name && newClass.level && newClass.grade) {
      setClasses([...classes, { ...newClass, id: Date.now().toString() }]);
      setNewClass({ name: "", level: "", grade: "", hoursPerWeek: 0, students: 0, school: "" });
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

  const removeClass = (id: string) => {
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
      setClasses(classes.filter(cls => cls.id !== id));
      
      // Also remove this class from the weekly schedule
      setWeeklySchedule(prev => prev.map(day => ({
        ...day,
        classes: day.classes.filter(cls => cls.class !== classToDelete?.name)
      })));
    }
  };

  // Time validation functions
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isValidTimeFormat = (time: string) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    
    // Check if time is within valid school hours
    const timeInMinutes = hours * 60 + minutes;
    
    // Morning session: 08:30 - 12:30
    const morningStart = 8 * 60 + 30; // 08:30
    const morningEnd = 12 * 60 + 30;  // 12:30
    
    // Afternoon session: 14:30 - 18:30
    const afternoonStart = 14 * 60 + 30; // 14:30
    const afternoonEnd = 18 * 60 + 30;   // 18:30
    
    // Evening session: 19:00 - 21:00
    const eveningStart = 19 * 60; // 19:00
    const eveningEnd = 21 * 60;   // 21:00
    
    return (timeInMinutes >= morningStart && timeInMinutes <= morningEnd) ||
           (timeInMinutes >= afternoonStart && timeInMinutes <= afternoonEnd) ||
           (timeInMinutes >= eveningStart && timeInMinutes <= eveningEnd);
  };

  const hasTimeConflict = (day: string, from: string, to: string, excludeIndex?: number) => {
    const daySchedule = weeklySchedule.find(d => d.day === day);
    if (!daySchedule) return false;

    const newFrom = timeToMinutes(from);
    const newTo = timeToMinutes(to);

    // Check if end time is after start time
    if (newTo <= newFrom) return true;

    return daySchedule.classes.some((cls, index) => {
      if (excludeIndex !== undefined && index === excludeIndex) return false;
      
      const existingFrom = timeToMinutes(cls.from);
      const existingTo = timeToMinutes(cls.to);
      
      // Check for overlap
      return (newFrom < existingTo && newTo > existingFrom);
    });
  };

  const addScheduleItem = () => {
    console.log("Adding/updating schedule item:", newScheduleItem); // Debug log

    const updatedSchedule = weeklySchedule.map(daySchedule => {
      if (daySchedule.day === newScheduleItem.day) {
        // Check if there's an existing class in this time slot
        const existingClassIndex = daySchedule.classes.findIndex(cls => 
          cls.from === newScheduleItem.from && cls.to === newScheduleItem.to
        );

        if (existingClassIndex !== -1) {
          // Update existing class
          const updatedClasses = [...daySchedule.classes];
          updatedClasses[existingClassIndex] = {
            from: newScheduleItem.from || "",
            to: newScheduleItem.to || "",
            class: newScheduleItem.class || "",
            classroom: newScheduleItem.classroom || ""
          };
          console.log("Updating existing class:", updatedClasses[existingClassIndex]);
          return {
            ...daySchedule,
            classes: updatedClasses
          };
        } else {
          // Add new class
          const newClass = {
            from: newScheduleItem.from || "",
            to: newScheduleItem.to || "",
            class: newScheduleItem.class || "",
            classroom: newScheduleItem.classroom || ""
          };
          console.log("Adding new class:", newClass);
          return {
            ...daySchedule,
            classes: [...daySchedule.classes, newClass]
          };
        }
      }
      return daySchedule;
    });
    
    console.log("Updated schedule:", updatedSchedule); // Debug log
    setWeeklySchedule(updatedSchedule);
    setNewScheduleItem({ day: "", from: "", to: "", class: "", classroom: "" });
    setSelectedTimeSlot("");
  };

  const removeScheduleItem = (day: string, index: number) => {
    const updatedSchedule = weeklySchedule.map(daySchedule => {
      if (daySchedule.day === day) {
        return {
          ...daySchedule,
          classes: daySchedule.classes.filter((_, i) => i !== index)
        };
      }
      return daySchedule;
    });
    setWeeklySchedule(updatedSchedule);
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
      // If there's an existing class, populate the form with its data
      setNewScheduleItem({
        day: day,
        from: from,
        to: to,
        class: existingClass.class || "",
        classroom: existingClass.classroom || ""
      });
      console.log("Editing existing class:", existingClass);
    } else {
      // If it's an empty slot, just set the time
      setNewScheduleItem(prev => ({
        ...prev,
        day: day,
        from: from,
        to: to,
        class: "",
        classroom: ""
      }));
      console.log("Adding new class to empty slot");
    }
    
    setSelectedTimeSlot(timeSlot);
  };

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Profile</h1>
        <p className="text-gray-600">Manage your personal information and class schedule</p>
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
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.photo} />
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
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
                    {profile.photo && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProfile(prev => ({ ...prev, photo: "" }))}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Photo
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-600">{profile.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-600">{profile.email}</p>
                  )}
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
                <Button onClick={handleSave} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
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
                    {classes.map((cls) => (
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
                    ))}
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
              {/* Add New Schedule Item */}
              {isEditingSchedule && (
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
                    {newScheduleItem.class ? "Update Class" : "Add Class to Schedule"}
                  </Button>
                </div>
              )}

              {/* Weekly Calendar View */}
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
                        const classInSlot = day.classes.find(cls => 
                          cls.from + " - " + cls.to === timeSlot
                        );
                        
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 