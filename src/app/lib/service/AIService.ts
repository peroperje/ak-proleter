import { InferenceClient } from '@huggingface/inference';
import { useMemo } from 'react';

export type ContextHints = {
  recentAthletes?: { id: string; name: string }[];
  currentEventId?: string;
  eventDisciplines?: string[];
  [key: string]: unknown;
};

export type AIModelConfig = {
  id: string;
  name: string;
  provider: string;
  modelName: string;
  apiKey?: string;
};

export class AIService {
  private readonly modelConfig: AIModelConfig;
  private readonly defaultPrompt: string;

  constructor(defaultPrompt: string, modelConfig?: AIModelConfig) {
    this.defaultPrompt = defaultPrompt;
    // Default to Hugging Face if no config provided (backward compatibility or fallback)
    this.modelConfig = modelConfig || {
      id: 'default',
      name: 'Default HF',
      provider: 'huggingface',
      modelName: 'deepseek-ai/DeepSeek-V3-0324',
      apiKey: process.env.NEXT_PUBLIC_HF_API_KEY || ''
    };
  }

  // Text processing using the configured model
  async extractData<T>(
    prompt: string,
    role: string = 'ATHLETE',
    language: string = 'sr-RS',
    contextHints?: ContextHints
  ): Promise<T | undefined> {
    try {
      // If we're on the client and no apiKey in config, proxy through server API
      // to keep API keys secure and abstracted
      if (typeof window !== 'undefined' && !this.modelConfig.apiKey) {
        const response = await fetch('/api/ai/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            role,
            language,
            contextHints,
            modelId: this.modelConfig.id === 'default' ? undefined : this.modelConfig.id
          })
        });
        if (response.ok) return await response.json();
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to extract data via API');
      }

      let result: string | undefined;

      switch (this.modelConfig.provider.toLowerCase()) {
        case 'huggingface':
          result = await this.tryHuggingFaceModel(prompt, role, language, contextHints);
          break;
        case 'gemini':
          result = await this.tryGeminiModel(prompt, role, language, contextHints);
          break;
        case 'openai':
          result = await this.tryOpenAIModel(prompt, role, language, contextHints);
          break;
        case 'groq':
          result = await this.tryGroqModel(prompt, role, language, contextHints);
          break;
        default:
          console.error(`Unsupported provider: ${this.modelConfig.provider}`);
          return undefined;
      }

      if (result) {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : result;
        const json = JSON.parse(jsonString);
        if (json) {
          return json;
        }
      }
    } catch (error) {
      console.error(`Error with model ${this.modelConfig.modelName}:`, error);
    }
    return undefined;
  }

  private constructSystemPrompt(role: string, language: string, contextHints?: ContextHints): string {
    const contextInfo = contextHints ? `
Context Hints:
${JSON.stringify(contextHints, null, 2)}
Use these to understand the context of the input text (e.g. timestamp, location).
` : '';

    return `
${this.defaultPrompt}
User Role: ${role}
Target Language: ${language}
${contextInfo}

Return ONLY a valid JSON object matching the requested schema.
JSON:`;
  }

  private async tryHuggingFaceModel(
    prompt: string,
    role: string,
    language: string,
    contextHints?: ContextHints
  ): Promise<string | undefined> {
    if (!this.modelConfig.apiKey) throw new Error("Hugging Face API key is missing");

    const systemPrompt = this.constructSystemPrompt(role, language, contextHints);
    const client = new InferenceClient(this.modelConfig.apiKey);
    
    const chatCompletion = await client.chatCompletion({
      model: this.modelConfig.modelName,
      messages: [
        {
          role: 'system',
          content: 'You are an athletic result processing assistant. Output ONLY valid JSON.',
        },
        {
          role: 'user',
          content: `${systemPrompt}\n\nText to process: "${prompt}"`,
        },
      ],
      response_format: {
        type: 'json_object',
      },
      temperature: 0.1,
      max_tokens: 150,
      top_p: 0.95,
      stream: false,
    });
    return chatCompletion.choices[0].message.content;
  }

  // Placeholder for Gemini integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async tryGeminiModel(_prompt: string, _role: string, _language: string, _contextHints?: ContextHints): Promise<string | undefined> {
    console.log("Gemini provider not yet fully implemented in this refactor");
    return undefined;
  }

  // Placeholder for OpenAI integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async tryOpenAIModel(_prompt: string, _role: string, _language: string, _contextHints?: ContextHints): Promise<string | undefined> {
    console.log("OpenAI provider not yet fully implemented in this refactor");
    return undefined;
  }

  // Placeholder for Groq integration
  private async tryGroqModel(prompt: string, role: string, language: string, contextHints?: ContextHints): Promise<string | undefined> {
    if (!this.modelConfig.apiKey) throw new Error("Groq API key is missing");

    const systemPrompt = this.constructSystemPrompt(role, language, contextHints);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.modelConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.modelConfig.modelName,
        messages: [
          {
            role: 'system',
            content: 'You are an athletic result processing assistant. Output ONLY valid JSON.',
          },
          {
            role: 'user',
            content: `${systemPrompt}\n\nText to process: "${prompt}"`,
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 150,
        top_p: 0.95,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  }

  // Alternative: Use Hugging Face's Whisper model for transcription
  async transcribeAudioWithHF(audioFile: File): Promise<string> {
    try {
      const apiKey = this.modelConfig.apiKey || process.env.NEXT_PUBLIC_HF_API_KEY || '';
      if (!apiKey) throw new Error("API key is missing for transcription");

      const response = await fetch(
        "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          method: "POST",
          body: audioFile,
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result.text || '';
      }
      return '';
    } catch (error) {
      console.error('HF transcription error:', error);
      throw error;
    }
  }

  // Process audio: transcribe then extract data
  async extractDataFromAudio<T>(audioFile: File): Promise<T | undefined> {
    const transcript = await this.transcribeAudioWithHF(audioFile);
    return this.extractData(transcript);
  }
}

type UseAIServiceProps = {
  defaultPrompt: string;
  modelConfig?: AIModelConfig;
}

const useAIService = ({ defaultPrompt, modelConfig }: UseAIServiceProps) => {
  return useMemo(() => new AIService(defaultPrompt, modelConfig), [defaultPrompt, modelConfig]);
}

export default useAIService;
