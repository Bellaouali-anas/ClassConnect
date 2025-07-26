import { useState } from "react";
import { Calendar, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClasses } from "@/data/mockData";

export default function Assignments() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const handleClassToggle = (className: string) => {
    setSelectedClasses(prev => 
      prev.includes(className) 
        ? prev.filter(c => c !== className)
        : [...prev, className]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, dueDate, selectedClasses });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">New Assignment</h1>
      </div>

      <div className="max-w-4xl">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter assignment title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3"
                />
              </div>

              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Enter assignment description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </Label>
                <div className="relative">
                  <Input
                    id="dueDate"
                    type="text"
                    placeholder="Select due date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 pr-12"
                  />
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach File
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Paperclip className="text-gray-400 text-2xl mb-2 mx-auto w-8 h-8" />
                  <p className="text-gray-600">Upload file</p>
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  Assign to Class(es)
                </Label>
                <div className="space-y-2">
                  {mockClasses.map((classItem) => (
                    <div key={classItem.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={classItem.id}
                        checked={selectedClasses.includes(classItem.name)}
                        onCheckedChange={() => handleClassToggle(classItem.name)}
                      />
                      <Label htmlFor={classItem.id} className="text-gray-700">
                        {classItem.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  Email Preview
                </Label>
                <div className="bg-gradient-to-r from-orange-200 to-orange-300 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">New Assignment: {title || "Algebra 1"}</h3>
                  <p className="text-orange-50 leading-relaxed">
                    Dear Students and Parents, Please find the new assignment for {selectedClasses.join(", ") || "Algebra 1"} attached. 
                    The due date is {dueDate || "March 15th"}. Please submit your work on time. Best regards, Mr. Harrison
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-primary text-white px-8 py-3 hover:bg-blue-600 font-medium">
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
