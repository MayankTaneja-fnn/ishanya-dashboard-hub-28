
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchTableColumns } from '@/lib/api';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Edit,
  Trash2,
  Plus,
  Search,
  X,
  AlertCircle,
  Mic,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
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
  const [showVoiceInputDialog, setShowVoiceInputDialog] = useState(false);

  // Fetch table data and columns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const tableName = table.name.toLowerCase();

        const columnsData = await fetchTableColumns(tableName);
        if (!columnsData) {
          setError('Failed to fetch table columns');
          return;
        }

        setColumns(columnsData);

        let query = supabase.from(tableName).select('*');
        if (table.center_id) {
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

        const defaultFormData: Record<string, any> = {};
        columnsData.forEach(col => {
          defaultFormData[col] = '';
        });

        if (table.center_id) {
          defaultFormData.center_id = table.center_id;
        }

        setFormData(defaultFormData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table]);

  // Filter data based on search input
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTermLower)
      )
    );

    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Handle row selection for editing
  const handleRowClick = (row: any) => {
    setSelectedRow(row);
    setIsEditing(true);

    const rowFormData: Record<string, any> = {};
    columns.forEach(col => {
      rowFormData[col] = row[col] || '';
    });

    setFormData(rowFormData);
    setShowForm(true);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save record update
  const handleSave = async () => {
    if (!selectedRow) return;

    try {
      setLoading(true);
      setError(null);

      const tableName = table.name.toLowerCase();
      const { data: updatedData, error } = await supabase
        .from(tableName)
        .update(formData)
        .eq('id', selectedRow.id)
        .select();

      if (error) {
        console.error('Update error:', error);
        toast.error('Failed to update record');
        return;
      }

      toast.success('Record updated successfully');
      setData(prev => prev.map(item => (item.id === selectedRow.id ? updatedData[0] : item)));
      setFilteredData(prev => prev.map(item => (item.id === selectedRow.id ? updatedData[0] : item)));
      setShowForm(false);
    } catch (err) {
      console.error('Error updating record:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add new record
  const handleAdd = async () => {
    try {
      setLoading(true);
      setError(null);

      const tableName = table.name.toLowerCase();
      const { data: newRecord, error } = await supabase
        .from(tableName)
        .insert([formData])
        .select();

      if (error) {
        console.error('Insert error:', error);
        toast.error('Failed to add record');
        return;
      }

      toast.success('Record added successfully');
      setData(prev => [...prev, newRecord[0]]);
      setFilteredData(prev => [...prev, newRecord[0]]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding record:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle voice input completion
  const handleVoiceInputComplete = async (data: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      
      const tableName = table.name.toLowerCase();
      const { data: newRecord, error } = await supabase
        .from(tableName)
        .insert([{
          ...data,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Insert error:', error);
        toast.error(`Failed to add record via voice: ${error.message}`);
        return;
      }

      toast.success(`${tableName} created successfully via voice input`);
      setData(prev => [...prev, newRecord[0]]);
      setFilteredData(prev => [...prev, newRecord[0]]);
      setShowVoiceInputDialog(false);
    } catch (err) {
      console.error(`Error creating ${table.name}:`, err);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding with voice
  const handleAddWithVoice = () => {
    setShowVoiceInputDialog(true);
  };

  return (
    <div>
      <TableActions
        tableName={table.name}
        onInsert={() => {
          setShowForm(true);
          setIsEditing(false);
          setFormData(Object.fromEntries(columns.map(col => [col, ''])));
        }}
        onRefresh={() => window.location.reload()}
      />

      {/* Voice Add Button for Students Table */}
      {table.name.toLowerCase() === 'students' && (
        <div className="mb-4">
          <Button 
            onClick={handleAddWithVoice} 
            variant="outline"
            className="border-ishanya-green text-ishanya-green hover:bg-ishanya-green/10"
          >
            <Mic className="mr-2 h-4 w-4" />
            Add Student with Voice
          </Button>
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Record' : 'Add Record'}</CardTitle>
          </CardHeader>
          <CardContent>
            {columns.map(column => (
              <div key={column}>
                <Label htmlFor={column}>{column}</Label>
                <Input id={column} name={column} value={formData[column]} onChange={handleInputChange} />
              </div>
            ))}
            <Button onClick={isEditing ? handleSave : handleAdd} className="mt-4">
              {isEditing ? 'Save' : 'Add'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column}>{column}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(row => (
              <TableRow key={row.id}>
                {columns.map(column => <TableCell key={column}>{row[column]}</TableCell>)}
                <TableCell>
                  <Button variant="ghost" onClick={() => handleRowClick(row)}><Edit /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Voice Input Dialog */}
      {showVoiceInputDialog && (
        <VoiceInputDialog 
          isOpen={showVoiceInputDialog}
          onClose={() => setShowVoiceInputDialog(false)}
          table={table.name.toLowerCase()}
          onComplete={handleVoiceInputComplete}
        />
      )}
    </div>
  );
};

export default TableView;
