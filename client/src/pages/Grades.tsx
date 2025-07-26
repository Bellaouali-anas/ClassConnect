import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockGrades, mockStudents, gradeTypeOptions, subjectOptions } from "@/data/mockData";

export default function Grades() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [gradeType, setGradeType] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ selectedStudent, gradeType, subject, score, date });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Grades</h1>
        <p className="text-gray-600">Manage and track student grades</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Grade Form */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Add Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="student" className="text-sm font-medium text-gray-700">
                    Select Student
                  </Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gradeType" className="text-sm font-medium text-gray-700">
                    Grade Type
                  </Label>
                  <Select value={gradeType} onValueChange={setGradeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeTypeOptions.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject
                  </Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((subj) => (
                        <SelectItem key={subj} value={subj.toLowerCase()}>
                          {subj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="score" className="text-sm font-medium text-gray-700">
                    Score
                  </Label>
                  <Input
                    id="score"
                    type="number"
                    placeholder="Enter score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary text-white hover:bg-blue-600">
                  Add Grade
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Grade Overview */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="p-6 border-b border-gray-200">
              <Tabs defaultValue="class" className="w-full">
                <TabsList>
                  <TabsTrigger value="class" className="px-4 py-2 bg-primary text-white data-[state=active]:bg-primary data-[state=active]:text-white">
                    Per Class
                  </TabsTrigger>
                  <TabsTrigger value="student" className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                    Per Student
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="class" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200">
                          <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                            Student
                          </TableHead>
                          <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                            Grade Type
                          </TableHead>
                          <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                            Subject
                          </TableHead>
                          <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                            Score
                          </TableHead>
                          <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockGrades.map((grade) => (
                          <TableRow key={grade.id} className="hover:bg-gray-50">
                            <TableCell className="py-4 px-6">
                              <div className="font-medium text-gray-800">{grade.studentName}</div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <span className="text-primary font-medium">{grade.gradeType}</span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <span className="text-gray-600">{grade.subject}</span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <span className="font-medium text-gray-800">{grade.score}</span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <span className="text-gray-600">{grade.date}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="student">
                  <div className="text-center py-8 text-gray-500">
                    Per Student view - Feature to be implemented
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <CardTitle className="text-lg font-semibold text-gray-800 mb-4">
                  Score Trends
                </CardTitle>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">87</div>
                  <p className="text-sm text-gray-600">
                    Last 6 Months <span className="text-green-500">+5%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <CardTitle className="text-lg font-semibold text-gray-800 mb-4">
                  Average Scores
                </CardTitle>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">85</div>
                  <p className="text-sm text-gray-600">
                    This Semester <span className="text-red-500">-2%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
