'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ExternalLink, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface Video {
  id: number;
  title: string;
  source: string;
  tags: string[];
  url: string;
  ytid: string;
  weight: string;
  date: string;
}

interface VideoGridProps {
  selectedTechnique: string;
  searchQuery: string;
  onTechniqueChange: (technique: string) => void;
  sortBy: string;
}

export default function VideoGrid({
  selectedTechnique,
  searchQuery,
  onTechniqueChange,
  sortBy,
}: VideoGridProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/VideoGrid.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data.videos)) {
        throw new Error('Invalid data format: expected an array of videos');
      }
      setVideos(data.videos);
    } catch (err) {
      if (err instanceof Error) {
        setError(
          `Failed to load videos: ${err.message}. Please check your internet connection and try again.`
        );
      } else {
        setError(
          'An unexpected error occurred while loading videos. Please try again.'
        );
      }
      console.error('Error fetching videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos
    .filter((video) => {
      const matchesTechnique =
        selectedTechnique === 'All' ||
        video.tags.includes(selectedTechnique);
      const matchesSearch =
        searchQuery === '' ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesTechnique && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      // Default to newest
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="bg-background shadow-md rounded-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-muted" />
            <CardFooter className="flex flex-col items-start p-4">
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2 mb-3" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-6 bg-muted rounded w-16" />
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button onClick={fetchVideos} className="mt-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (filteredVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-lg p-8 inline-block">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No videos found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVideos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="bg-card shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800/50 dark:backdrop-blur-sm">
            <CardContent className="p-0 relative aspect-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.ytid}?si=lhpskc_FdSK8udD-`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <div className="flex items-start justify-between w-full">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/title"
                >
                  <h3 className="font-semibold text-lg text-foreground group-hover/title:text-blue-500 dark:group-hover/title:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                    {video.title}
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover/title:opacity-100 transition-opacity duration-200" />
                  </h3>
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 mb-3">
                <Youtube className="h-4 w-4" />
                <span>{video.source}</span>
                <span>•</span>
                <time dateTime={video.date}>
                  {new Date(video.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex gap-2 flex-wrap">
                {video.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 transition-colors duration-200 cursor-pointer rounded-[20px]"
                    onClick={() => onTechniqueChange(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}