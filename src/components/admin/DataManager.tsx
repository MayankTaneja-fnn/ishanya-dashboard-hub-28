
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle, Users, Database, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BatchUploader from './BatchUploader';
import StudentForm from './StudentForm';
import EducatorForm from './EducatorForm';
import EmployeeForm from './EmployeeForm';

const DataManager = () => {
  const [activeTab, setActiveTab] = useState('upload');
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Database className="h-5 w-5 text-ishanya-green" />
          Data Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <TabsTrigger value="upload" className="data-[state=active]:bg-ishanya-green data-[state=active]:text-white">
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Batch Upload
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-ishanya-green data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Add Student
            </TabsTrigger>
            <TabsTrigger value="educators" className="data-[state=active]:bg-ishanya-green data-[state=active]:text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Educator
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-ishanya-green data-[state=active]:text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Employee
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <BatchUploader />
          </TabsContent>
          
          <TabsContent value="students">
            <StudentForm />
          </TabsContent>
          
          <TabsContent value="educators">
            <EducatorForm />
          </TabsContent>
          
          <TabsContent value="employees">
            <EmployeeForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataManager;
