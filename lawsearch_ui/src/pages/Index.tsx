import { useState } from "react";
import SearchHeader from "@/components/SearchHeader";
import SearchFilters from "@/components/SearchFilters";
import SearchResults from "@/components/SearchResults";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: "all",
    courts: [],
    topics: []
  });

  // Mock data for demonstration
  const mockResults = [
    {
      id: "1",
      title: "עמותת מיצדק לאמנות נגד עיריית תל אביב-יפו",
      headline: "ערעור על החלטת בית משפט השלום בעניין זכויות יוצרים ברחבה ציבורית",
      topic: "קניין רוחני",
      date: "15 בנובמבר 2023",
      court: "בית משפט מחוזי תל אביב",
      summary: "בית המשפט דן בשאלת היקף זכויות האמן ברחבה ציבורית לעומת סמכויות העירייה בעיצוב המרחב הציבורי. הדיון התמקד בפרשנות חוק זכות יוצרים ביחס ליצירות אמנות קבועות במרחב הציבורי.",
      caseNumber: "ע\"א 1234/23"
    },
    {
      id: "2", 
      title: "ישראל כהן נגד חברת הביטוח הכללית",
      headline: "תביעת נזיקין בעקבות תאונת דרכים - חובת הוכחת רשלנות",
      topic: "נזיקין",
      date: "8 באוקטובר 2023",
      court: "בית משפט מחוזי ירושלים",
      summary: "התיק עוסק בשאלת חלוקת נטל ההוכחה בתביעות נזיקין הנובעות מתאונות דרכים. בית המשפט קבע כללים חדשים לגבי הוכחת רשלנות במקרים של התנגשות צד.",
      caseNumber: "ת\"א 5678/22"
    },
    {
      id: "3",
      title: "המדינה נגד אברהם לוי",
      headline: "עבירות מס הכנסה - פרשנות החוק בעניין הכנסות לא דווחות",
      topic: "מיסים",
      date: "22 בספטמבר 2023", 
      court: "בית משפט מחוזי חיפה",
      summary: "פסק הדין קובע תקדים חשוב בפרשנות חוק מס הכנסה בנוגע להכנסות מעסקאות מקרקעין שלא דווחו כדין. בית המשפט התייחס לשאלת התיקנון התיאוטי של המס.",
      caseNumber: "ת\"פ 9012/23"
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setHasSearched(true);
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
            
            <SearchResults
              results={mockResults}
              searchQuery={searchQuery}
              totalResults={156}
              onCaseClick={handleCaseClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;