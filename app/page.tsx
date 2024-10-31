'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import TechniqueFilter from '@/components/TechniqueFilter';
import TechniqueHero from '@/components/TechniqueHero';
import VideoGrid from '@/components/VideoGrid';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';

export default function Home() {
  const [selectedTechnique, setSelectedTechnique] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' &&
        document.activeElement instanceof HTMLInputElement
      ) {
        if (
          document.activeElement.getAttribute('data-search-input') === 'true'
        ) {
          setSearchQuery('');
          document.activeElement.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTechniqueChange = (technique: string) => {
    setSelectedTechnique(technique);
    if (searchQuery) {
      setSearchQuery('');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setSelectedTechnique('All');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchVisible(false);
  };

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-4">
          <div className="max-w-2xl">
            <Logo onTechniqueChange={handleTechniqueChange} />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <Search className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle search</span>
          </Button>
        </div>

        <AnimatePresence>
          {isSearchVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-8"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for mixing techniques..."
                  className="pl-10 h-12 bg-background border-input"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  data-search-input="true"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <TechniqueFilter
          selectedTechnique={selectedTechnique}
          onTechniqueChange={handleTechniqueChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <TechniqueHero technique={selectedTechnique} />

        <VideoGrid
          selectedTechnique={selectedTechnique}
          searchQuery={searchQuery}
          onTechniqueChange={handleTechniqueChange}
          sortBy={sortBy}
        />

        <hr className="mt-16 mb-8 border-t border-border" />

        <footer className="flex justify-between items-center text-sm text-muted-foreground pb-8">
          <div>
            <span>Mixcraft.tv</span>
            <span className="mx-2">&middot;</span>
            <span>&copy; 2024</span>
            <span className="mx-2">&middot;</span>
            Created by{' '}
            <a
              href="https://konigi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Konigi
            </a>
          </div>
          <ThemeToggle />
        </footer>
      </div>
    </main>
  );
}