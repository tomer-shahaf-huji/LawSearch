import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, Building2, FileText, Eye } from "lucide-react";
import { useState } from "react";

interface CaseResult {
  id: string;
  doc_id: string;
  chunk: string;
  content: string;
  headline: string;
  district: string;
  court: string;
  judges: string;
  judgement_type: string;
  decision_date: string;
  lexical_score?: number;
  semantic_score?: number;
  rrf_score?: number;
}

interface SearchResultsProps {
  results: CaseResult[];
  searchQuery: string;
  totalResults: number;
  onCaseClick: (caseId: string) => void;
  filters?: {
    years?: string[];
    courts?: string[];
    topics?: string[];
    districts?: string[];
  };
}

const SearchResults = ({ results, searchQuery, totalResults, onCaseClick, filters }: SearchResultsProps) => {
  const [selectedCase, setSelectedCase] = useState<CaseResult | null>(null);

  const highlightSearchTerm = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-legal-gray/20">{part}</mark>
      ) : part
    );
  };

  const handleCaseClick = (case_: CaseResult) => {
    setSelectedCase(case_);
    onCaseClick(case_.id);
  };

  // Helper to render active filters as a string
  const renderActiveFilters = () => {
    if (!filters) return null;
    const parts: string[] = [];
    if (filters.years && filters.years.length && !filters.years.includes("all")) {
      parts.push(`שנה: ${filters.years.join(", ")}`);
    }
    if (filters.districts && filters.districts.length) {
      parts.push(`מחוז: ${filters.districts.join(", ")}`);
    }
    if (filters.topics && filters.topics.length) {
      parts.push(`נושא: ${filters.topics.join(", ")}`);
    }
    if (filters.courts && filters.courts.length) {
      parts.push(`בית משפט: ${filters.courts.join(", ")}`);
    }
    if (parts.length === 0) return null;
    return `(${parts.join(" | ")})`;
  };

  return (
    <div className="flex-1 space-y-4" dir="rtl">
      {/* Results summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-legal-gray">
          נמצאו {totalResults.toLocaleString('he-IL')} תוצאות עבור "<span className="font-medium">{searchQuery}</span>" {renderActiveFilters() && <span className="text-xs text-muted-foreground">{renderActiveFilters()}</span>}
        </div>
        <div className="text-sm text-muted-foreground">
          מיון לפי רלוונטיות
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {results.map((case_) => (
          <Card 
            key={case_.id} 
            className="hover:shadow-md transition-shadow cursor-pointer border-r-4 border-r-legal-blue/20 hover:border-r-legal-blue"
            onClick={() => handleCaseClick(case_)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      מסמך: {case_.doc_id}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {case_.judgement_type}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold leading-tight mb-2 text-primary hover:text-legal-blue">
                    {highlightSearchTerm(case_.headline, searchQuery)}
                  </h3>
                </div>
                
                <Eye className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {highlightSearchTerm(case_.chunk, searchQuery)}
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>תאריך: {case_.decision_date}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>מחוז: {case_.district}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>בית משפט: {case_.court}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span>שופט/ת: {case_.judges}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full case view dialog */}
      <Dialog open={selectedCase !== null} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary">
                  {selectedCase.headline}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    מסמך: {selectedCase.doc_id}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {selectedCase.judgement_type}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>תאריך: {selectedCase.decision_date}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>מחוז: {selectedCase.district}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>בית משפט: {selectedCase.court}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span>שופט/ת: {selectedCase.judges}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">תוכן מלא:</h4>
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {highlightSearchTerm(selectedCase.content, searchQuery)}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchResults;