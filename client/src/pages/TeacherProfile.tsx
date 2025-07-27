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
import { CalendarIcon, Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ClassInfo {
  id: string;
  name: string;
  level: string;
  grade: string; // College 1st-3rd year or Lycee 1st-3rd year
  hoursPerWeek: number;
  students: number;
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
    status: "Active",
    subject: "Mathematics",
    schools: ["High School of Science", "Technical Institute"],
    startDate: new Date(2024, 8, 1), // September 1, 2024
    endDate: new Date(2025, 5, 30), // June 30, 2025
    totalWeeks: 36,
    photo: ""
  });

  const [classes, setClasses] = useState<ClassInfo[]>([
    { id: "1", name: "1A", level: "College", grade: "1st Year College", hoursPerWeek: 6, students: 24 },
    { id: "2", name: "2A", level: "College", grade: "2nd Year College", hoursPerWeek: 5, students: 22 },
    { id: "3", name: "3A", level: "College", grade: "3rd Year College", hoursPerWeek: 4, students: 26 },
    { id: "4", name: "1B", level: "Lycee", grade: "1st Year Lycee", hoursPerWeek: 6, students: 28 }
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

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const [newClass, setNewClass] = useState({
    name: "",
    level: "",
    grade: "",
    hoursPerWeek: 0,
    students: 0
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const addClass = () => {
    if (newClass.name && newClass.level && newClass.grade) {
      setClasses([...classes, { ...newClass, id: Date.now().toString() }]);
      setNewClass({ name: "", level: "", grade: "", hoursPerWeek: 0, students: 0 });
    }
  };

  const removeClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
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
    setSelectedTimeSlot(null);
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
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
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
                    <p className="text-gray-800 font-medium">{profile.name}</p>
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
                    <Textarea
                      value={profile.schools.join('\n')}
                      onChange={(e) => setProfile({ ...profile, schools: e.target.value.split('\n') })}
                      placeholder="Enter schools (one per line)"
                    />
                  ) : (
                    <div className="space-y-1">
                      {profile.schools.map((school, index) => (
                        <p key={index} className="text-gray-600">• {school}</p>
                      ))}
                    </div>
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
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Classes Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add New Class */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  <Input
                    placeholder="Class Name (e.g., 1A)"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  />
                  <Select value={newClass.level} onValueChange={(value) => setNewClass({ ...newClass, level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Lycee">Lycee</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newClass.grade} onValueChange={(value) => setNewClass({ ...newClass, grade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year College">1st Year College</SelectItem>
                      <SelectItem value="2nd Year College">2nd Year College</SelectItem>
                      <SelectItem value="3rd Year College">3rd Year College</SelectItem>
                      <SelectItem value="1st Year Lycee">1st Year Lycee</SelectItem>
                      <SelectItem value="2nd Year Lycee">2nd Year Lycee</SelectItem>
                      <SelectItem value="3rd Year Lycee">3rd Year Lycee</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Hours/Week"
                    value={newClass.hoursPerWeek || ''}
                    onChange={(e) => setNewClass({ ...newClass, hoursPerWeek: parseInt(e.target.value) || 0 })}
                  />
                  <Button onClick={addClass} className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Class
                  </Button>
                </div>

                {/* Classes List */}
                <div className="space-y-2">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold">
                          {cls.name}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{cls.name}</p>
                          <p className="text-sm text-gray-600">{cls.grade} • {cls.hoursPerWeek}h/week • {cls.students} students</p>
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
                      <div className="p-2 text-sm text-gray-600 text-center bg-gray-50 rounded">
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