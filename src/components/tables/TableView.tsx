import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Download, Upload, Search, X, Filter, Mic } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { fetchTableColumns } from '@/lib/api';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TableActions from './TableActions';
import CsvUpload from './CsvUpload';
import VoiceInputDialog from '@/components/ui/VoiceInputDialog';

type TableViewProps = {
  table: any;
};

const TableView = ({ table }: TableViewProps) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const tableName = table.name.toLowerCase();
        
        // Fetch columns first
        const columnsData = await fetchTableColumns(tableName);
        if (!columnsData) {
          setError('Failed to fetch table columns');
          return;
        }
        
        setColumns(columnsData);
        
        // Fetch table data
        let query = supabase.from(tableName).select('*');
        
        if (tableName.toLowerCase() === 'students' && table.center_id) {
          query = query.eq('center_id', table.center_id);
        } else if (table.center_id) {
          query = query.eq('center_id', table.center_id);
        }
        
        const { data: tableData, error: fetchError } = await query;
        
        if (fetchError) {
          console.error('Error fetching data:', fetchError);
          setError('Failed to fetch data');
          return;
        }
        
        setData(tableData || []);
        setFilteredData(tableData || []);
        
        // Initialize default form data
        const defaultFormData: Record<string, any> = {};
        columnsData.forEach(col => {
          defaultFormData[col] = '';
        });
        
        // Add center_id from table if available
        if (table.center_id) {
          defaultFormData.center_id = table.center_id;
        }
        
        setFormData(defaultFormData);
        
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [table]);

  // Filter data based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = data.filter(item => {
      return Object.entries(item).some(([key, value]) => {
        if (
          value !== null &&
          typeof value !== 'object' &&
          value.toString().toLowerCase().includes(searchTermLower)
        ) {
          return true;
        }
        return false;
      });
    });
    
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
    setIsEditing(true);
    
    // Copy row data to form
    const rowFormData: Record<string, any> = {};
    columns.forEach(col => {
      rowFormData[col] = row[col] !== null ? row[col] : '';
    });
    
    setFormData(rowFormData);
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tableName = table.name.toLowerCase();
      
      // Prepare data for update
      const updateData: Record<string, any> = {};
      columns.forEach(col => {
        // Special handling for days_of_week which is an array
        if (col === 'days_of_week') {
          if (formData[col] === '') {
            updateData[col] = null;
          } else if (typeof formData[col] === 'string') {
            // If it's a comma-separated string, convert to array
            if (formData[col].includes(',')) {
              updateData[col] = formData[col].split(',').map((day: string) => day.trim());
            } else {
              // If it's a single value, make it a single-item array
              updateData[col] = [formData[col].trim()];
            }
          } else {
            // If it's already an array or null, keep it as is
            updateData[col] = formData[col];
          }
        } else {
          updateData[col] = formData[col] !== null ? formData[col] : null;
        }
      });
      
      const { data: updatedData, error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', selectedRow.id)
        .select();
        
      if (updateError) {
        console.error('Error updating record:', updateError);
        toast.error('Failed to update record: ' + updateError.message);
        return;
      }
      
      toast.success('Record updated successfully');
      
      // Update local state
      setData(data.map(item => (item.id === selectedRow.id ? updatedData[0] : item)));
      setFilteredData(filteredData.map(item => (item.id === selectedRow.id ? updatedData[0] : item)));
      setShowForm(false);
      
    } catch (err) {
      console.error('Error in handleSave:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tableName = table.name.toLowerCase();
      
      // Prepare data for insert
      const insertData: Record<string, any> = {};
      columns.forEach(col => {
        // Special handling for days_of_week which is an array
        if (col === 'days_of_week') {
          if (formData[col] === '') {
            insertData[col] = null;
          } else if (typeof formData[col] === 'string') {
            // If it's a comma-separated string, convert to array
            if (formData[col].includes(',')) {
              insertData[col] = formData[col].split(',').map((day: string) => day.trim());
            } else {
              // If it's a single value, make it a single-item array
              insertData[col] = [formData[col].trim()];
            }
          } else {
            // If it's already an array or null, keep it as is
            insertData[col] = formData[col];
          }
        } else {
          insertData[col] = formData[col] !== null ? formData[col] : null;
        }
      });
      
      const { data: newRecord, error: insertError } = await supabase
        .from(tableName)
        .insert([insertData])
        .select();
        
      if (insertError) {
        console.error('Error adding record:', insertError);
        toast.error('Failed to insert record: ' + insertError.message);
        return;
      }
      
      toast.success('Record added successfully');
      
      // Update local state
      setData([...data, newRecord[0]]);
      setFilteredData([...filteredData, newRecord[0]]);
      setShowForm(false);
      
    } catch (err) {
      console.error('Error in handleAdd:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row: any) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        setLoading(true);
        setError(null);
        
        const tableName = table.name.toLowerCase();
        
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .eq('id', row.id);
          
        if (deleteError) {
          console.error('Error deleting record:', deleteError);
          toast.error('Failed to delete record');
          return;
        }
        
        toast.success('Record deleted successfully');
        
        // Update local state
        setData(data.filter(item => item.id !== row.id));
        setFilteredData(filteredData.filter(item => item.id !== row.id));
        
      } catch (err) {
        console.error('Error in handleDelete:', err);
        setError('Failed to delete record');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVoiceInputComplete = async (collectedData: Record<string, any>) => {
    try {
      setLoading(true);

      const tableName = table.name.toLowerCase();
      
      // Prepare data for insert
      const insertData = { ...collectedData };
      
      // Special handling for days_of_week
      if (insertData.days_of_week) {
        if (typeof insertData.days_of_week === 'string') {
          if (insertData.days_of_week.trim() === '') {
            insertData.days_of_week = null;
          } else if (insertData.days_of_week.includes(',')) {
            insertData.days_of_week = insertData.days_of_week.split(',').map((day: string) => day.trim());
          } else {
            insertData.days_of_week = [insertData.days_of_week.trim()];
          }
        }
      }
      
      // Add center_id from table if it's not in the collected data
      if (table.center_id && !insertData.center_id) {
        insertData.center_id = table.center_id;
      }
      
      const { data: newRecord, error: insertError } = await supabase
        .from(tableName)
        .insert([insertData])
        .select();
        
      if (insertError) {
        console.error('Error adding record via voice:', insertError);
        toast.error('Failed to insert record: ' + insertError.message);
        return;
      }
      
      toast.success('Record added successfully via voice input');
      
      // Update local state
      setData([...data, newRecord[0]]);
      setFilteredData([...filteredData, newRecord[0]]);
      
    } catch (err) {
      console.error('Error in handleVoiceInputComplete:', err);
      toast.error('An error occurred while adding record');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <TableActions
        tableName={table.name}
        onInsert={() => {
          setShowForm(true);
          setIsEditing(false);
          setSelectedRow(null);
          
          // Reset form with default values
          const defaultFormData: Record<string, any> = {};
          columns.forEach(col => {
            defaultFormData[col] = '';
          });
          
          // Add center_id from table if available
          if (table.center_id) {
            defaultFormData.center_id = table.center_id;
          }
          
          setFormData(defaultFormData);
        }}
        onUpload={() => setShowUpload(true)}
        onRefresh={() => window.location.reload()}
      />
      
      {/* Show Add Student with Voice button only on students table */}
      {table.name.toLowerCase() === 'students' && (
        <div className="mb-4">
          <Button 
            onClick={() => setShowVoiceInput(true)}
            className="bg-ishanya-green hover:bg-ishanya-green/90 text-white flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            Add Student with Voice
          </Button>
        </div>
      )}
      
      {showUpload && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Upload CSV</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CsvUpload
              tableName={table.name}
              onSuccess={() => {
                setShowUpload(false);
                window.location.reload();
              }}
              onClose={() => setShowUpload(false)}
            />
          </CardContent>
        </Card>
      )}
      
      {showForm && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>{isEditing ? 'Edit Record' : 'Add Record'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {columns.map((column) => (
                <div key={column}>
                  <Label htmlFor={column}>{column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                  <Input
                    id={column}
                    name={column}
                    value={formData[column] || ''}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              {isEditing ? (
                <Button onClick={handleSave}>Save</Button>
              ) : (
                <Button onClick={handleAdd}>Add</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-white rounded-md shadow mb-6 overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {table.display_name || table.name} ({filteredData.length})
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.slice(0, 6).map((column) => (
                  <TableHead key={column}>
                    {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.slice(0, 6).length + 1} className="h-24 text-center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow key={row.id || row.student_id || row.employee_id}>
                    {columns.slice(0, 6).map((column) => (
                      <TableCell key={column}>
                        {row[column] !== null && row[column] !== undefined
                          ? typeof row[column] === 'object'
                            ? JSON.stringify(row[column])
                            : String(row[column])
                          : '-'}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRowClick(row)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Voice Input Dialog */}
      {showVoiceInput && (
        <VoiceInputDialog
          isOpen={showVoiceInput}
          onClose={() => setShowVoiceInput(false)}
          table="students"
          onComplete={handleVoiceInputComplete}
        />
      )}
    </div>
  );
};

export default TableView;
