import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 5)); // October 2024
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const today = currentDate.getDate();
  
  const calendarDays = [];
  
  // Previous month's trailing days
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
    });
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday: day === today,
    });
  }
  
  // Next month's leading days
  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </Button>
          <CardTitle className="text-lg font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((calendarDay, index) => (
            <div
              key={index}
              className={`
                text-center py-2 text-sm cursor-pointer rounded transition-colors
                ${calendarDay.isCurrentMonth 
                  ? calendarDay.isToday 
                    ? "bg-primary text-white" 
                    : "text-gray-800 hover:bg-gray-100"
                  : "text-gray-400"
                }
              `}
            >
              {calendarDay.day}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
