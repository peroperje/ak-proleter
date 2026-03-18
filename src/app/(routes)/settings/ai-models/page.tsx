'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, 
  Trash2, 
  CheckCircle2, 
  Key, 
  Plus, 
  Save, 
  ChevronDown, 
  ChevronRight,
  Loader2,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_name: string;
  has_key: boolean;
}

export default function AIModelsPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newProvider, setNewProvider] = useState('huggingface');
  const [newModelName, setNewModelName] = useState('deepseek-ai/DeepSeek-V3-0324');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);

  const fetchModels = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/models');
      if (res.ok) {
        const data = await res.json();
        setModels(data);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
      toast.error('Failed to load models');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleAddModel = async () => {
    if (!newName || !newProvider || !newModelName) {
      toast.warn('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, provider: newProvider, model_name: newModelName }),
      });

      if (res.ok) {
        toast.success('Model added successfully');
        setIsAddingMode(false);
        setNewName('');
        fetchModels();
      } else {
        toast.error('Failed to add model');
      }
    } catch (error) {
      console.error('Error adding model:', error);
      toast.error('Error adding model');
    }
  };

  const handleDeleteModel = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this model?')) return;

    try {
      const res = await fetch(`/api/models/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Model deleted');
        fetchModels();
        if (selectedModelId === id) setSelectedModelId(null);
      } else {
        toast.error('Failed to delete model');
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Error deleting model');
    }
  };

  const handleSaveKey = async () => {
    if (!selectedModelId || !apiKey) return;

    try {
      setIsSavingKey(true);
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId: selectedModelId, key: apiKey }),
      });

      if (res.ok) {
        toast.success('API key saved');
        setApiKey('');
        fetchModels();
      } else {
        toast.error('Failed to save API key');
      }
    } catch (error) {
      console.error('Error saving key:', error);
      toast.error('Error saving key');
    } finally {
      setIsSavingKey(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="text-indigo-500" size={20} fill="currentColor" />
              AI Models
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage AI models and API keys for processing athletic results.
            </p>
          </div>
          {!isAddingMode && (
            <button
              onClick={() => setIsAddingMode(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              <Plus size={18} /> Add Model
            </button>
          )}
        </div>

        <div className="p-6">
          {isAddingMode && (
            <div className="mb-6 bg-gray-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Add New AI Model</h3>
                <button onClick={() => setIsAddingMode(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. DeepSeek V3"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  >
                    <option value="huggingface">Hugging Face</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="groq">Groq</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model ID</label>
                  <input
                    type="text"
                    placeholder="e.g. deepseek-ai/DeepSeek-V3"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAddModel}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold transition-all shadow-md active:scale-95"
                >
                  Confirm & Add
                </button>
                <button
                  onClick={() => setIsAddingMode(false)}
                  className="flex-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 py-2 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {models.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-neutral-700 rounded-2xl">
                <p className="text-gray-400">No AI models configured yet.</p>
              </div>
            ) : (
              models.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModelId(selectedModelId === m.id ? null : m.id)}
                  className={`group relative border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                    selectedModelId === m.id
                      ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/50 ring-1 ring-indigo-200 dark:ring-indigo-900/50'
                      : 'bg-white dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-colors ${
                        selectedModelId === m.id ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{m.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                            {m.provider}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">/</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {m.model_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {m.has_key && (
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-900/30">
                          <Key size={12} /> KEY SET
                        </div>
                      )}
                      <button
                        onClick={(e) => handleDeleteModel(m.id, e)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                      {selectedModelId === m.id ? <ChevronDown size={20} className="text-indigo-500" /> : <ChevronRight size={20} className="text-gray-300" />}
                    </div>
                  </div>

                  {selectedModelId === m.id && (
                    <div 
                      className="mt-6 pt-6 border-t border-indigo-100 dark:border-indigo-900/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                        {m.has_key ? 'Update API Key' : 'Enter API Key'}
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="password"
                            placeholder="sk-..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                          />
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                        <button
                          onClick={handleSaveKey}
                          disabled={!apiKey || isSavingKey}
                          className="bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSavingKey ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
