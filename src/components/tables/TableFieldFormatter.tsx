
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { format, isValid, parse } from 'date-fns';
import { MultiSelect } from './MultiSelect';

export const capitalizeFirstLetter = (string: string) => {
  if (!string) return '';
  return string.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

interface TableFieldFormatterProps {
  fieldName: string;
  value: any;
  onChange: (value: any) => void;
  isEditing: boolean;
  isRequired?: boolean;
}

export const TableFieldFormatter: React.FC<TableFieldFormatterProps> = ({
  fieldName,
  value,
  onChange,
  isEditing,
  isRequired = false
}) => {
  // Helper function to handle array fields
  const formatArrayField = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(v => v?.toString() || '');
    if (typeof value === 'string') {
      if (value.trim() === '') return [];
      // Try to parse as JSON if it starts with [ and ends with ]
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          return JSON.parse(value);
        } catch (e) {
          console.error(`Error parsing JSON array for ${fieldName}:`, e);
        }
      }
      // If it's a comma-separated list
      return value.split(',').map(item => item.trim());
    }
    return [];
  };

  // Format array field values back to string for display
  const formatArrayForDisplay = (value: any): string => {
    if (!value) return '';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  // Determine if field is date type
  const isDateField = fieldName.includes('date') || fieldName === 'dob';
  
  // Determine if field is a multi-select or array field
  const isArrayField = fieldName === 'days_of_week' || fieldName.includes('array');

  // Determine if field is boolean
  const isBooleanField = typeof value === 'boolean' || fieldName.includes('is_') || fieldName === 'attendance';
  
  // Determine if field is a select list
  const isSelectField = 
    fieldName === 'gender' || 
    fieldName === 'blood_group' || 
    fieldName === 'status' || 
    fieldName === 'priority' || 
    fieldName === 'session_type' ||
    fieldName === 'employment_type' || 
    fieldName === 'transport';
  
  // Options for select fields
  const getSelectOptions = (field: string) => {
    switch (field) {
      case 'gender':
        return ['Male', 'Female', 'Other'];
      case 'blood_group':
        return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
      case 'status':
        return ['Active', 'Inactive', 'On Leave', 'Graduated', 'Transferred'];
      case 'priority':
        return ['High', 'Medium', 'Low'];
      case 'session_type':
        return ['Individual', 'Group', 'Online', 'Hybrid'];
      case 'employment_type':
        return ['Full-time', 'Part-time', 'Contract', 'Intern', 'Volunteer'];
      case 'transport':
        return ['School Bus', 'Parent Drop', 'Public Transport', 'Self', 'Not Required'];
      default:
        return [];
    }
  };

  // For password fields
  const isPasswordField = fieldName === 'password';

  // For text area fields
  const isTextAreaField = 
    fieldName === 'address' || 
    fieldName === 'comments' || 
    fieldName === 'description' || 
    fieldName === 'strengths' || 
    fieldName === 'weakness' || 
    fieldName === 'primary_diagnosis' || 
    fieldName === 'comorbidity' || 
    fieldName === 'allergies';

  if (isEditing) {
    // Date picker for date fields
    if (isDateField) {
      let dateValue = null;
      if (value) {
        try {
          // Try to parse the date
          const parsedDate = new Date(value);
          if (isValid(parsedDate)) {
            dateValue = parsedDate;
          }
        } catch (e) {
          console.error(`Error parsing date for ${fieldName}:`, e);
        }
      }
      
      return (
        <DatePicker
          date={dateValue}
          onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
          className="w-full"
          required={isRequired}
        />
      );
    }
    
    // Array / multi-select field
    if (isArrayField) {
      const arrayValues = formatArrayField(value);
      
      // For days of week, use a specific component
      if (fieldName === 'days_of_week') {
        const daysOptions = [
          { value: '1', label: 'Monday' },
          { value: '2', label: 'Tuesday' },
          { value: '3', label: 'Wednesday' },
          { value: '4', label: 'Thursday' },
          { value: '5', label: 'Friday' },
          { value: '6', label: 'Saturday' },
          { value: '7', label: 'Sunday' },
        ];
        
        return (
          <MultiSelect
            options={daysOptions}
            selected={arrayValues}
            onChange={(selected) => {
              onChange(selected.length > 0 ? selected : null);
            }}
            placeholder="Select days"
          />
        );
      }
      
      // For general array fields, use a comma-separated input
      return (
        <Input
          value={formatArrayForDisplay(value)}
          onChange={(e) => {
            // Store as comma-separated string for now
            onChange(e.target.value);
          }}
          placeholder="Enter comma-separated values"
          required={isRequired}
        />
      );
    }
    
    // Boolean field
    if (isBooleanField) {
      return (
        <Select
          value={value === true ? 'true' : value === false ? 'false' : ''}
          onValueChange={(val) => onChange(val === 'true' ? true : val === 'false' ? false : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    // Select field
    if (isSelectField) {
      const options = getSelectOptions(fieldName);
      
      return (
        <Select
          value={value || ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${capitalizeFirstLetter(fieldName)}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Password field
    if (isPasswordField) {
      return (
        <Input
          type="password"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter password"
          required={isRequired}
        />
      );
    }
    
    // Textarea for longer text
    if (isTextAreaField) {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${fieldName.replace(/_/g, ' ')}`}
          rows={3}
          required={isRequired}
        />
      );
    }
    
    // Default input field
    return (
      <Input
        type={fieldName.includes('email') ? 'email' : 'text'}
        value={value !== null && value !== undefined ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${fieldName.replace(/_/g, ' ')}`}
        required={isRequired}
      />
    );
  }
  
  // Read-only view
  if (isArrayField) {
    const arrayValues = formatArrayField(value);
    
    if (fieldName === 'days_of_week') {
      const daysMap: Record<string, string> = {
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday',
        '7': 'Sunday'
      };
      
      return <span>{arrayValues.map(day => daysMap[day] || day).join(', ')}</span>;
    }
    
    return <span>{formatArrayForDisplay(value)}</span>;
  }
  
  if (isDateField && value) {
    try {
      const date = new Date(value);
      if (isValid(date)) {
        return <span>{format(date, 'PPP')}</span>;
      }
    } catch (e) {
      console.error(`Error formatting date for display: ${value}`, e);
    }
  }
  
  if (isPasswordField) {
    return <span>••••••••</span>;
  }
  
  if (isBooleanField) {
    return <span>{value === true ? 'Yes' : value === false ? 'No' : '-'}</span>;
  }
  
  return <span>{value !== null && value !== undefined ? String(value) : '-'}</span>;
};
