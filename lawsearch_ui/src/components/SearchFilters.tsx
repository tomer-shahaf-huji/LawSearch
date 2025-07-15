import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, Building2 } from "lucide-react";

interface SearchFiltersProps {
  filters: {
    dateRange: string;
    courts: string[];
    topics: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const courts = [
    'בית המשפט העליון',
    'בתי הדין לעבודה',
    'בתי המשפט המחוזיים',
    'בתי המשפט לענייני משפחה',
    'בתי המשפט לעניינים מקומיים',
    'בתי המשפט לתביעות קטנות',
    'בתי המשפט לתעבורה',
    'בתי משפט השלום',
    'בתי משפט לנוער',
    'ועדות שחרורים'
  ];

  const topics = [
    'אזרחי',
    'אין מידע',
    'בג"ץ',
    'ועדות שחרורים',
    'משפחה',
    'נוער',
    'עבודה',
    'עניינים כלכליים',
    'עניינים מנהליים',
    'פלילי',
    'שאר הנושאים',
    'תעבורה'
  ];

  // Change courts and topics to single value (string) instead of array
  const handleCourtChange = (court: string) => {
    if (filters.courts[0] === court) {
      // If already selected, clicking again removes the filter
      onFiltersChange({ ...filters, courts: [] });
    } else {
      onFiltersChange({ ...filters, courts: [court] });
    }
  };

  const handleTopicChange = (topic: string) => {
    if (filters.topics[0] === topic) {
      // If already selected, clicking again removes the filter
      onFiltersChange({ ...filters, topics: [] });
    } else {
      onFiltersChange({ ...filters, topics: [topic] });
    }
  };

  return (
    <div className="w-80 space-y-4" dir="rtl">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            סינון תוצאות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div>
            <Label className="flex items-center gap-2 text-base font-medium mb-3">
              <Calendar className="w-4 h-4" />
              תקופת זמן
            </Label>
            <Select value={filters.dateRange} onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר תקופה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל התקופות</SelectItem>
                <SelectItem value="last-year">השנה האחרונה</SelectItem>
                <SelectItem value="last-5-years">5 שנים אחרונות</SelectItem>
                <SelectItem value="last-10-years">10 שנים אחרונות</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Courts */}
          <div>
            <Label className="flex items-center gap-2 text-base font-medium mb-3">
              <Building2 className="w-4 h-4" />
              בתי משפט
            </Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {courts.map((court) => {
                const selected = filters.courts[0] === court;
                return (
                  <button
                    key={court}
                    type="button"
                    onClick={() => handleCourtChange(court)}
                    className={`flex items-center space-x-2 space-x-reverse focus:outline-none ${selected ? 'bg-legal-blue/10 border-legal-blue' : 'bg-transparent'} rounded px-2 py-1 w-full border transition-colors`}
                  >
                    <span
                      className={`inline-block w-4 h-4 rounded-full border-2 mr-2 ${selected ? 'border-legal-blue bg-legal-blue' : 'border-gray-400 bg-white'}`}
                    />
                    <span className="text-sm leading-tight">{court}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topics */}
          <div>
            <Label className="text-base font-medium mb-3 block">נושאים</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {topics.map((topic) => {
                const selected = filters.topics[0] === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicChange(topic)}
                    className={`flex items-center space-x-2 space-x-reverse focus:outline-none ${selected ? 'bg-legal-blue/10 border-legal-blue' : 'bg-transparent'} rounded px-2 py-1 w-full border transition-colors`}
                  >
                    <span
                      className={`inline-block w-4 h-4 rounded-full border-2 mr-2 ${selected ? 'border-legal-blue bg-legal-blue' : 'border-gray-400 bg-white'}`}
                    />
                    <span className="text-sm">{topic}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFilters;