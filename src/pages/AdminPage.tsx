import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Database, Trash2 } from "lucide-react";

const AdminPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      toast.success(`File selected: ${selectedFile.name}`);
    } else {
      toast.error("Please select a valid CSV file");
      setFile(null);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue;
      
      const values = lines[i].split(",").map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      
      data.push(row);
    }
    
    return data;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadProgress("Reading file...");

    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      
      setUploadProgress(`Processing ${csvData.length} records...`);

      // Map CSV columns to database columns
      const records = csvData.map(row => ({
        full_address: row["Full Address"] || "",
        index_value: row["Index"] || null,
        street: row["Street"] || "",
        suburb: row["Suburb"] || "",
        state: row["State"] || "",
        postcode: row["Postcode"] || ""
      }));

      // Insert in batches of 1000 to avoid timeout
      const batchSize = 1000;
      let inserted = 0;

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        setUploadProgress(`Uploading batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(records.length / batchSize)}...`);
        
        const { error } = await supabase
          .from("insurance_pricing_data")
          .insert(batch);

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        
        inserted += batch.length;
      }

      toast.success(`Successfully uploaded ${inserted} records!`);
      setFile(null);
      setUploadProgress("");
      
      // Reset file input
      const fileInput = document.getElementById("csv-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to delete ALL pricing data? This cannot be undone.")) {
      return;
    }

    setIsUploading(true);
    setUploadProgress("Deleting all records...");

    try {
      const { error } = await supabase
        .from("insurance_pricing_data")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all records

      if (error) throw error;

      toast.success("All pricing data cleared successfully");
      setUploadProgress("");
    } catch (error: any) {
      console.error("Clear error:", error);
      toast.error(`Failed to clear data: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Upload and manage insurance pricing data
            </p>
          </div>

          <div className="grid gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Pricing Data
                </CardTitle>
                <CardDescription>
                  Upload a CSV file with columns: Full Address, Index, Street, Suburb, State, Postcode
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </div>

                {file && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Selected file:</p>
                    <p className="text-sm text-muted-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                {uploadProgress && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium text-primary">{uploadProgress}</p>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Data"}
                </Button>
              </CardContent>
            </Card>

            {/* Data Management Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Manage existing pricing data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleClearData}
                  disabled={isUploading}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
