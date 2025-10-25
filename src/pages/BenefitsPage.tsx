import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { 
  Car, 
  Droplets, 
  Flame, 
  ShieldAlert, 
  CloudRain, 
  CloudHail,
  Download,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  XCircle,
  MapPin
} from "lucide-react";
import { useState } from "react";

const benefitIcons = {
  collision_damage: Car,
  flood_damage: Droplets,
  fire_damage: Flame,
  theft: ShieldAlert,
  storm_damage: CloudRain,
  hail_damage: CloudHail
};

const BenefitsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: activePds, isLoading } = useQuery({
    queryKey: ['active-pds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_active_pds')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const getPdfUrl = (path: string) => {
    const { data } = supabase.storage.from('pds-documents').getPublicUrl(path);
    return data.publicUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading benefits information...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!activePds) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Active PDS</CardTitle>
              <CardDescription>
                Product Disclosure Statement information is currently being prepared.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Please check back soon or contact support for more information.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredSections = (activePds.full_content as any)?.sections?.filter((section: any) =>
    searchTerm === "" ||
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Your Membership Benefits
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Comprehensive protection for your vehicle
          </p>
          <Badge variant="outline" className="text-lg py-2 px-4">
            PDS Version {activePds.version_number} | 
            Effective from {format(new Date(activePds.effective_from), 'PPP')}
          </Badge>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-12 space-y-16">
        {/* Key Benefits Grid */}
        <section>
          <h2 className="text-4xl font-bold mb-8 text-center">What's Covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePds.key_benefits && Object.entries(activePds.key_benefits).map(([key, benefit]: [string, any]) => {
              const Icon = benefitIcons[key as keyof typeof benefitIcons];
              return (
                <Card key={key} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    {Icon && <Icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />}
                    <CardTitle className="capitalize">{key.replace(/_/g, ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{benefit.description}</p>
                    {benefit.covered ? (
                      <Badge className="bg-green-600 hover:bg-green-700 gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Covered
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Not Covered
                      </Badge>
                    )}
                    {benefit.conditions && benefit.conditions.length > 0 && (
                      <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="conditions">
                          <AccordionTrigger className="text-sm">View Conditions</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-4 space-y-1">
                              {benefit.conditions.map((condition: string, idx: number) => (
                                <li key={idx} className="text-sm">{condition}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Coverage Details */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center">Coverage Details</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Maximum Cover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    ${(activePds.coverage_details as any)?.maximum_cover?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-muted-foreground">
                    {(activePds.coverage_details as any)?.currency || 'AUD'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Geographic Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {(activePds.coverage_details as any)?.geographic_limitations || 'Australia-wide'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <ShieldAlert className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Coverage Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {(activePds.coverage_details as any)?.coverage_types?.length || 0} types covered
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Exclusions */}
        <section className="py-16 bg-destructive/5 rounded-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-8">
              <AlertTriangle className="h-12 w-12 text-destructive mr-4" />
              <h2 className="text-4xl font-bold">What's Not Covered</h2>
            </div>
            <Card className="border-destructive/50">
              <CardContent className="pt-6">
                <Accordion type="multiple">
                  <AccordionItem value="general">
                    <AccordionTrigger className="text-lg font-semibold">General Exclusions</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {((activePds.exclusions as any)?.general_exclusions as string[] || []).map((exclusion: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <XCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
                            <span>{exclusion}</span>
                          </li>
                        ))}
                        {((activePds.exclusions as any)?.general_exclusions as string[] || []).length === 0 && (
                          <li>No general exclusions listed</li>
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {(activePds.exclusions as any)?.specific_exclusions && Object.keys((activePds.exclusions as any).specific_exclusions).length > 0 && (
                    <AccordionItem value="specific">
                      <AccordionTrigger className="text-lg font-semibold">Specific Exclusions</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {Object.entries((activePds.exclusions as any).specific_exclusions).map(([category, items]: [string, any]) => (
                            <div key={category}>
                              <h4 className="font-semibold mb-2 capitalize">{category.replace(/_/g, ' ')}</h4>
                              <ul className="space-y-1 ml-4">
                                {Array.isArray(items) ? items.map((item: string, idx: number) => (
                                  <li key={idx} className="text-sm text-muted-foreground">• {item}</li>
                                )) : <li className="text-sm text-muted-foreground">• {items}</li>}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Full PDS Document */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Complete Product Disclosure Statement
            </h2>
            
            <div className="flex justify-center mb-8">
              <Button asChild size="lg">
                <a href={getPdfUrl(activePds.pdf_file_path)} download target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF (Version {activePds.version_number})
                </a>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <Input 
                  type="search" 
                  placeholder="Search the PDS..." 
                  className="mb-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CardHeader>
              <CardContent>
                {filteredSections.length > 0 ? (
                  <Accordion type="single" collapsible>
                    {filteredSections.map((section: any, idx: number) => (
                      <AccordionItem key={idx} value={`section-${idx}`}>
                        <AccordionTrigger>
                          {section.title} {section.page_number && `(Page ${section.page_number})`}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="prose max-w-none dark:prose-invert">
                            <p className="whitespace-pre-wrap">{section.content}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {searchTerm ? "No matching sections found" : "No document sections available"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BenefitsPage;
