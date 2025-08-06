import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, Building2 } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  filters: {
    courts: string[];
    topics: string[];
    years: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const judgement_type = [
    'פסק-דין',
    'החלטה'
   ];
 
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

  const [open, setOpen] = useState(true); // Sidebar open by default

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

  // Add clear filters handler
  const handleClearFilters = () => {
    onFiltersChange({
      courts: [],
      topics: [],
      years: ["all"]
    });
  };

  return (
    <div className="relative">
      {!open && (
        <button
          className="absolute left-0 top-0 z-10 bg-transparent border-none p-2 hover:bg-black/10 transition-colors flex items-center justify-center rounded"
          onClick={() => setOpen(true)}
          type="button"
          title="הצג סינון"
          style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Filter className="w-6 h-6 text-black" style={{ display: 'block', margin: 'auto' }} />
        </button>
      )}
      {open && (
        <div className="w-80 space-y-4" dir="rtl" style={{ transition: 'width 0.3s' }}>
          <Card>
            <CardHeader className="pb-3 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg">
                  <button
                    className="p-0 m-0 bg-transparent border-none focus:outline-none flex items-center justify-center"
                    onClick={() => setOpen(false)}
                    type="button"
                    title="הסתר סינון"
                    style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Filter className="w-6 h-6 text-black" style={{ display: 'block', margin: 'auto' }} />
                  </button>
                  סינון תוצאות
                </div>
                <button
                  className="text-xs font-bold text-black border border-black rounded px-3 py-1 hover:bg-black/10 transition-colors"
                  onClick={handleClearFilters}
                  type="button"
                >
                  נקה
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
                            {/* Document Type */}
                            <div>
                <Label className="text-base font-medium mb-3 block">סוג מסמך</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {judgement_type.map((topic) => {
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;