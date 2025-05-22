import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HF_API_TOKEN = process.env.HF_API_TOKEN;

interface HFLabelScore {
  label: string;
  score: number;
}

type HuggingFaceSentimentResponse = HFLabelScore[][];

export async function analyzeSentiment(text: string): Promise<string> {
  try {
    const response = await axios.post<HuggingFaceSentimentResponse>(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const predictions = response.data[0]; // inner array

    if (!Array.isArray(predictions)) {
      console.error('Unexpected format:', response.data);
      return 'unknown';
    }

    const topPrediction = predictions.reduce((prev, curr) =>
      curr.score > prev.score ? curr : prev
    );

    const labelMap: Record<string, string> = {
      LABEL_0: 'negative',
      LABEL_1: 'neutral',
      LABEL_2: 'positive',
    };

    const sentiment = labelMap[topPrediction.label] || 'unknown';
    return sentiment;

  } catch (error: any) {
    console.error('❌ Sentiment analysis error:', error.response?.data || error.message);
    return 'unknown';
  }
}
