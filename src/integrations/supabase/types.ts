export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          admin_id: string | null
          announcement: string | null
          announcement_id: number
          created_at: string | null
          title: string | null
        }
        Insert: {
          admin_id?: string | null
          announcement?: string | null
          announcement_id?: number
          created_at?: string | null
          title?: string | null
        }
        Update: {
          admin_id?: string | null
          announcement?: string | null
          announcement_id?: number
          created_at?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      centers: {
        Row: {
          center_id: number
          created_at: string | null
          id: string
          location: string | null
          name: string
          num_of_educator: number | null
          num_of_employees: number | null
          num_of_student: number | null
        }
        Insert: {
          center_id?: number
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          num_of_educator?: number | null
          num_of_employees?: number | null
          num_of_student?: number | null
        }
        Update: {
          center_id?: number
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          num_of_educator?: number | null
          num_of_employees?: number | null
          num_of_student?: number | null
        }
        Relationships: []
      }
      discussion_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string
          sender_name: string
          sender_role: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id: string
          sender_name: string
          sender_role: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          sender_name?: string
          sender_role?: string
        }
        Relationships: []
      }
      educators: {
        Row: {
          center_id: number
          created_at: string | null
          date_of_birth: string
          date_of_joining: string
          designation: string
          email: string
          employee_id: number
          id: string
          name: string
          phone: string
          photo: string | null
          work_location: string
        }
        Insert: {
          center_id: number
          created_at?: string | null
          date_of_birth: string
          date_of_joining: string
          designation: string
          email: string
          employee_id: number
          id?: string
          name: string
          phone: string
          photo?: string | null
          work_location: string
        }
        Update: {
          center_id?: number
          created_at?: string | null
          date_of_birth?: string
          date_of_joining?: string
          designation?: string
          email?: string
          employee_id?: number
          id?: string
          name?: string
          phone?: string
          photo?: string | null
          work_location?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_educators_center"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["center_id"]
          },
          {
            foreignKeyName: "fk_educators_employee"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      employee_attendance: {
        Row: {
          attendance: boolean | null
          date: string
          employee_id: number
        }
        Insert: {
          attendance?: boolean | null
          date: string
          employee_id: number
        }
        Update: {
          attendance?: boolean | null
          date?: string
          employee_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_attendance_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      employee_payroll: {
        Row: {
          current_salary: number | null
          employee_id: number
          last_paid: string | null
        }
        Insert: {
          current_salary?: number | null
          employee_id: number
          last_paid?: string | null
        }
        Update: {
          current_salary?: number | null
          employee_id?: number
          last_paid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      employees: {
        Row: {
          blood_group: string | null
          center_id: number
          created_at: string | null
          date_of_birth: string
          date_of_joining: string
          date_of_leaving: string | null
          department: string
          designation: string
          email: string
          emergency_contact: string
          emergency_contact_name: string
          employee_id: number
          employment_type: string
          gender: string
          id: string
          LOR: string | null
          name: string
          password: string
          phone: string
          program_id: number | null
          status: string
          work_location: string | null
        }
        Insert: {
          blood_group?: string | null
          center_id: number
          created_at?: string | null
          date_of_birth: string
          date_of_joining: string
          date_of_leaving?: string | null
          department: string
          designation: string
          email: string
          emergency_contact: string
          emergency_contact_name: string
          employee_id?: number
          employment_type: string
          gender: string
          id?: string
          LOR?: string | null
          name: string
          password?: string
          phone: string
          program_id?: number | null
          status: string
          work_location?: string | null
        }
        Update: {
          blood_group?: string | null
          center_id?: number
          created_at?: string | null
          date_of_birth?: string
          date_of_joining?: string
          date_of_leaving?: string | null
          department?: string
          designation?: string
          email?: string
          emergency_contact?: string
          emergency_contact_name?: string
          employee_id?: number
          employment_type?: string
          gender?: string
          id?: string
          LOR?: string | null
          name?: string
          password?: string
          phone?: string
          program_id?: number | null
          status?: string
          work_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_employees_center"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["center_id"]
          },
          {
            foreignKeyName: "fk_employees_program_center"
            columns: ["program_id", "center_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["program_id", "center_id"]
          },
        ]
      }
      goals_tasks: {
        Row: {
          assigned_by: number
          created_at: string
          description: string | null
          due_date: string
          feedback: string | null
          program_id: number
          status: string
          student_id: number
          task_id: string
        }
        Insert: {
          assigned_by: number
          created_at: string
          description?: string | null
          due_date: string
          feedback?: string | null
          program_id: number
          status?: string
          student_id: number
          task_id: string
        }
        Update: {
          assigned_by?: number
          created_at?: string
          description?: string | null
          due_date?: string
          feedback?: string | null
          program_id?: number
          status?: string
          student_id?: number
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_goals_tasks_educator"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "fk_goals_tasks_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      parents: {
        Row: {
          email: string
          feedback: string | null
          id: number
          password: string
          student_id: number
        }
        Insert: {
          email: string
          feedback?: string | null
          id?: number
          password: string
          student_id: number
        }
        Update: {
          email?: string
          feedback?: string | null
          id?: number
          password?: string
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_parents_students"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      performance_records: {
        Row: {
          assessment_date: string
          assessment_id: string
          center_id: number
          cognition: number
          communication: number
          created_at: string | null
          logic: number
          notes: string | null
          program_id: number
          reasoning: number
          score: number
          student_id: number
        }
        Insert: {
          assessment_date: string
          assessment_id: string
          center_id: number
          cognition: number
          communication: number
          created_at?: string | null
          logic: number
          notes?: string | null
          program_id: number
          reasoning: number
          score: number
          student_id: number
        }
        Update: {
          assessment_date?: string
          assessment_id?: string
          center_id?: number
          cognition?: number
          communication?: number
          created_at?: string | null
          logic?: number
          notes?: string | null
          program_id?: number
          reasoning?: number
          score?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_performance_center"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["center_id"]
          },
          {
            foreignKeyName: "fk_performance_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      programs: {
        Row: {
          center_id: number
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          num_of_educator: number | null
          num_of_student: number | null
          program_id: number
          start_date: string | null
        }
        Insert: {
          center_id: number
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          num_of_educator?: number | null
          num_of_student?: number | null
          program_id?: number
          start_date?: string | null
        }
        Update: {
          center_id?: number
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          num_of_educator?: number | null
          num_of_student?: number | null
          program_id?: number
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_programs_center"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["center_id"]
          },
        ]
      }
      reports: {
        Row: {
          content: Json
          created_at: string | null
          generated_by: number
          id: string
          report_type: string
          student_id: number
        }
        Insert: {
          content: Json
          created_at?: string | null
          generated_by: number
          id?: string
          report_type: string
          student_id: number
        }
        Update: {
          content?: Json
          created_at?: string | null
          generated_by?: number
          id?: string
          report_type?: string
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_reports_educator"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "fk_reports_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_attendance: {
        Row: {
          attendance: boolean | null
          date: string
          program_id: number
          student_id: number
        }
        Insert: {
          attendance?: boolean | null
          date: string
          program_id: number
          student_id: number
        }
        Update: {
          attendance?: boolean | null
          date?: string
          program_id?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_attendance_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          allergies: string | null
          alt_contact_number: string | null
          blood_group: string | null
          center_id: number
          comments: string | null
          comorbidity: string | null
          contact_number: string
          created_at: string | null
          days_of_week: string[] | null
          dob: string
          educator_employee_id: number
          enrollment_year: number
          fathers_name: string | null
          first_name: string
          gender: string
          id: string
          last_name: string
          mothers_name: string | null
          number_of_sessions: number | null
          parents_email: string | null
          photo: string | null
          primary_diagnosis: string | null
          program_2_id: number | null
          program_id: number
          secondary_educator_employee_id: number | null
          session_type: string | null
          status: string
          strengths: string | null
          student_email: string
          student_id: number
          timings: string | null
          transport: string | null
          udid: string | null
          weakness: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          alt_contact_number?: string | null
          blood_group?: string | null
          center_id: number
          comments?: string | null
          comorbidity?: string | null
          contact_number: string
          created_at?: string | null
          days_of_week?: string[] | null
          dob: string
          educator_employee_id: number
          enrollment_year: number
          fathers_name?: string | null
          first_name: string
          gender: string
          id?: string
          last_name: string
          mothers_name?: string | null
          number_of_sessions?: number | null
          parents_email?: string | null
          photo?: string | null
          primary_diagnosis?: string | null
          program_2_id?: number | null
          program_id: number
          secondary_educator_employee_id?: number | null
          session_type?: string | null
          status: string
          strengths?: string | null
          student_email: string
          student_id: number
          timings?: string | null
          transport?: string | null
          udid?: string | null
          weakness?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string | null
          alt_contact_number?: string | null
          blood_group?: string | null
          center_id?: number
          comments?: string | null
          comorbidity?: string | null
          contact_number?: string
          created_at?: string | null
          days_of_week?: string[] | null
          dob?: string
          educator_employee_id?: number
          enrollment_year?: number
          fathers_name?: string | null
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          mothers_name?: string | null
          number_of_sessions?: number | null
          parents_email?: string | null
          photo?: string | null
          primary_diagnosis?: string | null
          program_2_id?: number | null
          program_id?: number
          secondary_educator_employee_id?: number | null
          session_type?: string | null
          status?: string
          strengths?: string | null
          student_email?: string
          student_id?: number
          timings?: string | null
          transport?: string | null
          udid?: string | null
          weakness?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_students_educator"
            columns: ["educator_employee_id"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "fk_students_program_center"
            columns: ["program_id", "center_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["program_id", "center_id"]
          },
          {
            foreignKeyName: "fk_students_secondary_educator"
            columns: ["secondary_educator_employee_id"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "students_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["center_id"]
          },
        ]
      }
      voice_sessions: {
        Row: {
          collected_data: Json | null
          created_at: string | null
          current_field: string | null
          id: string
          status: string | null
          table_name: string
          updated_at: string | null
        }
        Insert: {
          collected_data?: Json | null
          created_at?: string | null
          current_field?: string | null
          id?: string
          status?: string | null
          table_name: string
          updated_at?: string | null
        }
        Update: {
          collected_data?: Json | null
          created_at?: string | null
          current_field?: string | null
          id?: string
          status?: string | null
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      webdata: {
        Row: {
          created_at: string | null
          transaction_id: number
          transaction_name: string
        }
        Insert: {
          created_at?: string | null
          transaction_id?: number
          transaction_name: string
        }
        Update: {
          created_at?: string | null
          transaction_id?: number
          transaction_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
