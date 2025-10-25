import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, Plus, LineChart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { PricingSchemeChartModal } from "@/components/admin/PricingSchemeChartModal";
import { generatePricingEquation, calculateBasePremium } from "@/lib/pricingCalculator";

// Simplified schema with only 4 core variables
const pricingSchemeSchema = z.object({
  floor_price: z.coerce.number().positive("Floor price must be positive"),
  floor_point: z.coerce.number().positive("Floor point must be positive"),
  ceiling_price: z.coerce.number().positive("Ceiling price must be positive"),
  ceiling_point: z.coerce.number().positive("Ceiling point must be positive"),
  valid_from: z.date(),
}).refine((data) => data.ceiling_point > data.floor_point, {
  message: "Ceiling point must be greater than floor point",
  path: ["ceiling_point"],
});

type PricingSchemeFormData = z.infer<typeof pricingSchemeSchema>;

const AdminPricingSchemes = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<PricingSchemeFormData>({
    resolver: zodResolver(pricingSchemeSchema),
    defaultValues: {
      floor_price: 500,
      floor_point: 5000,
      ceiling_price: 2000,
      ceiling_point: 100000,
    }
  });

  // Watch form values for real-time equation preview
  const watchedValues = form.watch();
  const previewEquation = watchedValues.floor_price && 
                          watchedValues.floor_point && 
                          watchedValues.ceiling_price && 
                          watchedValues.ceiling_point
    ? generatePricingEquation({
        floor_price: Number(watchedValues.floor_price),
        floor_point: Number(watchedValues.floor_point),
        ceiling_price: Number(watchedValues.ceiling_price),
        ceiling_point: Number(watchedValues.ceiling_point),
      })
    : null;

  // Sample calculations for preview
  const getSampleCalculations = () => {
    if (!watchedValues.floor_price || !watchedValues.floor_point || 
        !watchedValues.ceiling_price || !watchedValues.ceiling_point) {
      return [];
    }

    const scheme = {
      floor_price: Number(watchedValues.floor_price),
      floor_point: Number(watchedValues.floor_point),
      ceiling_price: Number(watchedValues.ceiling_price),
      ceiling_point: Number(watchedValues.ceiling_point),
    };

    const sampleValues = [5000, 10000, 25000, 50000, 75000, 100000];
    return sampleValues
      .map(value => {
        try {
          return {
            value,
            premium: calculateBasePremium(value, scheme)
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  };

  // Fetch all pricing schemes
  const { data: schemes, isLoading } = useQuery({
    queryKey: ["pricing-schemes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_schemes")
        .select("*")
        .order("valid_from", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create new pricing scheme
  const createSchemeMutation = useMutation({
    mutationFn: async (formData: PricingSchemeFormData) => {
      const { error } = await supabase.from("pricing_schemes").insert([{
        floor_price: formData.floor_price,
        floor_point: formData.floor_point,
        ceiling_price: formData.ceiling_price,
        ceiling_point: formData.ceiling_point,
        valid_from: formData.valid_from.toISOString(),
      } as any]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-schemes"] });
      toast.success("Pricing scheme created successfully");
      form.reset();
      setShowForm(false);
    },
    onError: (error: any) => {
      toast.error("Failed to create pricing scheme: " + error.message);
    },
  });

  const onSubmit = (data: PricingSchemeFormData) => {
    createSchemeMutation.mutate(data);
  };

  const handleViewChart = (scheme: any) => {
    setSelectedScheme(scheme);
    setShowChartModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Pricing Scheme Management</h1>
          <p className="text-muted-foreground">
            Configure and manage membership pricing schemes using 4 core variables
          </p>
        </div>

        {/* Create New Scheme Button */}
        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            {showForm ? "Cancel" : "Create New Pricing Scheme"}
          </Button>
        </div>

        {/* Form Card */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>New Pricing Scheme</CardTitle>
              <CardDescription>
                Enter 4 variables to define the straight-line pricing equation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="floor_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="floor_point"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor Point ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="5000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ceiling_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ceiling Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="2000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ceiling_point"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ceiling Point ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="100000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="valid_from"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Valid From</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Real-time Equation Preview */}
                  {previewEquation && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Preview Equation:</p>
                            <p className="text-base font-mono font-semibold">{previewEquation}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Sample Calculations:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              {getSampleCalculations().map((sample: any) => (
                                <div key={sample.value} className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    ${sample.value.toLocaleString()}:
                                  </span>
                                  <span className="font-semibold">
                                    ${sample.premium.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-4">
                    <Button type="submit" disabled={createSchemeMutation.isPending}>
                      {createSchemeMutation.isPending ? "Creating..." : "Create Pricing Scheme"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Existing Schemes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Scheme History</CardTitle>
            <CardDescription>
              All pricing schemes with their validity periods and active status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading schemes...</div>
            ) : schemes && schemes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scheme #</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valid From</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Equation</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Ceiling</TableHead>
                      <TableHead>Chart</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schemes.map((scheme) => (
                      <TableRow key={scheme.id}>
                        <TableCell className="font-medium">#{scheme.scheme_number}</TableCell>
                        <TableCell>
                          {scheme.is_active ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(scheme.valid_from), "PPP")}
                        </TableCell>
                        <TableCell>
                          {scheme.valid_until
                            ? format(new Date(scheme.valid_until), "PPP")
                            : "Present"}
                        </TableCell>
                        <TableCell className="font-mono text-xs max-w-xs truncate">
                          {generatePricingEquation(scheme)}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>${scheme.floor_price}</div>
                          <div className="text-xs text-muted-foreground">
                            @${scheme.floor_point.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>${scheme.ceiling_price}</div>
                          <div className="text-xs text-muted-foreground">
                            @${scheme.ceiling_point.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewChart(scheme)}
                          >
                            <LineChart className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No pricing schemes found. Create your first scheme to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />

      {/* Chart Modal */}
      {selectedScheme && (
        <PricingSchemeChartModal
          open={showChartModal}
          onOpenChange={setShowChartModal}
          scheme={selectedScheme}
        />
      )}
    </div>
  );
};

export default AdminPricingSchemes;
