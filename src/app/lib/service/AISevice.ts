
import { InferenceClient } from "@huggingface/inference";
import { AthleteFormData } from '@/app/lib/actions';


export class AIService {
  private hfApiKey: string;

  constructor() {
    // Hugging Face API key (free forever)
    this.hfApiKey = process.env.NEXT_PUBLIC_HF_API_KEY || '';
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
    const systemPrompt = `Extract athlete information from this text and return as JSON with these fields: firstName, lastName, dateOfBirth (YYYY-MM-DD format), gender (male/female), phone, address, notes, photoUrl. Only include fields clearly mentioned.

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
    /*try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${this.hfApiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: systemPrompt,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.1,
              do_sample: false,
              return_full_text: false
            }
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.error(`Model ${model} not found or not available through inference API`);
          return null;
        }
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();

      console.log(`Model ${model} response:`, result);

      // Handle different response formats
      let generatedText = '';
      if (Array.isArray(result)) {
        generatedText = result[0]?.generated_text || result[0]?.text || '';
      } else {
        generatedText = result.generated_text || result.text || '';
      }

      // Try to extract JSON from response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          // If JSON parsing fails, continue to fallback
        }
      }

      return null;
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      throw error;
    }*/
  }

  // Alternative approach: Use a text classification model for better results
  /*async extractAthleteDataAlternative(prompt: string): Promise<AthleteFormData> {
    try {
      // Use a more reliable text generation model
      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-base",
        {
          headers: {
            Authorization: `Bearer ${this.hfApiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `Extract athlete information from this text and format as JSON with fields firstName, lastName, dateOfBirth (YYYY-MM-DD), gender (male/female), phone, address, notes, photoUrl: "${prompt}"`,
            parameters: {
              max_new_tokens: 100,
              temperature: 0.1
            }
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const generatedText = result[0]?.generated_text || '';

        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0]);
          } catch {
            // Fall through to regex extraction
          }
        }
      }
    } catch (error) {
      console.error('Alternative model failed:', error);
    }


    // Always fall back to regex extraction
    return this.fallbackExtraction(prompt);
  }*/

  // Audio transcription using Web Speech API (free, browser-based)
  async transcribeAudio(audioFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      // Use Web Speech API for transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.start();

      // Timeout after 30 seconds
      setTimeout(() => {
        recognition.stop();
        reject(new Error('Transcription timeout'));
      }, 30000);
    });
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

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.text || '';
    } catch (error) {
      console.error('HF transcription error:', error);
      throw error;
    }
  }

  // Process audio: transcribe then extract data
  async extractAthleteDataFromAudio(audioFile: File): Promise<AthleteFormData | undefined> {
    /*try {
      // First, transcribe the audio
      let transcript: string;

      try {
        // Try browser-based speech recognition first (free)
        transcript = await this.transcribeAudio(audioFile);
      } catch {
        // Fallback to Hugging Face Whisper
        transcript = await this.transcribeAudioWithHF(audioFile);
      }

      // Then extract data from transcript
      //return await this.extractAthleteData(transcript);
      const systemPrompt = `Extract athlete information and return as JSON with these fields: firstName, lastName, dateOfBirth (YYYY-MM-DD format), gender (male/female), phone, address, notes, photoUrl. Only include fields clearly mentioned.

Text: "${prompt}"

JSON:`;*/
try {
      console.log('typeof audioFile:',audioFile);
      const client = new InferenceClient(this.hfApiKey);
      const chatCompletion = await client.automaticSpeechRecognition({
        model: "openai/whisper-large-v3",
        data: audioFile,

      });


      console.log('Chat completion response:', chatCompletion);
      return ;

    } catch (error) {
      console.error('Audio processing error:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
