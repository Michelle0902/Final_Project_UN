// test.ts
import { analyzeSentiment } from './utils/sentimentAnalyzer';

(async () => {
  const result = await analyzeSentiment('I love this product!');
  console.log('✅ Sentiment result:', result);
})();
