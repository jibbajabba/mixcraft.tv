"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc3, ArrowUpDown, Waves, Combine, Split, Volume2, Sliders, Filter, Music2, Repeat, Layers, ChevronsDown, Shell, ChevronLeft, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const iconMap = {
  Disc3,
  ArrowUpDown,
  Waves,
  Combine,
  Split,
  Volume2,
  Sliders,
  Filter,
  Music2,
  Repeat,
  Layers,
  ChevronsDown,
  Shell
}

interface TechniqueInfo {
  iconName: keyof typeof iconMap
  description: string
  tip: string
}

interface TechniqueData {
  [key: string]: TechniqueInfo
}

interface TechniqueHeroProps {
  technique: string
}

export default function TechniqueHero({ technique }: TechniqueHeroProps) {
  const [techniqueInfo, setTechniqueInfo] = useState<TechniqueData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchTechniqueInfo = async () => {
      try {
        const response = await fetch('/TechniqueInfo.json')
        const data = await response.json()
        setTechniqueInfo(data)
      } catch (error) {
        console.error('Error loading technique information:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTechniqueInfo()
  }, [])

  useEffect(() => {
    setIsExpanded(false)
  }, [technique])

  if (isLoading || technique === 'All' || !techniqueInfo[technique]) {
    return null
  }

  const { iconName, description, tip } = techniqueInfo[technique]
  const Icon = iconMap[iconName]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={technique}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          height: isExpanded ? 340 : 110
        }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 mb-8 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent" />
        <div className="relative z-10 w-full">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-blue-600/10 dark:bg-blue-400/10 rounded-lg shrink-0">
                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{technique}</h2>
            </div>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 ml-4 shrink-0 shadow-sm"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl"
              >
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {description}
                </p>
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Pro Tip</h3>
                  <p className="text-gray-700 dark:text-gray-300">{tip}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10">
          <Icon className="w-64 h-64" />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}