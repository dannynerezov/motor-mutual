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
import { CalendarIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const pricingSchemeSchema = z.object({
  vehicle_value: z.coerce.number().positive("Vehicle value must be positive"),
  base_premium: z.coerce.number().positive("Base premium must be positive"),
  floor_price: z.coerce.number().positive("Floor price must be positive"),
  floor_point: z.coerce.number().positive("Floor point must be positive"),
  ceiling_price: z.coerce.number().positive("Ceiling price must be positive"),
  ceiling_point: z.coerce.number().positive("Ceiling point must be positive"),
  increment: z.coerce.number().positive("Increment must be positive"),
  number_increments: z.coerce.number().int().positive("Number of increments must be a positive integer"),
  valid_from: z.date(),
});

type PricingSchemeFormData = z.infer<typeof pricingSchemeSchema>;

const AdminPricingSchemes = () => {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<PricingSchemeFormData>({
    resolver: zodResolver(pricingSchemeSchema),
  });

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
        vehicle_value: formData.vehicle_value,
        base_premium: formData.base_premium,
        floor_price: formData.floor_price,
        floor_point: formData.floor_point,
        ceiling_price: formData.ceiling_price,
        ceiling_point: formData.ceiling_point,
        increment: formData.increment,
        number_increments: formData.number_increments,
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Pricing Scheme Management</h1>
          <p className="text-muted-foreground">
            Configure and manage membership pricing schemes with date-based versioning
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
                Enter the variables for the straight line equation to calculate membership prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="vehicle_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Value ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="25000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="base_premium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Premium ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="floor_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="100" {...field} />
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
                          <FormLabel>Floor Point</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="50" {...field} />
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
                            <Input type="number" step="0.01" placeholder="1000" {...field} />
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
                          <FormLabel>Ceiling Point</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="increment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Increment ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="number_increments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Increments</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="15" {...field} />
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
                      <TableHead>Vehicle Value</TableHead>
                      <TableHead>Base Premium</TableHead>
                      <TableHead>Floor Price</TableHead>
                      <TableHead>Ceiling Price</TableHead>
                      <TableHead>Increment</TableHead>
                      <TableHead># Increments</TableHead>
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
                          {format(new Date(scheme.valid_from), "PPP p")}
                        </TableCell>
                        <TableCell>
                          {scheme.valid_until
                            ? format(new Date(scheme.valid_until), "PPP p")
                            : "Present"}
                        </TableCell>
                        <TableCell>${scheme.vehicle_value.toLocaleString()}</TableCell>
                        <TableCell>${scheme.base_premium.toLocaleString()}</TableCell>
                        <TableCell>${scheme.floor_price.toLocaleString()}</TableCell>
                        <TableCell>${scheme.ceiling_price.toLocaleString()}</TableCell>
                        <TableCell>${scheme.increment.toLocaleString()}</TableCell>
                        <TableCell>{scheme.number_increments}</TableCell>
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
    </div>
  );
};

export default AdminPricingSchemes;
