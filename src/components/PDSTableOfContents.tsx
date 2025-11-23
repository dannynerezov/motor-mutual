import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TOCItem {
  id: string;
  label: string;
  children?: TOCItem[];
}

const tocData: TOCItem[] = [
  { id: "contact-details", label: "Contact Details" },
  { id: "introduction", label: "Introduction" },
  { id: "glossary", label: "Glossary" },
  {
    id: "part-1",
    label: "Part 1: Product Disclosure Statement",
    children: [
      { id: "section-1", label: "Section 1 — Introduction" },
      { id: "section-2", label: "Section 2 — About Motor Cover Mutual Limited" },
      { id: "section-3", label: "Section 3 — Membership" },
      { id: "section-4", label: "Section 4 — Discretionary Risk Protection" },
      { id: "section-5", label: "Section 5 — Financial Information" },
      { id: "section-6", label: "Section 6 — Making a Claim" },
      { id: "section-7", label: "Section 7 — Complaints" },
      { id: "section-8", label: "Section 8 — Changes and Cancellation" },
    ],
  },
  {
    id: "part-2",
    label: "Part 2: Protection Wording",
    children: [
      { id: "section-9", label: "Section 9 — Nature of Discretionary Protection" },
      { id: "section-10", label: "Section 10 — Types of Cover" },
      { id: "section-11", label: "Section 11 — Optional Add-On Covers" },
      { id: "section-12", label: "Section 12 — Claims Lodgement Requirements" },
      { id: "section-13", label: "Section 13 — Claims Settlement" },
      { id: "section-14", label: "Section 14 — Exclusions" },
      { id: "section-15", label: "Section 15 — Excess Structure" },
      { id: "section-16", label: "Section 16 — Complaints & Dispute Resolution" },
      { id: "section-17", label: "Section 17 — Definitions" },
      { id: "section-18", label: "Section 18 — Statutory References" },
      { id: "section-19", label: "Section 19 — Add-On Cover Schedules" },
      { id: "section-20", label: "Section 20 — Member Obligations" },
      { id: "section-21", label: "Section 21 — Example Scenarios" },
    ],
  },
];

interface PDSTableOfContentsProps {
  mobile?: boolean;
}

export function PDSTableOfContents({ mobile = false }: PDSTableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "part-1": true,
    "part-2": true,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0.1,
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll("[id]");
    sections.forEach((section) => {
      if (section.id) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const renderTOCItem = (item: TOCItem, level: number = 0) => {
    const isActive = activeSection === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups[item.id];

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleGroup(item.id);
            }
            scrollToSection(item.id);
          }}
          className={cn(
            "w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center justify-between group",
            level === 0 && "font-semibold",
            level === 1 && "pl-6 text-xs",
            isActive
              ? "bg-primary/10 text-primary border-l-2 border-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <span className="flex-1">{item.label}</span>
          {hasChildren && (
            <span className="ml-2">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map((child) => renderTOCItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (mobile) {
    return (
      <Accordion type="single" collapsible defaultValue="toc" className="w-full">
        <AccordionItem value="toc" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <h2 className="text-lg font-semibold">Table of Contents</h2>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <nav aria-label="Table of Contents Navigation" className="space-y-1">
              {tocData.map((item) => renderTOCItem(item))}
            </nav>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <nav
      aria-label="Table of Contents Navigation"
      className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto bg-muted/30 border border-border rounded-lg p-4"
    >
      <h2 className="text-base font-bold mb-4 text-primary">Table of Contents</h2>
      <div className="space-y-1">
        {tocData.map((item) => renderTOCItem(item))}
      </div>
    </nav>
  );
}
