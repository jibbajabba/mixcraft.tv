'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const techniques = [
  'All',
  'Basics',
  'Beatmatching',
  // 'Build-Up/Breakdown',
  'EQ',
  'FX',
  'Drops',
  'Key',
  'Loops',
  // 'Quick Transitions',
  'Scratching',
  'Stems',
  'Tone Play'
  // 'Turntablism'
];

interface TechniqueFilterProps {
  selectedTechnique: string;
  onTechniqueChange: (technique: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function TechniqueFilter({
  selectedTechnique,
  onTechniqueChange,
  sortBy,
  onSortChange,
}: TechniqueFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap gap-1">
        {techniques.map((technique) => (
          <Button
            key={technique}
            variant={technique === selectedTechnique ? 'default' : 'outline'}
            className={`
              text-sm px-[1em] py-[1em] rounded-[2em] transition-all duration-200 h-7
              ${
                technique === selectedTechnique
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800 dark:text-card-foreground dark:hover:bg-blue-800 dark:hover:text-card-foreground'
              }
              dark:border-gray-700
            `}
            onClick={() => onTechniqueChange(technique)}
          >
            {technique}
          </Button>
        ))}
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="alphabetical">Alphabetical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}