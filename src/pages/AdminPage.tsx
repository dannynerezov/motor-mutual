import { AdminUploadCard } from "@/components/admin/AdminUploadCard";
import { AdminDataCard } from "@/components/admin/AdminDataCard";
import { PremiumCalculator } from "@/components/admin/PremiumCalculator";
import { PDSUploadCard } from "@/components/admin/PDSUploadCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AdminPage = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Upload and manage insurance pricing data and PDS documents
          </p>
          
          <div className="grid gap-6">
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
