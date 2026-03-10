import { AdminUploadCard } from "@/components/admin/AdminUploadCard";
import { AdminDataCard } from "@/components/admin/AdminDataCard";
import { PremiumCalculator } from "@/components/admin/PremiumCalculator";
import { PDSUploadCard } from "@/components/admin/PDSUploadCard";
import { ManualQuoteRequestsCard } from "@/components/admin/ManualQuoteRequestsCard";
import { QuoteWidgetCard } from "@/components/admin/QuoteWidgetCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={() => navigate("/admin/submissions")}>
              <FileText className="mr-2 h-4 w-4" /> Submissions Viewer
            </Button>
          </div>
          <p className="text-muted-foreground mb-8">
            Upload and manage insurance pricing data and PDS documents
          </p>
          
          <div className="grid gap-6">
            <QuoteWidgetCard />
            <ManualQuoteRequestsCard />
            <AdminUploadCard />
            <PDSUploadCard />
            <AdminDataCard />
            <PremiumCalculator />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
