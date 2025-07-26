import { Users, UserX, ClipboardList, Calculator, BookOpen, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStats } from "@/data/mockData";

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Math Teacher</h1>
        <p className="text-gray-600">Your math classroom overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={mockStats.totalStudents}
          icon={<Users className="w-6 h-6 text-primary" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Active Classes"
          value="4"
          icon={<BookOpen className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Pending Homework"
          value={mockStats.pendingAssignments}
          icon={<ClipboardList className="w-6 h-6 text-yellow-500" />}
          iconBgColor="bg-yellow-100"
        />
        <StatCard
          title="Class Average"
          value="87%"
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Today's Math Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Algebra I - Period 1</h4>
                  <p className="text-sm text-gray-600">8:00 AM - 9:15 AM</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-800">24 students</span>
                  <p className="text-xs text-gray-500">Chapter 5: Linear Functions</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Geometry - Period 2</h4>
                  <p className="text-sm text-gray-600">9:20 AM - 10:35 AM</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-800">22 students</span>
                  <p className="text-xs text-gray-500">Quiz: Pythagorean Theorem</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Pre-Calculus - Period 3</h4>
                  <p className="text-sm text-gray-600">10:40 AM - 11:55 AM</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-800">18 students</span>
                  <p className="text-xs text-gray-500">Trigonometric Identities</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Math Performance Chart */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Math Performance by Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Algebra I</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-800">87%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Geometry</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-800">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pre-Calculus</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-800">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Calculus</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-800">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
