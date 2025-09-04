'use client';
import React, { useState, useRef, ReactElement } from 'react';
import clsx from 'clsx';
import useAIService from '@/app/lib/service/AISevice';
import Textarea from '@/app/ui/textarea';
import {
  FaMicrophoneAltIcon,
  FaStopCircleIcon,
  MdTextsmsIcon,
} from '@/app/ui/icons';
import Button from '@/app/ui/button';

const isDataPresent = <T,>(data: T | undefined): data is T => {
  return data !== undefined && Object.keys(data as object).length > 0;
};


export interface RenderTextAreaProps {
  prompt: string;
  setPrompt: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isDisabled: boolean;
  isProcessing: boolean;
}
export interface AiFormPopulatorProps<T> {
  onDataExtracted: (data: T) => void;
  isDisabled?: boolean;
  defaultPrompt: string;
  renderTextArea: (props:RenderTextAreaProps)=> ReactElement;
}

export default function AiFormPopulator<T,>({
  onDataExtracted,
  isDisabled = false,
  defaultPrompt,
                                          renderTextArea,
}: AiFormPopulatorProps<T>) {
  const aiService = useAIService({ defaultPrompt });

  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const extractedData = await aiService.extractData<T>(prompt);

      // Check if any data was extracted
      const hasData = isDataPresent<T>(extractedData);


      if (hasData) {
        onDataExtracted(extractedData);
        setPrompt('');
      } else {
        setError(
          'Could not extract information from the text. Please try rephrasing.',
        );
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
      const extractedData =
        await aiService.extractDataFromAudio<T>(audioFile);

      const hasData = isDataPresent<T>(extractedData);

      if (hasData) {
        onDataExtracted(extractedData);
        setSuccess(
          `✅ Extracted from audio`,
        );
        setAudioFile(null);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(
          'Could not extract athlete information from the audio. Please try again.',
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to extract data from audio',
      );
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
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.webm', {
          type: 'audio/wav',
        });
        setAudioFile(audioFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (e) {
      console.error('Error accessing microphone:', e);
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

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && inputMode === 'text') {
      await handleExtractFromText();
    }
  };

  return (
    <div>
      {/* Input Mode Toggle */}
      <div className='mb-4 grid grid-cols-2 border border-gray-200 dark:border-neutral-700'>
        <button
          type='button'
          onClick={() => setInputMode('text')}
          className={clsx(
            'flex items-center justify-center gap-2 px-3 py-1 text-sm font-medium transition-colors',
            inputMode === 'text'
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              : '',
          )}
        >
          <MdTextsmsIcon size={20} />
          <span>Text Input</span>
        </button>
        <button
          type='button'
          onClick={() => setInputMode('audio')}
          className={clsx(
            'flex items-center justify-center gap-2 px-3 py-1 text-sm font-medium transition-colors',
            inputMode === 'audio'
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              : '',
          )}
        >
          <FaMicrophoneAltIcon size={20} /> <span>Audio Input</span>
        </button>
      </div>
      <div className='mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20'>
        <p className='text-sm text-yellow-800 dark:text-yellow-200'>
          <strong>💡 Tip:</strong> Be specific! Say &#34;Create athlete John
          Smith, born January 15, 1990, male, phone 555-123-4567&#34;
        </p>
      </div>
      <div className='space-y-3'>
        {inputMode === 'text' && renderTextArea({
          prompt,
          setPrompt,
          handleKeyPress,
          isDisabled,
          isProcessing,
        }) && (
          <div className='min-h-52'>
            <Textarea
              label={'Enter description of athlete:'}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder='Example: Create athlete Maria Rodriguez, female, born March 15 1992, phone 555-0123, lives at 456 Oak Street, New York'
              rows={7}
              disabled={isDisabled || isProcessing}
            />
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              Press Ctrl+Enter to extract data
            </p>
          </div>
        )}

        {inputMode === 'audio' && (
          <div className='space-y-3'>
            <div className='min-h-52 flex flex-col w-full items-center justify-center '>
              <Button
                type='button'
                size={'large'}
                variant={isRecording ? 'cancel' : 'outline'}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isDisabled || isProcessing}
              >
                {isRecording ? (
                  <>
                    <FaStopCircleIcon />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <FaMicrophoneAltIcon size={20} />{' '}
                    <span>Start Recording</span>
                  </>
                )}
              </Button>


              <input
                ref={fileInputRef}
                type='file'
                accept='audio/*'
                onChange={handleFileUpload}
                className='hidden'
              />
            </div>

            {audioFile && (
              <div className='rounded-lg bg-green-100 p-3 dark:bg-green-900/20'>
                <p className='text-sm text-green-800 dark:text-green-200'>
                  ✅ Audio file ready: {audioFile.name}
                </p>
                <audio controls className='mt-2 w-full'>
                  <source src={URL.createObjectURL(audioFile)} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <p className='rounded bg-green-50 p-2 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400'>
            {success}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className='rounded bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400'>
            {error}
          </p>
        )}

        <div className='grid grid-cols-2 gap-2'>
          <Button
            type='button'
            onClick={
              inputMode === 'text'
                ? handleExtractFromText
                : handleExtractFromAudio
            }
            disabled={
              isDisabled ||
              isProcessing ||
              (inputMode === 'text' && !prompt.trim()) ||
              (inputMode === 'audio' && !audioFile)
            }
          >
            {isProcessing ? 'Processing...' : 'Extract & Populate'}
          </Button>

          <Button
            type='button'
            variant={'cancel'}
            onClick={() => {
              setPrompt('');
              setAudioFile(null);
              setError(null);
              setSuccess(null);
            }}
            disabled={isDisabled || isProcessing}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
