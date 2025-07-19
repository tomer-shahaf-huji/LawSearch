import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, Building2 } from "lucide-react";

interface SearchFiltersProps {
  filters: {
    courts: string[];
    topics: string[];
    years: string[];
    districts?: string[];
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
    'בג"ץ',
    'ועדות שחרורים',
    'משפחה',
    'נוער',
    'עבודה',
    'עניינים כלכליים',
    'עניינים מנהליים',
    'פלילי',
    'שאר הנושאים',
    'תעבורה', 
    'אין מידע',
  ];

  const districts = [
    'מחוז תל-אביב',
    'מחוז חיפה',
    'מחוז מרכז',
    'מחוז דרום',
    'מחוז ירושלים',
    'מחוז צפון',
    'בית המשפט העליון',
    'אין מידע'
  ]

  const allYearsValue = "all";
  const years = [
    allYearsValue, // 'כל השנים' option
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "unknown"
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

  const handleYearChange = (year: string) => {
    let yearsArr = filters.years || [];
    if (year === allYearsValue) {
      // If 'all years' is selected, deselect all others and select only 'all'
      onFiltersChange({ ...filters, years: [allYearsValue] });
      return;
    }
    // If any other year is selected, remove 'all' if present
    yearsArr = yearsArr.filter((y) => y !== allYearsValue);
    if (yearsArr.includes(year)) {
      const newYears = yearsArr.filter((y) => y !== year);
      // If nothing left, reselect 'all years'
      onFiltersChange({ ...filters, years: newYears.length === 0 ? [allYearsValue] : newYears });
    } else {
      onFiltersChange({ ...filters, years: [...yearsArr, year] });
    }
  };

  const handleDistrictChange = (district: string) => {
    if ((filters.districts || [])[0] === district) {
      // If already selected, clicking again removes the filter
      onFiltersChange({ ...filters, districts: [] });
    } else {
      onFiltersChange({ ...filters, districts: [district] });
    }
  };

  // Add clear filters handler
  const handleClearFilters = () => {
    onFiltersChange({
      courts: [],
      topics: [],
      years: ["all"],
      districts: []
    });
  };

  return (
    <div className="w-80 space-y-4" dir="rtl">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              סינון תוצאות
            </CardTitle>
            <button
              className="text-xs text-legal-blue border border-legal-blue rounded px-2 py-1 hover:bg-legal-blue/10 transition-colors"
              onClick={handleClearFilters}
              type="button"
            >
              נקה
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Year Multi-Select */}
          <div>
            <Label className="flex items-center gap-2 text-base font-medium mb-3">
              <Calendar className="w-4 h-4" />
              שנים
            </Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {years.map((year) => {
                const selected = (filters.years || []).includes(year);
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearChange(year)}
                    className={`flex items-center space-x-2 space-x-reverse focus:outline-none ${selected ? 'bg-legal-blue/10 border-legal-blue' : 'bg-transparent'} rounded px-2 py-1 w-full border transition-colors`}
                  >
                    <span
                      className={`inline-block w-4 h-4 rounded-full border-2 mr-2 ${selected ? 'border-legal-blue bg-legal-blue' : 'border-gray-400 bg-white'}`}
                    />
                    <span className="text-sm leading-tight">{year === allYearsValue ? "כל השנים" : year}</span>
                  </button>
                );
              })}
            </div>
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

          {/* Districts */}
          <div>
            <Label className="text-base font-medium mb-3 block">מחוזות</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {districts.map((district) => {
                const selected = (filters.districts || [])[0] === district;
                return (
                  <button
                    key={district}
                    type="button"
                    onClick={() => handleDistrictChange(district)}
                    className={`flex items-center space-x-2 space-x-reverse focus:outline-none ${selected ? 'bg-legal-blue/10 border-legal-blue' : 'bg-transparent'} rounded px-2 py-1 w-full border transition-colors`}
                  >
                    <span
                      className={`inline-block w-4 h-4 rounded-full border-2 mr-2 ${selected ? 'border-legal-blue bg-legal-blue' : 'border-gray-400 bg-white'}`}
                    />
                    <span className="text-sm">{district}</span>
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