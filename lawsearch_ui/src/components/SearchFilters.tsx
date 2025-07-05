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
    "בית המשפט העליון",
    "בית משפט מחוזי תל אביב",
    "בית משפט מחוזי ירושלים",
    "בית משפט מחוზי חיפה",
    "בית משפט מחוזי באר שבע",
    "בית דין לעבודה ארצי",
    "בית משפט לענייני משפחה"
  ];

  const topics = [
    "נזיקין",
    "חוזים",
    "דיני משפחה",
    "דיני עבודה",
    "דיני חברות",
    "פלילי",
    "מנהלי",
    "חוקתי",
    "מיסים",
    "ביטוח"
  ];

  const handleCourtChange = (court: string, checked: boolean) => {
    const newCourts = checked 
      ? [...filters.courts, court]
      : filters.courts.filter(c => c !== court);
    
    onFiltersChange({ ...filters, courts: newCourts });
  };

  const handleTopicChange = (topic: string, checked: boolean) => {
    const newTopics = checked 
      ? [...filters.topics, topic]
      : filters.topics.filter(t => t !== topic);
    
    onFiltersChange({ ...filters, topics: newTopics });
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
              {courts.map((court) => (
                <div key={court} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`court-${court}`}
                    checked={filters.courts.includes(court)}
                    onCheckedChange={(checked) => handleCourtChange(court, checked as boolean)}
                  />
                  <Label htmlFor={`court-${court}`} className="text-sm leading-tight">
                    {court}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <Label className="text-base font-medium mb-3 block">נושאים</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {topics.map((topic) => (
                <div key={topic} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`topic-${topic}`}
                    checked={filters.topics.includes(topic)}
                    onCheckedChange={(checked) => handleTopicChange(topic, checked as boolean)}
                  />
                  <Label htmlFor={`topic-${topic}`} className="text-sm">
                    {topic}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFilters;