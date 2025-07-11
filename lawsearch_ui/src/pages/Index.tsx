import { useState } from "react";
import SearchHeader from "@/components/SearchHeader";
import SearchFilters from "@/components/SearchFilters";
import SearchResults from "@/components/SearchResults";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    dateRange: "all",
    courts: [],
    topics: []
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8501/api/lexical_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || data || []);
      setTotalResults(data.total || data.length || 0);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בחיפוש');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaseClick = (caseId: string) => {
    console.log("Opening case:", caseId);
    // TODO: Navigate to case details page
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />
      
      {!hasSearched ? (
        // Hero section when no search has been performed
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-br from-primary/5 to-legal-gray/10 rounded-2xl p-12 mb-8">
                <h2 className="text-3xl font-bold text-primary mb-6" dir="rtl">
                  מנוע החיפוש המתקדם לפסקי דין ישראליים
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed" dir="rtl">
                  חפש ומצא פסקי דין מכל בתי המשפט בישראל. בסיס נתונים מקיף עם מנוע חיפוש חכם 
                  המאפשר לחפש בטקסט חופשי או בעזרת מסננים מתקדמים.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 text-right" dir="rtl">
                <div className="p-8 rounded-xl bg-card border-2 border-primary/10 hover:border-primary/20 transition-colors shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mr-auto">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="font-bold text-primary mb-3 text-lg">חיפוש מתקדם</h3>
                  <p className="text-muted-foreground leading-relaxed">חפש בטקסט חופשי או השתמש במסננים לפי תאריך, בית משפט ונושא</p>
                </div>
                
                <div className="p-8 rounded-xl bg-card border-2 border-accent/10 hover:border-accent/20 transition-colors shadow-sm">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mr-auto">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <h3 className="font-bold text-primary mb-3 text-lg">כיסוי מלא</h3>
                  <p className="text-muted-foreground leading-relaxed">פסקי דין מכל בתי המשפט: עליון, מחוזי, שלום ובתי דין מיוחדים</p>
                </div>
                
                <div className="p-8 rounded-xl bg-card border-2 border-legal-gray/20 hover:border-legal-gray/30 transition-colors shadow-sm">
                  <div className="w-12 h-12 bg-legal-gray/10 rounded-lg flex items-center justify-center mb-4 mr-auto">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h3 className="font-bold text-primary mb-3 text-lg">עדכון שוטף</h3>
                  <p className="text-muted-foreground leading-relaxed">בסיס הנתונים מתעדכן באופן קבוע עם פסקי דין חדשים</p>
                </div>
              </div>
            </div>
        </div>
      ) : (
        // Search results section
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            <SearchFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
            
            {error ? (
              <div className="text-center py-8">
                <p className="text-destructive">שגיאה: {error}</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">מחפש...</p>
              </div>
            ) : (
              <SearchResults
                results={results}
                searchQuery={searchQuery}
                totalResults={totalResults}
                onCaseClick={handleCaseClick}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;