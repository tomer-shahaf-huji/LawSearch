import { Search, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  showPopularSearches?: boolean;
}

const SearchHeader = ({ searchQuery, onSearchChange, onSearch, showPopularSearches }: SearchHeaderProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  // Handler for popular search click
  const handlePopularSearch = (value: string) => {
    onSearchChange(value);
  };

  return (
    <div className="bg-header-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-6">
          <Scale className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold text-primary">מנוע חיפוש פסקי דין</h1>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="flex gap-2">
            <Button type="submit" onClick={onSearch} variant="default" className="px-6">
              חפש
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-legal-blue w-5 h-5" />
              <Input
                type="text"
                placeholder="חפש פסקי דין, נושאים, שמות שופטים..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 text-right bg-search-bg border-border focus:ring-2 focus:ring-legal-blue shadow-sm"
                dir="rtl"
              />
            </div>
          </form>
          
          {showPopularSearches && (
            <div className="flex gap-2 mt-4 items-center justify-end">
              <button className="text-legal-gray hover:text-legal-blue transition-colors" type="button" onClick={() => handlePopularSearch('פלילי')}>פלילי</button>
              <button className="text-legal-gray hover:text-legal-blue transition-colors" type="button" onClick={() => handlePopularSearch('דיני עבודה')}>דיני עבודה</button>
              <button className="text-legal-gray hover:text-legal-blue transition-colors" type="button" onClick={() => handlePopularSearch('דיני משפחה')}>דיני משפחה</button>
              <button className="text-legal-gray hover:text-legal-blue transition-colors" type="button" onClick={() => handlePopularSearch('נזיקין')}>נזיקין</button>
              <span className="text-legal-gray-dark">:חיפושים פופולריים</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;