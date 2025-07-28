import React, { useState } from "react";
import { Plus, BookOpen, Users, TrendingUp, Clock, GraduationCap, X, Edit, Trash2, BarChart3, PieChart, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/StatCard";
import { mockClasses, mockStudents, mockGrades } from "@/data/mockData";
import { useLocation } from "wouter";
import Plot from 'react-plotly.js';

interface ClassData {
  id: string;
  name: string;
  studentCount: number;
  level: string;
  grade: string;
  hoursPerWeek: number;
  school: string;
  // Financial and payment information
  hourlyRate: number;
  paymentType: 'hourly' | 'monthly' | 'per_class';
  contractStartDate: string;
  contractEndDate: string;
  totalSessions: number;
  completedSessions: number;
  // Additional class details
  subject: string;
  classroom: string;
  schedule: string;
  maxStudents: number;
  description: string;
}

export default function Classes() {
  const [, setLocation] = useLocation();
  
  const [classes, setClasses] = useState<ClassData[]>([
    { 
      id: "1", 
      name: "Algebra 1", 
      studentCount: 25, 
      level: "College", 
      grade: "1st Grade", 
      hoursPerWeek: 6, 
      school: "Al Akhawayn University",
      hourlyRate: 150,
      paymentType: 'hourly',
      contractStartDate: "2024-09-01",
      contractEndDate: "2025-06-30",
      totalSessions: 120,
      completedSessions: 45,
      subject: "Mathematics",
      classroom: "Room 101",
      schedule: "Monday, Wednesday, Friday 8:00-10:00",
      maxStudents: 30,
      description: "Introduction to algebraic concepts and problem-solving techniques"
    },
    { 
      id: "2", 
      name: "Geometry", 
      studentCount: 30, 
      level: "College", 
      grade: "2nd Grade", 
      hoursPerWeek: 6, 
      school: "Al Akhawayn University",
      hourlyRate: 160,
      paymentType: 'hourly',
      contractStartDate: "2024-09-01",
      contractEndDate: "2025-06-30",
      totalSessions: 120,
      completedSessions: 42,
      subject: "Mathematics",
      classroom: "Room 102",
      schedule: "Tuesday, Thursday 9:00-11:00",
      maxStudents: 35,
      description: "Study of geometric shapes, properties, and spatial relationships"
    },
    { 
      id: "3", 
      name: "Calculus", 
      studentCount: 20, 
      level: "College", 
      grade: "3rd Grade", 
      hoursPerWeek: 6, 
      school: "Al Akhawayn University",
      hourlyRate: 180,
      paymentType: 'hourly',
      contractStartDate: "2024-09-01",
      contractEndDate: "2025-06-30",
      totalSessions: 120,
      completedSessions: 38,
      subject: "Mathematics",
      classroom: "Room 103",
      schedule: "Monday, Wednesday 14:00-16:00",
      maxStudents: 25,
      description: "Advanced calculus concepts including derivatives and integrals"
    },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [newClass, setNewClass] = useState({
    name: "",
    level: "",
    grade: "",
    hoursPerWeek: 6,
    school: "Al Akhawayn University",
    hourlyRate: 150,
    paymentType: 'hourly' as 'hourly' | 'monthly' | 'per_class',
    contractStartDate: "",
    contractEndDate: "",
    totalSessions: 0,
    completedSessions: 0,
    subject: "Mathematics",
    classroom: "",
    schedule: "",
    maxStudents: 30,
    description: ""
  });
  const [editClass, setEditClass] = useState({
    name: "",
    level: "",
    grade: "",
    hoursPerWeek: 6,
    school: "Al Akhawayn University",
    hourlyRate: 150,
    paymentType: 'hourly' as 'hourly' | 'monthly' | 'per_class',
    contractStartDate: "",
    contractEndDate: "",
    totalSessions: 0,
    completedSessions: 0,
    subject: "Mathematics",
    classroom: "",
    schedule: "",
    maxStudents: 30,
    description: ""
  });

  // Calculate statistics
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, classItem) => sum + classItem.studentCount, 0);
  
  // Calculate average grade across all students
  const averageGrade = mockGrades.length > 0 
    ? Math.round(mockGrades.reduce((sum, grade) => sum + grade.score, 0) / mockGrades.length)
    : 0;
  
  // Calculate total teaching hours
  const totalHoursPerWeek = classes.reduce((sum, classItem) => sum + classItem.hoursPerWeek, 0);
  
  // Calculate attendance rate (mock data - in real app this would be calculated from attendance records)
  const averageAttendanceRate = 87; // Mock average attendance rate

  const handleAddClass = () => {
    if (newClass.name && newClass.level && newClass.grade) {
      const classToAdd: ClassData = {
        id: Date.now().toString(),
        name: newClass.name,
        studentCount: 0, // New class starts with 0 students
        level: newClass.level,
        grade: newClass.grade,
        hoursPerWeek: newClass.hoursPerWeek,
        school: newClass.school,
        hourlyRate: newClass.hourlyRate,
        paymentType: newClass.paymentType,
        contractStartDate: newClass.contractStartDate,
        contractEndDate: newClass.contractEndDate,
        totalSessions: newClass.totalSessions,
        completedSessions: 0,
        subject: newClass.subject,
        classroom: newClass.classroom,
        schedule: newClass.schedule,
        maxStudents: newClass.maxStudents,
        description: newClass.description
      };
      
      setClasses([...classes, classToAdd]);
      setNewClass({
        name: "",
        level: "",
        grade: "",
        hoursPerWeek: 6,
        school: "Al Akhawayn University",
        hourlyRate: 150,
        paymentType: 'hourly' as 'hourly' | 'monthly' | 'per_class',
        contractStartDate: "",
        contractEndDate: "",
        totalSessions: 0,
        completedSessions: 0,
        subject: "Mathematics",
        classroom: "",
        schedule: "",
        maxStudents: 30,
        description: ""
      });
      setShowAddModal(false);
    }
  };

  const handleCancelAdd = () => {
    setNewClass({
      name: "",
      level: "",
      grade: "",
      hoursPerWeek: 6,
      school: "Al Akhawayn University",
      hourlyRate: 150,
      paymentType: 'hourly' as 'hourly' | 'monthly' | 'per_class',
      contractStartDate: "",
      contractEndDate: "",
      totalSessions: 0,
      completedSessions: 0,
      subject: "Mathematics",
      classroom: "",
      schedule: "",
      maxStudents: 30,
      description: ""
    });
    setShowAddModal(false);
  };

  const handleRowClick = (classId: string) => {
    setLocation(`/classes/${classId}`);
  };

  const handleDeleteClass = (classId: string, className: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${className}"?\n\n` +
      `⚠️ WARNING: This will permanently delete:\n` +
      `• All students in this class\n` +
      `• All schedule entries for this class\n` +
      `• All grades and assignments\n` +
      `• All attendance records\n\n` +
      `This action cannot be undone.`
    );
    
    if (confirmed) {
      setClasses(classes.filter(cls => cls.id !== classId));
    }
  };

  const handleEditClass = (classId: string) => {
    const classToEdit = classes.find(cls => cls.id === classId);
    if (classToEdit) {
      setEditClass({
        name: classToEdit.name,
        level: classToEdit.level,
        grade: classToEdit.grade,
        hoursPerWeek: classToEdit.hoursPerWeek,
        school: classToEdit.school,
        hourlyRate: classToEdit.hourlyRate,
        paymentType: classToEdit.paymentType,
        contractStartDate: classToEdit.contractStartDate,
        contractEndDate: classToEdit.contractEndDate,
        totalSessions: classToEdit.totalSessions,
        completedSessions: classToEdit.completedSessions,
        subject: classToEdit.subject,
        classroom: classToEdit.classroom,
        schedule: classToEdit.schedule,
        maxStudents: classToEdit.maxStudents,
        description: classToEdit.description
      });
      setEditingClassId(classId);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingClassId && editClass.name && editClass.level && editClass.grade) {
      setClasses(classes.map(cls => 
        cls.id === editingClassId 
          ? { ...cls, ...editClass }
          : cls
      ));
      setShowEditModal(false);
      setEditingClassId(null);
      setEditClass({
        name: "",
        level: "",
        grade: "",
        hoursPerWeek: 6,
        school: "Al Akhawayn University",
        hourlyRate: 150,
        paymentType: 'hourly' as 'hourly' | 'monthly' | 'per_class',
        contractStartDate: "",
        contractEndDate: "",
        totalSessions: 0,
        completedSessions: 0,
        subject: "Mathematics",
        classroom: "",
        schedule: "",
        maxStudents: 30,
        description: ""
      });
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingClassId(null);
    setEditClass({
      name: "",
      level: "",
      grade: "",
      hoursPerWeek: 6,
      school: "Al Akhawayn University",
      hourlyRate: 150,
      paymentType: 'hourly' as 'hourly' | 'monthly' | 'per_class',
      contractStartDate: "",
      contractEndDate: "",
      totalSessions: 0,
      completedSessions: 0,
      subject: "Mathematics",
      classroom: "",
      schedule: "",
      maxStudents: 30,
      description: ""
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Classes Management</h1>
        <p className="text-gray-600">Overview of your classes and student performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Classes"
          value={totalClasses}
          icon={<BookOpen className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Average Grade"
          value={`${averageGrade}%`}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Teaching Hours/Week"
          value={totalHoursPerWeek}
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Your Classes</h2>
        <Button 
          className="bg-primary text-white hover:bg-blue-600"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Class Name
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Level
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Students
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Hours/Week
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
                {classes.map((classItem) => {
                  // Calculate class-specific stats
                  const classStudents = mockStudents.filter(student => student.classId === classItem.id);
                  const classGrades = mockGrades.filter(grade => 
                    classStudents.some(student => student.id === grade.studentId)
                  );
                  const classAverageGrade = classGrades.length > 0 
                    ? Math.round(classGrades.reduce((sum, grade) => sum + grade.score, 0) / classGrades.length)
                    : 0;
                  
                  return (
                    <TableRow 
                      key={classItem.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(classItem.id)}
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm">
                            {classItem.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{classItem.name}</div>
                            <div className="text-sm text-gray-500">Math Class</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {classItem.level}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 font-medium">{classItem.studentCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span className="text-gray-600">{classItem.hoursPerWeek} hours</span>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${classAverageGrade}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{classAverageGrade}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:text-blue-600 p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(classItem.id);
                            }}
                            title="View Details"
                          >
                            <BookOpen className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-600 hover:text-gray-800 p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClass(classItem.id);
                            }}
                            title="Edit Class"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClass(classItem.id, classItem.name);
                            }}
                            title="Delete Class"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Class Analytics & Performance</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Distribution Histogram */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Score Distribution (0-20 Scale)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Histogram Bar Chart */}
                <div className="relative">
                  {(() => {
                    // Extract scores from mockGrades
                    const scores = mockGrades.map(grade => grade.score);
                    
                    // Manually chunk grades into bins of 2 (0-2, 2-4, 4-6, ..., 18-20)
                    const bins = Array.from({ length: 10 }, (_, i) => ({
                      range: `${i * 2}-${(i + 1) * 2}`,
                      min: i * 2,
                      max: (i + 1) * 2,
                      count: 0
                    }));

                    // Count students in each bin
                    scores.forEach(score => {
                      const binIndex = Math.floor(score / 2);
                      if (binIndex >= 0 && binIndex < bins.length) {
                        bins[binIndex].count++;
                      }
                    });

                    // Create histogram data from processed bins
                    const histogramData = {
                      x: bins.map(bin => bin.range), // X-axis: bin ranges
                      y: bins.map(bin => bin.count), // Y-axis: student counts
                      type: 'bar' as const,
                      name: 'Student Count',
                      text: bins.map(bin => `${bin.count} students`), // Custom hover text
                      hoverinfo: 'text' as const, // Only show custom text on hover
                      textposition: 'none', // Don't show text on bars
                      marker: {
                        color: '#3B82F6',
                        line: {
                          color: '#1E40AF',
                          width: 1
                        }
                      }
                    };

                    const layout = {
                      title: {
                        text: 'Score Distribution',
                        font: { size: 16, color: '#374151' }
                      },
                      xaxis: {
                        title: { text: 'Score Range' },
                        type: 'category' as const,
                        showgrid: false,
                        zeroline: false
                      },
                      yaxis: {
                        title: { text: 'Number of Students' },
                        zeroline: false,
                        showgrid: false,
                        tickvals: [0, 5, 10, 15, 20],
                        ticktext: ['0', '5', '10', '15', '20']
                      },
                      showlegend: false,
                      margin: { l: 60, r: 30, t: 60, b: 60 },
                      height: 300,
                      plot_bgcolor: 'rgba(0,0,0,0)',
                      paper_bgcolor: 'rgba(0,0,0,0)',
                      font: { color: '#374151' },
                      modebar: {
                        bgcolor: 'rgba(0,0,0,0)',
                        color: '#3B82F6',
                        activecolor: '#1E40AF'
                      }
                    };

                    const config = {
                      displayModeBar: true,
                      displaylogo: false,
                      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'zoom2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines', 'zoomIn2d', 'zoomOut2d', 'reset+autorange', 'toImage'] as any,
                      modeBarButtonsToAdd: [{
                        name: 'Download Chart',
                        icon: {
                          'width': 500,
                          'height': 500,
                          'path': 'M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z'
                        },
                        click: function(gd) {
                          Plotly.downloadImage(gd, {
                            format: 'png',
                            filename: 'score-distribution',
                            height: 400,
                            width: 600
                          });
                        }
                      }] as any,
                      responsive: true
                    };

                    return (
                      <Plot
                        data={[histogramData]}
                        layout={layout}
                        config={config}
                        style={{ width: '100%', height: '400px' }}
                      />
                    );
                  })()}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Average Score</div>
                    <div className="text-lg font-bold text-gray-800">
                      {(() => {
                        const scores20 = mockGrades.map(g => g.score);
                        const avg = scores20.length > 0 
                          ? (scores20.reduce((sum, score) => sum + score, 0) / scores20.length).toFixed(1)
                          : '0.0';
                        return `${avg}/20`;
                      })()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Total Students</div>
                    <div className="text-lg font-bold text-gray-800">{mockGrades.length}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Highest Score</div>
                    <div className="text-lg font-bold text-green-600">
                      {Math.max(...mockGrades.map(g => g.score))}/20
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Lowest Score</div>
                    <div className="text-lg font-bold text-red-600">
                      {Math.min(...mockGrades.map(g => g.score))}/20
                    </div>
                  </div>
                </div>

                {/* Score Range Legend */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Score Ranges:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>0-4: Poor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>5-8: Below Average</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>9-12: Average</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>13-20: Good/Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Progress Overview */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <LineChart className="w-5 h-5 mr-2" />
                Class Progress & Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.map((classItem) => {
                  const progressPercentage = Math.round((classItem.completedSessions / classItem.totalSessions) * 100);
                  const remainingSessions = classItem.totalSessions - classItem.completedSessions;
                  
                  return (
                    <div key={classItem.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{classItem.name}</span>
                        <span className="text-sm font-bold text-gray-800">{progressPercentage}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">
                          {classItem.completedSessions}/{classItem.totalSessions}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Completed: {classItem.completedSessions} sessions</span>
                        <span>Remaining: {remainingSessions} sessions</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Student Distribution */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Student Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classes.map((classItem) => {
                  const percentage = Math.round((classItem.studentCount / totalStudents) * 100);
                  return (
                    <div key={classItem.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm text-gray-700">{classItem.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-800">{classItem.studentCount}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Students</span>
                    <span className="text-sm font-bold text-gray-800">{totalStudents}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Hours Distribution */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Teaching Hours Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classes.map((classItem) => {
                  const percentage = Math.round((classItem.hoursPerWeek / totalHoursPerWeek) * 100);
                  return (
                    <div key={classItem.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{classItem.name}</span>
                        <span className="text-sm font-medium text-gray-800">{classItem.hoursPerWeek}h/week</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Hours/Week</span>
                    <span className="text-sm font-bold text-gray-800">{totalHoursPerWeek}h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-1">{averageGrade}%</div>
                  <div className="text-sm text-gray-600">Overall Average Grade</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Best Performing Class:</span>
                    <span className="font-medium text-gray-800">
                      {(() => {
                        const classAverages = classes.map(classItem => {
                          const classStudents = mockStudents.filter(student => student.classId === classItem.id);
                          const classGrades = mockGrades.filter(grade => 
                            classStudents.some(student => student.id === grade.studentId)
                          );
                          return {
                            name: classItem.name,
                            average: classGrades.length > 0 
                              ? Math.round(classGrades.reduce((sum, grade) => sum + grade.score, 0) / classGrades.length)
                              : 0
                          };
                        });
                        const bestClass = classAverages.reduce((best, current) => 
                          current.average > best.average ? current : best
                        );
                        return bestClass.name;
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Most Progress:</span>
                    <span className="font-medium text-gray-800">
                      {(() => {
                        const classProgress = classes.map(classItem => ({
                          name: classItem.name,
                          progress: Math.round((classItem.completedSessions / classItem.totalSessions) * 100)
                        }));
                        const mostProgress = classProgress.reduce((best, current) => 
                          current.progress > best.progress ? current : best
                        );
                        return `${mostProgress.name} (${mostProgress.progress}%)`;
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Largest Class:</span>
                    <span className="font-medium text-gray-800">
                      {(() => {
                        const largestClass = classes.reduce((largest, current) => 
                          current.studentCount > largest.studentCount ? current : largest
                        );
                        return `${largestClass.name} (${largestClass.studentCount} students)`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add New Class</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="class-name">Class Name</Label>
                <Input
                  id="class-name"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="e.g., Algebra 1, Geometry"
                />
              </div>
              
              <div>
                <Label htmlFor="level">Level</Label>
                <Select value={newClass.level} onValueChange={(value) => setNewClass({ ...newClass, level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Lycee">Lycee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select value={newClass.grade} onValueChange={(value) => setNewClass({ ...newClass, grade: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Grade">1st Grade</SelectItem>
                    <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                    <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="hours">Hours per Week</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  max="20"
                  value={newClass.hoursPerWeek}
                  onChange={(e) => setNewClass({ ...newClass, hoursPerWeek: parseInt(e.target.value) || 6 })}
                />
              </div>
              
              <div>
                <Label htmlFor="school">School</Label>
                <Select value={newClass.school} onValueChange={(value) => setNewClass({ ...newClass, school: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Al Akhawayn University">Al Akhawayn University</SelectItem>
                    <SelectItem value="International School of Morocco">International School of Morocco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleAddClass} className="flex-1">
                Add Class
              </Button>
              <Button variant="outline" onClick={handleCancelAdd} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Edit Class</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-class-name">Class Name</Label>
                <Input
                  id="edit-class-name"
                  value={editClass.name}
                  onChange={(e) => setEditClass({ ...editClass, name: e.target.value })}
                  placeholder="e.g., Algebra 1, Geometry"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-level">Level</Label>
                <Select value={editClass.level} onValueChange={(value) => setEditClass({ ...editClass, level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Lycee">Lycee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-grade">Grade</Label>
                <Select value={editClass.grade} onValueChange={(value) => setEditClass({ ...editClass, grade: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Grade">1st Grade</SelectItem>
                    <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                    <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-hours">Hours per Week</Label>
                <Input
                  id="edit-hours"
                  type="number"
                  min="1"
                  max="20"
                  value={editClass.hoursPerWeek}
                  onChange={(e) => setEditClass({ ...editClass, hoursPerWeek: parseInt(e.target.value) || 6 })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-school">School</Label>
                <Select value={editClass.school} onValueChange={(value) => setEditClass({ ...editClass, school: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Al Akhawayn University">Al Akhawayn University</SelectItem>
                    <SelectItem value="International School of Morocco">International School of Morocco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
