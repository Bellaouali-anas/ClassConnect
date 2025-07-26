import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AttendanceCalendar from "@/components/AttendanceCalendar";
import { mockAttendance } from "@/data/mockData";

export default function Attendance() {
  const [selectedClass, setSelectedClass] = useState("all");

  const attendanceStats = {
    present: mockAttendance.filter(record => record.present).length,
    absent: mockAttendance.filter(record => record.absent).length,
    late: mockAttendance.filter(record => record.late).length,
    excused: mockAttendance.filter(record => record.excused).length,
  };

  const total = mockAttendance.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Calendar */}
        <AttendanceCalendar />

        {/* Today's Attendance Stats */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Present</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(attendanceStats.present / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{attendanceStats.present}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Absent</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(attendanceStats.absent / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{attendanceStats.absent}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Late</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(attendanceStats.late / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{attendanceStats.late}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Excused</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(attendanceStats.excused / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{attendanceStats.excused}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Attendance Table */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Student Attendance
            </CardTitle>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="algebra">Algebra 1</SelectItem>
                <SelectItem value="geometry">Geometry</SelectItem>
                <SelectItem value="calculus">Calculus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Student Name
                  </TableHead>
                  <TableHead className="text-center py-3 px-6 text-sm font-medium text-gray-600">
                    Present
                  </TableHead>
                  <TableHead className="text-center py-3 px-6 text-sm font-medium text-gray-600">
                    Absent
                  </TableHead>
                  <TableHead className="text-center py-3 px-6 text-sm font-medium text-gray-600">
                    Late
                  </TableHead>
                  <TableHead className="text-center py-3 px-6 text-sm font-medium text-gray-600">
                    Excused
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAttendance.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-50">
                    <TableCell className="py-4 px-6">
                      <div className="font-medium text-gray-800">{record.studentName}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      {record.present ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      {record.absent ? (
                        <Check className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      {record.late ? (
                        <Check className="w-5 h-5 text-yellow-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      {record.excused ? (
                        <Check className="w-5 h-5 text-blue-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <Button className="bg-primary text-white hover:bg-blue-600">
              Save Attendance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
