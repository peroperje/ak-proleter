'use client';
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { aiService } from '@/app/lib/service/AISevice';

interface SmartFormInputProps {
  onDataExtracted: (data: any) => void;
  isDisabled?: boolean;
}

export default function SmartFormInput({ onDataExtracted, isDisabled = false }: SmartFormInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'audio'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExtractFromText = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const extractedData = await aiService.extractAthleteData(prompt);

      // Check if any data was extracted
      const hasData = Object.keys(extractedData).length > 0;

      if (hasData) {
        onDataExtracted(extractedData);
        setSuccess(`✅ Extracted: ${Object.keys(extractedData).join(', ')}`);
        setPrompt('');
        // Don't auto-close, let user see the success message
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError('Could not extract athlete information from the text. Please try rephrasing.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractFromAudio = async () => {
    if (!audioFile) {
      setError('Please record or select an audio file');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const extractedData = await aiService.extractAthleteDataFromAudio(audioFile);

      const hasData = Object.keys(extractedData).length > 0;

      if (hasData) {
        onDataExtracted(extractedData);
        setSuccess(`✅ Extracted from audio: ${Object.keys(extractedData).join(', ')}`);
        setAudioFile(null);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError('Could not extract athlete information from the audio. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract data from audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        setAudioFile(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setError(null);
      } else {
        setError('Please select an audio file');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && inputMode === 'text') {
      handleExtractFromText();
    }
  };

  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
          🤖 Smart Form Population
        </h3>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 dark:bg-yellow-900/20 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>💡 Tip:</strong> Be specific! Say "Create athlete John Smith, born January 15, 1990, male, phone 555-123-4567"
            </p>
          </div>

          {/* Input Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={clsx(
                'px-3 py-1 text-sm rounded-md font-medium transition-colors',
                inputMode === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              )}
            >
              📝 Text Input
            </button>
            <button
              type="button"
              onClick={() => setInputMode('audio')}
              className={clsx(
                'px-3 py-1 text-sm rounded-md font-medium transition-colors',
                inputMode === 'audio'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              )}
            >
              🎤 Audio Input
            </button>
          </div>

          <div className="space-y-3">
            {inputMode === 'text' && (
              <div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Example: Create athlete Maria Rodriguez, female, born March 15 1992, phone 555-0123, lives at 456 Oak Street, New York"
                  className={clsx(
                    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400',
                    {
                      'border-red-500': error,
                      'border-green-500': success,
                    }
                  )}
                  rows={3}
                  disabled={isDisabled || isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                  Press Ctrl+Enter to extract data
                </p>
              </div>
            )}

            {inputMode === 'audio' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isDisabled || isProcessing}
                    className={clsx(
                      'px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2',
                      {
                        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': isRecording,
                        'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500': !isRecording && !isProcessing,
                        'bg-gray-300 text-gray-500 cursor-not-allowed': isProcessing,
                      }
                    )}
                  >
                    {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isDisabled || isProcessing}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    📁 Upload Audio
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {audioFile && (
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✅ Audio file ready: {audioFile.name}
                    </p>
                    <audio controls className="mt-2 w-full">
                      <source src={URL.createObjectURL(audioFile)} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                {success}
              </p>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={inputMode === 'text' ? handleExtractFromText : handleExtractFromAudio}
                disabled={
                  isDisabled ||
                  isProcessing ||
                  (inputMode === 'text' && !prompt.trim()) ||
                  (inputMode === 'audio' && !audioFile)
                }
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                  {
                    'bg-blue-600 text-white hover:bg-blue-700':
                      !isProcessing &&
                      ((inputMode === 'text' && prompt.trim()) || (inputMode === 'audio' && audioFile)),
                    'bg-gray-300 text-gray-500 cursor-not-allowed':
                      isProcessing ||
                      (inputMode === 'text' && !prompt.trim()) ||
                      (inputMode === 'audio' && !audioFile),
                  }
                )}
              >
                {isProcessing ? '⏳ Processing...' : '🚀 Extract & Populate'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrompt('');
                  setAudioFile(null);
                  setError(null);
                  setSuccess(null);
                }}
                disabled={isDisabled || isProcessing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
