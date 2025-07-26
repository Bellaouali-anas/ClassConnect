import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockStudents } from "@/data/mockData";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || student.className === classFilter;
    const matchesGender = genderFilter === "all" || student.gender.toLowerCase() === genderFilter;
    
    return matchesSearch && matchesClass && matchesGender;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        <Button className="bg-primary text-white hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search students"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="Class A">Class A</SelectItem>
                  <SelectItem value="Class B">Class B</SelectItem>
                  <SelectItem value="Class C">Class C</SelectItem>
                </SelectContent>
              </Select>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Name
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Class
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Gender
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Attendance
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Average Grade
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell className="py-4 px-6">
                      <div className="font-medium text-gray-800">{student.name}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="text-primary font-medium">{student.className}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="text-gray-600">{student.gender}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{student.attendanceRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="font-medium text-gray-800">{student.averageGrade}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Button variant="ghost" className="text-primary hover:text-blue-600 text-sm font-medium p-0">
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
