import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  BookOpen, Users, TrendingUp, Clock, GraduationCap, Edit, Save, X, 
  Calendar, MapPin, DollarSign, FileText, Target, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/StatCard";
import { mockStudents, mockGrades } from "@/data/mockData";

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

export default function ClassDetail() {
  const [location] = useLocation();
  const classId = location.split('/').pop(); // Get the class ID from URL
  
  const [isEditing, setIsEditing] = useState(false);
  const [classData, setClassData] = useState<ClassData | null>(null);
  
  // Mock class data - in real app this would come from API
  const mockClassData: ClassData = {
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
  };

  useEffect(() => {
    // In real app, fetch class data based on classId
    setClassData(mockClassData);
  }, [classId]);

  if (!classData) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading class information...</p>
        </div>
      </div>
    );
  }

  // Calculate class-specific statistics
  const classStudents = mockStudents.filter(student => student.classId === classData.id);
  const classGrades = mockGrades.filter(grade => 
    classStudents.some(student => student.id === grade.studentId)
  );
  const averageGrade = classGrades.length > 0 
    ? Math.round(classGrades.reduce((sum, grade) => sum + grade.score, 0) / classGrades.length)
    : 0;
  
  const attendanceRate = 87; // Mock attendance rate
  const totalEarnings = classData.completedSessions * 2 * classData.hourlyRate; // 2 hours per session
  const projectedEarnings = classData.totalSessions * 2 * classData.hourlyRate;
  const progressPercentage = Math.round((classData.completedSessions / classData.totalSessions) * 100);

  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to backend
    console.log("Saving class data:", classData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setClassData(mockClassData);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{classData.name}</h1>
          <p className="text-gray-600">{classData.subject} • {classData.level} • {classData.grade}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isEditing ? "Cancel" : "Edit Class"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Class Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Students"
          value={classData.studentCount}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Average Grade"
          value={`${averageGrade}%`}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={<CheckCircle className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Total Earnings"
          value={`${totalEarnings.toLocaleString()} MAD`}
          icon={<DollarSign className="w-6 h-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Class Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Class Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="class-name">Class Name</Label>
              {isEditing ? (
                <Input
                  id="class-name"
                  value={classData.name}
                  onChange={(e) => setClassData({ ...classData, name: e.target.value })}
                />
              ) : (
                <p className="text-gray-600 font-medium">{classData.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level">Level</Label>
                {isEditing ? (
                  <Select value={classData.level} onValueChange={(value) => setClassData({ ...classData, level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Lycee">Lycee</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-600">{classData.level}</p>
                )}
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                {isEditing ? (
                  <Select value={classData.grade} onValueChange={(value) => setClassData({ ...classData, grade: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Grade">1st Grade</SelectItem>
                      <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                      <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-600">{classData.grade}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              {isEditing ? (
                <Input
                  id="subject"
                  value={classData.subject}
                  onChange={(e) => setClassData({ ...classData, subject: e.target.value })}
                />
              ) : (
                <p className="text-gray-600">{classData.subject}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={classData.description}
                  onChange={(e) => setClassData({ ...classData, description: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-gray-600">{classData.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Location */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="classroom">Classroom</Label>
              {isEditing ? (
                <Input
                  id="classroom"
                  value={classData.classroom}
                  onChange={(e) => setClassData({ ...classData, classroom: e.target.value })}
                />
              ) : (
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {classData.classroom}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="schedule">Schedule</Label>
              {isEditing ? (
                <Input
                  id="schedule"
                  value={classData.schedule}
                  onChange={(e) => setClassData({ ...classData, schedule: e.target.value })}
                  placeholder="e.g., Monday, Wednesday, Friday 8:00-10:00"
                />
              ) : (
                <p className="text-gray-600">{classData.schedule}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hours-per-week">Hours per Week</Label>
                {isEditing ? (
                  <Input
                    id="hours-per-week"
                    type="number"
                    value={classData.hoursPerWeek}
                    onChange={(e) => setClassData({ ...classData, hoursPerWeek: parseInt(e.target.value) || 0 })}
                  />
                ) : (
                  <p className="text-gray-600">{classData.hoursPerWeek} hours</p>
                )}
              </div>
              <div>
                <Label htmlFor="max-students">Max Students</Label>
                {isEditing ? (
                  <Input
                    id="max-students"
                    type="number"
                    value={classData.maxStudents}
                    onChange={(e) => setClassData({ ...classData, maxStudents: parseInt(e.target.value) || 0 })}
                  />
                ) : (
                  <p className="text-gray-600">{classData.maxStudents} students</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="school">School</Label>
              {isEditing ? (
                <Select value={classData.school} onValueChange={(value) => setClassData({ ...classData, school: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Al Akhawayn University">Al Akhawayn University</SelectItem>
                    <SelectItem value="International School of Morocco">International School of Morocco</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-600">{classData.school}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Information */}
      <Card className="shadow-sm border border-gray-200 mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label htmlFor="hourly-rate">Hourly Rate (MAD)</Label>
              {isEditing ? (
                <Input
                  id="hourly-rate"
                  type="number"
                  value={classData.hourlyRate}
                  onChange={(e) => setClassData({ ...classData, hourlyRate: parseInt(e.target.value) || 0 })}
                />
              ) : (
                <p className="text-gray-600 font-medium">{classData.hourlyRate} MAD/hour</p>
              )}
            </div>

            <div>
              <Label htmlFor="payment-type">Payment Type</Label>
              {isEditing ? (
                <Select value={classData.paymentType} onValueChange={(value: 'hourly' | 'monthly' | 'per_class') => setClassData({ ...classData, paymentType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="per_class">Per Class</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-600 capitalize">{classData.paymentType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contract-start">Contract Start</Label>
              {isEditing ? (
                <Input
                  id="contract-start"
                  type="date"
                  value={classData.contractStartDate}
                  onChange={(e) => setClassData({ ...classData, contractStartDate: e.target.value })}
                />
              ) : (
                <p className="text-gray-600">{new Date(classData.contractStartDate).toLocaleDateString()}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contract-end">Contract End</Label>
              {isEditing ? (
                <Input
                  id="contract-end"
                  type="date"
                  value={classData.contractEndDate}
                  onChange={(e) => setClassData({ ...classData, contractEndDate: e.target.value })}
                />
              ) : (
                <p className="text-gray-600">{new Date(classData.contractEndDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Progress and Earnings */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Session Progress</span>
                <span className="text-sm text-blue-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-1">
                {classData.completedSessions} of {classData.totalSessions} sessions completed
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Total Earnings</span>
                <span className="text-sm text-green-600 font-medium">{totalEarnings.toLocaleString()} MAD</span>
              </div>
              <p className="text-xs text-green-600">
                Based on {classData.completedSessions} completed sessions
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">Projected Earnings</span>
                <span className="text-sm text-purple-600 font-medium">{projectedEarnings.toLocaleString()} MAD</span>
              </div>
              <p className="text-xs text-purple-600">
                Based on {classData.totalSessions} total sessions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 