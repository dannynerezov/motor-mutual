import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface PreviewRow {
  full_address: string;
  index_value: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
}

export function AdminUploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || selectedFile.type !== "text/csv") {
      toast.error("Please select a valid CSV file");
      setFile(null);
      setPreviewData([]);
      setValidationErrors([]);
      return;
    }

    setFile(selectedFile);
    toast.success(`File selected: ${selectedFile.name}`);

    try {
      const text = await selectedFile.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const errors: string[] = [];
          const preview: PreviewRow[] = [];
          const sampleRows = results.data.slice(0, 5) as any[];
          
          sampleRows.forEach((row, idx) => {
            const mapped: PreviewRow = {
              full_address: (row["Full Address"] || "").trim(),
              index_value: (row["Index"] || "").trim(),
              street: (row["Street"] || "").trim(),
              suburb: (row["Suburb"] || "").trim(),
              state: (row["State"] || "").trim(),
              postcode: (row["Postcode"] || "").trim()
            };

            if (!mapped.index_value || isNaN(parseFloat(mapped.index_value))) {
              errors.push(`Row ${idx + 2}: Invalid index value "${mapped.index_value}"`);
            }
            if (mapped.postcode && !/^\d{4}$/.test(mapped.postcode)) {
              errors.push(`Row ${idx + 2}: Invalid postcode "${mapped.postcode}"`);
            }
            if (mapped.state && !["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"].includes(mapped.state.toUpperCase())) {
              errors.push(`Row ${idx + 2}: Invalid state "${mapped.state}"`);
            }

            preview.push(mapped);
          });

          setPreviewData(preview);
          setValidationErrors(errors.slice(0, 10));
          
          if (errors.length === 0) {
            toast.success("File validated successfully!");
          } else {
            toast.warning(`Found ${errors.length} validation issues in sample`);
          }
        },
        error: (error) => {
          toast.error(`Failed to parse CSV: ${error.message}`);
          setFile(null);
        }
      });
    } catch (error: any) {
      toast.error(`Failed to read file: ${error.message}`);
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadProgress("Parsing CSV file...");

    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const totalRows = results.data.length;
            setUploadProgress(`Processing ${totalRows} records...`);

            const records = results.data.map((row: any) => ({
              full_address: (row["Full Address"] || "").trim(),
              index_value: (row["Index"] || "").trim() || null,
              street: (row["Street"] || "").trim(),
              suburb: (row["Suburb"] || "").trim(),
              state: ((row["State"] || "").trim()).toUpperCase(),
              postcode: (row["Postcode"] || "").trim()
            })).filter(record =>
              record.index_value && 
              !isNaN(parseFloat(record.index_value))
            );

            setUploadProgress(`Validated ${records.length} of ${totalRows} records. Starting upload...`);

            const batchSize = 1000;
            let inserted = 0;

            for (let i = 0; i < records.length; i += batchSize) {
              const batch = records.slice(i, i + batchSize);
              setUploadProgress(`Uploading batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(records.length / batchSize)}...`);
              
              const { error } = await supabase
                .from("insurance_pricing_data")
                .insert(batch);

              if (error) throw error;
              inserted += batch.length;
            }

            toast.success(`Successfully uploaded ${inserted} records!`);
            setFile(null);
            setPreviewData([]);
            setValidationErrors([]);
            setUploadProgress("");
            
            const fileInput = document.getElementById("csv-file") as HTMLInputElement;
            if (fileInput) fileInput.value = "";
            
          } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(`Upload failed: ${error.message}`);
          } finally {
            setIsUploading(false);
          }
        },
        error: (error) => {
          toast.error(`CSV parsing failed: ${error.message}`);
          setIsUploading(false);
        }
      });
      
    } catch (error: any) {
      console.error("File read error:", error);
      toast.error(`Failed to read file: ${error.message}`);
      setIsUploading(false);
    }
  };

  return (
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
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Selected file:</p>
              <p className="text-sm text-muted-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Size: {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-1">Validation Issues Found:</p>
                  <ul className="text-xs space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {previewData.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <p className="text-sm font-medium">Preview (First 5 Rows)</p>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[300px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Full Address</TableHead>
                          <TableHead className="text-xs">Index</TableHead>
                          <TableHead className="text-xs">Suburb</TableHead>
                          <TableHead className="text-xs">State</TableHead>
                          <TableHead className="text-xs">Postcode</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-xs">{row.full_address}</TableCell>
                            <TableCell className="text-xs font-medium">{row.index_value}</TableCell>
                            <TableCell className="text-xs">{row.suburb}</TableCell>
                            <TableCell className="text-xs">{row.state}</TableCell>
                            <TableCell className="text-xs">{row.postcode}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Column mapping looks correct? Verify Full Address, Index, Suburb, State, and Postcode are in the right columns before uploading.
                </p>
              </div>
            )}
          </div>
        )}

        {uploadProgress && (
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium text-primary">{uploadProgress}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Data"}
          </Button>
          
          <Link to="/admin/pricing-analysis" className="flex-1">
            <Button variant="outline" className="w-full">
              View Analysis
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
