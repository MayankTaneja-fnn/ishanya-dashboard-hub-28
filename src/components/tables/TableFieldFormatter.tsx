import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper function to capitalize the first letter of each word
export const capitalizeFirstLetter = (str: string) => {
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

interface TableFieldFormatterProps {
  fieldName: string;
  value: any;
  onChange: (value: any) => void;
  isEditing: boolean;
  isRequired?: boolean;
}

export const TableFieldFormatter = ({ 
  fieldName, 
  value, 
  onChange, 
  isEditing, 
  isRequired = false 
}: TableFieldFormatterProps) => {
  // Handle empty values
  const displayValue = value !== null && value !== undefined ? value : '';
  
  // Check if the field is likely to be an array
  const isArrayField = fieldName === 'days_of_week' || 
                      fieldName === 'timings' || 
                      fieldName.includes('array');
  
  // Format array values for display
  const formatArrayForDisplay = (arrayValue: any) => {
    if (!arrayValue) return '';
    
    if (Array.isArray(arrayValue)) {
      return arrayValue.join(', ');
    }
    
    try {
      if (typeof arrayValue === 'string') {
        if (arrayValue.startsWith('[') && arrayValue.endsWith(']')) {
          return JSON.parse(arrayValue).join(', ');
        }
        return arrayValue;
      }
      return String(arrayValue);
    } catch (e) {
      console.error(`Error formatting array value for ${fieldName}:`, e);
      return String(arrayValue);
    }
  };
  
  // Format array input for database storage
  const formatArrayForStorage = (inputValue: string) => {
    // If empty, return null or an empty array
    if (!inputValue.trim()) {
      return null;
    }
    
    // Convert comma-separated string to proper PostgreSQL array format
    const values = inputValue.split(',').map(item => item.trim());
    
    // For arrays with only numbers
    if (values.every(val => !isNaN(Number(val)))) {
      return values.map(val => Number(val));
    }
    
    // For mixed or string arrays
    return values;
  };
  
  // Special formatting for date fields
  if (fieldName.includes('date') || fieldName === 'dob' || fieldName === 'created_at') {
    // If editing, render a date picker
    if (isEditing) {
      return (
        <Input
          type="date"
          value={displayValue ? displayValue.split('T')[0] : ''}
          onChange={(e) => onChange(e.target.value)}
          className={isRequired && !displayValue ? "border-red-500" : ""}
          required={isRequired}
        />
      );
    }
    
    // Otherwise, just display the formatted date
    return <div>{displayValue ? new Date(displayValue).toLocaleDateString() : '-'}</div>;
  }
  
  // Special formatting for array fields
  if (isArrayField) {
    if (isEditing) {
      return (
        <Input
          value={formatArrayForDisplay(displayValue)}
          onChange={(e) => {
            const formattedValue = formatArrayForStorage(e.target.value);
            onChange(formattedValue);
          }}
          placeholder="Enter comma-separated values"
          className={isRequired && !displayValue ? "border-red-500" : ""}
          required={isRequired}
        />
      );
    }
    
    return <div>{formatArrayForDisplay(displayValue) || '-'}</div>;
  }
  
  // Password field special handling
  if (fieldName === 'password') {
    if (isEditing) {
      return (
        <Input
          type="password"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
          className={isRequired && !displayValue ? "border-red-500" : ""}
          required={isRequired}
        />
      );
    }
    
    return <div>••••••••</div>;
  }
  
  // Default handling for most fields
  if (isEditing) {
    // Special handling for numeric fields
    if (
      fieldName.includes('_id') || 
      fieldName.includes('number') || 
      fieldName.includes('year')
    ) {
      return (
        <Input
          type="number"
          value={displayValue}
          onChange={(e) => {
            const numValue = e.target.value !== '' ? Number(e.target.value) : '';
            onChange(numValue);
          }}
          className={isRequired && !displayValue ? "border-red-500" : ""}
          required={isRequired}
        />
      );
    }
    
    // For gender field
    if (fieldName === 'gender') {
      return (
        <Select
          value={displayValue || ""}
          onValueChange={onChange}
        >
          <SelectTrigger className={isRequired && !displayValue ? "border-red-500" : ""}>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    // For status field
    if (fieldName === 'status') {
      return (
        <Select
          value={displayValue || ""}
          onValueChange={onChange}
        >
          <SelectTrigger className={isRequired && !displayValue ? "border-red-500" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="On Leave">On Leave</SelectItem>
            <SelectItem value="Graduated">Graduated</SelectItem>
            <SelectItem value="Transferred">Transferred</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    // For session_type field
    if (fieldName === 'session_type') {
      return (
        <Select
          value={displayValue || ""}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select session type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Individual">Individual</SelectItem>
            <SelectItem value="Group">Group</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    // For blood_group field
    if (fieldName === 'blood_group') {
      return (
        <Select
          value={displayValue || ""}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    // For all other fields, render a simple text input
    return (
      <Input
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        className={isRequired && !displayValue ? "border-red-500" : ""}
        required={isRequired}
      />
    );
  }
  
  // For display mode (non-editing)
  return <div>{displayValue || '-'}</div>;
};

export default TableFieldFormatter;
