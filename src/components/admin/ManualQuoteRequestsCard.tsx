import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Loader2, Eye, User, Car, AlertTriangle, Info } from "lucide-react";
import { format } from "date-fns";

export const ManualQuoteRequestsCard = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [filterStatus]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("manual_quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Failed to load manual quote requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === "contacted" && !requests.find(r => r.id === id)?.contacted_at) {
        updates.contacted_at = new Date().toISOString();
      }
      if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("manual_quote_requests")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast.success(`Status updated to ${newStatus}`);
      loadRequests();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const updateAdminNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("manual_quote_requests")
        .update({ admin_notes: notes })
        .eq("id", id);

      if (error) throw error;
      toast.success("Notes updated");
      loadRequests();
    } catch (error) {
      console.error("Failed to update notes:", error);
      toast.error("Failed to update notes");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Manual Quote Requests
            </CardTitle>
            <CardDescription className="mt-1">
              Manage quote requests that couldn't be processed automatically
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {requests.filter(r => r.status === 'pending').length} Pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All ({requests.length})
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === "contacted" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("contacted")}
          >
            Contacted
          </Button>
          <Button
            variant={filterStatus === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
        </div>

        {/* Requests Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No manual quote requests found</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(request.created_at), "PPp")}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm">
                          {request.customer_first_name} {request.customer_last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{request.customer_email}</p>
                        {request.customer_phone && (
                          <p className="text-xs text-muted-foreground">{request.customer_phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-mono font-bold text-sm">
                          {request.registration_number}
                        </p>
                        <p className="text-xs text-muted-foreground">{request.state_of_registration}</p>
                        {request.vehicle_make && request.vehicle_model && (
                          <p className="text-xs">
                            {request.vehicle_year} {request.vehicle_make} {request.vehicle_model}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={request.status}
                        onValueChange={(value) => updateRequestStatus(request.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="quote_sent">Quote Sent</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailDialog(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Detail Dialog */}
      {selectedRequest && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manual Quote Request Details</DialogTitle>
              <DialogDescription>
                Request ID: {selectedRequest.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <p className="font-semibold">
                      {selectedRequest.customer_first_name} {selectedRequest.customer_last_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="font-mono text-sm">{selectedRequest.customer_email}</p>
                  </div>
                  {selectedRequest.customer_phone && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p>{selectedRequest.customer_phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label className="text-xs text-muted-foreground">Registration</Label>
                    <p className="font-mono font-bold">{selectedRequest.registration_number}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">State</Label>
                    <p className="font-bold">{selectedRequest.state_of_registration}</p>
                  </div>
                  {selectedRequest.vin_number && (
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">VIN Number</Label>
                      <p className="font-mono">{selectedRequest.vin_number}</p>
                    </div>
                  )}
                  {selectedRequest.vehicle_make && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">Make</Label>
                        <p>{selectedRequest.vehicle_make}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Model</Label>
                        <p>{selectedRequest.vehicle_model}</p>
                      </div>
                      {selectedRequest.vehicle_year && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Year</Label>
                          <p>{selectedRequest.vehicle_year}</p>
                        </div>
                      )}
                    </>
                  )}
                  {selectedRequest.additional_vehicle_info && (
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">Additional Information</Label>
                      <p className="text-sm mt-1">{selectedRequest.additional_vehicle_info}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Information */}
              {selectedRequest.error_message && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Lookup Error Message</Label>
                  <Alert variant="destructive" className="text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{selectedRequest.error_message}</AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  defaultValue={selectedRequest.admin_notes || ""}
                  onBlur={(e) => {
                    if (e.target.value !== selectedRequest.admin_notes) {
                      updateAdminNotes(selectedRequest.id, e.target.value);
                    }
                  }}
                  placeholder="Add notes about this request (actions taken, follow-up needed, etc.)"
                  rows={4}
                />
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div>
                  <Label className="text-xs">Submitted</Label>
                  <p>{format(new Date(selectedRequest.created_at), "PPp")}</p>
                </div>
                {selectedRequest.contacted_at && (
                  <div>
                    <Label className="text-xs">Contacted</Label>
                    <p>{format(new Date(selectedRequest.contacted_at), "PPp")}</p>
                  </div>
                )}
                {selectedRequest.completed_at && (
                  <div>
                    <Label className="text-xs">Completed</Label>
                    <p>{format(new Date(selectedRequest.completed_at), "PPp")}</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
