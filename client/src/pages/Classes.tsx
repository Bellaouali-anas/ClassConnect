import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockClasses } from "@/data/mockData";

export default function Classes() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Classes</h1>
        <Button className="bg-primary text-white hover:bg-blue-600">
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
                    Students
                  </TableHead>
                  <TableHead className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClasses.map((classItem) => (
                  <TableRow key={classItem.id} className="hover:bg-gray-50">
                    <TableCell className="py-4 px-6">
                      <div className="font-medium text-gray-800">{classItem.name}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="text-gray-600">{classItem.studentCount}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Button variant="ghost" className="text-primary hover:text-blue-600 text-sm font-medium p-0">
                        View Students
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
