
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
    try {
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

JSON:`;

      const client = new InferenceClient(this.hfApiKey);
      const chatCompletion = await client.chatCompletion({
        model: "facebook/mms-1b-all",
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

      console.log('Chat completion response:', content);

    } catch (error) {
      console.error('Audio processing error:', error);
      throw error;
    }
  }

  // Enhanced fallback extraction using regex patterns
  /*private fallbackExtraction(text: string): AthleteFormData {
    console.log('Using fallback extraction for:', text);
    const data = {} as AthleteFormData;

    // Name extraction - multiple patterns
    const namePatterns = [
      /(?:athlete|create|add|new)\s+([A-Z][a-z]+)\s+([A-Z][a-z]+)/i,
      /([A-Z][a-z]+)\s+([A-Z][a-z]+)(?:\s*,|\s+born|\s+is)/i,
      /name\s*:?\s*([A-Z][a-z]+)\s+([A-Z][a-z]+)/i
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        data.firstName = match[1];
        data.lastName = match[2];
        break;
      }
    }

    // Date extraction with more patterns
    const datePatterns = [
      /born\s+(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{4})/i,
      /(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{4})/,
      /(\d{4})-(\d{1,2})-(\d{1,2})/,
      /born\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/i,
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/i
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        if (pattern.source.includes('january|february')) {
          // Month name format
          const months: {[key: string]: string} = {
            january: '01', february: '02', march: '03', april: '04',
            may: '05', june: '06', july: '07', august: '08',
            september: '09', october: '10', november: '11', december: '12'
          };
          const monthIndex = pattern.source.includes('born') ? 2 : 1;
          const dayIndex = monthIndex + 1;
          const yearIndex = dayIndex + 1;
          const month = months[match[monthIndex].toLowerCase()];
          data.dateOfBirth = `${match[yearIndex]}-${month}-${match[dayIndex].padStart(2, '0')}`;
        } else if (match.length >= 4 && match[3]) {
          // DD.MM.YYYY or similar
          data.dateOfBirth = `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
        } else if (match[0].includes('-')) {
          // YYYY-MM-DD format
          data.dateOfBirth = match[0];
        }
        break;
      }
    }

    // Gender extraction
    if (/\b(male|man|boy|he|him|his)\b/i.test(text)) data.gender = 'male';
    if (/\b(female|woman|girl|she|her)\b/i.test(text)) data.gender = 'female';

    // Phone extraction - multiple patterns
    const phonePatterns = [
      /(?:phone|tel|call|mobile|number)\s*:?\s*([\+\d\-\s\(\)]{10,})/i,
      /(\d{3}[-\.\s]?\d{3}[-\.\s]?\d{4})/,
      /(\+\d{1,3}\s?\d{3,4}\s?\d{3,4}\s?\d{3,4})/
    ];

    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        data.phone = match[1].trim();
        break;
      }
    }

    // Email extraction
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch && !data.notes) {
      data.notes = `Email: ${emailMatch[1]}`;
    }

    // Address extraction - enhanced patterns
    const addressPatterns = [
      /(?:address|lives?|resides?)\s*(?:at|in)?\s*:?\s*([^,\n]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)[^,\n]*)/i,
      /(?:address|lives?|resides?)\s*(?:at|in)?\s*:?\s*(\d+[^,\n]+)/i,
      /(?:from|in)\s+([A-Z][a-zA-Z\s]+(?:City|Town|Village|,\s*[A-Z]{2}))/i
    ];

    for (const pattern of addressPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.address = match[1].trim();
        break;
      }
    }

    // Extract any additional notes
    if (text.length > 50 && !data.notes) {
      // If the text is long, use it as notes
      data.notes = text.substring(0, 200) + (text.length > 200 ? '...' : '');
    }
    return data;
  }*/
}

export const aiService = new AIService();
