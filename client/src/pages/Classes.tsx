import React, { useState } from "react";
import {
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  GraduationCap,
  X,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatCard from "@/components/StatCard";
import { mockStudents, mockGrades } from "@/data/mockData";
import { useLocation } from "wouter";
import Plot from "react-plotly.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface ClassData {
  id: string;
  name: string;
  student_count: number;
  created_at?: string;
}

interface CreateClassData {
  name: string;
  student_count?: number;
}

interface UpdateClassData {
  name?: string;
  student_count?: number;
}

export default function Classes() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [newClass, setNewClass] = useState({
    name: "",
    student_count: 0,
  });
  const [editClass, setEditClass] = useState({
    name: "",
    student_count: 0,
  });

  // Fetch classes from Supabase
  const {
    data: classes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as ClassData[];
    },
  });

  // Create class mutation
  const createClassMutation = useMutation({
    mutationFn: async (classData: CreateClassData) => {
      const { data, error } = await supabase
        .from("classes")
        .insert(classData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast({
        title: "Success",
        description: "Class created successfully",
      });
      setShowAddModal(false);
      setNewClass({ name: "", student_count: 0 });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create class",
        variant: "destructive",
      });
    },
  });

  // Update class mutation
  const updateClassMutation = useMutation({
    mutationFn: async ({
      id,
      classData,
    }: {
      id: string;
      classData: UpdateClassData;
    }) => {
      const { data, error } = await supabase
        .from("classes")
        .update(classData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast({
        title: "Success",
        description: "Class updated successfully",
      });
      setShowEditModal(false);
      setEditingClassId(null);
      setEditClass({ name: "", student_count: 0 });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive",
      });
    },
  });

  // Delete class mutation
  const deleteClassMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("classes").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
    },
  });

  // Calculate statistics
  const totalClasses = classes.length;
  const totalStudents = classes.reduce(
    (sum, classItem) => sum + classItem.student_count,
    0
  );

  // Calculate average grade across all students
  const averageGrade =
    mockGrades.length > 0
      ? Math.round(
          mockGrades.reduce((sum, grade) => sum + grade.score, 0) /
            mockGrades.length
        )
      : 0;

  // Calculate total teaching hours (mock data for now)
  const totalHoursPerWeek = classes.length * 6; // Assuming 6 hours per class per week

  // Calculate attendance rate (mock data - in real app this would be calculated from attendance records)
  const averageAttendanceRate = 87; // Mock average attendance rate

  const handleAddClass = () => {
    if (newClass.name) {
      createClassMutation.mutate(newClass);
    }
  };

  const handleCancelAdd = () => {
    setNewClass({ name: "", student_count: 0 });
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
      deleteClassMutation.mutate(classId);
    }
  };

  const handleEditClass = (classId: string) => {
    const classToEdit = classes.find((cls) => cls.id === classId);
    if (classToEdit) {
      setEditClass({
        name: classToEdit.name,
        student_count: classToEdit.student_count,
      });
      setEditingClassId(classId);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingClassId && editClass.name) {
      updateClassMutation.mutate({
        id: editingClassId,
        classData: editClass,
      });
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingClassId(null);
    setEditClass({ name: "", student_count: 0 });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading classes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <BookOpen className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Error Loading Classes
            </h3>
            <p className="text-gray-600 mb-4">
              Failed to load classes from the database.
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Classes Management
        </h1>
        <p className="text-gray-600">
          Overview of your classes and student performance
        </p>
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
          disabled={createClassMutation.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          {createClassMutation.isPending ? "Adding..." : "Add Class"}
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
                    Students
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Created
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
                  const classStudents = mockStudents.filter(
                    (student) => student.classId === classItem.id
                  );
                  const classGrades = mockGrades.filter((grade) =>
                    classStudents.some(
                      (student) => student.id === grade.studentId
                    )
                  );
                  const classAverageGrade =
                    classGrades.length > 0
                      ? Math.round(
                          classGrades.reduce(
                            (sum, grade) => sum + grade.score,
                            0
                          ) / classGrades.length
                        )
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
                            <div className="font-medium text-gray-800">
                              {classItem.name}
                            </div>
                            <div className="text-sm text-gray-500">Class</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 font-medium">
                            {classItem.student_count}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span className="text-gray-600">
                          {classItem.created_at
                            ? new Date(
                                classItem.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${classAverageGrade}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {classAverageGrade}%
                          </span>
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
                            disabled={updateClassMutation.isPending}
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
                            disabled={deleteClassMutation.isPending}
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Class Analytics & Performance
        </h2>

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
                    const scores = mockGrades.map((grade) => grade.score);

                    // Manually chunk grades into bins of 2 (0-2, 2-4, 4-6, ..., 18-20)
                    const bins = Array.from({ length: 10 }, (_, i) => ({
                      range: `${i * 2}-${(i + 1) * 2}`,
                      min: i * 2,
                      max: (i + 1) * 2,
                      count: 0,
                    }));

                    // Count students in each bin
                    scores.forEach((score) => {
                      const binIndex = Math.floor(score / 2);
                      if (binIndex >= 0 && binIndex < bins.length) {
                        bins[binIndex].count++;
                      }
                    });

                    // Create histogram data from processed bins
                    const histogramData = {
                      x: bins.map((bin) => bin.range), // X-axis: bin ranges
                      y: bins.map((bin) => bin.count), // Y-axis: student counts
                      type: "bar" as const,
                      name: "Student Count",
                      text: bins.map((bin) => `${bin.count} students`), // Custom hover text
                      hoverinfo: "text" as const, // Only show custom text on hover
                      textposition: "none" as const, // Don't show text on bars
                      marker: {
                        color: "#3B82F6",
                        line: {
                          color: "#1E40AF",
                          width: 1,
                        },
                      },
                    };

                    const layout = {
                      title: {
                        text: "Score Distribution",
                        font: { size: 16, color: "#374151" },
                      },
                      xaxis: {
                        title: { text: "Score Range" },
                        type: "category" as const,
                        showgrid: false,
                        zeroline: false,
                      },
                      yaxis: {
                        title: { text: "Number of Students" },
                        zeroline: false,
                        showgrid: false,
                        tickvals: [0, 5, 10, 15, 20],
                        ticktext: ["0", "5", "10", "15", "20"],
                      },
                      showlegend: false,
                      margin: { l: 60, r: 30, t: 60, b: 60 },
                      height: 300,
                      plot_bgcolor: "rgba(0,0,0,0)",
                      paper_bgcolor: "rgba(0,0,0,0)",
                      font: { color: "#374151" },
                      modebar: {
                        bgcolor: "rgba(0,0,0,0)",
                        color: "#3B82F6",
                        activecolor: "#1E40AF",
                      },
                    };

                    const config = {
                      displayModeBar: true,
                      displaylogo: false,
                      modeBarButtonsToRemove: [
                        "pan2d",
                        "lasso2d",
                        "select2d",
                        "zoom2d",
                        "autoScale2d",
                        "resetScale2d",
                        "hoverClosestCartesian",
                        "hoverCompareCartesian",
                        "toggleSpikelines",
                        "zoomIn2d",
                        "zoomOut2d",
                        "reset+autorange",
                        "toImage",
                      ] as any,
                      modeBarButtonsToAdd: [
                        {
                          name: "Download Chart",
                          icon: {
                            width: 500,
                            height: 500,
                            path: "M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z",
                          },
                          click: function (gd: any) {
                            (window as any).Plotly.downloadImage(gd, {
                              format: "png",
                              filename: "score-distribution",
                              height: 400,
                              width: 600,
                            });
                          },
                        },
                      ] as any,
                      responsive: true,
                    };

                    return (
                      <Plot
                        data={[histogramData]}
                        layout={layout}
                        config={config}
                        style={{ width: "100%", height: "400px" }}
                      />
                    );
                  })()}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Average Score
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {(() => {
                        const scores20 = mockGrades.map((g) => g.score);
                        const avg =
                          scores20.length > 0
                            ? (
                                scores20.reduce(
                                  (sum, score) => sum + score,
                                  0
                                ) / scores20.length
                              ).toFixed(1)
                            : "0.0";
                        return `${avg}/20`;
                      })()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Total Students
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {mockGrades.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Highest Score
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {Math.max(...mockGrades.map((g) => g.score))}/20
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Lowest Score
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      {Math.min(...mockGrades.map((g) => g.score))}/20
                    </div>
                  </div>
                </div>

                {/* Score Range Legend */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Score Ranges:
                  </div>
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
                Class Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.map((classItem) => {
                  const percentage =
                    totalStudents > 0
                      ? Math.round(
                          (classItem.student_count / totalStudents) * 100
                        )
                      : 0;

                  return (
                    <div key={classItem.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {classItem.name}
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          {classItem.student_count} students
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">
                          {percentage}%
                        </span>
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
                  const percentage =
                    totalStudents > 0
                      ? Math.round(
                          (classItem.student_count / totalStudents) * 100
                        )
                      : 0;
                  return (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm text-gray-700">
                          {classItem.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-800">
                          {classItem.student_count}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Total Students
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {totalStudents}
                    </span>
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
                  const percentage = Math.round((1 / classes.length) * 100); // Equal distribution for now
                  return (
                    <div key={classItem.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          {classItem.name}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          6h/week
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Total Hours/Week
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {totalHoursPerWeek}h
                    </span>
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
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {averageGrade}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Overall Average Grade
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Best Performing Class:
                    </span>
                    <span className="font-medium text-gray-800">
                      {(() => {
                        const classAverages = classes.map((classItem) => {
                          const classStudents = mockStudents.filter(
                            (student) => student.classId === classItem.id
                          );
                          const classGrades = mockGrades.filter((grade) =>
                            classStudents.some(
                              (student) => student.id === grade.studentId
                            )
                          );
                          return {
                            name: classItem.name,
                            average:
                              classGrades.length > 0
                                ? Math.round(
                                    classGrades.reduce(
                                      (sum, grade) => sum + grade.score,
                                      0
                                    ) / classGrades.length
                                  )
                                : 0,
                          };
                        });
                        const bestClass = classAverages.reduce(
                          (best, current) =>
                            current.average > best.average ? current : best
                        );
                        return bestClass.name;
                      })()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Largest Class:</span>
                    <span className="font-medium text-gray-800">
                      {(() => {
                        const largestClass = classes.reduce(
                          (largest, current) =>
                            current.student_count > largest.student_count
                              ? current
                              : largest
                        );
                        return `${largestClass.name} (${largestClass.student_count} students)`;
                      })()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Classes:</span>
                    <span className="font-medium text-gray-800">
                      {totalClasses}
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
              <h3 className="text-lg font-semibold text-gray-800">
                Add New Class
              </h3>
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
                  onChange={(e) =>
                    setNewClass({ ...newClass, name: e.target.value })
                  }
                  placeholder="e.g., Algebra 1, Geometry"
                />
              </div>

              <div>
                <Label htmlFor="student-count">Initial Student Count</Label>
                <Input
                  id="student-count"
                  type="number"
                  min="0"
                  value={newClass.student_count}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      student_count: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={handleAddClass}
                className="flex-1"
                disabled={createClassMutation.isPending}
              >
                {createClassMutation.isPending ? "Adding..." : "Add Class"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelAdd}
                className="flex-1"
              >
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
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Class
              </h3>
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
                  onChange={(e) =>
                    setEditClass({ ...editClass, name: e.target.value })
                  }
                  placeholder="e.g., Algebra 1, Geometry"
                />
              </div>

              <div>
                <Label htmlFor="edit-student-count">Student Count</Label>
                <Input
                  id="edit-student-count"
                  type="number"
                  min="0"
                  value={editClass.student_count}
                  onChange={(e) =>
                    setEditClass({
                      ...editClass,
                      student_count: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={handleSaveEdit}
                className="flex-1"
                disabled={updateClassMutation.isPending}
              >
                {updateClassMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
