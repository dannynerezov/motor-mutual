import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Download, Trash2, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleInput {
  state: string;
  registrationNumber: string;
}

interface ProcessingResult {
  id?: string;
  state: string;
  registrationNumber: string;
  status: 'success' | 'failed';
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  marketValue?: number;
  membershipPrice?: number;
  imageExists?: boolean;
  vehicleImageUrl?: string;
  error?: string;
}

export const QuoteWidgetCard = () => {
  const { toast } = useToast();
  const [pastedData, setPastedData] = useState("");
  const [parsedVehicles, setParsedVehicles] = useState<VehicleInput[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const validStates = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

  const parseExcelData = () => {
    try {
      const lines = pastedData.trim().split('\n');
      
      if (lines.length === 0) {
        throw new Error('No data provided');
      }

      const vehicles: VehicleInput[] = [];
      const errors: string[] = [];

      // Skip header row if it exists
      const startIndex = lines[0].toLowerCase().includes('state') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split by tab or comma
        const parts = line.split(/[\t,]/).map(p => p.trim());
        
        if (parts.length < 2) {
          errors.push(`Row ${i + 1}: Invalid format (needs State and Rego)`);
          continue;
        }

        const state = parts[0].toUpperCase();
        const rego = parts[1].toUpperCase().replace(/[^A-Z0-9]/g, '');

        // Validate state
        if (!validStates.includes(state)) {
          errors.push(`Row ${i + 1}: Invalid state '${state}'`);
          continue;
        }

        // Validate rego format
        if (!/^[A-Z0-9]{3,8}$/.test(rego)) {
          errors.push(`Row ${i + 1}: Invalid rego format '${rego}'`);
          continue;
        }

        vehicles.push({ state, registrationNumber: rego });
      }

      if (vehicles.length === 0) {
        throw new Error('No valid vehicles found in data');
      }

      setParsedVehicles(vehicles);
      
      if (errors.length > 0) {
        toast({
          title: "Parsing completed with warnings",
          description: `Found ${vehicles.length} valid vehicles, ${errors.length} errors`,
          variant: "default",
        });
      } else {
        toast({
          title: "Data parsed successfully",
          description: `Found ${vehicles.length} vehicles ready to process`,
        });
      }
    } catch (error) {
      toast({
        title: "Parsing failed",
        description: error instanceof Error ? error.message : "Invalid data format",
        variant: "destructive",
      });
    }
  };

  const processVehicles = async () => {
    if (parsedVehicles.length === 0) {
      toast({
        title: "No vehicles to process",
        description: "Please parse data first",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    setResults([]);
    setSummary(null);

    try {
      const { data, error } = await supabase.functions.invoke('process-sample-vehicles', {
        body: { vehicles: parsedVehicles }
      });

      if (error) throw error;

      setResults(data.results);
      setSummary(data.summary);
      setProgress(100);

      toast({
        title: "Processing complete",
        description: `Successfully processed ${data.summary.successful} of ${data.summary.total} vehicles`,
      });
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process vehicles",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const clearData = () => {
    setPastedData("");
    setParsedVehicles([]);
    setResults([]);
    setSummary(null);
    setProgress(0);
  };

  const exportResults = () => {
    if (results.length === 0) return;

    const csv = [
      ['State', 'Rego', 'Status', 'Make', 'Model', 'Year', 'Market Value', 'Membership Price', 'Image Exists', 'Error'].join(','),
      ...results.map(r => [
        r.state,
        r.registrationNumber,
        r.status,
        r.vehicleMake || '',
        r.vehicleModel || '',
        r.vehicleYear || '',
        r.marketValue || '',
        r.membershipPrice || '',
        r.imageExists ? 'Yes' : 'No',
        r.error || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicle-quotes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Widget - Sample Vehicle Database</CardTitle>
        <CardDescription>
          Paste vehicle registration data to build a sample database with pricing calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste & Process</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Paste Excel Data (State | Rego)
              </label>
              <Textarea
                placeholder="NSW    ABC123&#10;VIC    XYZ789&#10;QLD    123ABC"
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Format: Two columns separated by tab or comma. State codes: NSW, VIC, QLD, SA, WA, TAS, NT, ACT
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={parseExcelData} disabled={!pastedData.trim() || processing}>
                <Upload className="mr-2 h-4 w-4" />
                Parse Data
              </Button>
              <Button onClick={clearData} variant="outline" disabled={processing}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>

            {parsedVehicles.length > 0 && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Preview ({parsedVehicles.length} vehicles)</h3>
                  <div className="max-h-48 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>State</TableHead>
                          <TableHead>Registration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedVehicles.slice(0, 10).map((v, i) => (
                          <TableRow key={i}>
                            <TableCell>{v.state}</TableCell>
                            <TableCell className="font-mono">{v.registrationNumber}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {parsedVehicles.length > 10 && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        ...and {parsedVehicles.length - 10} more
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={processVehicles} 
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Process Vehicles'
                    )}
                  </Button>

                  {processing && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <p className="text-xs text-center text-muted-foreground">
                        Processing vehicles... This may take a few minutes
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold">{summary.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-green-600">{summary.successful}</div>
                  <div className="text-xs text-muted-foreground">Success</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold">${summary.averagePrice.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Avg Price</div>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <>
                <div className="flex justify-end">
                  <Button onClick={exportResults} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>

                <div className="rounded-lg border">
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>State</TableHead>
                          <TableHead>Rego</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Vehicle</TableHead>
                          <TableHead className="text-right">Value</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="w-[100px]">Image</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result, i) => (
                          <TableRow key={i}>
                            <TableCell>{result.state}</TableCell>
                            <TableCell className="font-mono">{result.registrationNumber}</TableCell>
                            <TableCell>
                              <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                                {result.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {result.status === 'success' ? (
                                <div className="text-sm">
                                  <div className="font-medium">
                                    {result.vehicleYear} {result.vehicleMake} {result.vehicleModel}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-red-600">{result.error}</div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {result.marketValue ? `$${result.marketValue.toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {result.membershipPrice ? `$${result.membershipPrice.toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell>
                              {result.imageExists && result.vehicleImageUrl ? (
                                <div className="relative w-20 h-14 rounded overflow-hidden border border-border">
                                  <img 
                                    src={result.vehicleImageUrl} 
                                    alt={`${result.vehicleMake} ${result.vehicleModel || ''}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-muted text-xs text-muted-foreground">No Image</div>';
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-20 h-14 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted">
                                  <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}

            {results.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No results yet. Process vehicles to see results here.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
