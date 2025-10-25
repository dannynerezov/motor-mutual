import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileText, Upload, Download, CheckCircle, XCircle } from "lucide-react";

export function PDSUploadCard() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch PDS versions
  const { data: pdsVersions, isLoading } = useQuery({
    queryKey: ['pds-versions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_disclosure_statements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a PDF file",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      toast({
        title: "Missing file",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }

    // Generate client-side run ID for correlation
    const clientRunId = (crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);
    console.groupCollapsed(`[PDS] Upload ${clientRunId}`);
    console.time(`[PDS] ${clientRunId} total`);
    console.log('[PDS] INPUT', { 
      name: pdfFile.name, 
      sizeMB: (pdfFile.size / 1024 / 1024).toFixed(2),
      clientRunId
    });

    setIsUploading(true);
    setUploadProgress(20);

    try {
      // Upload PDF to storage with timestamp-based filename
      const timestamp = Date.now();
      const filePath = `pds-${timestamp}.pdf`;
      console.log('[PDS] STORAGE_UPLOAD_START', { filePath, timestamp });
      setUploadProgress(40);
      
      const { error: uploadError } = await supabase.storage
        .from('pds-documents')
        .upload(filePath, pdfFile, {
          upsert: true
        });

      if (uploadError) throw uploadError;
      console.log('[PDS] STORAGE_UPLOAD_OK', { filePath });

      setUploadProgress(60);

      // Call edge function to analyze PDF
      console.log('[PDS] FUNCTION_INVOKE_START', { 
        function: 'analyze-pds', 
        body: { pdfPath: filePath } 
      });
      
      const { data, error: functionError } = await supabase.functions.invoke('analyze-pds', {
        body: {
          pdfPath: filePath
        }
      });

      if (functionError) throw functionError;

      setUploadProgress(100);

      console.log('[PDS] FUNCTION_OK', { 
        requestId: data?.requestId,
        id: data?.data?.id,
        clientRunId
      });
      console.timeEnd(`[PDS] ${clientRunId} total`);
      console.groupEnd();

      const ref = data?.requestId ? ` (Ref: ${data.requestId})` : '';
      toast({
        title: "Success!",
        description: `PDS uploaded and analyzed successfully${ref}`
      });

      // Reset form
      setPdfFile(null);
      
      // Refresh list
      queryClient.invalidateQueries({ queryKey: ['pds-versions'] });

    } catch (error: any) {
      // Parse structured error from backend
      const status = error?.context?.response?.status;
      let parsed: any = undefined;
      
      if (error?.context?.body) {
        try {
          parsed = typeof error.context.body === 'string' 
            ? JSON.parse(error.context.body) 
            : error.context.body;
        } catch {
          // Ignore parse errors
        }
      }

      console.error('[PDS] FUNCTION_ERROR', {
        status,
        backendError: parsed?.error ?? error.message,
        code: parsed?.code,
        step: parsed?.step,
        requestId: parsed?.requestId,
        clientRunId
      });
      console.timeEnd(`[PDS] ${clientRunId} total`);
      console.groupEnd();

      // Extract meaningful error message
      let errorMessage = parsed?.error ?? error.message ?? 'Failed to upload and analyze PDS';
      
      // Add helpful hints for common errors
      if (errorMessage.includes('Rate limits exceeded') || parsed?.code === 'AI_RATE_LIMITED') {
        errorMessage += ' Please wait a minute and try again.';
      } else if (errorMessage.includes('credits exhausted') || parsed?.code === 'AI_PAYMENT_REQUIRED') {
        errorMessage += ' Please add credits to your workspace in Settings → Usage.';
      }
      
      // Include requestId in toast if available
      const ref = parsed?.requestId ? ` Ref: ${parsed.requestId}` : '';
      
      toast({
        title: "Upload failed",
        description: `${errorMessage}${ref}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadPdf = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from('pds-documents')
      .download(filePath);

    if (error) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    // Create download link
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'pds.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Product Disclosure Statement Management
        </CardTitle>
        <CardDescription>
          Upload and manage PDS versions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload New PDS</TabsTrigger>
            <TabsTrigger value="versions">Version History</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-file">PDF File</Label>
                <Input
                  id="pdf-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                {pdfFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">Automatic Features</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Version number assigned automatically (sequential)</li>
                  <li>✓ Effective date set to upload timestamp</li>
                  <li>✓ Previous PDS timeline updated automatically</li>
                </ul>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground text-center">
                    {uploadProgress < 40 && "Uploading PDF..."}
                    {uploadProgress >= 40 && uploadProgress < 60 && "Analyzing document with AI..."}
                    {uploadProgress >= 60 && uploadProgress < 100 && "Storing data..."}
                    {uploadProgress === 100 && "Complete!"}
                  </p>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={isUploading || !pdfFile}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Processing..." : "Upload & Analyze"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="versions">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading versions...</p>
            ) : pdsVersions && pdsVersions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Effective From</TableHead>
                    <TableHead>Effective Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pdsVersions.map((pds) => (
                    <TableRow key={pds.id}>
                      <TableCell className="font-medium">{pds.version_number}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(pds.created_at), 'PPP p')}
                      </TableCell>
                      <TableCell>{format(new Date(pds.effective_from), 'PPP p')}</TableCell>
                      <TableCell>
                        {pds.effective_until ? format(new Date(pds.effective_until), 'PPP p') : '-'}
                      </TableCell>
                      <TableCell>
                        {pds.is_active ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadPdf(pds.pdf_file_path)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">No PDS versions uploaded yet</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
