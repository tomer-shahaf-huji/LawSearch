import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2, FileText, Eye } from "lucide-react";

interface CaseResult {
  id: string;
  title: string;
  headline: string;
  topic: string;
  date: string;
  court: string;
  summary: string;
  caseNumber: string;
}

interface SearchResultsProps {
  results: CaseResult[];
  searchQuery: string;
  totalResults: number;
  onCaseClick: (caseId: string) => void;
}

const SearchResults = ({ results, searchQuery, totalResults, onCaseClick }: SearchResultsProps) => {
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

  return (
    <div className="flex-1 space-y-4" dir="rtl">
      {/* Results summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-legal-gray">
          נמצאו {totalResults.toLocaleString('he-IL')} תוצאות עבור "<span className="font-medium">{searchQuery}</span>"
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
            onClick={() => onCaseClick(case_.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {case_.caseNumber}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {case_.topic}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold leading-tight mb-2 text-primary hover:text-legal-blue">
                    {highlightSearchTerm(case_.title, searchQuery)}
                  </h3>
                  
                  <p className="text-base text-foreground font-medium mb-2">
                    {highlightSearchTerm(case_.headline, searchQuery)}
                  </p>
                </div>
                
                <Eye className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {highlightSearchTerm(case_.summary, searchQuery)}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>{case_.date}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{case_.court}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>פסק דין מלא</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load more */}
      {results.length > 0 && (
        <div className="text-center pt-6">
          <button className="text-legal-blue hover:text-legal-blue-light font-medium">
            טען תוצאות נוספות
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;