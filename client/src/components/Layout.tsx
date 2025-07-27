import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, Home, Users, BookOpen, Calendar, ClipboardList, BarChart3, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Classes", href: "/classes", icon: BookOpen },
  { name: "Students", href: "/students", icon: Users },
  { name: "Attendance", href: "/attendance", icon: Calendar },
  { name: "Assignments", href: "/assignments", icon: ClipboardList },
  { name: "Grades", href: "/grades", icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full z-20">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">MathPro</span>
          </div>
          
          {/* User Profile */}
          <div className="mb-6">
            <Link href="/profile">
              <a className="flex items-center space-x-3 mb-2 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-white font-medium text-sm">
                    AB
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">Mr. Anas Bellaouali</p>
                  <p className="text-sm text-gray-600">Math Teacher</p>
                </div>
              </a>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/settings">
              <a className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
