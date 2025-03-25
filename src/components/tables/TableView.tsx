import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Record {
  id: string;
  name: string;
  tags?: string[]; // Example array column
  description?: string;
}

const EditableTable = () => {
  const [data, setData] = useState<Record[]>([]);
  const [filteredData, setFilteredData] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<Record | null>(null);
  const [formData, setFormData] = useState<Record | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase.from("your_table_name").select("*");

      if (error) throw error;
      setData(data || []);
      setFilteredData(data || []);
    } catch (err) {
      setError("Failed to fetch records");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Record) => {
    setSelectedRow(record);
    setFormData({ ...record });
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value } = e.target;

    // Special handling for arrays (example: tags field)
    if (name === "tags") {
      setFormData({ ...formData, [name]: value ? value.split(",") : [] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!selectedRow || !formData) return;

    try {
      setLoading(true);
      setError(null);

      // Ensure proper data format before updating
      const fixedFormData: Record = { ...formData };
      Object.keys(fixedFormData).forEach((key) => {
        if (Array.isArray(fixedFormData[key as keyof Record]) && fixedFormData[key as keyof Record] === "") {
          fixedFormData[key as keyof Record] = [];
        }
      });

      console.log("Updating with:", fixedFormData);

      const { data: updatedData, error } = await supabase
        .from("your_table_name")
        .update(fixedFormData)
        .eq("id", selectedRow.id)
        .select();

      if (error) throw error;

      toast.success("Record updated successfully");

      setData((prev) => prev.map((item) => (item.id === selectedRow.id ? updatedData[0] : item)));
      setFilteredData((prev) => prev.map((item) => (item.id === selectedRow.id ? updatedData[0] : item)));
      setShowForm(false);
    } catch (err) {
      console.error("Update error:", err);
      setError("An unexpected error occurred");
      toast.error("Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Editable Table</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Tags</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((record) => (
            <tr key={record.id} className="border">
              <td className="border p-2">{record.id}</td>
              <td className="border p-2">{record.name}</td>
              <td className="border p-2">{record.tags?.join(", ") || "N/A"}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(record)} className="bg-blue-500 text-white px-2 py-1 rounded">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && formData && (
        <div className="mt-4 p-4 border rounded shadow-md bg-white">
          <h3 className="text-lg font-bold mb-2">Edit Record</h3>

          <label className="block mb-2">
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>

          <label className="block mb-2">
            Tags (comma-separated):
            <input
              type="text"
              name="tags"
              value={formData.tags?.join(", ") || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>

          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => setShowForm(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableTable;
