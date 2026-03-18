'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_name: string;
  has_key: boolean;
}

interface AIConfigContextType {
  models: AIModel[];
  selectedModelId: string | null;
  setSelectedModelId: (id: string | null) => void;
  isLoading: boolean;
}

const AIConfigContext = createContext<AIConfigContextType | undefined>(undefined);

export function AIConfigProvider({ children }: { children: ReactNode }) {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('/api/models');
        if (res.ok) {
          const data = await res.json();
          setModels(data);
          
          // Set default model (first one with key)
          const stored = localStorage.getItem('selectedAIModelId');
          if (stored && data.some((m: AIModel) => m.id === stored)) {
            setSelectedModelId(stored);
          } else {
            const firstWithKey = data.find((m: AIModel) => m.has_key);
            if (firstWithKey) setSelectedModelId(firstWithKey.id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch AI models for context:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchModels();
  }, []);

  const handleSetSelectedModelId = (id: string | null) => {
    setSelectedModelId(id);
    if (id) {
      localStorage.setItem('selectedAIModelId', id);
    } else {
      localStorage.removeItem('selectedAIModelId');
    }
  };

  return (
    <AIConfigContext.Provider value={{ models, selectedModelId, setSelectedModelId: handleSetSelectedModelId, isLoading }}>
      {children}
    </AIConfigContext.Provider>
  );
}

export function useAIConfig() {
  const context = useContext(AIConfigContext);
  if (context === undefined) {
    throw new Error('useAIConfig must be used within an AIConfigProvider');
  }
  return context;
}
