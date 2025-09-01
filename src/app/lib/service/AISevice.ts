
import { InferenceClient } from "@huggingface/inference";
import { AthleteFormData } from '@/app/lib/actions';
import { useMemo } from 'react';
import { string } from 'yup';


export class AIService {
  private readonly hfApiKey: string;
  private readonly defaultPrompt: string;

  constructor(defultPrompt:string) {
    // the Hugging Face API key
    this.hfApiKey = process.env.NEXT_PUBLIC_HF_API_KEY || '';
    this.defaultPrompt = defultPrompt;
  }

  // Text processing using Hugging Face with a working model
  async extractAthleteData(prompt: string): Promise<AthleteFormData | undefined> {
    // Try multiple models in order of preference
    const models = [
      "deepseek-ai/DeepSeek-V3-0324",
    ];


    for (const model of models) {
      try {
        const result = await this.tryModel(model, prompt);
        if (result) return result;
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        console.warn(`Model ${model} failed, trying next...`);
      }
    }

    // If all models fail, use fallback extraction
  }

  private async tryModel(model: string, prompt: string): Promise<AthleteFormData | null> {
    const systemPrompt = `${this.defaultPrompt}

Text: "${prompt}"

JSON:`;
    const client = new InferenceClient(this.hfApiKey);
    const chatCompletion = await client.chatCompletion({
      model: model,
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0.1,
      max_tokens: 100,
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stream: false,
    });

    const content = chatCompletion.choices[0].message.content;


    if (content){
        const json = await JSON.parse(content);
      const dateOfBirth = new Date(json.dateOfBirth);
      if(json){
        return {
          ...json,
          dateOfBirth: dateOfBirth.toString() !== 'Invalid Date' ? dateOfBirth:undefined,
        }
      }
    }
    return null;
  }


  // Alternative: Use Hugging Face's Whisper model for transcription
  async transcribeAudioWithHF(audioFile: File): Promise<string> {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
        {
          headers: {
            Authorization: `Bearer ${this.hfApiKey}`,
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
  async extractAthleteDataFromAudio(audioFile: File): Promise<AthleteFormData | undefined> {
    const transcript = await this.transcribeAudioWithHF(audioFile);
    return this.extractAthleteData(transcript);

  }
}
type UseAIServiceProps = {
  defaultPrompt: string;
}
const useAIService = ({defaultPrompt}:UseAIServiceProps) => {
  return useMemo(()=>new AIService(defaultPrompt),[defaultPrompt]);
}
export default useAIService
